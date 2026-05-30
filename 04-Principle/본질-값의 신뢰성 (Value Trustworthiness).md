---
aliases: [Value Trustworthiness, 불변성, 예측 가능성, 자기 검증, Immutability, Predictability, Self-Validation, VO의 본질]
tags: [본질, 작성중, 설계, OOP]
type: Principle
difficulty: High
---

**핵심 질문**: "소프트웨어에서 '믿을 수 있는 값'이란 무엇이며, 어떻게 만드는가?"

## 한 문장 정의

> (사전적) 한번 생성된 값이 변하지 않고(불변성), 동일 입력에 항상 같은 결과를 반환하며(예측 가능성), 유효하지 않은 상태로 존재할 수 없는(자기 검증) 성질.
> (이해용) 신뢰할 수 있는 값이란 "바뀌지 않고, 속이지 않고, 처음부터 올바른" 값이다.

---

## 사용 예시

1. "필드를 `final`로 선언하고 생성자에서 검증하여, 생성 이후에는 **불변이고 항상 유효한** 객체를 보장했다."
2. "`setMileage`가 기존 객체를 수정하는 대신 새 객체를 반환하도록 바꿔, **예측 가능한** 순수 함수로 만들었다."
3. "`equals`와 `hashCode`를 값 기반으로 오버라이딩하여, 상태가 같으면 같은 객체로 **동등성**을 보장했다."

---

## 트레이드오프

- **안전성 vs 프레임워크 제약**: JPA Entity는 변경 감지(Dirty Checking)를 위해 필드를 mutable로 유지해야 한다. 불변성을 완벽히 지키면 ORM의 핵심 기능을 포기하게 된다.
- **예측 가능성 vs 성능**: 매번 새 객체를 생성하면 GC 부담이 증가한다. 대량 연산에서는 mutable 방식이 효율적일 수 있다.
- **자기 검증 vs 유연성**: 생성 시점에 모든 검증을 강제하면, 부분적으로 유효한 상태(Builder 패턴, 초안 상태)를 표현하기 어려워진다.

---

## 왜 사라지지 않는가

소프트웨어는 본질적으로 불확실성으로 가득하다. 네트워크는 실패하고, 공유 상태는 경쟁하며, 참조하는 객체의 값은 언제든 변할 수 있다. 이 불확실성 속에서 "확실히 믿을 수 있는 영역"을 최대화하는 것이 소프트웨어 품질의 핵심이며, 그 수단이 바로 이 세 가지 성질이다.

---

## 다른 모습들

### 불변성 (Immutability)

```text
[Mutable 방식]                    [Immutable 방식]
Thread A ──┐                      Thread A ──┐
           ├─ account.mileage     │           ├─ account.setMileage(70000)
Thread B ──┘  = 20000 → 70000?   │           │   → new Account(id, 70000)  ← A의 결과
           결과 비결정적           │ Thread B ──┤
                                  │           ├─ account.setMileage(50000)
                                  │           │   → new Account(id, 50000)  ← B의 결과
                                  │           원본 account는 20000 그대로
```

- 필드에 `final` 선언 → 재할당 불가
- 클래스에 `final` 선언 → 하위 클래스가 불변 계약을 깨는 것을 방지
- 컬렉션 반환 시 `List.of()`, `Collections.unmodifiableList()` 사용

### 예측 가능성 (Predictability)

순수 함수의 조건: **같은 입력 → 항상 같은 출력, 부수 효과 없음.**

```java
// 예측 불가능: 외부 상태에 의존
public long getDiscountedPrice() {
    return this.price - externalConfig.getDiscount(); // 외부 값에 따라 결과 변동
}

// 예측 가능: 입력만으로 결과 결정
public long getDiscountedPrice(long discount) {
    return this.price - discount;
}
```

OOP는 확장성과 유지보수성을 제공하지만, **예측 가능성은 OOP 이론만으로 보장되지 않는다.** 이를 보장하는 것은 순수 함수적 설계이다.

### 자기 검증 (Self-Validation)

```java
public record Money(long amount, String currency) {
    public Money {  // compact constructor
        if (amount < 0) throw new IllegalArgumentException("금액은 음수일 수 없다");
        if (currency == null || currency.isBlank()) throw new IllegalArgumentException("통화 필수");
    }
}
// Money 인스턴스가 존재한다 = 유효한 값이 보장된다
```

한번 생성된 객체의 내부에 이상한 값이 들어있을 수 없다. 생성 시점에 모든 불변 조건(invariant)을 검증하고, 이후에는 상태가 변하지 않으므로 재검증이 불필요하다.

### 동등성 (Equality)

불변성 + 예측 가능성을 지키면, 값이 같은 두 객체는 같은 것으로 취급할 수 있다.

```java
Color green1 = new Color(0, 1, 0);
Color green2 = new Color(0, 1, 0);
// 참조는 다르지만 값이 같다 → equals/hashCode 오버라이딩으로 동등성 보장
```

이 세 가지를 모두 지키는 객체가 **Value Object(VO)**이다. VO는 분류가 아니라, 값의 신뢰성을 지키려는 노력의 결과물이다.

### 현실적 적용 경계

| 계층 | 불변성 적용 가능 여부 |
| :--- | :--- |
| Value Object / Command / DTO | 완전 적용 가능 (Java record 활용) |
| Domain Entity | 부분 적용 (식별자 불변, 상태는 변경 감지 필요) |
| JPA Entity | 제한적 (Dirty Checking을 위해 mutable 유지) |
| Embeddable | 적용 권장 (JPA도 불변 Embeddable 지원) |

---

## 관련 본질

- [[본질-캡슐화 (Encapsulation)]] — 자기 검증은 캡슐화의 실현 수단.
- [[본질-멱등성 (Idempotency)]] — 예측 가능성과 멱등성은 "같은 입력 → 같은 결과"를 공유.
- [[본질-원자성 (Atomicity)]] — 불변 객체는 원자적 상태 전이를 자연스럽게 보장.
