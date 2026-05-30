---
aliases: [Spring Transaction, PlatformTransactionManager, TransactionSynchronizationManager, 선언형 트랜잭션]
tags: [개념, 작성중, Spring, DB]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Spring이 `PlatformTransactionManager`와 프록시 기반 선언형 트랜잭션을 이용해, 현재 스레드에 트랜잭션 자원(Connection, EntityManager 등)을 묶어 일관되게 관리하는 메커니즘.
> (이해용) Tomcat, Kafka Listener, Scheduler, Batch 중 무엇이 실행했든 현재 Java thread에 필요한 resource를 붙여 두고 시작·커밋·롤백을 자동으로 챙기는 장치.

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
  ├─ DataSourceTransactionManager  ← JDBC / RDB
  ├─ JpaTransactionManager         ← JPA
  ├─ KafkaTransactionManager       ← Kafka producer transaction
  ├─ MongoTransactionManager       ← MongoDB transaction
  └─ JtaTransactionManager         ← JTA / XA
       │
       ▼
TransactionSynchronizationManager (ThreadLocal 커넥션 보관)
       │
       ▼
DataSource → ConnectionPool (HikariCP)
```

### 스레드 중심으로 보는 트랜잭션 흐름

```text
Tomcat / Kafka Listener / Scheduler / Batch
   │
   ▼
현재 Java thread
   │
@Service @Transactional 메서드 진입
   │   (여기서 Spring AOP 프록시가 개입)
   ▼
TransactionManager begin
   │
   ├─ JDBC면 Connection 획득 후 현재 thread에 바인딩
   ├─ JPA면 EntityManager도 현재 thread에 바인딩
   ├─ Kafka면 producer transaction 제어
   │
Service → Repository / Client
   │
   └─ 같은 thread 안에서는 같은 thread-bound resource를 계속 씀
   │
commit / rollback
   │
thread binding 해제
   │
resource 반환 또는 정리
```

핵심은 **Spring이 Tomcat 요청 생명주기에 묶인 트랜잭션 전용 스레드를 만드는 게 아니라, 지금 실행 중인 그 Java thread에 트랜잭션 자원을 묶는다**는 점이다. Tomcat worker thread, Kafka listener container thread, scheduler thread, batch worker thread 모두 같은 imperative transaction model을 사용할 수 있다.

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

### Tomcat 밖에서도 동작하는 이유

`@Transactional`은 HTTP 요청 전용 기능이 아니다. 실행 주체가 어떤 thread를 제공하느냐만 다를 뿐, proxy advice와 transaction manager는 현재 thread를 기준으로 동작한다.

```text
HTTP 요청       -> Tomcat worker thread
Kafka 메시지    -> Kafka listener container thread
@Scheduled     -> Scheduler thread
Spring Batch   -> Step / Chunk worker thread
@Async         -> TaskExecutor thread
```

각 thread에서 `@Transactional` method가 proxy를 통해 호출되면 Spring은 같은 방식으로 transaction을 시작한다. 단, thread가 바뀌면 `TransactionSynchronizationManager`의 ThreadLocal context는 자동 전파되지 않는다.

```java
@Transactional
public void outer() {
    asyncService.doSomething(); // 다른 thread면 기존 transaction context 없음
}
```

### HikariCP와 트랜잭션의 경계

[[개념-HikariCP]]는 JDBC `DataSource` connection pool이다. RDB `Connection`을 빌려주고 돌려받는 역할이지, transaction manager나 모든 저장소 connection manager가 아니다.

```text
@Transactional
  -> PlatformTransactionManager
      -> DataSource
          -> HikariCP
              -> JDBC Connection
                  -> RDB
```

- commit/rollback 판단: [[개념-PlatformTransactionManager]] 책임.
- JDBC connection borrow/return: HikariCP 책임.
- Kafka connection: Kafka client/producer factory 책임.
- Redis connection: Lettuce/Jedis 책임.
- MongoDB connection: MongoDB Java Driver 책임.

### 자주 헷갈리는 점

- **트랜잭션을 관리하는 Thread = 현재 `@Transactional` method를 실행 중인 Java thread**
- **Tomcat은 HTTP 요청 thread를 제공할 뿐 Spring transaction의 필수 전제가 아님**
- **DB 서버 쪽 실행은 별개지만, Java 애플리케이션 쪽 호출 흐름은 같은 thread-bound resource를 사용함**
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
- [[개념-PlatformTransactionManager]] — `@Transactional`의 실제 begin/commit/rollback 전략.
- [[개념-TransactionSynchronizationManager]] — 현재 thread에 transaction resource를 보관하는 내부 delegate.
- [[개념-HikariCP]] — JDBC Connection을 pool로 관리하는 RDB connection pool.
- [[개념-JPA EntityManager]] — JpaTransactionManager가 직접 생명주기를 관리하는 대상.
- [[개념-EntityManager의 주입 방식과 AOP의 관계]] — AOP가 하는 일과 EntityManager 프록시가 하는 일을 분리해서 이해.

## 참고

> "the Spring Framework's declarative transaction management is enabled via AOP proxies" — [Spring Framework Reference, Declarative Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html)

> "The key to the Spring transaction abstraction is the notion of a transaction strategy." — [Spring Framework Reference, Transaction Abstraction](https://docs.spring.io/spring-framework/reference/data-access/transaction/strategies.html)

> "Central delegate that manages resources and transaction synchronizations per thread." — [Spring Framework Javadoc, TransactionSynchronizationManager](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/support/TransactionSynchronizationManager.html)

> "The KafkaTransactionManager is an implementation of Spring Framework’s PlatformTransactionManager." — [Spring Kafka Reference, Transactions](https://docs.spring.io/spring-kafka/reference/kafka/transactions.html)
