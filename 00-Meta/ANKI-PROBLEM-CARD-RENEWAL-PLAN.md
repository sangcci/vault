# Anki Problem Card Renewal Plan

> Keyword 암기에서 Problem 기반 문제해결 훈련으로 전환한다.

## 1. 결론

현재 Anki `💻::Keyword` 덱은 230장이다. 기존 카드는 대부분 용어 정의 중심이며, `Type` 필드가 없고 `Question / Answer / Category / Code / RelatedConcepts` 필드만 사용 중이다.

앞으로 Anki의 주 학습 단위는 `01-Problem/` 노트다. `02-Principle/`은 보조 회상용 Keyword로 유지하고, `03-Question/`은 Anki 대상으로 삼지 않는다.

덱은 복잡하게 나누지 않는다. 문제 해결 카드는 **단일 덱**으로 유지하고, 카드 내부의 `CardType` 필드만 `Scenario / Code Review / Implementation`으로 구분한다.

```text
Deck: 💻::Problem Solving

Problem note
  ↓
Scenario card       문제 상황 → 원인/첫 대응
Code Review card    코드/설정 조각 → 위험 지점 탐지
Implementation card 해결 방향 → 구현 체크포인트
```

---

## 2. 기존 Keyword 덱 감사 결과

생성 파일:

```text
00-Meta/Anki-Keyword-Audit.csv
00-Meta/Anki-Keyword-Audit-Reviewed.csv
```

초기 자동 분류:

| Decision | Count | 의미 |
|---|---:|---|
| KEEP | 39 | Principle 회상용으로 유지 후보 |
| CONVERT | 25 | Problem 카드로 전환 후보 |
| DELETE | 26 | 삭제 후보 |
| REVIEW | 140 | 보수적 자동 분류로 남겨둔 수동 검토 후보 |

REVIEW 재분류 후:

| Decision | Count | 의미 |
|---|---:|---|
| KEEP | 48 | Keyword로 유지 후보 |
| CONVERT | 69 | Problem 카드로 전환 후보 |
| DELETE | 113 | 삭제 또는 suspend 후보 |
| REVIEW | 0 | 남은 미분류 없음 |

### 2.1 KEEP 기준

다음 조건을 만족하면 Keyword로 유지한다.

- 여러 Problem을 관통하는 Principle이다.
- 5초 안에 떠올릴 가치가 있는 압축 개념이다.
- Problem 카드의 Answer에서 반복적으로 참조된다.
- 예: 멱등성, 원자성, 트랜잭션 경계, 임계 구역, 가시성, 역압, 캐시 일관성.

### 2.2 DELETE 기준

다음 조건이면 삭제 후보로 둔다.

- 현재 `01-Problem/` 또는 `02-Principle/`과 연결되지 않는다.
- 단독 CS/용어 암기에 가깝다.
- 면접 답변이나 실무 문제 해결에 바로 쓰기 어렵다.
- 이미 Problem/Principle 노트로 흡수되어 별도 Keyword 회상이 중복이다.

주의: 실제 삭제는 사용자 승인 후 Anki에서 수행한다.

### 2.3 CONVERT 기준

다음 조건이면 삭제보다 Problem 카드 전환을 우선한다.

- 기존 Keyword 질문이 특정 Problem의 증상/원인/해결과 직접 연결된다.
- 용어 정의보다 “이 상황에서 무엇을 해야 하는가?”로 물을 때 가치가 커진다.
- 예: 문맥 교환, 장애, 캐시 키 공간, 인덱스, 트랜잭션 경계.

### 2.4 REVIEW 처리 방식

초기 `REVIEW` 140장은 “모호해서 보류”라기보다, 자동 매칭을 보수적으로 잡았기 때문에 생겼다. 예를 들어 `N+1 문제`, `Lost Update`, `EXPLAIN ANALYZE`는 실제 Problem과 연결되지만, 파일명과 정확히 매칭되지 않아 REVIEW로 남았다.

재분류 기준:

```text
1. 특정 Problem의 증상/원인/해결로 바로 바뀌는가? → CONVERT
2. 여러 Problem 정답에서 반복 참조할 원리/지표인가? → KEEP
3. 연결 Problem을 특정하지 못한 단독 용어인가? → DELETE
```

REVIEW 140장 재분류 결과:

```text
CONVERT 44
KEEP     9
DELETE  87
```

따라서 최종 감사 작업은 `Anki-Keyword-Audit-Reviewed.csv`를 기준으로 한다.

---

## 3. 새 Problem 카드 유형

### 3.1 Scenario

목적: 실무 상황을 보고 원인과 첫 대응을 떠올린다.

```text
Question: 운영에서 어떤 증상이 발생했다. 가장 먼저 의심할 구조적 원인은?
Answer: 핵심 원인 + 첫 확인 지점 + 해결 방향
```

필드 초안:

| Field | 내용 |
|---|---|
| Question | 실제 앞면 질문. 코드리뷰 카드는 코드/SQL/설정 조각도 여기에 포함 |
| Answer | 핵심 원인, 판단, 해결 행동 |
| CardType | Scenario |
| Problem | 연결 Problem 노트명 |
| Principles | 연결 Principle 1~3개 |

---

### 3.2 Code Review

목적: 코드/설정/SQL 조각을 보고 위험 지점을 찾는다.

```text
Question: 다음 코드에서 운영 장애로 이어질 수 있는 지점은?
Answer: 위험 지점 + 왜 문제인지 + 안전한 수정 방향
```

적합한 Problem:

- 트랜잭션 안 외부 API 호출
- save try-catch로 DB 제약 예외 처리
- JPQL 벌크 업데이트 후 stale read
- AOP self-invocation
- 캐시 evict race
- SQL 로그 민감정보 노출

---

### 3.3 Implementation

목적: 해결책을 어떻게 구현할지 체크리스트로 떠올린다.

```text
Question: 이 문제를 막기 위해 어떤 구조로 구현해야 하는가?
Answer: 구현 단계 + 필수 저장 상태 + 예외/동시성 처리
```

적합한 Problem:

- 멱등성 키로 중복 주문 방지
- Rate Limit 구현
- 감사 로그/이벤트 이력 저장
- 스키마 마이그레이션 순서 설계
- 접근 제어 모델 구현
- 테스트 외부 의존성 격리

---

## 4. 카드 생성 우선순위

생성 파일:

```text
00-Meta/Anki-Problem-Card-Candidates.csv
```

초기 분류:

| Priority | Count | 카드 정책 |
|---|---:|---|
| P1 | 44 | Scenario + Implementation + 필요 시 Code Review |
| P2 | 27 | Scenario + 필요 시 Implementation |
| P3 | 0 | 이번 1차 개편에서는 없음 |

### 4.1 P1 기준

- 운영 장애로 직접 이어진다.
- 백엔드 면접에서 질문으로 바꾸기 쉽다.
- 코드/설계 리뷰 카드로 만들 수 있다.
- 여러 Principle과 연결된다.

대표 후보:

```text
01 외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈됨
02 재시도와 동시 요청으로 주문이 중복 생성됨
03 동시 요청으로 재고나 예약 수량 갱신이 소실됨
04 목록 조회 API에서 연관 데이터 접근으로 SQL이 폭증함
07 DB 업데이트 후 캐시에 오래된 값이 다시 저장됨
16 같은 클래스 내부 호출로 트랜잭션이나 캐시가 적용되지 않음
23 운영 중 인덱스 추가로 쓰기 요청이 막히거나 마이그레이션이 멈춤
55 코드 배포와 DB 스키마 변경 순서가 맞지 않아 장애가 발생함
71 운영 SQL 로그에 파라미터를 남겨 개인정보와 시크릿이 노출됨
```

### 4.2 P2 기준

- 실무 판단에는 중요하지만 코드 리뷰 카드보다는 시나리오 카드가 적합하다.
- CS/인프라 배경 지식이 강하지만 Problem으로 연결 가능하다.

---

## 5. 실제 Anki 작업 순서

### Phase 1. Audit 확정

1. `Anki-Keyword-Audit.csv`의 `REVIEW` 140장을 수동으로 재분류한다.
2. 최종 `KEEP / DELETE / CONVERT` 목록을 확정한다.
3. 삭제 목록은 사용자 확인 후에만 Anki에서 삭제한다.

### Phase 2. Problem 카드 모델 결정

덱은 하나만 둔다.

```text
Deck: 💻::Problem Solving
Model: 🧑🏻‍💻 Problem Solving v1
Fields: Question | Answer | CardType | Problem | Principles
CardType: Scenario | Code Review | Implementation
```

추천은 새 모델을 만들되, 덱은 하나로 유지하는 방식이다. 기존 Keyword 모델은 한 줄 정의 회상에 맞춰져 있어 Scenario/Code Review/Implementation 카드와 맞지 않는다.

### Phase 3. P1 Problem부터 생성

1. P1 44개 중 상위 10개만 먼저 만든다.
2. 각 Problem당 기본 1장 Scenario.
3. 코드/설정 냄새가 명확한 경우 Code Review 1장 추가.
4. 구현 체크리스트가 명확한 경우 Implementation 1장 추가.

### Phase 4. Keyword 정리

1. CONVERT 완료된 Keyword는 삭제 또는 suspend.
2. KEEP은 Principle 회상용으로 유지.
3. DELETE는 사용자 승인 후 삭제.

---

## 6. 안전 규칙

- 실제 Anki 카드 삭제는 반드시 사용자 승인 후 수행한다.
- 실제 Anki 카드 생성도 preview 후 승인받는다.
- `03-Question/`은 Anki 카드 생성 대상이 아니다.
- 카드 하나는 하나의 판단만 묻는다.
- 필드는 5개만 유지한다: `Question / Answer / CardType / Problem / Principles`.
- 코드/SQL/설정 조각은 별도 필드를 만들지 않고 `Question`에 포함한다.
- 난이도, 증거, 체크리스트는 별도 필드로 만들지 않고 필요하면 `Answer`에 짧게 포함한다.
- Problem 카드의 정답은 “정의”가 아니라 “문제 해결 행동”이어야 한다.

---

## 7. 다음 실행 단위

다음 작업은 둘 중 하나다.

```text
A. `Anki-Keyword-Audit-Reviewed.csv` 기준으로 삭제/suspend 후보를 사용자 승인받기
B. P1 Problem 상위 10개로 단일 덱 Problem 카드 샘플 세트 설계
```

추천: B를 먼저 한다. 샘플 카드 품질을 확인한 뒤 Keyword 삭제/suspend를 실행하는 편이 안전하다.

---

## 2026-07-08 Problem 카드 v1 모델 생성

사용자 결정에 따라 필드는 5개로 최소화했다.

```text
Deck:  💻::Problem Solving
Model: 🧑🏻‍💻 Problem Solving v1
Fields:
- Question
- Answer
- CardType
- Problem
- Principles
```

설계 원칙:

```text
- Scenario / Code Review / Implementation은 덱을 나누지 않고 CardType으로만 구분한다.
- 코드, SQL, 설정 조각은 별도 Code 필드가 아니라 Question 안에 넣는다.
- Difficulty는 사용하지 않는다.
- Evidence, Checklist도 별도 필드로 만들지 않고 Answer에 필요한 만큼만 짧게 포함한다.
```

생성한 샘플 초안:

```text
00-Meta/Anki-Problem-Sample-Cards-v1.csv
```

샘플과 함께 처리할 기존 Keyword convert 후보:

```text
00-Meta/Anki-Problem-Sample-Convert-Mapping.csv
```

현재 정책:

```text
1. 샘플 Problem 카드 10장 preview
2. 사용자 승인 후 💻::Problem Solving에 추가
3. 샘플 카드와 겹치는 ka_keyword_convert 후보 6장을 suspend
4. 이후 같은 방식으로 P1 Problem을 확장
```
