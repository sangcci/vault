---
aliases: [UI Query API Split, 조회 API 분리 기준, 상품상세 API, API 변경 가능성]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준

- UI 조회 API는 화면 모양만 기준으로 묶지 않고, 포함된 개념들의 변경 가능성을 기준으로 분리한다.
- 여러 개념이 한 API에 크게 묶이면 처음에는 편하지만, 기획이 바뀔 때 V2·V3 API가 빠르게 늘어날 수 있다.
- API를 쪼갤지 묶을지는 Front/Client와 협의하되, 마땅한 이유가 있는 쪽이 조율을 주도한다.

> "여러 개념이 묶여서 조회API를 만들면..? v1에서 v2, v3로 갈 때 지옥이 시작됨." — 사용자 메모, 2026-06-10

---

## 판단 흐름

```text
UI 조회 요청
├─ 한 화면에 보이는 데이터
│  ├─ 상품 기본 정보
│  ├─ 카테고리
│  ├─ 판매 실적
│  ├─ 추천/리뷰/혜택
│  └─ 기타 기획 요소
└─ API 분리 판단
   ├─ 함께 자주 바뀌는가?
   ├─ 따로 캐시하거나 장애 격리할 필요가 있는가?
   ├─ Front가 한 번에 받아야 하는 이유가 있는가?
   └─ 변경 시 V2/V3 증가 위험이 있는가?
      └─ 묶기 / 분리하기 / 단계적 분리
```

```pseudo
function designUiQueryApi(uiNeeds, context) {
    concepts = splitByConcept(uiNeeds)
    volatility = estimateChangeFrequency(concepts, context)
    coupling = checkFrontendNeed(concepts)
    if (volatility.high && coupling.low) return splitApiByConcept(concepts)
    if (coupling.high && volatility.low) return combineApi(concepts)
    return negotiateWithFrontend(concepts, volatility, coupling)
}
```

---

## 효과적인 상황

- 상품상세처럼 판매 실적과 직결되어 기획 변경이 민감하고 자주 발생하는 화면.
- 한 화면에 여러 개념의 데이터가 섞여 있지만, 각 개념의 변경 주기가 다른 경우.
- V1 API를 만든 뒤 V2·V3가 계속 생길 위험을 줄이고 싶을 때.
- Front/Client와 API 응답 단위를 협의해야 할 때.

---

## 실패하는 상황

- 화면 하나당 API 하나로만 생각하면 여러 개념이 덩어리로 묶인다.
- 너무 잘게 나누면 Front 요청 수와 조합 복잡도가 커질 수 있다.
- Front 측 이유를 듣지 않고 Back 기준만 밀면 실제 화면 구현 비용을 놓친다.
- Back 측 이유 없이 Front 요구만 따르면 변경 비용과 버전 증가를 감당하게 된다.

---

## 협의 질문

| 질문 | 의미 |
|---|---|
| 이 데이터들은 같은 이유로 같이 바뀌는가? | 묶어도 되는지 본다 |
| 상품상세처럼 매출과 직결되는 화면인가? | 변경 민감도를 본다 |
| Front가 한 번에 받아야 하는 명확한 이유가 있는가? | 요청 수·렌더링 흐름을 본다 |
| API가 바뀌면 V2/V3가 얼마나 빨리 늘어나는가? | 장기 변경 비용을 본다 |
| 우리가 제안하는 분리에 마땅한 이유가 있는가? | 협의 주도권을 판단한다 |

---

## 관련 노트

- [[본질-개발자 실무]]
- [[본질-구현 파트는 나뉘어도 요구사항 흐름은 하나다]]
- [[판단기준-UI 요구사항을 질문으로 구체화하는 법]]
- [[판단기준-서비스 상황 분석 척도]]
- [[판단기준-기술적 사고력으로 실무 상황을 해석하는 법]]
