# SQL GROUP BY 함수 종속(Functional Dependency)과 관계대수

## 핵심 개념

**함수 종속** 정의:
> X 값이 같으면 Y 값도 반드시 같다 → `X → Y`

GROUP BY에서 PK가 포함되어 있으면, 해당 테이블의 나머지 컬럼들은 **함수 종속**이 성립하므로 SELECT에 집계함수 없이 사용 가능하다.

---

## 실제 사례 (SurveyDslRepositoryImpl)

Survey 테이블에서 `id`는 PK이므로:
```
{survey.id} → {title, information, isClosed}
```

### 문제가 된 쿼리
```java
.where(survey.id.eq(surveyId))
.groupBy(surveyBoardingDate.date)   // ← 42803 에러
```

PostgreSQL SQLState `42803`: `GROUP BY` 절에 없는 컬럼(`title`, `information`, `isClosed`)을 SELECT에 사용

### 수정된 쿼리
```java
.where(survey.id.eq(surveyId))
.groupBy(survey.id, surveyBoardingDate.date)  // PK 추가
```

PK(`survey.id`)가 GROUP BY에 들어오면 → PostgreSQL이 `title`, `information`, `isClosed`가 자동으로 결정됨을 알고 허용

---

## 관계대수 표현

확장 관계대수의 **집계 연산자 γ (gamma)**:
```
γ_(X; f(A)) (R)
   X: 그루핑 속성
   f(A): 집계함수(속성)
```

전체 쿼리:
```
π_(survey.id, title, information, isClosed, date, SUM(passengerNum))
  (
    γ_(survey.id, date; SUM(passengerNum))
      (
        σ(survey.id = surveyId)
          (Survey ⋈ SurveyBoardingDate ⋈ SurveyJoin)
      )
  )
```

### π에서 title 등을 꺼낼 수 있는 이유

Armstrong 공리의 **증가 법칙(Augmentation)**:
```
{survey.id} → title
────────────────────── (augmentation)
{survey.id, date} → title
```

`GROUP BY (survey.id, date)`로 만들어진 각 그룹 안에서 `title`은 반드시 하나의 값만 존재 → π로 꺼내는 것이 수학적으로 안전

---

## 직관적 이해

| 그룹 | survey.id | date  | SUM(passenger) | title      |
|------|-----------|-------|----------------|------------|
| 1    | 1         | 01-01 | 10             | "서울콘서트" |
| 2    | 1         | 01-02 | 5              | "서울콘서트" |

각 그룹에서 `title`이 동일하므로 **집계 없이 꺼내도 모호함이 없다**.

---

## 2단계 처리 구조 (QueryDSL transform)

`transform(GroupBy.groupBy(survey.id))` 는 SQL과 Java 두 단계로 처리된다.

**SQL 레벨** — `GROUP BY (survey.id, date)`:
```
(survey_id=1, date=01-01) → passengerNum 합계
(survey_id=1, date=01-02) → passengerNum 합계
(survey_id=1, date=01-03) → passengerNum 합계
```

**Java 레벨** — `transform(GroupBy.groupBy(survey.id))`:
→ survey.id 기준으로 다시 묶어 `List<SurveyBoardingDateResponse>`로 변환

**최종 결과**:
```
SurveyDetailResponse {
  id: 1,
  title: "서울콘서트",
  boardingDates: [
    { date: 01-01, passengerCount: 10 },
    { date: 01-02, passengerCount: 5 },
    { date: 01-03, passengerCount: 8 }
  ]
}
```

---

## MySQL vs PostgreSQL 차이

| 항목 | MySQL (기본값) | PostgreSQL |
|------|---------------|------------|
| ONLY_FULL_GROUP_BY | 비활성화 (느슨) | 항상 활성화 (엄격) |
| 비집계 컬럼 SELECT | 허용 (임의 값 반환 가능) | 함수 종속 없으면 에러 |
| 함수 종속 인식 | 제한적 | PK 기반 완전 지원 |

> MySQL에서 동작하던 쿼리가 PostgreSQL로 마이그레이션 시 42803 에러로 깨지는 주요 원인

---

## 관련 개념

- Armstrong 공리 (반사율, 증가율, 이행율)
- 정규화 (1NF~3NF, BCNF)
- SQL:1999 표준 functional dependency 조항