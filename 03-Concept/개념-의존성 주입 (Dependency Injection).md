---
aliases: [Dependency Injection, DI]
tags: [개념, 완료]
created: 2026-03-02
updated: 2026-03-02
type: Concept
difficulty: Medium
---
## 한 문장 정의

> 객체지향 프로그래밍에서 객체 간의 의존 관계를 소스코드 내부에서 결정하지 않고, 외부에서 제공(주입)해주는 설계 패턴.

---

## 해결하는 문제 (Problem Solved)

- **강한 결합(Tight Coupling)**: 클래스가 특정 구현체를 직접 `new` 하면, 다른 구현체로 바꿀 때 소스코드를 다 뜯어고쳐야 합니다.
- **테스트의 어려움**: 진짜 DB 연결 객체를 내부에 박아두면, 테스트할 때마다 실제 DB를 띄워야 합니다.

---

## 동작 원리 (Mechanism)

Spring과 같은 **IoC 컨테이너**가 이 역할을 담당합니다.

1. **Interface Injection**: 인터페이스 타입을 바라보게 설계하여 교체 가능성을 높입니다.
2. **Concrete Class Injection**: Spring은 `@Bean`이 붙은 일반 클래스도 주입해줍니다. (CGLIB 프록시 활용)
3. **Delegation**: 내 코드에서는 필드만 선언해두고, 실제로 일을 할 때는 프레임워크가 꽂아준 객체에게 일을 시킵니다(**위임**).

---

## 치르는 비용 (Cost/Trade-off)

- **추상화 오버헤드**: 인터페이스와 구현체가 나뉘면서 코드 추적이 복잡해질 수 있습니다.
- **런타임 복잡성**: 객체가 언제, 어디서 주입되었는지 런타임에 확인해야 할 때가 생깁니다.

---

## 관련 본질

- [[본질-제어의 역전 (Inversion of Control)]]
- [[본질-조합 (Composition)]]
- [[본질-관심사의 분리 (Separation of Concerns)]]
