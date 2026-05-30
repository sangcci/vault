---
aliases: [InitPlan, SubPlan, PostgreSQL SubPlan]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) `InitPlan`은 outer row와 독립적이라 한 번 실행해 parameter로 쓰는 subquery plan이고, `SubPlan`은 outer query 중간에서 호출되며 반복 실행될 수 있는 subquery plan이다.
> (이해용) `InitPlan`은 미리 한 번 계산해 둔 값이고, `SubPlan`은 바깥 row를 보면서 필요할 때 다시 부르는 하위 작업이다.

---

## 해결하는 문제

- 서브쿼리가 한 번 실행되는지, outer row마다 반복될 수 있는지 구분한다.
- EXPLAIN에서 느린 subquery를 찾을 때 `loops`를 봐야 하는 이유를 설명한다.
- 비상관/상관 서브쿼리의 실행 차이를 물리 plan으로 연결한다.

---

## 치르는 비용

- `SubPlan`이 항상 나쁜 것은 아니다. index probe가 작고 outer row가 적으면 충분히 빠를 수 있다.
- `loops`가 크고 내부 scan 비용이 크면 N+1과 비슷한 병목이 된다.
- planner가 join으로 풀지 못한 이유는 NULL semantics, aggregation, volatile function, LIMIT 등 다양할 수 있다.

---

## 동작 원리

```text
InitPlan
- outer row 값에 의존하지 않음
- query 시작 시 한 번 실행
- 결과를 parameter로 저장해 parent plan에서 사용

SubPlan
- outer row 값에 의존할 수 있음
- parent node의 filter/expression 평가 중 호출
- loops가 커질 수 있음
```

예시:

```sql
SELECT *
FROM orders
WHERE total > (SELECT avg(total) FROM orders);
```

가능한 plan 감각:

```text
InitPlan
  -> Aggregate avg(total)
Seq Scan orders
  Filter: total > $0
```

상관 서브쿼리 예시:

```sql
SELECT *
FROM orders o
WHERE total > (
  SELECT avg(total)
  FROM orders o2
  WHERE o2.user_id = o.user_id
);
```

가능한 plan 감각:

```text
Seq Scan orders o
  Filter: total > (SubPlan)
  SubPlan
    -> Aggregate avg(total)
       -> Index/Seq Scan orders o2
          Filter: o2.user_id = o.user_id
```

이때 `SubPlan`의 `loops`가 outer row 수만큼 커질 수 있다.

---

## 관련 본질

- [[개념-서브쿼리 실행 계획]]
- [[개념-EXPLAIN ANALYZE]]
- [[개념-SQL 물리 실행 흐름]]

---

## 참고

> "Some query plans involve subplans, which arise from sub-SELECTs in the original query." — [PostgreSQL Documentation, Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)

> "Such queries can sometimes be transformed into ordinary join plans" — [PostgreSQL Documentation, Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)
