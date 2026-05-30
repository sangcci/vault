---
aliases: [AOP Self-Invocation, 셀프 인보케이션, 내부 호출 AOP 미적용]
tags: [현상, 작성중]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의

> (사전적) Spring AOP 프록시 구조에서 동일 객체 내부 메서드가 다른 메서드를 직접 호출할 때 프록시를 우회하여 AOP 어드바이스가 적용되지 않는 현상.
> (이해용) 프록시는 외부에서 오는 호출만 감싸기 때문에, 같은 클래스 안에서 자기 자신을 호출하면 @Transactional, @Cacheable 등이 무시됨.

---

## 발생 환경

- Spring AOP 기반 어노테이션: `@Transactional`, `@Cacheable`, `@Async` 등
- 같은 빈(Bean) 내부에서 메서드 A가 메서드 B를 `this.B()` 형태로 호출할 때

---

## 관찰되는 증상

- `@Transactional(propagation = REQUIRES_NEW)` 메서드를 내부 호출해도 새 트랜잭션이 열리지 않음.
- `@Cacheable` 내부 호출 시 캐시 조회/저장이 동작하지 않음.
- 단위 테스트에서는 정상, 실제 Spring 컨텍스트에서만 문제 재현.

---

## 추측되는 원인

- [[개념-AOP (Aspect-Oriented Programming)]] — Spring AOP는 런타임 프록시 방식이므로 외부 진입 호출만 인터셉트 가능.

```text
[외부 호출 - AOP 적용됨]           [내부 호출 - AOP 미적용]
                                    
  외부 → [Proxy] → [Target.A()]     외부 → [Proxy] → [Target.A()]
              ↓                                            ↓
         [Target.B()]                               this.B()  ← 프록시 우회
         (AOP 적용)                                [Target.B()]
                                                   (AOP 미적용)
```

---

## 해결 방법

```text
[해결 1] 빈 분리 (권장)
  → @Async sendNotification()을 별도 NotificationService 빈으로 이동
  → 외부 호출이 되므로 프록시 경유

[해결 2] Self 주입
  @Autowired private OrderService self;
  self.sendNotification(); // 프록시 경유 → AOP 정상 동작
  ↳ 순환 참조 주의, 가독성 하락

[해결 3] AspectJ Load-Time Weaving 사용
  → 프록시 방식이 아닌 바이트코드 조작 → self-invocation 해결
  ↳ 설정 복잡도 증가
```

---

## 관련 사례

- [[개념-AOP (Aspect-Oriented Programming)]]
