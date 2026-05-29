---
aliases: [TransactionAwareCacheManagerProxy, Transaction-aware Cache]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) TransactionAwareCacheManagerProxy는 Spring-managed transaction과 cache 작업을 동기화해 실제 cache put을 성공한 transaction의 after-commit phase로 미루는 CacheManager proxy다.
> (이해용) DB commit이 끝나기 전에 캐시가 먼저 바뀌지 않도록 cache 작업을 commit 뒤로 줄 세우는 wrapper다.

## 해결하는 문제

- transaction rollback인데 cache가 먼저 갱신되는 문제.
- commit 전 cache evict/put 때문에 stale data가 다시 들어가는 문제.
- DB 변경과 cache 변경 타이밍이 어긋나는 문제.

```text
@Transactional
  db update
  cache put 요청
commit 성공
  afterCommit cache put 실행
```

## 치르는 비용

- 모든 cache consistency 문제가 해결되는 것은 아니다.
- DB와 Redis를 하나의 원자적 transaction으로 묶지는 않는다.
- commit 이후 evict 시점에 동시 조회가 몰리면 [[개념-Cache Stampede]]가 생길 수 있다.

## 동작 원리

Spring의 `TransactionSynchronizationManager`를 통해 transaction 상태와 동기화한다. 활성 transaction이 있으면 cache 작업을 after-commit으로 미루고, transaction이 없으면 즉시 실행한다.

```java
@Bean
CacheManager cacheManager(CacheManager target) {
    return new TransactionAwareCacheManagerProxy(target);
}
```

## 관련 본질

- [[개념-캐시 Evict Race Condition]]
- [[본질-정합성과 무결성의 차이]]
- [[03-Concept/개념-Spring 트랜잭션 관리 (Transaction Management)|Spring 트랜잭션 관리]]

## 참고

> "Proxy for a target CacheManager, exposing transaction-aware Cache objects which synchronize their Cache.put(Object, Object) operations with Spring-managed transactions" — [Spring Framework Javadoc, TransactionAwareCacheManagerProxy](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/transaction/TransactionAwareCacheManagerProxy.html)

> "performing the actual cache put operation only in the after-commit phase of a successful transaction" — [Spring Framework Javadoc, TransactionAwareCacheManagerProxy](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/transaction/TransactionAwareCacheManagerProxy.html)
