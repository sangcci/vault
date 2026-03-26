---
aliases: [AOP, Aspect-Oriented Programming, 관점 지향 프로그래밍, 횡단 관심사]
tags: [개념, 작성중, Spring, 설계]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 핵심 비즈니스 로직과 부가 기능(로깅, 트랜잭션, 보안 등)을 분리하여, 부가 기능을 독립 모듈(Aspect)로 정의한 뒤 지정된 시점에 자동으로 삽입하는 프로그래밍 패러다임.
> (이해용) 모든 메서드에 반복되는 try-catch 트랜잭션 코드를 한 곳에 모아두고, "어디에 끼워 넣을지"만 지정하면 자동으로 적용되게 하는 것.

## 해결하는 문제

- 트랜잭션, 로깅, 보안 등 **횡단 관심사(Cross-Cutting Concern)**가 여러 클래스에 중복 작성되는 문제.
- 핵심 로직과 부가 로직이 섞여 코드 가독성과 유지보수성이 떨어지는 문제.

## 치르는 비용

- **디버깅 난이도 증가**: 프록시를 통해 실행되므로 호출 스택이 직관적이지 않음.
- **Self-invocation 불가**: 같은 객체 내부에서 호출하면 프록시를 거치지 않아 AOP가 적용되지 않음.
- **Bean 한정**: Spring AOP는 Spring 컨테이너가 관리하는 Bean에만 적용 가능.

## 동작 원리

### 횡단 관심사의 모듈화

```text
[Before AOP]                         [After AOP]
┌──────────────────┐                 ┌──────────────────┐
│ 대출승인서비스     │                 │ 대출승인서비스     │
│   startTx()      │                 │                  │
│   비즈니스 로직    │       →         │   비즈니스 로직    │
│   commitTx()     │                 │                  │
├──────────────────┤                 └──────────────────┘
│ 환불서비스        │                        ↑
│   startTx()      │                 ┌──────┴──────┐
│   비즈니스 로직    │                 │  Tx Aspect  │  ← 한 곳에서 관리
│   commitTx()     │                 └─────────────┘
└──────────────────┘
```

### 위빙(Weaving) 전략 3가지

| 시점 | 방식 | 대표 |
| :--- | :--- | :--- |
| 컴파일 시점 | 소스 코드에 직접 삽입 | AspectJ (ajc 컴파일러) |
| 클래스 로딩 시점 | 바이트코드 조작 | AspectJ (Load-Time Weaving) |
| **런타임 시점** | **프록시 객체로 감싸기** | **Spring AOP** |

### Spring AOP: JDK Proxy vs CGLib

```text
[JDK Dynamic Proxy]              [CGLib Proxy]
Interface 기반                    Class 기반 (상속)

  «interface»                      Target Class
  ┌──────────┐                     ┌──────────┐
  │ Service   │                     │ Service   │
  └────┬─────┘                     └────┬─────┘
       │ implements                      │ extends
  ┌────┴─────┐                     ┌────┴─────┐
  │ Proxy$0   │                     │ Service$$ │
  │ (Advice   │                     │ EnhancerBy│
  │  + 위임)  │                     │ CGLib     │
  └──────────┘                     └──────────┘

→ CGLib는 interface 없이도 적용 가능하여 Spring Boot 기본값
```

### AOP 용어

| 용어 | 의미 |
| :--- | :--- |
| **Target** | AOP를 적용할 대상 객체 |
| **Join Point** | Advice가 적용될 수 있는 지점 (메서드 실행 시점) |
| **Advice** | 실제 부가 기능 로직 (Before, After, Around 등) |
| **Pointcut** | 어떤 Join Point에 Advice를 적용할지 정의하는 표현식 |
| **Aspect** | Advice + Pointcut을 묶은 모듈 (Spring Bean으로 등록) |

### Advice 실행 시점

```text
        Before
          │
          ▼
    ┌───────────┐
    │ Join Point │ ── Around (전후 모두)
    │ (메서드)   │
    └─────┬─────┘
          │
     ┌────┴────┐
     ▼         ▼
After        After
Returning    Throwing
```

## 관련 본질

- [[본질-관심사의 분리 (Separation of Concerns)]] — AOP의 존재 이유 그 자체.
- [[본질-간접 참조 (Indirection)]] — 프록시 객체를 통한 간접 호출이 AOP의 구현 원리.
- [[개념-의존성 주입 (Dependency Injection)]] — Bean으로 등록되어야 프록시 적용이 가능.
