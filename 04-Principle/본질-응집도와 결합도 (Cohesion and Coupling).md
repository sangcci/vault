---
aliases: [Cohesion, Coupling]
tags: [본질, 작성중]
created: 2026-02-03
updated: 2026-06-17
type: Principle
difficulty: Medium
---
# Principle: 응집도와 결합도 (Cohesion and Coupling)
**핵심 질문**: "수정할 때 한 곳만 고칠 수 있는지, 하나 고쳤을 때 다른 곳이 터지지 않는지 관리하고 있는가?"

## One-liner Definition
> (사전적) 응집도는 모듈 내부 요소들의 관련성 정도, 결합도는 모듈 간의 의존성 정도.
> (이해용) **"따로 또 같이: 내부의 결속력은 높이고(응집), 외부와의 연결 고리는 최소화(결합)하는 소프트웨어의 건강 지표"**.

---

## Usage Examples (문장 3개)
1. "주문 서비스의 응집도를 높이기 위해 결제 로직을 별도의 모듈로 분리하여 각자의 역할에 집중하게 했다."
2. "인터페이스를 통한 의존성 주입으로 서비스와 레포지토리 간의 **결합도**를 낮춰 테스트 용이성을 확보했다."
3. "**고응집 저결합** 원칙을 지킨 덕분에 시스템 일부를 교체하더라도 파급 효과를 최소화할 수 있었다."

---

## Recurring Core Problem
소프트웨어는 끊임없이 변합니다. 하지만 코드가 뒤엉켜 있으면 사소한 수정 하나가 예상치 못한 곳에서 장애를 일으킵니다(Spaghetti Code). "어디를 고쳐야 할지 모르겠고, 고치면 어디가 터질지 모르는" 두려움을 어떻게 제어할 것인가가 설계의 본질적 문제입니다.

> "Low coupling minimizes the \"ripple effect\" where changes in one module cause errors in other modules." — [UNC COMP 145, Intermodule Coupling](https://www.cs.unc.edu/~stotts/COMP145/coupling.html)

---

## 데이터 참조와 도메인 의존은 다르다

데이터를 가지고 있다고 해서 곧바로 그 개념 자체에 도메인 의존을 가진다고 볼 수는 없다. 결합도 판단의 핵심은 **이름이나 값이 등장하는가**가 아니라, **상대 개념의 변경이 내 비즈니스 로직 변경으로 전파되는가**다.

> "X is _coupled_ to Y if a change to Y can potentially require a change in X" — [SEforSDL, Software Design Fundamentals](http://se-education.org/se-book/designFundamentals/index.html)

```text
낮은 결합: 데이터로 분류만 함
Review
 └─ reviewType = ReviewType.PRODUCT
    └─ Product라는 분류값만 보유
       └─ Product 정책을 호출하거나 알지 않음

높은 결합: 도메인 규칙을 직접 앎
Review
 ├─ Product product
 ├─ product.calculateReviewPolicy()
 └─ Product 정책 변경
      ↓
    Review 비즈니스 로직 수정 필요
```

예를 들어 `Review`가 `ReviewType.PRODUCT`라는 enum 값을 가진다는 사실만으로는 `Review`가 `Product` 도메인에 강하게 의존한다고 단정하기 어렵다. 이 경우에는 `Product` 객체의 내부 구조나 정책을 아는 것이 아니라, 리뷰의 대상을 분류하는 데이터만 저장하는 것에 가깝다.

반대로 `Review`가 `Product` 객체를 직접 들고, `Product`의 메서드를 호출하고, `Product` 정책 변경에 따라 `Review` 로직까지 수정되어야 한다면 결합도는 높아진다. 즉 결합도는 “참조의 존재”보다 “변경 전파의 경로”로 보는 편이 실전적이다.

---

## Why It Doesn't Disappear
시스템이 커질수록 인간의 인지 능력으로는 모든 의존 관계를 파악할 수 없기 때문입니다. 변경의 파급 범위를 격리(Isolation)하지 못하면 시스템은 유지보수 비용이 급증하여 결국 기술 부채로 인해 사멸하게 됩니다.

---

## Trade-offs
- **유연성 vs 복잡성**: 결합도를 낮추기 위해 인터페이스와 추상화 계층을 늘리면 코드를 따라가기 위한 물리적인 복잡도가 증가하고 '오버 엔지니어링' 위험이 따릅니다.
- **응집도 vs 파편화**: 응집도를 너무 좁게 정의하면 모듈이 너무 잘게 쪼개져 관리 포인트가 늘어나고, 오히려 전체적인 흐름을 파악하기 어려워질 수 있습니다.

---

## Appears As
- **SOLID 원칙**: 객체지향 설계의 고응집 저결합 실천법
- **Microservices (MSA)**: 서비스 단위의 물리적 격리를 통한 저결합 달성
- **Encapsulation**: 내부 구현을 숨겨 결합도를 낮추는 기술
- **Data Coupling**: 필요한 데이터만 전달하는 약한 결합 형태

> "Two modules are data coupled if they communicate by passing parameters." — [UNC COMP 145, Intermodule Coupling](https://www.cs.unc.edu/~stotts/COMP145/coupling.html)

---

## Related Cases
- [[본질-모듈성 (Modularity)]]
- [[본질-캡슐화 (Encapsulation)]]
- [[본질-원자성 (Atomicity)]]
- [[판단기준-데이터 참조와 도메인 의존 구분]]
