---
aliases: [Spring Transaction, PlatformTransactionManager, TransactionSynchronizationManager, 선언형 트랜잭션]
tags: [개념, 작성중, Spring, DB]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Spring이 JDBC, JPA 등 이기종 데이터 접근 기술의 트랜잭션 API를 `PlatformTransactionManager` 인터페이스로 추상화하고, ThreadLocal 기반으로 같은 커넥션을 공유하게 하는 메커니즘.
> (이해용) 데이터 접근 기술이 바뀌어도 트랜잭션 코드는 그대로 두고, 하나의 요청 안에서 Service든 Repository든 같은 DB 연결을 쓰게 보장하는 장치.

## 해결하는 문제

- JDBC는 `Connection.setAutoCommit(false)`, JPA는 `EntityTransaction.begin()` — 기술마다 트랜잭션 API가 다른 문제.
- Service와 Repository가 각각 다른 Connection을 사용하면 트랜잭션 격리가 깨지는 문제.

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

### 커넥션 동기화 흐름

```text
1. @Transactional 진입
2. DataSource에서 Connection 획득
3. Connection을 ThreadLocal에 저장
         ┌──────────────────────────┐
         │  ThreadLocal<Connection> │
         │  ┌────────────────────┐  │
         │  │ Connection (conn1) │  │
         │  └────────────────────┘  │
         └──────────────────────────┘
              ↑              ↑
         Service         Repository
         (같은 Thread = 같은 Connection)
4. 비즈니스 로직 수행
5. commit 또는 rollback
6. ThreadLocal에서 Connection 제거
7. DataSource에 Connection 반환
```

핵심: **같은 Thread 내에서는 Service든 Repository든 동일한 Connection을 사용**한다. 이것이 논리 트랜잭션을 가능하게 하는 원리.

### 트랜잭션 사용 방식 진화

| 방식 | 코드량 | 특징 |
| :--- | :--- | :--- |
| TransactionManager 직접 사용 | 많음 | try-catch-rollback 수동 작성 |
| TransactionTemplate | 중간 | 콜백 패턴, 자동 rollback 후 예외 전파 |
| `@Transactional` (선언형) | 최소 | AOP 프록시 기반, 어노테이션만으로 동작 |

### @Transactional의 내부

`@Transactional`은 [[개념-AOP (Aspect-Oriented Programming)]]를 활용한다. Spring이 Bean 등록 시 프록시 객체를 생성하고, 메서드 호출 전후에 트랜잭션 시작/커밋/롤백 로직을 Advice로 삽입한다.

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
