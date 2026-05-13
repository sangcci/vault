---
aliases: [EntityManager Injection and AOP, Shared EntityManager Proxy, PersistenceContext 주입]
tags: [개념, 작성중]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) Spring은 `@PersistenceContext`로 주입되는 `EntityManager`를 공유 프록시로 제공하고, `@Transactional` AOP가 만든 트랜잭션 경계 안에서 현재 스레드에 바인딩된 실제 `EntityManager`로 호출을 위임한다.
> (이해용) 개발자가 Bean에서 쓰는 `EntityManager`는 보통 진짜 본체라기보다 '지금 이 트랜잭션에 맞는 EntityManager한테 연결해 주는 중계기'에 가깝다.

## 해결하는 문제

- singleton Spring Bean에 thread-safe하지 않은 `EntityManager`를 그대로 들고 있으면 깨지는 문제
- `@Transactional`은 자동인데, `EntityManager`는 누가 만들고 누가 닫는지 감이 안 잡히는 문제
- AOP가 하는 일과 JPA 프록시가 하는 일이 섞여 보이는 문제

## 치르는 비용

- 프록시를 두 겹으로 이해해야 해서 처음엔 디버깅이 헷갈린다
- self-invocation처럼 트랜잭션 프록시를 우회하면 기대한 `EntityManager` 문맥도 다르게 보일 수 있다
- `PersistenceContextType.EXTENDED`는 성격이 달라서 singleton Bean에 함부로 쓰면 안 된다

## 동작 원리

### 누가 무엇을 맡는가

```text
AOP 프록시의 역할
- @Transactional 메서드 앞뒤에서 begin / commit / rollback
- 현재 thread에 트랜잭션 문맥 열기

EntityManager 공유 프록시의 역할
- Bean에 주입됨
- 호출이 들어오면 현재 thread의 실제 EntityManager로 위임

실제 EntityManager의 역할
- 영속성 컨텍스트 보유
- 1차 캐시, dirty checking, flush 수행
```

즉 핵심은 이거다.

```text
AOP는 "경계"를 만든다
EntityManager 프록시는 "대상 연결"을 한다
실제 EntityManager는 "영속성 작업"을 한다
```

### 전체 흐름

```text
HTTP 요청
  │
Tomcat worker thread-21
  │
@Service @Transactional 메서드 호출
  │
  ▼
트랜잭션 AOP 프록시
  ├─ begin
  ├─ JpaTransactionManager 호출
  └─ 실제 EntityManager를 현재 thread에 바인딩
          │
          ▼
Repository / Service 내부의 em.persist(), em.find()
  │
  └─ 주입된 shared EntityManager proxy가
     현재 thread의 실제 EntityManager로 위임
          │
          ▼
commit / rollback
  │
  └─ flush, close, thread binding 해제
```

### 왜 singleton Bean에서도 주입이 가능한가

`EntityManager` 자체는 thread-safe하지 않다. 그래서 진짜 `EntityManager` 인스턴스를 singleton Bean 필드에 고정해서 들고 있으면 위험하다.

하지만 Spring은 기본 `@PersistenceContext(type = TRANSACTION)`에서 **shared EntityManager proxy**를 주입한다.
이 프록시는 호출 시점마다 현재 트랜잭션 문맥을 보고 알맞은 실제 `EntityManager`로 연결한다.

```text
Bean 필드의 em
  = 고정된 진짜 EntityManager ❌
  = 위임용 shared proxy ✅
```

### self-invocation이 왜 문제를 만들 수 있나

```text
외부 호출 → 프록시 통과 → 트랜잭션 열림 → em이 현재 thread의 실제 EM으로 위임
내부 this 호출 → 프록시 우회 → 트랜잭션 advice 미적용 가능
```

그래서 self-invocation이 생기면 단순히 `@Transactional`만 빠지는 게 아니라, **그 호출이 기대하던 트랜잭션 문맥도 열리지 않을 수 있다**.

### EXTENDED는 왜 다르게 봐야 하나

기본값인 `TRANSACTION`은 트랜잭션과 함께 움직이는 shared proxy라서 일반적인 Spring 서버 코드와 잘 맞는다.
반면 `EXTENDED`는 생명주기가 길고 thread-safe하지 않아서, 여러 요청이 동시에 들어오는 singleton Bean과는 맞지 않는다.

## 관련 본질

- [[개념-Spring 트랜잭션 관리 (Transaction Management)]]
- [[개념-JPA EntityManager]]
- [[개념-AOP (Aspect-Oriented Programming)]]
- [[본질-간접 참조 (Indirection)]]
- [[본질-관심사의 분리 (Separation of Concerns)]]

## 참고

> "Although EntityManagerFactory instances are thread-safe, EntityManager instances are not." — [Spring Framework Reference: JPA](https://docs.spring.io/spring-framework/reference/data-access/orm/jpa.html)

> "The injected JPA EntityManager ... delegates all calls to the current transactional EntityManager, if any." — [Spring Framework Reference: JPA](https://docs.spring.io/spring-framework/reference/data-access/orm/jpa.html)

> "You can use this default to receive a shared EntityManager proxy." — [Spring Framework Reference: JPA](https://docs.spring.io/spring-framework/reference/data-access/orm/jpa.html)

> "Spring AOP is proxy-based." — [Spring Framework Reference: Proxying Mechanisms](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
