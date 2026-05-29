---
aliases: [Implementation Layer, Usecase Actor Layer, 구현 행위자 계층]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) Implementation 계층은 application service와 domain 사이에서 조회, 저장, not found 처리, 외부 port 호출, domain method 조합 같은 usecase 행위를 맡는 계층이다.
> (이해용) service가 업무 흐름을 읽히게 하도록, 중간에서 작은 행위자들이 실제 준비 작업을 나눠 맡는 층이다.

## 해결하는 문제

- application service가 repository 호출과 예외 처리로 길어지는 문제.
- domain 객체가 책임질 규칙과 usecase 준비 절차가 한 곳에 섞이는 문제.
- `Reader`, `Writer`, `Joiner`, `Canceller` 같은 역할을 이름으로 드러내지 못하는 문제.

```text
Application Service
  - usecase 순서
  - transaction boundary
        |
        v
Implementation Actor
  - Reader / Writer / Joiner
  - repository 호출
  - not found 처리
        |
        v
Domain
  - 업무 규칙
  - 상태 변경
```

## 치르는 비용

- 클래스 수가 늘어난다.
- 단순 CRUD에서는 오히려 추적 비용이 커질 수 있다.
- domain 규칙까지 implementation으로 빼면 빈약한 도메인 모델이 된다.

## 동작 원리

```java
Rent rent = rentReader.get(command.rentId());
RentParticipant participant = rentJoiner.join(rent, command, memberId);
RentParticipant saved = rentWriter.save(participant);
```

- `RentReader`: repository 조회와 not found 처리.
- `RentJoiner`: 참여 행위에 필요한 객체 조합.
- `RentWriter`: 저장 위임.
- `Rent`: 참여 가능 여부와 상태 변경 같은 업무 규칙 책임.

## 관련 본질

- [[판단기준-Application Domain Implementation 경계]]
- [[개념-Application Service]]
- [[개념-Domain Service와 Policy]]
- [[본질-캡슐화 (Encapsulation)]]

## 참고

> "A Transaction Script organizes all this logic primarily as a single procedure" — [Martin Fowler, Transaction Script](https://martinfowler.com/eaaCatalog/transactionScript.html)

> "The domain layer should not talk to external systems - the service layer should do that." — [Martin Fowler, Layering Principles](https://martinfowler.com/bliki/LayeringPrinciples.html)
