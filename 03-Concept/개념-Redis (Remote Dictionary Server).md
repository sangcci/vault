---
aliases: [Redis, Remote Dictionary Server, 레디스, 인메모리 데이터 구조 서버]
tags: [개념, 작성중]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) 인메모리 키-값 데이터 구조 서버로, 다양한 자료구조를 통해 캐시·메시지 큐·분산 락 등 여러 역할을 수행하는 시스템.
> (이해용) "빠른 딕셔너리를 네트워크로 공유한다"는 본질 위에 자료구조 종류에 따라 역할이 결정된다. 캐시는 그 중 하나일 뿐.

---

## 해결하는 문제

- 프로세스 간 상태 공유 (로컬 캐시는 인스턴스마다 다름)
- DB·외부 API 응답속도 병목 완화
- 애플리케이션 레이어에서 메시징·동기화 인프라 단순화

---

## 치르는 비용

- **휘발성**: 메모리 기반 → 재시작 시 데이터 소멸 (RDB 스냅샷·AOF 로그로 영속성 보완 가능)
- **싱글 스레드 명령 처리**: 오래 걸리는 명령(KEYS *, LRANGE 전체 등) 하나가 전체 블로킹
- **메모리 상한**: `maxmemory` 초과 시 교체 정책([[개념-캐시 교체 정책 (Cache Eviction Policy)]]) 또는 에러
- **클러스터 복잡도**: 고가용성 구성(Sentinel / Cluster) 시 운영 부담 증가

---

## 자료구조 → 사용 패턴

```text
자료구조              사용 패턴                    대표 명령
──────────────────────────────────────────────────────────────
String + TTL    →   캐시 / 세션 스토어           SET key val EX 300
String + INCR   →   Rate Limiting               INCR count, EXPIRE
List (LPUSH/BRPOP) → Message Queue (단순)       LPUSH queue msg
                                                BRPOP queue 0
Pub/Sub         →   이벤트 브로드캐스트           PUBLISH / SUBSCRIBE
                    (실시간 알림, fanout)
Sorted Set      →   리더보드 / 우선순위 큐        ZADD / ZRANGE
Hash            →   객체 부분 갱신 (사용자 프로필) HSET / HGET
SETNX / Lua     →   분산 락 (Distributed Lock)  SET key 1 NX EX ttl
Stream          →   내구성 메시지 스트리밍         XADD / XREAD
                    (Kafka 경량 대안)
HyperLogLog     →   UV 카운팅 (근사 중복 제거)    PFADD / PFCOUNT
Geo             →   지리 좌표 기반 검색           GEOADD / GEODIST
```

---

## 로컬 캐시 vs Redis 선택 기준

```text
로컬 캐시 (Caffeine)          Redis
──────────────────────────    ──────────────────────────
단일 인스턴스                  다중 인스턴스 공유 필요
네트워크 비용 없음              네트워크 RTT 존재
JVM 힙 메모리 소비             별도 프로세스 메모리
재시작 시 캐시 소멸             AOF/RDB로 영속 가능
캐시만 가능                    캐시 외 다용도 사용 가능
```

---

## 관련 본질

- [[본질-참조 지역성 (Locality of Reference)]]
- [[본질-일관성의 종류 (Consistency Types)]]
- [[개념-캐시 교체 정책 (Cache Eviction Policy)]]
- [[개념-로컬 캐시 (Local Cache)]]
