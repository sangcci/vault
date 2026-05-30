---
aliases: [PlatformTransactionManager, Spring TransactionManager, Transaction Strategy]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) `PlatformTransactionManager`는 Spring imperative transaction infrastructure에서 transaction begin, commit, rollback을 추상화하는 전략 interface다.
> (이해용) `@Transactional`이 “트랜잭션 시작”이라고 말하면, 실제로 JDBC인지 JPA인지 Kafka인지에 맞춰 처리하는 운전 규칙이다.

## 해결하는 문제

- JDBC, JPA, Kafka, MongoDB처럼 resource마다 transaction API가 다른 문제를 단일 추상화로 다룬다.
- `@Transactional`이 특정 저장소 API에 직접 묶이지 않게 한다.
- transaction 경계 설정과 실제 resource transaction 제어를 분리한다.

```text
@Transactional
      |
      v
TransactionInterceptor
      |
      v
PlatformTransactionManager
  ├─ DataSourceTransactionManager  -> JDBC Connection
  ├─ JpaTransactionManager         -> EntityManager / JDBC Connection
  ├─ KafkaTransactionManager       -> Kafka Producer transaction
  ├─ MongoTransactionManager       -> MongoDB session transaction
  └─ JtaTransactionManager         -> XA/JTA transaction
```

## 치르는 비용

- 어떤 transaction manager를 쓰는지에 따라 `@Transactional`의 실제 의미가 달라진다.
- DB와 Kafka 같은 여러 resource를 하나의 원자적 transaction으로 묶는 문제는 별도 설계가 필요하다.
- reactive stack은 imperative `PlatformTransactionManager`가 아니라 `ReactiveTransactionManager`가 필요하다.

## 동작 원리

`@Transactional`은 annotation이고, 실제 resource transaction을 여닫는 것은 선택된 `PlatformTransactionManager`다.

```java
@Transactional(transactionManager = "jpaTransactionManager")
public void save() { ... }

@Transactional(transactionManager = "kafkaTransactionManager")
public void publish() { ... }
```

Spring은 proxy advice에서 transaction manager를 호출하고, transaction manager는 필요한 resource를 현재 thread에 bind한다.

## 관련 본질

- [[개념-Spring 트랜잭션 관리 (Transaction Management)]]
- [[개념-HikariCP]]
- [[개념-TransactionSynchronizationManager]]
- [[본질-추상화 (Abstraction)]]

## 참고

> "The key to the Spring transaction abstraction is the notion of a transaction strategy." — [Spring Framework Reference, Transaction Abstraction](https://docs.spring.io/spring-framework/reference/data-access/transaction/strategies.html)

> "This is the central interface in Spring's imperative transaction infrastructure." — [Spring Framework Javadoc, PlatformTransactionManager](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/PlatformTransactionManager.html)

> "The KafkaTransactionManager is an implementation of Spring Framework’s PlatformTransactionManager." — [Spring Kafka Reference, Transactions](https://docs.spring.io/spring-kafka/reference/kafka/transactions.html)
