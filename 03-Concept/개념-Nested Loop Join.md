---
aliases: [Nested Loop Join, 중첩 루프 조인, NL Join]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Outer 테이블의 각 row마다 Inner 테이블을 탐색하는 중첩 반복 조인 전략.
> (이해용) 중첩 for문 그 자체. Inner에 인덱스가 있으면 빠르고, 없으면 최악.

## 해결하는 문제

- Outer가 소량이고 Inner에 인덱스가 있을 때 최적 조인
- Hash Join보다 메모리 사용량 낮음

## 치르는 비용

- Inner 인덱스 없으면 O(N × M) — 대용량에서 치명적
- Outer가 클수록 Inner 탐색 반복 횟수 증가

## 동작 원리

```
for each row in Outer (Driving):
    for each row in Inner (Driven):
        if 조건 매칭 → 결과 포함
```

**인덱스 유무에 따른 차이**

```
[Inner 인덱스 없음]
Outer 30,000 × Inner 1,020,000 = 306억 번 비교

[Inner 인덱스 있음]
Outer 30,000 × O(log N) = 30,000 × ~20 = 60만 번
```

**EXPLAIN 출력**

```
Nested Loop Left Join  (actual time=1.08..14.5 rows=34 loops=1)
  →  Index Scan on rent_boarding_slot   ← Outer (Driving)
       Index Cond: (rent_id = 500)
  →  Index Scan on rent_participants    ← Inner (Driven)
       Index Cond: (boarding_date = '2025-09-11')
```

**Driving/Driven 선택 원칙**

```
Driving  →  작은 테이블 (결과 row 수 적은 쪽)
Driven   →  인덱스 있는 테이블

LEFT JOIN: 왼쪽 테이블이 Driving 고정 (A의 모든 row 보장 필요)
INNER JOIN: 옵티마이저가 비용 계산 후 결정
```

## 관련 본질

- [[본질-처리량과 지연시간 (Throughput and Latency)]]
