---
aliases: [Aggregate Function, 집계함수, SQL 집계]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 여러 행의 값을 하나의 결과값으로 계산하는 함수 (MAX, MIN, AVG, COUNT, SUM).
> (이해용) 결과셋을 받는 함수가 아니라, 행을 직접 순회하며 값을 하나씩 비교·누적하는 함수.

---

## 해결하는 문제

- 그룹 내 최대·최소·평균·합계를 단일값으로 요약해야 할 때

---

## 치르는 비용

- 행 순회 방식이기 때문에 인자는 반드시 **행마다 단일값**이어야 함
- GROUP BY 이후에만 동작 → WHERE 절 사용 불가 ([[본질-SQL 실행 순서 (Query Execution Order)]])

---

## 동작 원리

### 핵심 구분: 리스트를 던지는 것 vs 행을 순회하는 것

```
[잘못된 이해]
서브쿼리가 [100, 200, 300] 완성 → MAX에 리스트를 통째로 던짐
→ MAX는 리스트를 인자로 받는 함수가 아님 → 오류

[올바른 동작]
MAX가 테이블 행을 직접 순회
  row1 → 100 비교
  row2 → 200 비교  → 현재 최대값 갱신
  row3 → 300 비교  → 현재 최대값 갱신
  결과: 300
```

```
// 내부 동작 (의사코드)
int max = MIN_VALUE;
for (Row row : group) {
    int value = eval(expr, row);  // 행마다 단일값
    if (value > max) max = value;
}
```

### 인자 조건: 행마다 단일값으로 평가되는 표현식

```
MAX(expr)
  ✓ 컬럼명           MAX(급여)
  ✓ 연산식           MAX(급여 * 1.1)
  ✓ 스칼라 서브쿼리  MAX((SELECT 5000))      -- 1행 1열, 가능하나 의미 없음
  ✗ 다중행 서브쿼리  MAX((SELECT 급여 FROM 직원))  -- N행 → 단일값 아님 → 오류
```

### 같은 결과, 다른 구조

```sql
-- ✗ 불가: 서브쿼리가 먼저 [100, 200, 300] 완성 후 MAX에 던짐
SELECT MAX((SELECT 단가 FROM 제품 WHERE 제조사='H'));

-- ✓ 가능: MAX가 직접 행 순회
SELECT MAX(단가) FROM 제품 WHERE 제조사='H';

-- ✓ 가능: FROM 서브쿼리로 집합 구성 후 MAX가 그 위에서 순회
SELECT MAX(단가) FROM (
    SELECT 단가 FROM 제품 WHERE 제조사='H'
) sub;
```

---

## 관련 본질

- [[본질-SQL 실행 순서 (Query Execution Order)]]
