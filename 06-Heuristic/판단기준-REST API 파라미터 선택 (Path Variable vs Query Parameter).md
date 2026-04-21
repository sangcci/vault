---
aliases: [Path Variable vs Query Parameter, REST 파라미터 선택, 경로 변수 쿼리 파라미터]
tags: [판단기준, 작성중, API 설계, Spring]
type: Heuristic
difficulty: Low
---

## 판단 기준

- 특정 리소스 **단건 식별** (검증/수정/삭제) → **Path Variable**
- 리소스 **목록 필터링/검색** → **Query Parameter**

## 효과적인 상황

```text
Path Variable
GET  /reservations/{id}         ← 예약 단건 조회
PUT  /reservations/{id}         ← 예약 수정
DELETE /reservations/{id}       ← 예약 삭제

Query Parameter
GET /reservations?userId=123            ← 특정 사용자의 예약 목록
GET /reservations?status=PENDING        ← 상태별 필터링
GET /reservations?userId=123&page=0     ← 페이징 조합
```

Query Parameter의 이점:
- 의미 전달이 명확 ("userId=123으로 필터링")
- 필터 조건 추가 시 엔드포인트 신설 불필요
- Path Variable로 필터링하면 엔드포인트가 무한히 늘어남

```text
// 잘못된 설계 — Path Variable로 필터링
GET /users/{userId}/reservations/{status}/{page}  ← 엔드포인트 파편화

// 올바른 설계 — Query Parameter로 필터링
GET /users/{userId}/reservations?status=PENDING&page=0
```

## 실패하는 상황

- Query Parameter로 단건 리소스를 식별하면 URL의 자원 표현이 모호해짐
  - `GET /reservations?id=1` → REST 관례 위반, 캐싱/로깅 어려움
- Path Variable로 다중 조건 필터링 시도 → 조합 수만큼 엔드포인트 증가

## 오해: 프론트 URL이 깔끔하면 백엔드도 Query Parameter를 안 쓴다?

프론트는 브라우저 주소창 표시를 위해 URL을 별도 관리할 수 있음.
백엔드는 독립적으로 Query Parameter를 적극 활용.
개발자 도구 Network 탭의 실제 요청을 보면 Query Parameter가 광범위하게 사용됨.

## 출처

- 2026-04-06 일지 — 프론트 URL과 쿼리 파라미터
