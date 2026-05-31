---
aliases: [Checked Exception, Unchecked Exception, RuntimeException, 검사 예외, 비검사 예외]
tags: [개념, 작성중, Java]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Java에서 `Exception`을 상속하면 Checked, `RuntimeException`을 상속하면 Unchecked로 분류되며, Checked는 컴파일 시점에 예외 처리를 강제하고 Unchecked는 강제하지 않는다.
> (이해용) "이 메서드는 실패할 수 있으니 반드시 대비해" (Checked) vs "실패하면 그때 알아서 처리해" (Unchecked)의 차이.

---

## 해결하는 문제

- **Checked**: 호출자가 예외를 무시할 수 없게 하여, 복구 가능한 예외 상황에 대한 처리를 강제.
- **Unchecked**: 프로그래밍 오류(NPE, IllegalArgument 등)에 대해 매번 throws 선언을 강제하지 않아 코드 간결성 유지.

---

## 치르는 비용

- **Checked의 비용**: throws가 호출 체인을 따라 전파되어 상위 메서드까지 오염시킴. 인터페이스 변경 시 하위 타입 전부 수정 필요.
- **Unchecked의 비용**: 예외 처리를 잊기 쉬움. 런타임에 예상치 못한 곳에서 터질 수 있음.

---

## 동작 원리

### 예외 계층 구조

```text
        Throwable
        ├── Error               ← JVM 레벨 (OutOfMemoryError)
        └── Exception           ← Checked Exception
            ├── IOException
            ├── SQLException
            └── RuntimeException  ← Unchecked Exception
                ├── NullPointerException
                ├── IllegalArgumentException
                └── ...
```

### 핵심 차이

| 구분 | Checked | Unchecked |
| :--- | :--- | :--- |
| 상속 | `Exception` | `RuntimeException` |
| 컴파일 시 강제 | try-catch 또는 throws **필수** | 선택 |
| 발생 시점 | **모두 런타임**에 발생 (컴파일 시점 아님) | 동일 |
| Spring 트랜잭션 | 기본적으로 **롤백하지 않음** | 기본적으로 **롤백** |
| 용도 | 복구 가능한 외부 실패 (I/O, 네트워크) | 프로그래밍 오류, 비즈니스 검증 실패 |

### 자바 예외 철학: 복구 가능성의 분류

Checked와 Unchecked의 본질은 `throws` 문법이 아니라 실패를 보는 관점이다. Checked Exception은 호출자가 복구 방법을 고민해야 하는 공개 계약이고, Unchecked Exception은 호출자가 보통 복구할 수 없는 프로그래밍 오류에 가깝다.

> "Any `Exception` that can be thrown by a method is part of the method's public programming interface." — [Oracle Java Tutorial: Unchecked Exceptions — The Controversy](https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html)

> "If a client can reasonably be expected to recover from an exception, make it a checked exception. If a client cannot do anything to recover from the exception, make it an unchecked exception." — [Oracle Java Tutorial: Unchecked Exceptions — The Controversy](https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html)

```text
실패 발생
  │
  ├─ 호출자가 복구 가능?
  │     └─ YES → Checked Exception
  │             예: 파일 없음, 네트워크 실패, 외부 시스템 응답 실패
  │
  └─ 호출자가 복구 불가능?
        └─ Unchecked Exception
                예: null 참조, 잘못된 인자, 깨진 불변식
```

이 관점 때문에 [[개념-Spring 트랜잭션 관리 (Transaction Management)]]도 기본적으로 Checked Exception에는 커밋 가능성을 남기고, Unchecked Exception에는 롤백을 건다. 다만 현대 서버 애플리케이션에서는 `IOException`, `SQLException`도 그 자리에서 복구하지 않고 전체 작업 실패로 처리하는 경우가 많아, Spring의 기본 철학과 실무 기대가 충돌할 수 있다.

---

### Checked Exception과 LSP 위반

```text
class Parent {
    void process() throws IOException { ... }
}

class Child extends Parent {
    @Override
    void process() throws SQLException { ... }  ← 컴파일 에러!
}
```

Checked Exception은 **부모가 선언하지 않은 예외를 자식이 선언할 수 없다.** 이는 [[본질-추상화 (Abstraction)]]의 관점에서, 부모 타입으로 치환했을 때 호출자가 예상하지 못한 예외를 받게 되는 것을 방지한다 (리스코프 치환 원칙).

### 커스텀 예외는 Unchecked 권장

```java
// Unchecked: throws 전파 불필요, 호출 체인 오염 없음
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
```

- Checked를 사용하면 던져지는 예외마다 호출 스택 전체에 `throws` 선언이 필요.
- 비즈니스 예외는 대부분 최상위에서 일괄 처리(ExceptionHandler)하므로, 중간 계층에 throws를 강제할 이유가 없음.
- Checked가 유효한 경우: **해당 로직 내에서 예외를 직접 핸들링할 수 있는 방법이 명확할 때.**

---

## 관련 본질

- [[본질-추상화 (Abstraction)]] — Checked Exception의 throws 선언 제약은 LSP(리스코프 치환 원칙)와 연결.
- [[본질-값의 신뢰성 (Value Trustworthiness)]] — 자기 검증과 예외 처리는 신뢰 가능한 코드를 만드는 수단.
