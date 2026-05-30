---
aliases: [Application Service, Usecase Service, Application Layer Service]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) Application Service는 외부 요청 하나에 대응하는 usecase 흐름을 조합하고 transaction boundary와 event 발행 순서를 관리하는 계층이다.
> (이해용) 사용자의 “대절 참여” 같은 요청을 어떤 순서로 처리할지 보여주는 업무 흐름의 목차다.

---

## 해결하는 문제

- controller가 domain/repository 세부 절차를 직접 알게 되는 문제.
- transaction boundary가 repository나 domain 안에 흩어지는 문제.
- usecase 흐름이 코드에서 읽히지 않는 문제.

```text
Controller / Batch Job
        |
        v
Application Service
  1. command 해석
  2. actor 조합
  3. transaction boundary
  4. event 발행
        |
        v
Implementation / Domain
```

---

## 치르는 비용

- 모든 로직을 application service에 몰아넣으면 거대한 service가 된다.
- 단순 CRUD에서는 별도 계층감이 과할 수 있다.
- 외부 API 호출을 transaction 안에 오래 붙잡으면 lock 시간이 길어진다.

---

## 동작 원리

```java
@Transactional
public Long join(final RentJoinCommand command, final Long memberId) {
    Rent rent = rentReader.get(command.rentId());
    RentParticipant participant = rentJoiner.join(rent, command, memberId);
    RentParticipant saved = rentWriter.save(participant);
    Events.raise(RentJoinedEvent.from(rent, saved));
    return saved.getId();
}
```

application service는 “어떤 순서로 처리하는가”를 보여준다. “참여 가능한가” 같은 판단은 domain 또는 policy로 내려간다.

---

## 관련 본질

- [[개념-Implementation 계층]]
- [[판단기준-트랜잭션 경계를 어디에 둘 것인가]]
- [[판단기준-Application Domain Implementation 경계]]

---

## 참고

> "Declaring transaction semantics directly in the Java source code puts the declarations much closer to the affected code." — [Spring Framework Reference, Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
