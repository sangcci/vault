---
aliases: [Cache Stampede, Thundering Herd, Dogpile Effect]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) Cache Stampede는 특정 cache key가 동시에 miss되면서 많은 요청이 같은 backend 연산을 병렬로 수행해 원본 저장소에 부하를 몰아넣는 현상이다.
> (이해용) 인기 메뉴 캐시가 비는 순간 손님 1000명이 동시에 주방으로 뛰어가는 상황이다.

## 해결하는 문제

- cache evict 이후 DB connection 부족이 생기는 이유를 설명한다.
- TTL 만료 시점에 요청이 몰리는 부하 spike를 설명한다.
- 캐시를 써도 backend가 갑자기 죽는 이유를 설명한다.

```text
cache key expired
  |
  +-- request 1 -> DB
  +-- request 2 -> DB
  +-- request 3 -> DB
  +-- request N -> DB
```

## 치르는 비용

- mutex/lock을 쓰면 tail latency가 늘 수 있다.
- stale-while-revalidate를 쓰면 잠깐 오래된 값을 보여줄 수 있다.
- TTL jitter를 쓰면 만료 시점 예측이 어려워진다.

## 동작 원리

대표 완화 방식은 다음과 같다.

```pseudo
if cache miss:
  if lock acquired:
    value = db.load()
    cache.put(value)
  else:
    wait or return stale value
```

- request coalescing: 같은 key 요청을 하나로 합친다.
- soft TTL: 만료 전에 백그라운드 갱신한다.
- TTL jitter: 만료 시점을 흩뜨린다.
- stale-while-revalidate: 오래된 값을 주고 뒤에서 갱신한다.

## 관련 본질

- [[개념-캐시 Evict Race Condition]]
- [[개념-TransactionAwareCacheManagerProxy]]
- [[본질-정합성과 무결성의 차이]]

## 참고

> "many different application processes simultaneously request a cache key, get a cache miss, and then each hits the same database query in parallel" — [AWS, Scale Performance for Amazon ElastiCache](https://docs.aws.amazon.com/pdfs/whitepapers/latest/scale-performance-elasticache/scale-performance-elasticache.pdf)
