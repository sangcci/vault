---
aliases: [SELECT Query Design, 쿼리 설계 체크리스트]
tags: [판단기준, 작성중, DB, SQL]
type: Heuristic
difficulty: Medium
---

## 판단 기준

### 1. JOIN 방식 선택

- 연관 엔티티가 **반드시 존재해야 하는** 관계 → `INNER JOIN`
- 연관 엔티티가 **없을 수도 있는** 관계 → `LEFT JOIN`

```text
[Rent] ──── [Concert]

Concert가 없는 Rent는 비정상 데이터
→ INNER JOIN 사용 시 비정상 행이 자동 필터링됨
→ LEFT JOIN 사용 시 NULL이 포함된 채 반환됨

판단: 비정상 시나리오를 노출할 것인가, 필터할 것인가
```

### 2. GROUP BY 시 인덱스 확인

- GROUP BY는 **정렬을 수반**한다.
- GROUP BY 대상 컬럼에 인덱스가 없으면 filesort 발생 → 대량 데이터에서 병목.
- `EXPLAIN`에서 `Using temporary; Using filesort`가 보이면 인덱스 추가 검토.

### 3. 시나리오 기반 쿼리 검증

- 쿼리 작성 후 다음 시나리오에서 결과가 올바른지 확인:
  - 연관 데이터가 0건인 경우
  - 연관 데이터가 N건인 경우 (중복 증폭 여부)
  - NULL 값이 포함된 경우

## 효과적인 상황

- 연관관계가 있는 테이블을 조회하는 API 설계 시.
- 코드 리뷰에서 쿼리를 검증할 때 체크리스트로 활용.
- 실행 계획(EXPLAIN)을 분석하기 전 가설을 세울 때.

## 실패하는 상황

- 단일 테이블 단순 조회에 과도하게 적용 (오버엔지니어링).
- 시나리오 검증 없이 "돌아가니까 OK" 판단.
- 인덱스만 믿고 데이터 분포(카디널리티)를 무시.
