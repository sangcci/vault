---
aliases: [Technology Leakage in Domain, Port Adapter Boundary, Infrastructure Coupling]
tags: [문제, 작성중, Architecture, DDD]
difficulty: High
type: Problem
---

# Problem: 27-도메인 코드에 DB Redis FCM 같은 기술 이름이 새어 나옴

## 상황

도메인 또는 core usecase 코드 안에 특정 기술 이름이 직접 등장한다.

```java
public class NotificationPolicy {
    private final FirebaseMessaging firebaseMessaging;
    private final RedisTemplate<String, String> redisTemplate;

    public void notifyParticipant(...) {
        if (redisTemplate.hasKey(...)) {
            firebaseMessaging.send(...);
        }
    }
}
```

처음에는 빠르게 구현되지만, FCM에서 다른 push provider로 바꾸거나 Redis 저장 구조를 바꾸면 비즈니스 규칙 코드까지 수정된다.

---

## 관찰된 증거

- Domain/Usecase 코드에 `Redis`, `Firebase`, `S3`, `Kafka`, `OAuth2`, `JpaRepository` 같은 이름이 나온다.
- 외부 SDK mocking 없이는 core 규칙 테스트가 어렵다.
- 기술 교체가 제품 정책 변경처럼 core 코드 변경으로 번진다.
- “누구에게 알림을 보낼 것인가”와 “FCM으로 어떻게 보낼 것인가”가 같은 클래스에 있다.
- Entity가 Repository를 직접 알거나, Spring Context에서 Bean을 꺼내려 한다.

---

## 의심 문제

가장 가능성 높은 문제는 **비즈니스 규칙과 기술 구현이 같은 방향으로 의존하는 것**이다.

Core는 “무엇을 해야 하는가”를 말해야 하고, adapter는 “어떤 기술로 어떻게 할 것인가”를 담당해야 한다. 기술 이름이 core 안으로 들어오면 의존성 방향이 바뀐다.

---

## 원인

```text
나쁜 방향
core → Firebase SDK
core → RedisTemplate
core → JpaRepository 구현

좋은 방향
core → NotificationSender port
adapter → FcmNotificationSender implements NotificationSender
```

핵심은 port가 기술을 숨기는 것이 아니라, core가 이해하는 요구사항 언어를 표현한다는 점이다.

```java
public interface NotificationSender {
    void send(Target target, Message message);
}
```

Core는 알림 발송이라는 제품 의미만 알고, FCM/메일/문자 같은 전송 방식은 adapter가 맡는다.

---

## 확인 방법

- core 패키지에서 vendor/protocol/SDK 이름을 grep한다.
- 이 코드가 기술이 바뀌면 변하는지, 정책이 바뀌면 변하는지 구분한다.
- 테스트가 외부 시스템 없이 가능한지 확인한다.
- Entity가 Repository, ApplicationContext, DataSource를 직접 아는지 확인한다.
- port 이름이 기술 이름이 아니라 usecase 언어인지 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| Port interface 도입 | core 의존성 안정화 | interface 증가 |
| Adapter로 SDK 격리 | 기술 교체 범위 축소 | mapping 코드 필요 |
| Repository interface 분리 | 도메인-저장소 결합 완화 | 단순 CRUD엔 과할 수 있음 |
| 테스트 fake adapter 사용 | core 테스트 단순화 | fake와 실제 adapter 차이 관리 |
| 기술 로직/core 규칙 분리 | 변경 이유 명확 | 경계 판단 필요 |

---

## 트레이드오프

모든 기술 의존을 제거하는 것이 목표는 아니다. 핵심은 제품 규칙이 기술 교체 때문에 바뀌지 않게 하는 것이다. 작은 CRUD에서는 직접 의존이 더 단순할 수 있지만, 외부 기술이 자주 바뀌거나 테스트 비용이 크면 port/adapter 경계가 값어치를 한다.

---

## 연결되는 본질

- [[본질-의존성 방향과 기술 격리]]
- [[본질-변경 이유와 경계]]
- [[본질-추상화 비용과 변경 가능성]]

---

## 참고

> "Business layer only uses abstractions of technological services." — [Martin Fowler: Layering Principles](https://martinfowler.com/bliki/LayeringPrinciples.html)

> "Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects." — [Martin Fowler: Repository](https://martinfowler.com/eaaCatalog/repository.html)
