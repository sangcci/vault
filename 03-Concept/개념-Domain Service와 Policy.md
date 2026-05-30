---
aliases: [Domain Service, Domain Policy, Policy Object]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) Domain Service와 Policy는 도메인 규칙이지만 특정 aggregate 하나의 책임으로 넣기 어색한 판단이나 계산을 분리한 객체다.
> (이해용) 한 객체 혼자 결정하기 어려운 업무 규칙을 별도 심판에게 맡기는 방식이다.

---

## 해결하는 문제

- 여러 aggregate를 함께 봐야 하는 규칙을 application service에 조건문으로 박는 문제.
- 한 entity에 모든 정책을 몰아넣어 책임이 비대해지는 문제.
- 기술 의존이 없는 순수 업무 판단이 usecase 절차와 섞이는 문제.

```text
Application Service
  |
  v
Implementation Actor ----> Domain Policy
        |                    |
        v                    v
     Aggregate           순수 업무 규칙
```

---

## 치르는 비용

- policy가 많아지면 규칙 위치를 찾기 어려울 수 있다.
- 단일 aggregate가 충분히 판단할 수 있는 규칙까지 policy로 빼면 응집도가 떨어진다.
- 이름을 구체적으로 짓지 않으면 `Manager`, `Helper` 같은 모호한 객체가 된다.

---

## 동작 원리

```java
public class RentSeatReservationPolicy {
    public void validateReservable(
            final Rent rent,
            final List<RentParticipant> participants,
            final int requestedSeatCount
    ) {
        if (rent.remainingSeats(participants) < requestedSeatCount) {
            throw new CustomException(RentErrorCode.SEAT_NOT_ENOUGH);
        }
    }
}
```

여러 객체를 보고 판단하지만 DB, HTTP, Redis 같은 기술은 모른다. 판단 자체는 domain rule로 남는다.

---

## 관련 본질

- [[개념-Implementation 계층]]
- [[개념-Application Service]]
- [[본질-캡슐화 (Encapsulation)]]
- [[판단기준-Application Domain Implementation 경계]]

---

## 참고

> "The domain layer should not talk to external systems - the service layer should do that." — [Martin Fowler, Layering Principles](https://martinfowler.com/bliki/LayeringPrinciples.html)
