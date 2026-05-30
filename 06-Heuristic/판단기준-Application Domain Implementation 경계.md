---
aliases: [Application Domain Implementation Boundary, Usecase Actor Boundary]
tags: [판단기준, 작성중]
difficulty: High
type: Heuristic
---

## 판단 기준

- 조건이 도메인 상태나 정책의 옳고 그름을 판단한다 → `domain` 또는 `domain service/policy`에 둔다.
- 조건이 조회, 저장, not found 처리, 외부 port 호출 실패 처리다 → `implementation` 행위자에 둔다.
- 사용자 요청 하나의 처리 순서, 트랜잭션 경계, 이벤트 발행 순서다 → `application service`에 둔다.
- 여러 aggregate를 함께 봐야 하지만 기술 의존이 없다 → `domain service/policy`로 분리한다.
- 객체가 자기 상태를 바꾸는 불변식이다 → entity/aggregate method로 둔다.

```text
Controller / Batch Job
        |
        v
application service
- usecase 흐름
- transaction boundary
- event 발행
        |
        v
implementation actor
- Reader / Writer / Joiner
- repository 호출
- not found 처리
        |
        v
domain / policy
- 업무 규칙
- 불변식
- 상태 변경
```

---

## 효과적인 상황

- Service 코드가 구현 절차로 길어져서 업무 흐름이 안 보일 때.
- 도메인 객체가 getter/setter 중심 데이터 박스로 변하고 있을 때.
- 같은 조회, 저장, not found 처리가 여러 usecase에 반복될 때.
- domain과 application 사이에 “작은 업무 행위자”가 필요할 때.

---

## 실패하는 상황

- 단순 CRUD인데 행위자를 과하게 쪼개면 추적 비용이 더 커진다.
- domain 객체가 책임질 규칙까지 implementation으로 빼면 빈약한 도메인 모델이 된다.
- implementation이 기술 adapter까지 직접 알면 의존성 방향이 무너진다.

---

## 예시

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

- `rentReader.get(...)`: 조회와 not found 처리이므로 implementation.
- `rentJoiner.join(...)`: 참여 행위 조합이므로 implementation.
- `rent.join(...)` 또는 `rent.validateJoinable(...)`: 좌석, 상태, 권한 같은 업무 규칙이면 domain.
- `@Transactional`, `Events.raise(...)`: usecase 실행 경계이므로 application.

---

## 관련 노트

- [[본질-모듈성 (Modularity)]]
- [[본질-캡슐화 (Encapsulation)]]
- [[판단기준-멀티모듈 아키텍처를 언제 도입할 것인가]]
- [[판단기준-기술 로직과 비즈니스 로직을 어떻게 구분할 것인가]]

---

## 참고

> "A Transaction Script organizes all this logic primarily as a single procedure, making calls directly to the database or through a thin database wrapper." — [Martin Fowler, Transaction Script](https://martinfowler.com/eaaCatalog/transactionScript.html)

> "The domain layer should not talk to external systems - the service layer should do that." — [Martin Fowler, Layering Principles](https://martinfowler.com/bliki/LayeringPrinciples.html)
