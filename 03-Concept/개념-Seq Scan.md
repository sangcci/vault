---
aliases: [Seq Scan, Sequential Scan, 순차 스캔, Table Scan, Full Scan]
tags: [개념, 작성중]
type: Concept
difficulty: Low
---

## 한 문장 정의

> (사전적) heap 파일을 page 0부터 끝까지 물리적 순서대로 전부 읽으며 조건에 맞는 row를 거르는 스캔 방식.
> (이해용) 데이터가 어떻게 정렬됐는지 모르니까 처음부터 끝까지 다 읽고 원하는 것만 남기는 방식.

## 해결하는 문제

- 인덱스 없을 때 유일한 탐색 수단
- 대부분의 row를 읽어야 할 때 Index Scan보다 효율적

## 치르는 비용

- 테이블 전체 읽음 (row 수에 비례)
- dead tuple도 읽어야 함 → bloat 시 더 느려짐

## 동작 원리

```
heap 파일 (단일 파일, 예: /data/base/16384/orders)

[page 0][page 1][page 2]...[page N]
   ↓       ↓       ↓
 순서대로  순서대로  순서대로 읽음
   ↓
 각 tuple의 Filter 조건 평가
   YES → 결과 포함
   NO  → 버림 (Rows Removed by Filter)
```

**Seq Scan은 컬럼 정렬과 무관**

```
boarding_date 값이 뒤죽박죽이어도 상관없음
인덱스 없어도 항상 가능
Clustered 여부와 무관 (물리 페이지 순서로 읽는 것뿐)
```

**디스크 I/O 관점**

```
Seq Scan:    파일 오프셋 0 → 8K → 16K → 24K ...
             OS readahead 작동 → 다음 페이지 미리 읽음
             HDD에서 순차 읽기 ~100MB/s

Index Scan:  TID 순서대로 heap 접근 → 물리적 랜덤 I/O
             OS readahead 작동 안 함
             HDD에서 랜덤 읽기 ~1MB/s
```

**EXPLAIN 출력**

```
Seq Scan on rent_participants  (actual time=0.106..519 rows=1020000 loops=1)
  Filter: (boarding_date='2025-09-11' AND rent_id=500)
  Rows Removed by Filter: 1019966
```

## 관련 본질

- [[본질-처리량과 지연시간 (Throughput and Latency)]]
