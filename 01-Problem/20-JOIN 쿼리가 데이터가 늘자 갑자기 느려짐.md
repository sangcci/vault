---
aliases: [Slow Join Query, Nested Loop Hash Join Merge Join, Join Strategy Regression]
tags: [문제, 작성중, DB, PostgreSQL, SQL]
difficulty: High
type: Problem
---

# Problem: 20-JOIN 쿼리가 데이터가 늘자 갑자기 느려짐

## 상황

처음에는 빠르던 JOIN 조회가 데이터가 늘어난 뒤 갑자기 느려진다. 인덱스를 추가했는데도 느리고, `EXPLAIN ANALYZE`를 보면 `Nested Loop`, `Hash Join`, `Merge Join` 중 어떤 plan이 선택됐는지에 따라 응답 시간이 크게 달라진다.

```sql
SELECT o.id, u.name, p.amount
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN payments p ON p.order_id = o.id
WHERE o.created_at >= now() - interval '7 days';
```

문제는 JOIN 문법 자체가 아니라, planner가 선택한 물리 조인 전략과 입력 row 수의 조합이다.

---

## 관찰된 증거

```text
Nested Loop
  outer row 수가 커짐
  inner index probe 반복
  loops 증가 → latency 증가

Hash Join
  build table이 work_mem 초과
  Batches > 1 → disk spill → latency 급증

Merge Join
  양쪽 정렬이 없어서 Sort 노드 추가
  대용량 sort 비용 → latency 증가
```

증상은 다음과 같다.

- `EXPLAIN ANALYZE`에서 `loops`가 예상보다 크다.
- Hash 노드의 `Batches`가 1보다 크다.
- Merge Join 앞에 큰 Sort 노드가 생긴다.
- 통계가 오래돼 실제 row 수와 추정 row 수 차이가 크다.
- `LEFT JOIN` 때문에 driving/build 방향이 제한된다.

---

## 의심 문제

가장 가능성 높은 문제는 **조인 전략과 입력 크기, 인덱스, 메모리 조건이 맞지 않는 것**이다.

JOIN은 SQL 문장에 적힌 순서대로 중첩 반복되는 고정 절차가 아니다. PostgreSQL planner는 여러 실행 계획 후보를 만들고 비용을 추정해 선택한다.

---

## 원인

대표 조인 전략은 다음 기준으로 갈린다.

```text
Nested Loop
  - outer가 작고 inner 인덱스가 좋을 때 유리
  - outer가 커지면 inner 탐색 반복이 병목

Hash Join
  - 인덱스 없는 대량 조인에 유리
  - build 쪽이 메모리를 넘으면 spill 비용 발생

Merge Join
  - 양쪽이 join key 기준 정렬되어 있을 때 유리
  - 정렬이 없으면 Sort 비용 발생
```

```text
같은 SQL
  ↓
통계 / 인덱스 / row 수 / work_mem / join type
  ↓
다른 plan 선택
  ↓
다른 latency
```

---

## 확인 방법

- `EXPLAIN (ANALYZE, BUFFERS)`로 실제 row 수와 추정 row 수를 비교한다.
- Nested Loop는 inner node의 `loops`와 index 사용 여부를 본다.
- Hash Join은 `Batches`, `Memory Usage`, spill 여부를 본다.
- Merge Join은 앞단 Sort 노드와 정렬 키 인덱스 존재 여부를 본다.
- `ANALYZE`로 통계를 갱신한 뒤 plan이 바뀌는지 확인한다.
- `LEFT JOIN`이 꼭 필요한지, `INNER JOIN`으로 바꿀 수 있는지 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| join key 인덱스 추가 | Nested Loop/ Merge Join 비용 감소 | 선택도 낮으면 효과 제한 |
| 통계 갱신/확장 통계 | row 추정 개선 | 데이터 분포 변화에 관리 필요 |
| WHERE 조건으로 outer 축소 | 반복 횟수 감소 | 비즈니스 조건 변경 불가 시 제한 |
| `work_mem` 조정 | Hash spill/Sort spill 완화 | 세션/동시성 기준 메모리 폭증 주의 |
| JOIN 순서/형태 재작성 | planner 선택지 개선 | 가독성 저하 가능 |
| 쿼리 분리/사전 집계 | 대량 조인 회피 | 정합성/복잡도 비용 |

---

## 트레이드오프

JOIN 최적화는 “어떤 JOIN이 항상 빠른가”가 아니라, 지금 입력 cardinality와 접근 경로에서 어떤 물리 전략이 싼가를 보는 문제다. 데이터가 늘거나 분포가 바뀌면 과거에 빠르던 plan이 갑자기 병목이 될 수 있다.

---

## 연결되는 본질

- [[본질-비용 기반 실행계획과 조인 전략]]
- [[본질-논리 순서와 물리 접근 비용]]
- [[본질-인덱스 선택도와 접근 경로]]

---

## 참고

> "A given SQL query (and hence, a query tree) can be actually executed in a wide variety of different ways" — [PostgreSQL Documentation: Planner/Optimizer](https://www.postgresql.org/docs/current/planner-optimizer.html)

> "ultimately selecting the execution plan that is expected to run the fastest" — [PostgreSQL Documentation: Planner/Optimizer](https://www.postgresql.org/docs/current/planner-optimizer.html)
