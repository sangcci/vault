---
aliases: [LRU, Least Recently Used, 최근 최소 사용]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 가장 오랫동안 참조되지 않은 페이지를 교체하는 알고리즘. 과거 참조 이력으로 미래를 근사한다.
> (이해용) 책상 위 책 정리 — 마지막으로 펼쳐본 지 가장 오래된 책을 치운다.

---

## 해결하는 문제

- **시간 지역성(Temporal Locality)** 활용 — 최근에 쓴 것은 곧 다시 쓸 가능성이 높음
- Belady's Anomaly 없음
- OPT에 근접한 실용적 성능

---

## 치르는 비용

- 참조 시마다 **순서 업데이트** 필요 → 구현 비용
  - 완전 LRU: 각 페이지에 타임스탬프 또는 이중 연결 리스트 + 해시맵 필요
  - OS는 완전 LRU 대신 **Clock 알고리즘**(근사)을 실제로 사용
- Page Hit 발생해도 순서 갱신 필요 (자주 간과하는 실수)

---

## 동작 원리

```
참조열: 7 0 1 2 0 3 0 4 2 3 0  (프레임 3개)

참조  프레임 (왼쪽=오래됨)    결과
 7    [7]                    FAULT
 0    [7,0]                  FAULT
 1    [7,0,1]                FAULT
 2    [0,1,2]  ← 7 교체      FAULT  (7이 가장 오래됨)
 0    [1,2,0]                HIT ← 0이 가장 최근으로 이동
 3    [2,0,3]  ← 1 교체      FAULT  (1이 가장 오래됨)
 0    [2,3,0]                HIT ← 0 갱신
 4    [3,0,4]  ← 2 교체      FAULT
 2    [0,4,2]  ← 3 교체      FAULT
 3    [4,2,3]  ← 0 교체      FAULT
 0    [2,3,0]  ← 4 교체      FAULT

⚠️ Page HIT 발생 시에도 해당 페이지를 "가장 최근"으로 이동시킴

[ 구현: 이중 연결 리스트 + 해시맵 ]
Head(최신) ──→ [0] ──→ [3] ──→ [2] ──→ Tail(오래됨)
              ↑                         ↑
         Hit 시 Head로 이동        교체 시 Tail에서 제거
해시맵: key → 노드 포인터 (O(1) 접근)
```

---

## 실제 사용처

- **Linux kernel page cache** — `mm/page_cache.c` (Clock 근사로 구현)
- **Redis** — `allkeys-lru`, `volatile-lru` eviction policy
- **MySQL InnoDB** Buffer Pool — 변형 LRU (young/old 두 영역)
- **CPU TLB** (Translation Lookaside Buffer) — 하드웨어 LRU 근사
- **CDN** (Cloudflare, Akamai) — 콘텐츠 캐시 eviction
- **Browser cache** — 탭/리소스 캐싱

---

## 관련 본질

- [[본질-트레이드오프 (Trade-off)]]
- [[본질-영속성 (Persistence)]]
- [[개념-Clock (Second Chance)]]
- [[판단기준-페이지 교체 알고리즘 선택]]
