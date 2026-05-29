---
aliases: [Encapsulation]
tags: [본질, 작성중]
created: 2026-02-05
updated: 2026-02-05
type: Principle
difficulty: Medium
---
# Principle: 캡슐화 (Encapsulation)
**핵심 질문**: "왜 내부의 복잡한 전선들을 케이스로 덮어야 하는가? 객체의 상태를 누구로부터 보호할 것인가?"

## One-liner Definition
> (사전적) 객체의 속성(Field)과 행위(Method)를 하나로 묶고, 실제 구현 내용의 일부를 외부에 감추어 은닉하는 기법.
> (이해용) **"TV 리모컨과 같다. 우리는 내부 회로를 몰라도 버튼만 누르면 채널을 바꿀 수 있다."**

## Usage Examples (문장 3개)
1. "필드를 `private`으로 선언하고 Setter에서 유효성 검사를 수행하여 객체의 상태를 안전하게 **캡슐화**했다."
2. "내부 자료구조를 List에서 Map으로 변경했지만, **캡슐화**된 인터페이스 덕분에 외부 코드는 수정할 필요가 없었다."
3. "event 패키지에서는 외부에 공개할 이벤트 타입과 발행 진입점만 노출하고, 내부 구현 클래스는 package-private으로 숨겨 import 파급 범위를 줄였다."

## Recurring Core Problem
객체의 내부 데이터가 외부에서 직접 조작될 수 있으면, 객체는 스스로의 정합성을 유지할 수 없게 됩니다. 또한 내부 구현 방식이 외부에 노출되면, 작은 변경 하나가 시스템 전체로 퍼져나가는 파급 효과(Ripple Effect)를 제어할 수 없게 되는 것이 본질적인 문제입니다.

## Why It Doesn't Disappear
객체지향 프로그래밍의 핵심인 '자율적인 객체'를 만들기 위한 전제 조건이기 때문입니다. 자신의 상태를 스스로 관리하고 외부에는 필요한 기능만 제공하는 객체들이 모여야만, 대규모 시스템에서도 변경의 범위를 최소한으로 격리할 수 있습니다.

패키지와 모듈 경계에서도 똑같습니다. 공개 API/계약만 드러내고 내부 구현을 숨겨야, 나중에 구현을 갈아엎어도 외부 import와 사용처를 대거 흔들지 않을 수 있습니다. 결국 캡슐화의 궁극적인 지향점은 "내부를 예쁘게 숨기는 것"이 아니라 **변경의 파급면을 줄여 유지보수성을 높이는 것**입니다.

## Trade-offs
- **유지보수성 vs 개발 속도**: 모든 접근을 메서드로 제한하고 공개 범위를 보수적으로 잡으면 변경 자유도는 커지지만, 처음에는 파일과 타입을 더 신경 써서 설계해야 합니다.
- **정보 은닉 vs 디버깅**: 내부가 완벽히 감춰져 있으면 사용하기는 편하지만, 문제가 발생했을 때 내부 상태를 추적하기 어려워질 수 있습니다.
- **좁은 공개 범위 vs 즉흥적 재사용**: 당장은 `public`으로 열어두면 편하지만, 나중에는 import 경로가 퍼져 작은 리팩토링도 대형 변경으로 번지기 쉽습니다.

## Appears As
- **Access Modifiers (private, protected, package-private)**: 접근 제어
- **Information Hiding**: 정보 은닉
- **Setter/Getter with Validation**: 데이터 보호 및 유효성 검사
- **Public API vs Internal Implementation**: 외부에는 계약만, 내부에는 구현을 배치

## 패키지 경계에서의 캡슐화

```text
event/
├── OrderCreatedEvent        ← 외부에 공개되는 계약
├── EventPublisher           ← 외부가 의존하는 진입점
├── internal/
│   ├── DefaultEventPublisher
│   └── EventSerializer
```

- 외부 패키지는 `OrderCreatedEvent`, `EventPublisher`까지만 import한다.
- 내부 구현이 바뀌어도 공개 계약이 유지되면 사용처 변경은 최소화된다.
- 그래서 코드리뷰에서도 "무엇을 고쳤는가"보다 "외부 계약이 바뀌었는가"를 먼저 볼 수 있다.
- AI agent 관점에서도 공개 경계가 분명하면 읽어야 할 파일 수와 컨텍스트가 줄어든다.

## Related Cases
- [[본질-추상화 (Abstraction)]]
- [[본질-응집도와 결합도 (Cohesion and Coupling)]]
- [[본질-모듈성 (Modularity)]]
