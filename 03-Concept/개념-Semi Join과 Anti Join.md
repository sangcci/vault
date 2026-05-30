---
aliases: [Semi Join, Anti Join, Semijoin, Antijoin]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) Semi Join은 inner row의 존재 여부만 확인해 outer row를 반환하는 join이고, Anti Join은 inner row가 존재하지 않는 outer row만 반환하는 join이다.
> (이해용) Semi Join은 “있으면 통과”, Anti Join은 “없으면 통과”하는 존재성 검사 join이다.

## 해결하는 문제

- `EXISTS`, `IN`, `NOT EXISTS`가 실제로 일반 join이 아니라 존재성 검사로 최적화될 수 있음을 설명한다.
- inner table의 중복 row를 전부 결과에 곱할 필요가 없다는 점을 이해한다.
- 서브쿼리가 planner에 의해 join plan으로 바뀔 수 있음을 보여준다.

```text
EXISTS / IN
  -> Semi Join
  -> matching inner row가 하나라도 있으면 outer row 반환

NOT EXISTS
  -> Anti Join
  -> matching inner row가 없으면 outer row 반환
```

## 치르는 비용

- `NOT IN`은 subquery 결과에 `NULL`이 있으면 3-valued logic 때문에 기대와 다르게 동작할 수 있다.
- 모든 `IN`/`EXISTS`가 항상 semi join으로 바뀌는 것은 아니다.
- outer/inner cardinality와 index 유무에 따라 Hash Semi Join, Nested Loop Semi Join 등 비용이 달라진다.

## 동작 원리

```sql
SELECT *
FROM orders o
WHERE EXISTS (
  SELECT 1
  FROM payments p
  WHERE p.order_id = o.id
);
```

가능한 plan:

```text
Nested Loop Semi Join
  -> Scan orders o
  -> Index Scan payments p
       Index Cond: p.order_id = o.id
```

Semi Join은 payment row를 결과에 붙이지 않는다. 존재 여부만 확인한 뒤 `orders` row를 반환한다.

```sql
SELECT *
FROM orders o
WHERE NOT EXISTS (
  SELECT 1
  FROM payments p
  WHERE p.order_id = o.id
);
```

가능한 plan:

```text
Hash Anti Join
  -> Scan orders o
  -> Hash payments p
```

Anti Join은 matching payment가 없는 order만 반환한다.

## 관련 본질

- [[개념-서브쿼리 실행 계획]]
- [[개념-InitPlan과 SubPlan]]
- [[개념-EXPLAIN ANALYZE]]
- [[개념-Hash Join]]
- [[개념-Nested Loop Join]]

## 참고

> "The subquery is evaluated to determine whether it returns any rows." — [PostgreSQL Documentation, Subquery Expressions](https://www.postgresql.org/docs/current/functions-subquery.html)

> "If it returns at least one row, the result of EXISTS is “true”; if the subquery returns no rows, the result of EXISTS is “false”." — [PostgreSQL Documentation, Subquery Expressions](https://www.postgresql.org/docs/current/functions-subquery.html)
