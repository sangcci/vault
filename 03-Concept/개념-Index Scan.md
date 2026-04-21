---
aliases: [Index Scan, 인덱스 스캔]
tags: [개념, 작성중]
type: Concept
difficulty: Low
---

## 한 문장 정의

> (사전적) B-tree 인덱스로 TID(물리적 주소)를 찾고 heap에서 해당 row만 읽는 스캔 방식.
> (이해용) 색인에서 페이지 번호 찾아 그 페이지만 펼치는 방식. 단, 페이지가 책 곳곳에 흩어져 있음.

## 해결하는 문제

- 소량 row 조회 시 Seq Scan 대비 압도적으로 빠름
- 특정 값이나 범위 조건의 정밀 탐색

## 치르는 비용

- heap 접근이 랜덤 I/O (non-clustered 환경)
- 같은 heap 페이지를 중복 접근 가능
- 인덱스 파일 + heap 파일 두 곳을 읽음

## 동작 원리

```
B-tree 인덱스 (boarding_date 기준)

2025-09-11 → TID(page 892, offset 3)
2025-09-11 → TID(page 12,  offset 1)   ← 역방향
2025-09-11 → TID(page 457, offset 2)   ← 앞으로
...

heap 접근:
page 892 읽음 → offset 3 tuple 반환
page 12  읽음 → offset 1 tuple 반환  ← 디스크 헤드 점프
page 457 읽음 → offset 2 tuple 반환  ← 또 점프
```

**Index Cond vs Filter 구분**

```
Index Cond: (boarding_date = '2025-09-11')  ← 인덱스로 필터링 (heap 접근 전)
Filter: (rent_id = 500)                     ← heap에서 row 읽은 후 필터링
```

**Non-clustered 환경의 한계**

```
인덱스 순서:    boarding_date 오름차순 (정렬됨)
heap 저장 순서: primary key 오름차순 (PK 기준)

→ boarding_date 인덱스로 읽으면 heap 접근은 랜덤
→ PostgreSQL은 CLUSTER 명령으로 물리 재정렬 가능하나 일회성
```

**EXPLAIN 출력**

```
Index Scan using idx_boarding_date on rent_participants
  (actual time=0.231..14.1 rows=2516 loops=1)
  Index Cond: (boarding_date = '2025-09-11')
```

## 관련 본질

- [[본질-간접 참조 (Indirection)]]
