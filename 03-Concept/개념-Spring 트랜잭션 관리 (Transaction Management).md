---
aliases: [Spring Transaction, PlatformTransactionManager, TransactionSynchronizationManager, 선언형 트랜잭션]
tags: [개념, 작성중, Spring, DB]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Spring이 `PlatformTransactionManager`와 프록시 기반 선언형 트랜잭션을 이용해, 현재 스레드에 트랜잭션 자원(Connection, EntityManager)을 묶어 일관되게 관리하는 메커니즘.
> (이해용) 보통은 Tomcat worker thread 하나가 요청을 처리하는 동안, Spring이 그 스레드에 같은 Connection과 EntityManager를 붙여 두고 시작·커밋·롤백을 자동으로 챙기는 장치.

## 해결하는 문제

- JDBC는 `Connection.setAutoCommit(false)`, JPA는 `EntityTransaction.begin()` — 기술마다 트랜잭션 API가 다른 문제.
- Service와 Repository가 각각 다른 Connection을 사용하면 트랜잭션 경계와 격리가 깨지는 문제.
- 요청 스레드 하나 안에서 같은 DB 작업인데도, 중간 계층마다 자원을 따로 열고 닫아 일관성이 무너지는 문제.

## 치르는 비용

- ThreadLocal 기반이므로 **비동기 컨텍스트 전환 시 커넥션이 전파되지 않음** (별도 처리 필요).
- 프록시 기반 `@Transactional`은 **같은 클래스 내부 호출(self-invocation)에서 동작하지 않음**.

## 동작 원리

### 추상화 계층

```text
@Transactional (선언형)
       │
       ▼
PlatformTransactionManager (인터페이스)
  ├─ DataSourceTransactionManager  ← JDBC
  ├─ JpaTransactionManager         ← JPA
  └─ ...                           ← 기타 구현체
       │
       ▼
TransactionSynchronizationManager (ThreadLocal 커넥션 보관)
       │
       ▼
DataSource → ConnectionPool (HikariCP)
```

### 스레드 중심으로 보는 트랜잭션 흐름

```text
HTTP 요청 도착
   │
Tomcat worker thread-17
   │
Controller
   │
@Service @Transactional 메서드 진입
   │   (여기서 Spring AOP 프록시가 개입)
   ▼
TransactionManager begin
   │
   ├─ Connection 획득 후 현재 thread에 바인딩
   ├─ JPA면 EntityManager도 현재 thread에 바인딩
   │
Service → Repository → JPA/JDBC
   │
   └─ 같은 thread 안에서는 같은 자원을 계속 씀
   │
commit / rollback
   │
thread binding 해제
   │
Connection 반환
```

핵심은 **Spring이 별도 트랜잭션 전용 스레드를 만드는 게 아니라, 지금 요청을 처리 중인 그 스레드에 트랜잭션 자원을 묶는다**는 점이다.

### 트랜잭션 사용 방식 진화

| 방식 | 코드량 | 특징 |
| :--- | :--- | :--- |
| TransactionManager 직접 사용 | 많음 | try-catch-rollback 수동 작성 |
| TransactionTemplate | 중간 | 콜백 패턴, 자동 rollback 후 예외 전파 |
| `@Transactional` (선언형) | 최소 | AOP 프록시 기반, 어노테이션만으로 동작 |

### @Transactional의 내부

`@Transactional`은 [[개념-AOP (Aspect-Oriented Programming)]]를 활용한다. Spring이 Bean 등록 시 프록시 객체를 만들고, **외부 호출이 프록시를 통과할 때만** 메서드 앞뒤에 트랜잭션 시작/커밋/롤백 로직을 Advice로 삽입한다.

```text
클라이언트
  ↓
트랜잭션 프록시
  ├─ begin
  ├─ 현재 thread에 Connection / EntityManager 바인딩
  ├─ 실제 target 메서드 호출
  ├─ commit or rollback
  └─ 자원 정리
```

즉 AOP가 하는 일은 **트랜잭션 경계를 잡는 것**이고, 그 경계 안에서 실제 Connection / EntityManager를 묶어 관리하는 건 `TransactionManager`와 `TransactionSynchronizationManager` 계층이다.

### 자주 헷갈리는 점

- **트랜잭션을 관리하는 Thread = 보통 Tomcat worker thread**
- **DB 서버 쪽 실행은 별개지만, Java 애플리케이션 쪽 호출 흐름은 같은 worker thread에서 계속 감**
- **JPA를 쓴다고 별도 EntityManager thread가 생기는 건 아님**
- **self-invocation은 프록시를 우회하므로 `@Transactional`이 적용되지 않음**
- **`@Async`나 직접 새 Thread를 만들면 ThreadLocal 문맥이 자동 전파되지 않음**

## @Transactional 남용 패턴

외부 I/O가 트랜잭션 범위 안에 포함되면 커넥션이 idle 상태로 점유되어 [[현상-커넥션 풀 고갈 (Connection Pool Exhaustion)]]로 이어진다.

```java
// 문제: callExternalApi() 동안 커넥션 idle 점유
@Transactional
public void process() {
    dbWrite();
    callExternalApi();   // 수백ms ~ 수초, 커넥션 반납 불가
    dbWrite2();
}

// 개선: 외부 호출을 트랜잭션 밖으로 분리
public void process() {
    callExternalApi();   // 커넥션 없이 실행
    doTransactional();   // 커넥션 점유 최소화
}

@Transactional
private void doTransactional() { dbWrite(); dbWrite2(); }
```

- `PROPAGATION_NOT_SUPPORTED`는 트랜잭션을 suspend할 뿐 커넥션을 반납하지 않음 (오히려 2개 점유)
- 외부 호출 실패 시 DB 롤백까지 필요하면 Saga / Transactional Outbox 패턴 사용
- → [[판단기준-트랜잭션 범위 설계]]

## 관련 본질

- [[본질-추상화 (Abstraction)]] — 이기종 트랜잭션 API를 단일 인터페이스로 통합.
- [[본질-격리성 (Isolation)]] — 같은 Connection 공유가 트랜잭션 격리 수준을 보장하는 전제 조건.
- [[개념-AOP (Aspect-Oriented Programming)]] — 선언형 트랜잭션의 구현 기반.
- [[개념-JPA EntityManager]] — JpaTransactionManager가 직접 생명주기를 관리하는 대상.
- [[개념-EntityManager의 주입 방식과 AOP의 관계]] — AOP가 하는 일과 EntityManager 프록시가 하는 일을 분리해서 이해.

## 참고

- [Spring Framework Reference — Declarative Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html) — "the Spring Framework's declarative transaction management is enabled via AOP proxies"
- [Spring Framework Reference — Transaction Abstraction](https://docs.spring.io/spring-framework/reference/data-access/transaction/strategies.html) — Spring transaction infrastructure binds resources and synchronizations to the current thread through `TransactionSynchronizationManager`
- [Spring Framework Reference — Proxying Mechanisms](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html) — self-invocation bypasses advice in proxy-based AOP
