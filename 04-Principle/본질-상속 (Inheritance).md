---
aliases: [Inheritance]
tags: [본질, 작성중]
created: 2026-02-05
updated: 2026-02-05
type: Principle
difficulty: Medium
---
# Principle: 상속 (Inheritance)
**핵심 질문**: "코드를 복사-붙여넣기 하지 않고, 부모의 유전자를 물려받아 재사용할 수 있는가?"

## One-liner Definition
> (사전적) 상위 클래스(부모)의 속성과 메서드를 하위 클래스(자식)가 물려받아 확장하거나 재정의하는 개념.
> (이해용) **"생물학적 유전과 같다. 아버지를 닮았지만(재사용), 나만의 재능(확장)을 가질 수 있다."**

## Usage Examples (문장 3개)
1. "BaseController를 **상속**받아 공통 에러 핸들링 로직을 모든 API에서 재사용했다."
2. "Java의 Exception 클래스를 **상속**하여 우리 서비스만의 커스텀 예외를 정의했다."
3. "무분별한 **상속**은 클래스 간의 결합도를 높여 부모의 변경이 자식에게 치명적인 영향을 줄 수 있다."

## Recurring Core Problem
코드의 중복을 제거하고 기능의 계층을 만들려는 욕구는 크지만, 상속을 잘못 사용하면 부모와 자식이 한 몸처럼 엮이는 '강한 결합(Tight Coupling)' 문제가 발생합니다. 부모 클래스의 작은 수정이 수십 개의 자식 클래스를 망가뜨리는 '깨지기 쉬운 기반 클래스' 문제가 반복됩니다.

## Why It Doesn't Disappear
'IS-A' 관계(개는 동물이다)를 통한 분류와 다형성(Polymorphism)은 객체지향 프로그래밍의 근간이기 때문입니다. 대규모 시스템에서 공통 규약을 강제하고 타입을 추상화하여 다루기 위해서는 상속 체계가 필수적입니다.

## Trade-offs
- **코드 재사용 vs 캡슐화 위반**: 코드는 짧아지지만, 자식이 부모의 내부 구현에 의존하게 되어 객체지향의 핵심인 캡슐화가 약해집니다.
- **유연성 저하**: 상속 구조는 컴파일 타임에 결정되므로 실행 중에 관계를 바꿀 수 없으며, 계층이 깊어질수록 시스템이 경직됩니다.

## Appears As
- **Base Class**: 프레임워크의 공통 기능 제공
- **Exception Hierarchy**: 예외 상황의 계층적 분류
- **Template Method Pattern**: 부모가 골격을 잡고 자식이 세부 구현

## Related Cases
- [[본질-캡슐화 (Encapsulation)]]
- [[본질-조합 (Composition)]] — 상속의 대안으로 권장되는 "상속보다는 조합" 원칙.
- [[본질-응집도와 결합도 (Cohesion and Coupling)]]
