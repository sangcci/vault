---
aliases: [Filter vs Index Cond, Index Cond, PostgreSQL Filter]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) `Index Cond`는 index 탐색 단계에서 후보 tuple을 줄이는 조건이고, `Filter`는 scan node가 tuple을 읽은 뒤 평가하는 조건이다.
> (이해용) `Index Cond`는 책 색인에서 먼저 거르는 조건이고, `Filter`는 페이지를 펼친 뒤 줄마다 다시 확인하는 조건이다.

---

## 해결하는 문제

- `WHERE` 조건이 모두 같은 비용으로 실행된다고 오해하는 문제.
- EXPLAIN에서 인덱스를 탔는데도 느린 이유를 찾지 못하는 문제.
- heap 접근 전 후보를 줄인 조건과 heap 접근 후 버린 조건을 구분하지 못하는 문제.

```text
Index Scan
  Index Cond: index page에서 후보 TID 축소
        |
        v
  heap page fetch
        |
        v
  Filter: tuple 읽은 뒤 추가 조건 평가
```

---

## 치르는 비용

- `Filter`가 많으면 이미 읽은 tuple을 버리는 비용이 커진다.
- index에 없는 조건은 heap tuple 접근 후 평가될 수 있다.
- 함수, 형변환, 낮은 선택도 조건은 index cond로 잘 내려가지 않을 수 있다.

---

## 동작 원리

```text
Index Scan using idx_boarding_date on rent_participants
  Index Cond: (boarding_date = '2025-09-11')
  Filter: (rent_id = 500)
  Rows Removed by Filter: 2510
```

`boarding_date`는 index에서 먼저 후보를 줄인다. `rent_id`는 heap tuple을 읽은 뒤 평가되어 많은 row를 버릴 수 있다.

---

## 관련 본질

- [[개념-EXPLAIN ANALYZE]]
- [[개념-Index Scan]]
- [[개념-SQL 물리 실행 흐름]]

---

## 참고

> "Nodes at the bottom level of the tree are scan nodes: they return raw rows from a table." — [PostgreSQL Documentation, Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)
