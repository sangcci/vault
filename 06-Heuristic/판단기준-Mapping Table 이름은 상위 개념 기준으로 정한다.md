---
aliases: [Mapping Table Naming, 매핑 테이블 이름, 연결 Entity 이름, ProductCategoryEntity]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준

- Mapping Table 이름은 단순히 두 테이블 이름을 붙이는 문제가 아니라, 팀이 어떤 개념을 상위로 보는지 드러내는 문제다.
- 두 개념이 연결될 때는 어떤 개념이 중심이고, 어떤 개념이 부수 정보인지 먼저 판단한다.
- 중심 개념이 정해지면 이름 순서도 그 관점을 따른다.

> "Category는 그저 Product를 나타내는 부수 정보라고 팀에서 판단했다면 Product를 상위 개념으로 인식하고 Product를 먼저 쓰고 Category를 나중에 쓰는 방식으로 Mapping Table의 이름을 선정할거임." — 사용자 메모, 2026-06-10

---

## 판단 흐름

```text
두 개념 연결
├─ Product
└─ Category
   └─ 질문
      ├─ 이 기능에서 중심 개념은 무엇인가?
      ├─ 다른 개념은 부수 정보인가, 독립 개념인가?
      ├─ 팀은 이 관계를 어떤 도메인 언어로 부르는가?
      └─ 이름 순서가 그 관점을 드러내는가?
         └─ ProductCategory / CategoryProduct
```

```pseudo
function nameMappingTable(leftConcept, rightConcept, context) {
    main = findDominantConcept(leftConcept, rightConcept, context)
    sub = findSupportingConcept(leftConcept, rightConcept, main)
    return main.name + sub.name
}
```

---

## 효과적인 상황

- `ProductCategoryEntity`처럼 두 개념을 연결하는 Entity를 만들 때.
- 관계 자체보다 한쪽 개념의 속성·분류·부수 정보 성격이 강할 때.
- 팀 안에서 도메인 언어와 코드 이름을 맞춰야 할 때.
- 나중에 API·조회·관리 화면에서 어떤 개념 중심으로 읽힐지 정해야 할 때.

---

## 실패하는 상황

- 알파벳순이나 습관으로 이름을 정하면 도메인 관점이 코드에 드러나지 않는다.
- 팀이 Category를 독립 관리 대상으로 보는데 ProductCategory로 고정하면 의미가 틀어질 수 있다.
- 단순 이름 문제로만 보면 Entity가 어떤 책임을 갖는지 놓친다.
- 상위 개념 판단 없이 관계를 만들면 API 이름, Repository 이름, 화면 언어도 함께 흔들린다.

---

## 판단 질문

| 질문 | 의미 |
|---|---|
| 이 기능에서 중심으로 설명되는 대상은 무엇인가? | 이름의 앞쪽 후보를 찾는다 |
| 다른 개념은 중심 대상의 부수 정보인가? | 보조 개념 여부를 확인한다 |
| 팀은 이 관계를 어떤 말로 부르는가? | 코드 이름과 도메인 언어를 맞춘다 |
| 조회와 관리 화면은 어느 개념 중심인가? | 실제 사용 흐름과 이름을 맞춘다 |

---

## 관련 노트

- [[본질-개발자 실무]]
- [[판단기준-개발 실무를 느끼는 4단계]]
- [[판단기준-기술적 사고력으로 실무 상황을 해석하는 법]]
- [[개념-DB 정규화 (Normalization)]]
