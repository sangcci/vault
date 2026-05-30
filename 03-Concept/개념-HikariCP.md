---
aliases: [HikariCP, JDBC Connection Pool, Hikari Pool]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) HikariCP는 JDBC `DataSource` 뒤에서 RDB `Connection`을 미리 만들고 빌려주고 반납받는 고성능 JDBC connection pool이다.
> (이해용) DB 커넥션을 매번 새로 만들지 않도록 차고에 보관했다가 빌려주는 렌터카 차고다.

---

## 해결하는 문제

- 요청마다 RDB connection을 새로 여는 비용을 줄인다.
- 동시에 사용할 수 있는 connection 수를 제한해 DB 과부하를 막는다.
- idle connection 검증, timeout, 반납 누락 탐지 같은 pool 운영 문제를 관리한다.

```text
@Transactional
  -> PlatformTransactionManager
      -> DataSource
          -> HikariCP
              -> JDBC Connection
                  -> RDB
```

---

## 치르는 비용

- pool size가 작으면 [[현상-커넥션 풀 고갈 (Connection Pool Exhaustion)]]이 생길 수 있다.
- pool size가 크면 DB connection 수와 memory/thread 비용이 커진다.
- HikariCP는 transaction boundary를 결정하지 않는다. commit/rollback은 transaction manager 책임이다.

---

## 동작 원리

```text
Application thread
  |
  | borrow
  v
HikariCP pool
  |
  v
JDBC Connection
  |
  v
RDB

commit / rollback 후
  |
  | return
  v
HikariCP pool
```

HikariCP는 모든 저장소 connection을 관리하는 thread manager가 아니다.

| 대상 | connection 관리 주체 |
|---|---|
| RDB JDBC | HikariCP 같은 JDBC connection pool |
| Kafka | Kafka client / producer factory |
| Redis | Lettuce 또는 Jedis connection factory/pool |
| MongoDB | MongoDB Java Driver connection pool |
| HTTP 외부 API | HTTP client connection pool |

---

## 관련 본질

- [[개념-Spring 트랜잭션 관리 (Transaction Management)]]
- [[개념-PlatformTransactionManager]]
- [[현상-커넥션 풀 고갈 (Connection Pool Exhaustion)]]
- [[본질-처리량과 지연시간 (Throughput and Latency)]]

---

## 참고

> "HikariCP is a \"zero-overhead\" production ready JDBC connection pool." — [HikariCP README](https://github.com/brettwooldridge/HikariCP)

> "The key to the Spring transaction abstraction is the notion of a transaction strategy." — [Spring Framework Reference, Transaction Abstraction](https://docs.spring.io/spring-framework/reference/data-access/transaction/strategies.html)
