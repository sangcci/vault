---
aliases: [Port and Adapter, Hexagonal Architecture, Ports and Adapters]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) 포트와 어댑터는 core가 외부 기술을 직접 알지 않고 port interface로 요구사항을 표현하고, adapter가 그 interface를 구현하게 만드는 구조다.
> (이해용) core는 콘센트 규격만 알고, DB·Redis·FCM은 그 규격에 맞춰 꽂히는 플러그가 된다.

## 해결하는 문제

- core 코드에 DB, Redis, FCM, OAuth2 같은 기술 이름이 새는 문제.
- 외부 기술 변경이 비즈니스 로직 변경으로 번지는 문제.
- 테스트에서 실제 외부 시스템을 계속 띄워야 하는 문제.

```text
core
  NotificationSender port
        ^
        |
support
  FcmSender adapter
```

## 치르는 비용

- interface와 구현체가 늘어난다.
- 작은 CRUD에서는 과한 추상화가 될 수 있다.
- port 이름을 잘못 잡으면 adapter보다 추상화가 더 불안정해진다.

## 동작 원리

```java
// core
public interface NotificationSender {
    void send(Target target, Message message);
}

// support
public class FcmSender implements NotificationSender {
    public void send(Target target, Message message) {
        firebaseClient.send(...);
    }
}
```

core는 “알림을 보낸다”만 말한다. support는 “FCM으로 어떻게 보낸다”를 담당한다.

## 관련 본질

- [[본질-의존성 방향 (Dependency Direction)]]
- [[본질-캡슐화 (Encapsulation)]]
- [[판단기준-기술 로직과 비즈니스 로직을 어떻게 구분할 것인가]]

## 참고

> "Business layer only uses abstractions of technological services." — [Martin Fowler, Layering Principles](https://martinfowler.com/bliki/LayeringPrinciples.html)
