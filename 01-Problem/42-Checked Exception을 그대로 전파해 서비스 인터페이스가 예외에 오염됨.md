---
aliases: [Checked Exception Pollution, Java Exception Contract, Throws Leakage]
tags: [문제, 작성중, Java, Exception, API]
difficulty: Medium
type: Problem
---

# Problem: 42-Checked Exception을 그대로 전파해 서비스 인터페이스가 예외에 오염됨

## 상황

하위 계층에서 `IOException`, `SQLException` 같은 checked exception이 발생한다. 이를 그대로 `throws`로 전파하다 보니 서비스 인터페이스와 상위 호출자 전체가 기술 예외에 오염된다.

```java
interface UserService {
    User findUser(Long id) throws SQLException, IOException;
}
```

도메인 usecase가 DB/JDBC/파일 시스템 실패 타입을 공개 계약으로 노출하게 된다.

---

## 관찰된 증거

- 호출 체인 전체에 `throws IOException`, `throws SQLException`이 퍼진다.
- 실제로는 호출자가 복구하지 못하고 최상위에서 500으로 변환한다.
- 인터페이스 구현체를 바꾸면 예외 타입 계약도 바뀐다.
- 테스트 코드도 불필요한 throws를 계속 달고 있다.
- Spring 트랜잭션 rollback 기대와 checked exception 기본 동작이 어긋난다.

---

## 의심 문제

가장 가능성 높은 문제는 **checked exception을 복구 가능한 공개 계약이 아니라 기술 실패 전파 수단으로 사용한 것**이다.

Checked exception은 호출자가 합리적으로 복구할 수 있을 때 의미가 있다. 복구할 수 없다면 내부에서 도메인/애플리케이션 예외로 변환하거나 최상위 예외 처리 정책으로 넘기는 편이 낫다.

---

## 원인

```text
Checked Exception
  - 컴파일러가 catch 또는 throws 강제
  - 메서드 공개 계약에 포함
  - 호출자가 복구해야 한다는 신호

문제 상황
  - 호출자는 SQLException을 복구할 수 없음
  - 하지만 throws가 인터페이스에 노출됨
  - 기술 세부사항이 도메인 경계 밖으로 새어 나감
```

---

## 확인 방법

- 호출자가 해당 예외를 실제로 복구하는지 확인한다.
- catch 후 같은 예외를 다시 던지는 코드가 많은지 본다.
- 인터페이스에 기술 예외가 노출되는지 확인한다.
- rollback 정책과 예외 타입이 맞는지 확인한다.
- 최상위 exception handler에서 일괄 처리하는 예외인지 본다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 복구 가능한 경우만 checked 유지 | 계약 명확 | 호출자 처리 코드 필요 |
| 기술 예외를 도메인/앱 예외로 변환 | 경계 보호 | 원인 보존 필요 |
| unchecked custom exception 사용 | 호출 체인 오염 감소 | 문서화/handler 필요 |
| 최상위 예외 처리 정책 정리 | 일관된 응답 | 세부 복구 어려움 |
| 트랜잭션 rollbackFor 명시 | Spring 기본과 실무 기대 조정 | 정책 누락 주의 |

---

## 트레이드오프

Checked exception은 호출자에게 실패 처리를 강제하는 장점이 있다. 하지만 복구할 수 없는 기술 실패를 그대로 노출하면 추상화 경계를 깨고 인터페이스를 오염시킨다.

---

## 연결되는 본질

- [[본질-예외 계약과 복구 가능성]]
- [[본질-의존성 방향과 기술 격리]]
- [[본질-스레드 바인딩 트랜잭션 문맥]]

---

## 참고

> "If a client can reasonably be expected to recover from an exception, make it a checked exception. If a client cannot do anything to recover from the exception, make it an unchecked exception." — [Oracle Java Tutorial: Unchecked Exceptions — The Controversy](https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html)

> "Any Exception that can be thrown by a method is part of the method's public programming interface." — [Oracle Java Tutorial: Unchecked Exceptions — The Controversy](https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html)
