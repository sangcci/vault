---
aliases: [Cache Evict Race Condition, Cache Invalidation Race, 캐시 무효화 경쟁 상태]
tags: [개념, 작성중]
difficulty: High
type: Concept
---

## 한 문장 정의

> (사전적) 캐시 evict race condition은 DB 트랜잭션과 캐시 무효화 타이밍이 어긋나 캐시에 오래된 값이 다시 저장되는 경쟁 상태다.
> (이해용) 새 값이 DB에 확정되기 전에 캐시를 먼저 비웠고, 그 사이 누군가 옛 DB 값을 읽어 캐시에 다시 넣는 상황이다.

---

## 해결하는 문제

이 개념은 캐시를 써도 데이터가 맞지 않는 이유를 설명한다. 특히 update/delete usecase에서 cache evict를 transaction commit 전에 실행하면 문제가 생긴다.

```text
T1: update 시작
T1: cache evict
T2: read 요청
T2: cache miss
T2: DB old value read
T2: cache put old value
T1: DB commit new value

결과: DB = new, cache = old
```

---

## 치르는 비용

- commit 이후 evict로 미루면 stale window를 줄일 수 있지만 완전히 없애지는 못한다.
- evict 이후 동시 read가 몰리면 Cache Stampede가 생길 수 있다.
- DB와 Redis처럼 저장소가 분리되어 있으면 완전한 원자성을 얻기 어렵다.

---

## 동작 원리

핵심 원인은 두 저장소의 변경 순서가 하나의 원자적 작업으로 묶이지 않는 것이다.

```pseudo
// 위험한 순서
cache.evict(key)
db.update(value)
commit()

// 더 나은 순서
transaction {
  db.update(value)
}
afterCommit {
  cache.evict(key)
}
```

Spring에서는 TransactionAwareCacheManagerProxy 같은 도구로 cache put/evict를 commit 이후로 동기화할 수 있다. 단, 이것은 DB와 캐시를 하나의 분산 트랜잭션으로 만드는 도구가 아니다. 타이밍 문제를 줄이는 장치다.

---

## 관련 본질

- [[본질-정합성과 무결성의 차이]]
- TransactionAwareCacheManagerProxy
- Cache Stampede
- [[03-Concept/개념-Spring 트랜잭션 관리 (Transaction Management)|Spring 트랜잭션 관리]]

---

## 참고

> "Proxy for a target CacheManager, exposing transaction-aware Cache objects which synchronize their Cache.put(Object, Object) operations with Spring-managed transactions" — [Spring Framework Javadoc, TransactionAwareCacheManagerProxy](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/transaction/TransactionAwareCacheManagerProxy.html)

> "performing the actual cache put operation only in the after-commit phase of a successful transaction" — [Spring Framework Javadoc, TransactionAwareCacheManagerProxy](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/transaction/TransactionAwareCacheManagerProxy.html)
