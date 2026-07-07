---
aliases: [Hidden Requirement Policy, UI Requirement Questioning, Requirement Rework]
tags: [문제, 작성중, Requirement, Backend]
difficulty: Medium
type: Problem
---

# Problem: 67-화면 요구사항만 보고 API를 만들었다가 숨은 정책이 뒤늦게 드러남

## 상황

기획서나 Figma에는 목록, 버튼, 카드 UI만 보인다. 백엔드가 화면에 보이는 필드만 보고 API와 DB 모델을 만들었는데, 구현 후 중복 노출, 정렬 기준, 권한, 예외 상태, 페이지 방식 같은 숨은 정책이 뒤늦게 나온다.

```text
UI: 상품 카드 10개 표시

숨은 질문
  - 10개는 고정인가 설정값인가?
  - 최신순/인기순/판매순 중 무엇인가?
  - 품절 상품은 보이는가?
  - 같은 상품이 여러 카테고리에 중복 노출되는가?
  - 로그인/비로그인 응답이 다른가?
```

---

## 관찰된 증거

- API 구현 후 프론트 연동 단계에서 필드와 정책이 추가된다.
- 단순 조회 API라고 생각했는데 정렬·필터·권한 조건이 계속 늘어난다.
- DB 모델이 화면 하나에 맞춰져 다른 화면 변경에 약하다.
- 기획자와 개발자가 같은 화면을 보고도 다른 의미로 이해한다.
- “그건 당연한 거 아닌가요?”라는 말이 뒤늦게 나온다.

---

## 원인

화면은 요구사항의 결과물일 뿐, 정책 전체가 아니다. 백엔드는 보이는 데이터보다 보이지 않는 조건, 예외, 변경 가능성을 질문으로 끌어내야 한다.

---

## 해결 방향

- UI 요소를 API/DB/권한/예외 질문으로 변환한다.
- 정렬, 페이징, 중복, 노출 범위, 상태별 처리 기준을 먼저 확인한다.
- 요구사항 변경 빈도와 팀 규모를 함께 보고 구조 복잡도를 정한다.
- 화면 단위가 아니라 변경 이유 기준으로 API 경계를 잡는다.
- 확정되지 않은 정책은 TODO가 아니라 명시적 미결정 사항으로 남긴다.

---

## 연결되는 본질

- [[본질-요구사항 질문화와 숨은 정책 발견]]
- [[본질-상황 제약 기반 기술 선택]]
- [[본질-변경 이유와 경계]]

---

## 참고

> "There are at least three main layer types: presentation, domain, and data source." — [Martin Fowler, Layering Principles](https://martinfowler.com/bliki/LayeringPrinciples.html)
