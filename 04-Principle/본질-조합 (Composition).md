---
aliases: [Composition]
tags: [본질, 완료]
created: 2026-02-05
updated: 2026-03-02
type: Principle
difficulty: Medium
---
**핵심 질문**: "필요한 부품을 조립해서 새로운 기능을 만들 수 있는가?"

## One-liner Definition

> 기존 클래스들을 부품으로 사용하여 새로운 클래스를 구성하는 설계 기법.

---

## 상속보다 조합을 권장하는 이유

1. **Low Coupling**: 부품의 내부 구현을 몰라도 인터페이스만 알면 사용할 수 있습니다.
2. **Dynamic Flexibility**: 실행 시점(Runtime)에 부품을 갈아 끼울 수 있습니다. (상속은 컴파일 타임에 고정됨)
3. **Capsule Preservation**: 부모의 내부가 자식에게 노출되는 '화이트박스' 문제를 해결합니다.

---

## Why It Works with DI

조합은 **의존성 주입(DI)**과 만났을 때 진가를 발휘합니다. 외부(IoC Container)에서 부품을 주입해주기 때문에, 클래스는 자신이 어떤 부품을 쓸지 고민하지 않고 오직 '사용'에만 집중할 수 있습니다.

---

## Related Cases

- [[본질-상속 (Inheritance)]]
- [[개념-의존성 주입 (Dependency Injection)]]
- [[본질-제어의 역전 (Inversion of Control)]]
