---
aliases: [EXPLAIN ANALYZE, EXPLAIN, 실행 계획, 쿼리 플랜]
tags: [개념, 작성중]
type: Concept
difficulty: Low
---

## 한 문장 정의

> (사전적) 쿼리 실행 계획(Planner 예측)과 실제 실행 결과(actual)를 동시에 출력하는 PostgreSQL 진단 도구.
> (이해용) "Planner가 예상한 것"과 "실제 일어난 것"을 나란히 보여줘서 어디서 예측이 빗나갔는지 찾는 도구.

## 해결하는 문제

- 쿼리 성능 병목 지점 파악
- Planner의 잘못된 통계/플랜 선택 탐지
- 인덱스 사용 여부 확인

## 치르는 비용

- `EXPLAIN ANALYZE`는 쿼리를 실제로 실행함
- `DELETE`, `UPDATE`에 사용 시 반드시 트랜잭션으로 감싸고 ROLLBACK

## 동작 원리

```
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;

Seq Scan on orders  (cost=0.00..4521.00 rows=183 width=64)
                    (actual time=0.021..18.432 rows=191 loops=1)
  Filter: (user_id = 42)
  Rows Removed by Filter: 89809
```

**필드별 의미**

```
(cost=0.00..4521.00  rows=183   width=64)
        │       │       │         └─ 예상 row 바이트 크기
        │       │       └─────────── Planner 예측 row 수
        │       └─────────────────── 마지막 row까지 예상 비용
        └─────────────────────────── 첫 row까지 예상 비용 (startup)

(actual time=0.021..18.432  rows=191  loops=1)
                               │        └─ 이 노드 실행 횟수
                               └────────── 실제 반환 row 수
```

**트리 읽는 순서**: 들여쓰기 깊을수록 먼저 실행

```
Hash Join
  → Seq Scan on A       ← 2번째 실행 (Probe)
  → Hash                ← 1번째 실행 (Build)
       → Seq Scan on B  ← 가장 먼저 실행
```

**병목 찾는 순서**
1. `actual time` 큰 노드 찾기
2. `rows` 예측 vs 실제 괴리 확인
3. `loops` 곱해 총 비용 계산 (`actual time × loops`)
4. `Rows Removed by Filter` 큰 것 주목
5. `BUFFERS`로 shared hit/read를 확인해 memory hit인지 disk read인지 구분

**FROM/WHERE 물리 실행 읽기**

```text
Seq Scan on orders
  Filter: (user_id = 42)
  Rows Removed by Filter: 89809
  Buffers: shared hit=120 read=30
```

- `Seq Scan`: `FROM orders`가 heap page 순차 접근으로 실행됨.
- `Filter`: `WHERE` 조건이 tuple을 읽은 뒤 평가됨.
- `Rows Removed by Filter`: page에서 읽었지만 조건에 맞지 않아 버린 row 수.
- `shared hit`: 이미 shared buffer에 있던 page.
- `shared read`: disk에서 읽어 shared buffer에 올린 page.

```text
Index Scan using idx_orders_user_id on orders
  Index Cond: (user_id = 42)
  Buffers: shared hit=10 read=2
```

- `Index Cond`: `WHERE` 조건이 index 탐색 조건으로 내려감.
- heap 접근 전 후보 TID를 줄일 수 있음.

**EXPLAIN vs EXPLAIN ANALYZE**

| | EXPLAIN | EXPLAIN ANALYZE |
|---|---|---|
| 쿼리 실행 | X | O |
| actual time/rows | X | O |
| 사용 시점 | 빠른 플랜 확인 | 실제 병목 진단 |

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-SQL 물리 실행 흐름]]
- [[개념-Seq Scan]]
- [[개념-Index Scan]]

## 참고

> "EXPLAIN actually executes the query, and then displays the true row counts and true run time accumulated within each plan node." — [PostgreSQL Documentation, Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)
