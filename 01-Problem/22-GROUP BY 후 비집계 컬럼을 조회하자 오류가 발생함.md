---
aliases: [GROUP BY Ungrouped Column Error, Functional Dependency GROUP BY, PostgreSQL 42803]
tags: [문제, 작성중, DB, SQL, PostgreSQL]
difficulty: Medium
type: Problem
---

# Problem: 22-GROUP BY 후 비집계 컬럼을 조회하자 오류가 발생함

## 상황

집계 결과와 일반 컬럼을 함께 조회하려고 했더니 PostgreSQL에서 오류가 발생한다.

```sql
SELECT survey.id, survey.title, date, sum(passenger_num)
FROM survey
JOIN survey_boarding_date ON survey.id = survey_boarding_date.survey_id
GROUP BY date;
```

오류는 대개 다음 형태다.

```text
ERROR: column "survey.id" must appear in the GROUP BY clause
or be used in an aggregate function
SQLSTATE 42803
```

MySQL에서 되던 쿼리가 PostgreSQL로 오면 깨지는 경우도 있다.

---

## 관찰된 증거

집계는 여러 row를 하나로 줄인다. 그런데 그룹 안에 서로 다른 값이 있을 수 있는 컬럼을 그냥 꺼내면 어떤 값을 반환해야 할지 결정할 수 없다.

```text
GROUP BY date

date=01-01 그룹 안:
  survey_id=1, title=서울콘서트, passenger=3
  survey_id=2, title=부산콘서트, passenger=7

SELECT title ?
  → 서울콘서트인가?
  → 부산콘서트인가?
  → 결정 불가
```

반대로 PK가 GROUP BY에 포함되면 상황이 달라진다.

```text
GROUP BY survey.id, date

survey.id=1이면 survey.title은 하나로 결정됨
  survey.id → title
  함수 종속 성립
```

---

## 의심 문제

가장 가능성 높은 문제는 **집계 단위와 조회하려는 컬럼의 결정성이 맞지 않는 것**이다.

GROUP BY는 결과 row의 원자 단위를 정한다. SELECT에 있는 비집계 컬럼은 그 그룹 안에서 하나의 값으로 결정되어야 한다.

---

## 원인

집계 쿼리에서 SELECT 표현식은 세 종류 중 하나여야 한다.

```text
1. GROUP BY key
2. aggregate function 결과
3. GROUP BY key에 함수 종속된 컬럼
```

PostgreSQL은 주로 PK를 통해 함수 종속을 인정한다.

```sql
SELECT survey.id, survey.title, date, sum(passenger_num)
FROM survey
JOIN survey_boarding_date ON survey.id = survey_boarding_date.survey_id
GROUP BY survey.id, date;
```

```text
survey.id가 PK
  ↓
survey.id → survey.title
  ↓
그룹 안에서 title은 하나로 결정
  ↓
SELECT 가능
```

---

## 확인 방법

- SELECT에 있는 컬럼이 GROUP BY key인지 확인한다.
- GROUP BY key로 해당 컬럼이 하나로 결정되는지 확인한다.
- PK 또는 UNIQUE NOT NULL 제약이 실제 DB에 존재하는지 확인한다.
- MySQL에서만 되던 쿼리라면 임의 값 반환에 기대고 있던 것은 아닌지 본다.
- QueryDSL/ORM transform이 SQL GROUP BY와 Java 재조합 단계를 섞어 이해하게 만들지 않았는지 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 필요한 key를 GROUP BY에 추가 | 결정성 명확 | 그룹 단위가 바뀔 수 있음 |
| PK를 GROUP BY에 포함 | FD로 비집계 컬럼 조회 가능 | DB 제약이 실제 있어야 함 |
| 집계 쿼리와 상세 조회 분리 | 의미 명확 | 쿼리 2회/조합 비용 |
| window function 사용 | 원본 row와 집계값 동시 표현 | frame/partition 이해 필요 |
| Java 단계 재조합 | DTO 구조화 편리 | SQL 결과 row 수 증가 가능 |

---

## 트레이드오프

GROUP BY 오류는 문법 문제가 아니라 “이 그룹의 대표값이 결정되는가”의 문제다. 집계 단위를 잘못 잡으면 오류가 나거나, 더 위험하게는 DB가 임의 값을 조용히 반환할 수 있다.

---

## 연결되는 본질

- [[본질-집계 단위와 함수 종속]]
- [[본질-관측 데이터 최소화와 민감정보 경계]]
- [[본질-논리 순서와 물리 접근 비용]]

---

## 참고

> "When GROUP BY is present, or any aggregate functions are present, it is not valid for the SELECT list expressions to refer to ungrouped columns except within aggregate functions or when the ungrouped column is functionally dependent on the grouped columns" — [PostgreSQL Documentation: SELECT](https://www.postgresql.org/docs/current/sql-select.html)

> "A functional dependency exists if the grouped columns (or a subset thereof) are the primary key of the table containing the ungrouped column." — [PostgreSQL Documentation: SELECT](https://www.postgresql.org/docs/current/sql-select.html)
