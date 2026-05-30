---
aliases: [Dependency Direction, 의존성 역전, Dependency Rule]
tags: [본질, 작성중]
difficulty: High
type: Principle
---

**핵심 질문**: "변하기 쉬운 구현이 변하지 않아야 하는 업무 규칙을 끌고 다니지 않게 하려면 의존성이 어느 쪽을 향해야 하는가?"

## 한 문장 정의

> (사전적) 의존성 방향은 한 코드 단위가 다른 코드 단위를 참조하고 변경 영향이 전파되는 방향이다.
> (이해용) 덜 중요한 세부사항이 더 중요한 정책을 바라보게 하고, 정책이 세부사항을 몰라도 되게 만드는 힘의 방향이다.

```text
나쁜 방향
core ----> db / redis / fcm

좋은 방향
api / batch / support ----> core
support implements core port
```

---

## 사용 예시

1. `allreva-core`는 `allreva-support`를 참조하지 않는다.
2. core는 `NotificationSender` port만 알고, FCM 구현체는 support에 둔다.
3. domain은 JPA Entity가 아니라 domain 객체와 repository interface를 기준으로 움직인다.

---

## 트레이드오프

- 얻는 것: 기술 교체 비용 감소, core 테스트 용이성, 모듈 경계 명확화.
- 잃는 것: interface/adapter 코드 증가, wiring 복잡도 증가, 초기 설계 비용 증가.

---

## 왜 사라지지 않는가

비즈니스 규칙보다 DB, cache, 외부 API, framework가 더 자주 바뀐다. 변하는 쪽이 변하지 않아야 하는 쪽을 끌고 가면 변경 비용이 커진다.

---

## 다른 모습들

- OS: user process는 kernel API를 사용하지만 kernel이 특정 app을 직접 알지 않는다.
- DB: SQL 사용자는 storage engine 세부 구현을 직접 알지 않는다.
- Network: application은 socket abstraction을 사용하고 NIC 구현을 몰라도 된다.

---

## 관련 노트

- [[본질-모듈성 (Modularity)]]
- [[본질-캡슐화 (Encapsulation)]]
- [[개념-포트와 어댑터 (Port and Adapter)]]

---

## 참고

> "Business layer only uses abstractions of technological services." — [Martin Fowler, Layering Principles](https://martinfowler.com/bliki/LayeringPrinciples.html)
