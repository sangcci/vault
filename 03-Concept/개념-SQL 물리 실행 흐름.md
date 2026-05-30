---
aliases: [SQL Physical Execution Flow, SQL Query Execution Pipeline, Query Execution Flow]
tags: [개념, 작성중]
difficulty: High
type: Concept
---

## 한 문장 정의

> (사전적) SQL 물리 실행 흐름은 SQL 문자열이 parse, rewrite, planning, execution을 거쳐 disk page와 memory buffer를 읽고 tuple을 반환하는 과정이다.
> (이해용) `SELECT ... FROM ... WHERE ...`가 사람이 읽는 문장에서 DBMS가 page를 읽고 row를 걸러내는 실행 기계로 바뀌는 과정이다.

---

## 해결하는 문제

- `FROM`과 `WHERE`를 단순한 논리 순서가 아니라 실제 page 접근과 tuple 평가로 이해하게 한다.
- 왜 같은 SQL도 Seq Scan, Index Scan, Bitmap Scan으로 다르게 실행되는지 설명한다.
- [[개념-EXPLAIN ANALYZE]]에서 `Filter`, `Index Cond`, `Buffers`가 무엇을 뜻하는지 연결한다.

---

## 치르는 비용

- 실제 DBMS는 optimizer가 plan을 고르므로 SQL 문장 순서와 실행 순서가 항상 일치하지 않는다.
- PostgreSQL, MySQL, Oracle마다 세부 구현은 다르다.
- page, buffer, MVCC, index, join까지 함께 봐야 전체 흐름이 보인다.

---

## 동작 원리

```text
SQL text
  |
  v
Parser
  - 문법 분석
  - query tree 생성
  |
  v
Rewriter
  - view/rule 확장
  |
  v
Planner / Optimizer
  - 가능한 path 생성
  - Seq Scan / Index Scan / Join 방식 비용 비교
  - 가장 싸다고 판단한 plan 선택
  |
  v
Executor
  - plan node를 demand-pull 방식으로 실행
  - scan node가 table/index에서 tuple 반환
  |
  v
Storage / Buffer Manager
  - disk page를 shared buffer로 적재
  - tuple visibility와 predicate 평가
```

`FROM table`은 “테이블 이름을 읽는다”가 아니다. planner가 relation 접근 path를 고르고, executor의 scan node가 heap page 또는 index page를 통해 raw row를 가져오는 출발점이다. 서브쿼리도 마찬가지로 SQL에 적힌 괄호 순서를 그대로 실행하는 것이 아니라 [[개념-서브쿼리 실행 계획]]에 따라 join, `InitPlan`, `SubPlan` 등으로 바뀔 수 있다.

```text
SELECT * FROM rent WHERE status = 'OPEN';

Seq Scan 선택 시:
heap page 0 -> buffer -> tuple filter
heap page 1 -> buffer -> tuple filter
heap page 2 -> buffer -> tuple filter

Index Scan 선택 시:
index page -> matching TID -> heap page -> tuple filter/recheck
```

---

## FROM과 WHERE의 물리적 의미

```text
논리 설명
FROM rent
WHERE status = 'OPEN'

물리 실행
scan node opens rent relation
  -> buffer manager requests page
  -> page in memory buffer
  -> tuple visible?
  -> predicate true?
  -> parent node로 row 반환
```

인덱스가 없거나 대부분의 row를 읽어야 하면 [[개념-Seq Scan]]이 선택될 수 있다. 선택도가 높고 인덱스가 유리하면 [[개념-Index Scan]]이나 [[개념-Bitmap Index Scan]]이 선택될 수 있다.

---

## 관련 본질

- [[본질-논리 순서와 물리 순서는 다르다]]
- [[개념-서브쿼리 실행 계획]]
- [[개념-DBMS의 역할과 저장소 관리자 (Storage Manager)]]
- [[개념-Heap Page 구조]]
- [[개념-MVCC (PostgreSQL)]]

---

## 참고

> "The planner/optimizer takes the (rewritten) query tree and creates a query plan that will be the input to the executor." — [PostgreSQL Documentation, The Path of a Query](https://www.postgresql.org/docs/devel/query-path.html)

> "The executor takes the plan created by the planner/optimizer and recursively processes it to extract the required set of rows." — [PostgreSQL Documentation, Executor](https://www.postgresql.org/docs/16/executor.html)

> "Nodes at the bottom level of the tree are scan nodes: they return raw rows from a table." — [PostgreSQL Documentation, Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)
