---
aliases: [TransactionSynchronizationManager, Thread-bound Transaction Resource]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) `TransactionSynchronizationManager`는 Spring transaction에서 resource와 synchronization callback을 현재 thread 단위로 관리하는 중앙 delegate다.
> (이해용) 현재 Java thread가 어떤 DB connection이나 EntityManager를 쓰는지 적어두는 thread-local 보관함이다.

---

## 해결하는 문제

- Service와 Repository가 같은 transaction 안에서 같은 connection/resource를 쓰게 한다.
- 계층마다 resource를 새로 열어 transaction 경계가 깨지는 문제를 막는다.
- transaction commit 이후 callback, resource cleanup 같은 동기화 지점을 제공한다.

```text
Current Java Thread
  |
  v
TransactionSynchronizationManager(ThreadLocal)
  ├─ DataSource -> ConnectionHolder
  ├─ EntityManagerFactory -> EntityManagerHolder
  └─ afterCommit / beforeCommit synchronization
```

---

## 치르는 비용

- thread가 바뀌면 context가 자동 전파되지 않는다.
- `@Async`, 직접 만든 thread, 다른 executor로 넘어가면 기존 transaction resource를 볼 수 없다.
- WebFlux/Reactor 같은 reactive stack은 ThreadLocal이 아니라 Reactor Context 기반 transaction 관리가 필요하다.

---

## 동작 원리

```text
Tomcat / Kafka Listener / Scheduler / Batch thread
        |
        v
@Transactional method
        |
        v
TransactionManager begin
        |
        v
resource bind to current thread
        |
        v
Repository는 thread-bound resource 재사용
        |
        v
commit / rollback 후 unbind
```

여기서 Tomcat은 필수가 아니다. Kafka listener container thread, scheduler thread, batch worker thread에서도 같은 imperative transaction model이 동작한다.

---

## 관련 본질

- [[개념-Spring 트랜잭션 관리 (Transaction Management)]]
- [[개념-PlatformTransactionManager]]
- [[개념-HikariCP]]
- [[개념-AOP (Aspect-Oriented Programming)]]

---

## 참고

> "Central delegate that manages resources and transaction synchronizations per thread." — [Spring Framework Javadoc, TransactionSynchronizationManager](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/support/TransactionSynchronizationManager.html)

> "Resource management code should check for thread-bound resources, for example, JDBC Connections or Hibernate Sessions" — [Spring Framework Javadoc, TransactionSynchronizationManager](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/support/TransactionSynchronizationManager.html)
