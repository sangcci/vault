---
aliases: [Inheritance]
tags: [본질, 완료]
created: 2026-02-05
updated: 2026-03-02
type: Principle
difficulty: Medium
---
**핵심 질문**: "단순히 코드를 재사용하는 것인가, 아니면 새로운 '타입'의 계층을 정의하는 것인가?"

## One-liner Definition

>  상위 클래스(부모)의 속성과 메서드를 하위 클래스(자식)가 물려받아 확장하거나 재정의하는 개념.

---

## Usage Examples (문장 3개)

1. "BaseController를 **상속**받아 공통 에러 핸들링 로직을 모든 API에서 재사용했다."
2. "Developer **IS-A** Employee 관계를 설정하여, 모든 개발자를 직원(Employee) 타입으로 다룰 수 있게 했다."
3. "무분별한 **상속**은 클래스 간의 결합도를 높여 부모의 변경이 자식에게 치명적인 영향을 주는 '깨지기 쉬운 기반 클래스' 문제를 일으킨다."

---

## Recurring Core Problem

코드의 중복을 제거하려는 욕구는 크지만, 상속은 **White-box Reuse**(내부가 다 보이는 재사용) 방식이기에 캡슐화를 약화시킵니다. 부모 클래스의 내부 구현이 바뀌면 수많은 자식 클래스가 동시에 망가지는 경직된 구조가 반복됩니다.

---

## Why It Doesn't Disappear

'IS-A' 관계를 통한 분류와 **다형성(Polymorphism)**의 기반이기 때문입니다. 상위 타입으로 하위 타입을 추상화하여 다룸으로써, 클라이언트 코드가 구체적인 구현이 아닌 '인터페이스'나 '추상 클래스'에 의존하게 만드는 객체지향의 근간입니다.

---

## Trade-offs

- **타입 계층 보장 vs 강한 결합**: 상위 타입으로 다룰 수 있는 유연성을 얻지만, 부모와 자식이 운명 공동체처럼 엮여 변경이 어려워집니다.
- **컴파일 타임 결정(Static)**: 상속 관계는 실행 중에 바꿀 수 없어 시스템의 동적인 유연성이 떨어집니다.

---

## Appears As

- **Base Class**: 프레임워크의 공통 기능 제공
- **Exception Hierarchy**: 예외 상황의 계층적 분류
- **Template Method Pattern**: 부모가 골격을 잡고 자식이 세부 구현(IoC의 초기 형태)

---

## 생성자 호출 순서와 super()

상속의 본질이 "부모의 자원을 사용하는 것"이기 때문에, 자식 객체 생성 시 **부모 생성자가 반드시 먼저 실행**된다.

```
// Compiler auto-injects super() if not explicitly written
class Dog extends Animal {
    Dog() {
        super();   // <-- injected by compiler (must be first line)
        this.breed = "Labrador";
    }
}

// If parent has no default constructor -> compile error
class Animal {
    Animal(String name) { ... }  // no default constructor
}

class Dog extends Animal {
    Dog() {
        // super();  <- compiler tries this, but Animal() doesn't exist
        // COMPILE ERROR: must explicitly call super("name")
        super("Buddy"); // <- developer must provide
    }
}
```

**초기화 순서:**
```
new Dog() called
  1. super() -> Animal constructor runs
  2. Dog field initializers run  (e.g., breed = "Labrador")
  3. Dog constructor body runs
```

---

## 생성자에서 오버라이드 가능한 메서드 호출 — 안티패턴

Java 설계자들은 "객체가 어떤 상태에 있든, 재정의된 메서드가 있다면 항상 최하위(가장 구체적인) 구현을 실행한다"는 다형성 원칙을 일관되게 적용했다. 그 결과, **생성자 안에서도 가상 디스패치가 동작**한다.

```
class Parent {
    Parent() {
        init();        // virtual dispatch -> Child::init() is called
    }
    void init() {}
}

class Child extends Parent {
    String name = "default";   // initialized AFTER super() returns

    @Override
    void init() {
        System.out.println(name.length());  // NPE! name is null here
    }
}

new Child();
// Execution order:
//   1. super() -> Parent()
//   2. Parent() calls init() -> virtual dispatch -> Child::init()
//   3. Child::init() accesses name -> name is null (step 4 not reached yet)
//   4. [never reached] Dog field: name = "default"
```

- **NPE 원인**: 부모 생성자 실행 시점에 자식 필드는 아직 null/기본값 상태
- **규칙**: 상속용 클래스의 생성자에서는 재정의 가능한 메서드를 절대 호출해선 안 된다 (Effective Java Item 19)
- **대안**: `private` 또는 `final` 메서드만 생성자에서 호출할 것 — 오버라이드 불가능하므로 안전

---

## Related Cases

- [[본질-제어의 역전 (Inversion of Control)]]
- [[본질-조합 (Composition)]] — 상속의 대안으로 권장되는 "상속보다는 조합" 원칙.
- [[본질-캡슐화 (Encapsulation)]]
- [[개념-JVM 메모리 구조 (JVM Memory Structure)]] — Heap 내 상속 관계 메모리 레이아웃 (부모 필드 → 자식 필드 순 배치)
