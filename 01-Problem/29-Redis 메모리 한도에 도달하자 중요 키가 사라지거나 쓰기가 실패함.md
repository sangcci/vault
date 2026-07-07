---
aliases: [Redis Maxmemory Eviction, Cache Eviction Policy, Redis LRU LFU]
tags: [문제, 작성중, Redis, Cache]
difficulty: High
type: Problem
---

# Problem: 29-Redis 메모리 한도에 도달하자 중요 키가 사라지거나 쓰기가 실패함

## 상황

Redis를 캐시, 세션, rate limit counter, 임시 상태 저장소로 함께 사용한다. 트래픽이 늘거나 TTL 없는 키가 누적되면서 `maxmemory`에 가까워진다.

```text
Redis
  ├─ product cache
  ├─ session
  ├─ rate limit counter
  ├─ distributed lock key
  └─ temporary business state
```

어느 순간 중요 키가 사라지거나, 반대로 쓰기 명령이 에러를 반환한다.

---

## 관찰된 증거

- Redis `used_memory`가 `maxmemory`에 근접한다.
- `evicted_keys` metric이 증가한다.
- TTL 없는 키가 장기간 남아 있다.
- `noeviction` 정책에서는 `OOM command not allowed` 계열 에러가 난다.
- `allkeys-lru` 설정 후 세션/락/카운터 같은 중요 키까지 제거된다.
- 캐시 hit rate가 떨어지고 DB 트래픽이 다시 증가한다.

---

## 의심 문제

가장 가능성 높은 문제는 **Redis의 역할과 키 중요도를 나누지 않은 채 maxmemory-policy 하나에 모든 키의 생존을 맡긴 것**이다.

Redis는 빠른 인메모리 자료구조 서버지만, 메모리는 유한하다. 메모리 한도에 도달하면 정책에 따라 키를 제거하거나 쓰기를 거부한다.

---

## 원인

```text
maxmemory 도달
  ↓
Redis가 eviction policy 확인
  ├─ noeviction: 쓰기 에러
  ├─ allkeys-lru/lfu: 전체 키에서 제거 후보 선택
  └─ volatile-lru/lfu/ttl: TTL 있는 키에서만 제거
```

문제는 모든 키가 같은 의미를 갖지 않는다는 점이다.

```text
캐시 키
  → 사라져도 원본 DB에서 재조회 가능

세션/락/카운터/임시 상태
  → 사라지면 사용자 상태나 제어 흐름이 깨질 수 있음
```

LRU/LFU 같은 교체 알고리즘은 “무엇이 비즈니스적으로 중요한가”를 모른다. 접근 이력과 빈도만 보고 제거 후보를 고른다.

---

## 확인 방법

- Redis를 캐시 전용으로 쓰는지, 여러 상태 저장 용도로 섞어 쓰는지 분류한다.
- 키 prefix별 TTL 적용 여부와 평균 key count를 확인한다.
- `maxmemory-policy`, `maxmemory-samples`, `evicted_keys`, `keyspace_hits/misses`를 본다.
- 사라져도 복구 가능한 키와 사라지면 안 되는 키를 구분한다.
- 세션/락/카운터와 캐시를 같은 Redis DB/Cluster에 둘 필요가 있는지 검토한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 캐시 전용 Redis 분리 | eviction 영향 격리 | 운영 리소스 증가 |
| TTL 있는 캐시만 eviction 대상 | 중요 키 보호 | TTL 누락 관리 필요 |
| `volatile-lru/lfu` | TTL 키 중심 제거 | TTL 없는 캐시는 제거 안 됨 |
| `allkeys-lru/lfu` | 캐시 전용 인스턴스에 단순 | 중요 키 혼재 시 위험 |
| key prefix별 metric 관리 | 원인 추적 쉬움 | 관측 설정 필요 |
| 용도별 저장소 분리 | 장애 반경 축소 | 아키텍처 복잡도 증가 |

---

## 트레이드오프

Redis를 “빠른 저장소 하나”로 보면 편하지만, 키마다 사라져도 되는 정도가 다르다. eviction policy는 메모리 압박을 처리할 뿐, 비즈니스 중요도를 판단하지 않는다. 따라서 Redis 설계의 핵심은 자료구조보다 용도별 생존 조건과 장애 반경을 먼저 나누는 것이다.

---

## 연결되는 본질

- [[본질-메모리 한계와 제거 정책]]
- [[본질-캐시 키 공간과 참조 지역성]]
- [[본질-폭발 반경과 격벽]]

---

## 참고

> "When the memory limit is reached Redis will try to remove keys according to the eviction policy selected" — [Redis configuration reference](https://github.com/redis/redis/blob/refs/heads/8.0/redis.conf)

> "Redis will start evicting keys according to the policy that is configured" — [Redis FAQ: maxmemory](https://redis.io/faq/doc/1jbxid5qq7/is-maxmemory-the-maximum-value-of-used-memory)
