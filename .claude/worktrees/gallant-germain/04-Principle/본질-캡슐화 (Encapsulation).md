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
3. "DTO를 통해 데이터베이스 엔티티의 민감한 정보를 숨김으로써 보안과 결합도 측면에서 이득을 보는 **캡슐화**를 실천했다."

## Recurring Core Problem
객체의 내부 데이터가 외부에서 직접 조작될 수 있으면, 객체는 스스로의 정합성을 유지할 수 없게 됩니다. 또한 내부 구현 방식이 외부에 노출되면, 작은 변경 하나가 시스템 전체로 퍼져나가는 파급 효과(Ripple Effect)를 제어할 수 없게 되는 것이 본질적인 문제입니다.

## Why It Doesn't Disappear
객체지향 프로그래밍의 핵심인 '자율적인 객체'를 만들기 위한 전제 조건이기 때문입니다. 자신의 상태를 스스로 관리하고 외부에는 필요한 기능만 제공하는 객체들이 모여야만, 대규모 시스템에서도 변경의 범위를 최소한으로 격리할 수 있습니다.

## Trade-offs
- **유지보수성 vs 개발 속도**: 모든 접근을 메서드로 제한하면 데이터 무결성은 높아지지만, 단순한 데이터 조회에도 코드를 추가로 작성해야 하는 번거로움과 초기 개발 비용이 발생합니다.
- **정보 은닉 vs 디버깅**: 내부가 완벽히 감춰져 있으면 사용하기는 편하지만, 문제가 발생했을 때 내부 상태를 추적하기 어려워질 수 있습니다.

## Appears As
- **Access Modifiers (private, protected)**: 접근 제어
- **Information Hiding**: 정보 은닉
- **Setter/Getter with Validation**: 데이터 보호 및 유효성 검사

## Related Cases
- [[본질-추상화 (Abstraction)]]
- [[본질-응집도와 결합도 (Cohesion and Coupling)]]
- [[본질-모듈성 (Modularity)]]
