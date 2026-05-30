---
aliases: [Bitmap Index Scan, Bitmap Heap Scan, 비트맵 스캔, Bitmap Scan]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 인덱스에서 매칭 TID를 전부 수집 후 물리 페이지 번호 순으로 정렬해 heap을 순차 접근하는 스캔 방식.
> (이해용) Index Scan의 랜덤 접근 문제를 "일단 다 모아 정렬 후 접근"으로 해결한 중간 전략.

---

## 해결하는 문제

- Index Scan의 랜덤 heap I/O 문제
- 같은 heap 페이지 중복 접근 문제
- 중간 selectivity(매칭 row 수가 많지도 적지도 않음)에서 최적

---

## 치르는 비용

- TID 수집 및 정렬 단계 추가 (메모리 사용)
- 소량 row에서는 Index Scan보다 오히려 느릴 수 있음

---

## 동작 원리

```
Step 1. Bitmap Index Scan — 인덱스만 탐색, heap 미접근
  boarding_date='2025-09-11' 매칭 TID 전부 수집
  → 비트맵 구성 (페이지 번호 기준)

  page 12:  [offset 1, offset 9]
  page 457: [offset 2]
  page 892: [offset 3, offset 7]
  ...

Step 2. Bitmap Heap Scan — 물리 순서대로 heap 접근
  page 12  읽음 → offset 1, 9 한 번에 처리  ← 1회만 접근
  page 457 읽음 → offset 2 처리
  page 892 읽음 → offset 3, 7 한 번에 처리  ← 1회만 접근
  → 페이지 오름차순 이동, 중복 없음
```

**EXPLAIN 출력**

```
Bitmap Heap Scan on rent_participants
  Recheck Cond: (boarding_date = '2025-09-11')
  →  Bitmap Index Scan on idx_boarding_date
       Index Cond: (boarding_date = '2025-09-11')
```

**세 가지 스캔 비교**

```
매칭 row 비율
0%                    50%                  100%
│──────────────────────┼─────────────────────│
Index Scan ←──────────┤
                       ├──Bitmap Scan──┤
                                       ├──── Seq Scan ──────→

Seq Scan    완전 순차   모름, 전부 읽음
Index Scan  랜덤 접근   소량에 최적
Bitmap Scan 준순차      중간 규모에 최적
```

---

## 관련 본질

- [[본질-논리 순서와 물리 순서는 다르다]]
- [[본질-간접 참조 (Indirection)]]
- [[본질-처리량과 지연시간 (Throughput and Latency)]]
