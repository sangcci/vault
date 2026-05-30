---
aliases: [GROUP BY Functional Dependency, 42803, ONLY_FULL_GROUP_BY, pg_constraint]
tags: [개념, 작성중, DB, SQL, PostgreSQL]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) GROUP BY 절에 PK가 포함되면, 해당 테이블의 나머지 컬럼은 함수 종속이 성립하여 집계함수 없이도 SELECT에 사용할 수 있다.
> (이해용) "survey.id를 알면 title도 이미 결정돼 있다 — 그룹 안에서 어느 행을 봐도 title이 같으니 아무거나 꺼내도 안전하다."

---

## 해결하는 문제

- GROUP BY 후 집계하지 않은 컬럼을 SELECT에서 꺼낼 때 발생하는 42803 에러
- 집계 + 비집계 컬럼을 동시에 조회해야 하는 쿼리 설계

---

## 치르는 비용

- PK가 GROUP BY에 없으면 PostgreSQL은 항상 에러 → 쿼리 구조를 FD(함수적 종속) 기반으로 설계해야 함
- MySQL에서 동작하던 쿼리가 PostgreSQL 마이그레이션 시 42803으로 깨질 수 있음

---

## 동작 원리

### 왜 GROUP BY가 필요한가

집계함수(`SUM`, `COUNT` 등)는 여러 행을 하나의 값으로 줄인다. 기준 없이는 어떤 행들을 묶어 계산해야 할지 알 수 없다.

```sql
-- 기준 없음 -> 전체 테이블을 하나의 그룹으로?
-- date 별로? id 별로? SQL이 판단 불가
SELECT SUM(passenger_num) FROM survey_boarding_date;  -- OK (전체 합계)
SELECT id, SUM(passenger_num) FROM survey_boarding_date;  -- ERROR: id 기준이 없음
```

문법적으로 집계함수와 함께 쓰는 비집계 컬럼은 반드시 GROUP BY에 명시해야 한다. PK가 있어도 예외 없이 적용된다.

### FD가 있으면 비집계 컬럼을 꺼낼 수 있는 이유

```sql
SELECT survey.id, title, date, SUM(passenger_num)
FROM survey
JOIN survey_boarding_date ON survey.id = survey_boarding_date.survey_id
WHERE survey.id = 1
GROUP BY survey.id, date
```

**1단계 — JOIN 후 원본 행 집합:**
```
survey_id | title    | date  | passenger_num
1         | 서울콘서트 | 01-01 | 3
1         | 서울콘서트 | 01-01 | 7
1         | 서울콘서트 | 01-02 | 5
```

**2단계 — GROUP BY (survey.id, date)로 그룹 형성:**
```
Group (1, 01-01): [ (서울콘서트, 3), (서울콘서트, 7) ]
Group (1, 01-02): [ (서울콘서트, 5) ]
```

**3단계 — SELECT 계산 (핵심):**
```
Group (1, 01-01) 처리:
  survey.id -> GROUP BY key   -> 1           (확정)
  date      -> GROUP BY key   -> 01-01       (확정)
  SUM(...)  -> aggregate      -> 3 + 7 = 10  (계산)
  title     -> first pick     -> "서울콘서트"  (그룹 내 첫 행에서 꺼냄)
```

PostgreSQL은 `title`을 특별히 계산하지 않는다. **그룹 내 임의의 행에서 값을 꺼낸다 (first pick)**. 이것이 안전한 이유는 `survey.id`가 PK이므로 같은 `survey.id`를 가진 모든 행의 `title`은 물리적으로 동일한 값이 보장되기 때문이다.

```
Group (1, 01-01)의 모든 행 -> title = "서울콘서트" (전부 동일)
-> 어느 행을 골라도 결과가 같음 -> first pick이 안전
```

### PostgreSQL이 FD를 확인하는 방법

쿼리 플래닝 시점에 `pg_constraint` 시스템 카탈로그를 조회한다.

```
pg_constraint:
  table: survey
  type: PRIMARY KEY
  columns: [id]
  -> survey.id -> survey의 모든 컬럼 (FD 성립)
```

- PK / UNIQUE NOT NULL 제약이 있는 컬럼만 FD 근거로 인정
- 개발자가 "이 컬럼은 FD가 있다"고 임의로 선언하는 방법은 없음
- Armstrong 공리의 증가 법칙: `{survey.id} → title` 이면 `{survey.id, date} → title` 도 성립

### PK 없이 GROUP BY하면?

```sql
GROUP BY date  -- PK 없음
```

```
Group (01-01): title 후보 -> "서울콘서트", "부산콘서트", ...
-> 어느 값을 골라야 할지 결정 불가 (non-deterministic)
-> PostgreSQL: 42803 에러
-> MySQL(ONLY_FULL_GROUP_BY 비활성): 조용히 임의 값 반환 (잘못된 결과 가능)
```

### MySQL vs PostgreSQL 비교

```
                  MySQL (기본값)          PostgreSQL
---------------------------------------------------------
ONLY_FULL_GROUP_BY  비활성 (느슨)          항상 활성 (엄격)
비집계 컬럼 SELECT   허용 (임의 값 반환)    FD 없으면 42803 에러
FD 인식             제한적                 PK 기반 완전 지원
```

> MySQL에서 동작하던 쿼리가 PostgreSQL로 마이그레이션 시 42803으로 깨지는 주요 원인.
> MySQL이 틀린 결과를 조용히 냈을 가능성이 있는 쿼리를 PostgreSQL이 잡아주는 것이기도 하다.

### QueryDSL 2단계 처리 구조

집계 결과를 중첩 DTO로 변환할 때 SQL과 Java 두 단계로 나뉜다.

```
SQL 레벨 — GROUP BY (survey.id, date):
  (survey_id=1, date=01-01) -> passenger 합계
  (survey_id=1, date=01-02) -> passenger 합계
  (survey_id=1, date=01-03) -> passenger 합계

Java 레벨 — transform(GroupBy.groupBy(survey.id)):
  survey.id 기준으로 재조합 -> List<SurveyBoardingDateResponse>

최종 결과:
  SurveyDetailResponse {
    id: 1, title: "서울콘서트",
    boardingDates: [
      { date: 01-01, passengerCount: 10 },
      { date: 01-02, passengerCount: 5 }
    ]
  }
```

이 구조는 역정규화와 무관하다. 쿼리를 2개로 나누는 방법과 달리, SQL 1회 + Java 재조합으로 처리한다.

---

## 관련 본질

- [[본질-원자성 (Atomicity)]] — 그룹 단위가 집계의 원자 단위를 결정
- [[본질-값의 신뢰성 (Value Trustworthiness)]] — FD 없는 비집계 컬럼은 신뢰할 수 없는 값

---

## 관련 개념

- [[개념-함수적 종속성 (Functional Dependency)]] — FD의 수학적 정의와 정규화 관계
- [[개념-EXPLAIN ANALYZE]] — GROUP BY 실행 계획 (Hash Aggregate vs Sort + Group Aggregate)
