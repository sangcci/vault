---
aliases: [EntityManager, 영속성 컨텍스트, Persistence Context, 1차 캐시]
tags: [개념, 작성중, JPA, Spring]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) JPA에서 엔티티의 생명주기를 관리하고, DB와의 동기화를 조율하는 영속성 컨텍스트의 관리자.
> (이해용) 엔티티를 메모리에 올려두고 변경을 추적하다가, 트랜잭션이 끝날 때 한 번에 DB에 반영하는 중간 관리자.

---

## 해결하는 문제

- 매 조회마다 DB에 접근하는 비효율 (1차 캐시로 해결)
- 객체 변경을 일일이 UPDATE 쿼리로 작성해야 하는 불편 (Dirty Checking으로 해결)
- 같은 식별자의 엔티티가 여러 인스턴스로 생성되는 정합성 문제 (Identity Map으로 해결)

---

## 치르는 비용

- JPQL 벌크 연산이 1차 캐시를 우회 → 불일치 발생 가능 (→ [[개념-JPQL 벌크 연산 (Bulk Operation)]])
- 영속성 컨텍스트가 살아있는 동안 엔티티를 메모리에 보유
- Lazy Loading 사용 시 컨텍스트가 닫힌 후 접근하면 `LazyInitializationException`

---

## 동작 원리

### 영속성 컨텍스트 구조

```text
┌─────────────────────────────────────────────────┐
│               영속성 컨텍스트                    │
│                                                  │
│  1차 캐시 (Identity Map)                         │
│  ┌──────────────────────────────────────────┐   │
│  │ @Id=1 → User(id=1, name="Alice")         │   │
│  │ @Id=2 → User(id=2, name="Bob")           │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  스냅샷 (Dirty Checking용 원본 보관)             │
│  ┌──────────────────────────────────────────┐   │
│  │ @Id=1 snapshot: User(id=1, name="Alice") │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  쓰기 지연 SQL 저장소                            │
│  ┌──────────────────────────────────────────┐   │
│  │ INSERT INTO user ...                     │   │
│  │ UPDATE user SET name=...                 │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 엔티티 생명주기

```text
비영속 (new)
    │  em.persist()
    │  em.merge()
    ▼
영속 (managed) ◄── em.merge() ── 준영속 (detached)
    │                                  ▲
    └──── em.detach() / em.clear() ────┘
    │
    │  em.remove()
    ▼
삭제 (removed)
```

### Dirty Checking (변경 감지)

```text
트랜잭션 시작
    │
    ├─ em.find(User.class, 1L)  → 1차 캐시 저장 + 스냅샷 저장
    │
    ├─ user.setName("Charlie")  → 영속 객체 변경 (쿼리 작성 없음)
    │
    ├─ flush() 시점 (트랜잭션 커밋 직전)
    │    → 스냅샷과 현재 상태 비교
    │    → 변경 감지 → UPDATE 쿼리 자동 생성
    │
트랜잭션 커밋 → DB 반영
```

### Spring에서 주입되는 EntityManager는 무엇인가

핵심은 **Spring Bean에 주입되는 `EntityManager`가 항상 '실제 EntityManager 인스턴스 그 자체'는 아니라는 점**이다.
보통 `@PersistenceContext`로 주입받는 것은 **현재 트랜잭션에 맞는 진짜 EntityManager로 위임해 주는 공유 프록시**에 가깝다.

```text
@Service / Repository Bean
   │
   └─ 주입되는 EntityManager
        = shared EntityManager proxy
                │
                ├─ 현재 thread에 트랜잭션용 EntityManager가 있으면 거기로 위임
                └─ 없으면 필요 시 새 EntityManager를 열어 작업 후 정리
```

그래서 `EntityManager` 자체는 thread-safe하지 않지만, Spring이 주입한 shared proxy는 **현재 트랜잭션 문맥으로 위임**하기 때문에 일반적인 singleton Bean에서도 안전하게 쓸 수 있다.

### JpaTransactionManager와의 관계

```text
@Transactional 진입
        │
        ▼
트랜잭션 AOP 프록시
        │
        ▼
JpaTransactionManager
  1. EntityManagerFactory에서 실제 EntityManager 생성 또는 연결
  2. 트랜잭션 시작 (EntityTransaction.begin())
  3. EntityManager를 현재 thread에 바인딩
        │
        ▼
비즈니스 로직 (Repository → 주입된 EntityManager proxy 사용)
        │
        └─ proxy가 현재 thread의 실제 EntityManager로 위임
        │
        ▼
JpaTransactionManager
  4. flush() → 쓰기 지연 SQL 실행
  5. commit() 또는 rollback()
  6. EntityManager close() → 영속성 컨텍스트 종료
  7. ThreadLocal 해제
```

→ [[개념-Spring 트랜잭션 관리 (Transaction Management)]]의 `JpaTransactionManager`가 EntityManager 생명주기를 통제하고, 주입된 프록시는 그 결과를 현재 스레드에서 투명하게 쓰게 해 준다.

### flush vs clear vs close

| 메서드 | 동작 |
|--------|------|
| `flush()` | 쓰기 지연 SQL을 DB에 실행 (1차 캐시 유지) |
| `clear()` | 1차 캐시 전체 초기화 (엔티티 준영속 전환) |
| `close()` | 영속성 컨텍스트 종료 |

---

## 관련 본질

- [[본질-영속성 (Persistence)]] — 엔티티 상태의 지속성 관리
- [[본질-값의 신뢰성 (Value Trustworthiness)]] — 1차 캐시와 DB 간 일관성
- [[개념-EntityManager의 주입 방식과 AOP의 관계]] — 주입 프록시, 트랜잭션 프록시, 실제 EntityManager의 역할 분리

---

## 참고

- [Spring Framework Reference — JPA](https://docs.spring.io/spring-framework/reference/data-access/orm/jpa.html) — "EntityManagerFactory instances are thread-safe, EntityManager instances are not"
- [Spring Framework Reference — JPA](https://docs.spring.io/spring-framework/reference/data-access/orm/jpa.html) — injected `EntityManager` "delegates all calls to the current transactional EntityManager, if any"
- [Spring Framework Reference — JPA](https://docs.spring.io/spring-framework/reference/data-access/orm/jpa.html) — `@PersistenceContext` with default `TRANSACTION` type gives a shared `EntityManager` proxy
