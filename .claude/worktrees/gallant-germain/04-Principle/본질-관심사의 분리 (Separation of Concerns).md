---
aliases: [Separation of Concerns, SoC]
tags: [본질, 완료]
created: 2026-03-02
updated: 2026-03-02
type: Principle
difficulty: Medium
---
**핵심 질문**: "한 번에 한 가지만 걱정하고 있는가? 비즈니스 로직과 시스템 인프라가 섞여 있지는 않은가?"

## One-liner Definition

> (사전적) 컴퓨터 프로그램을 구별된 부분으로 분리하여 각 부분이 개개인의 관심사를 해결하도록 만든 설계 원칙.
> (이해용) **"사장님(비즈니스)은 매출 전략만 짜고, 알바(인프라)는 매장 청소만 한다. 서로의 일을 대신 하지 않는 것."**

## 분리의 기준 (Concerns)

1. **Core Concern (핵심 관심사)**: 시스템의 본질적인 목적. 비즈니스 로직 (예: 결제 할인 정책 적용)
2. **Cross-cutting Concern (공통 관심사)**: 여러 모듈에 공통적으로 필요한 기능 (예: 로깅, 보안, 트랜잭션 관리, 스케줄링)

## IoC/DI와의 시너지

- **Dependency Injection**: 객체 간의 연결(Wiring)이라는 관심사를 외부로 완전히 밀어내어, 클래스 내부에는 비즈니스 코드만 남깁니다.
- **AOP(관점 지향 프로그래밍)**: 트랜잭션(@Transactional) 같은 공통 관심사를 비즈니스 로직 한복판이 아닌 '외부 프록시'에서 처리하게 만듭니다.

## Trade-offs

- **유지보수성 향상**: 한 쪽을 고쳤을 때 다른 쪽이 터질 걱정이 사라집니다. (낮은 결합도)
- **초기 설계 비용**: 처음부터 관심사를 잘 나누려면 더 정교한 추상화가 필요하며, 이는 개발 초기 속도를 늦출 수 있습니다.

## Related Cases

- [[본질-제어의 역전 (Inversion of Control)]]
- [[본질-응집도와 결합도 (Cohesion and Coupling)]]
- [[개념-의존성 주입 (Dependency Injection)]]
