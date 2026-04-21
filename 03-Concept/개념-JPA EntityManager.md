---
aliases: [EntityManager, 영속성 컨텍스트, Persistence Context, 1차 캐시]
tags: [개념, 작성중, JPA, Spring]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) JPA에서 엔티티의 생명주기를 관리하고, DB와의 동기화를 조율하는 영속성 컨텍스트의 관리자.
> (이해용) 엔티티를 메모리에 올려두고 변경을 추적하다가, 트랜잭션이 끝날 때 한 번에 DB에 반영하는 중간 관리자.

## 해결하는 문제

- 매 조회마다 DB에 접근하는 비효율 (1차 캐시로 해결)
- 객체 변경을 일일이 UPDATE 쿼리로 작성해야 하는 불편 (Dirty Checking으로 해결)
- 같은 식별자의 엔티티가 여러 인스턴스로 생성되는 정합성 문제 (Identity Map으로 해결)

## 치르는 비용

- JPQL 벌크 연산이 1차 캐시를 우회 → 불일치 발생 가능 (→ [[개념-JPQL 벌크 연산 (Bulk Operation)]])
- 영속성 컨텍스트가 살아있는 동안 엔티티를 메모리에 보유
- Lazy Loading 사용 시 컨텍스트가 닫힌 후 접근하면 `LazyInitializationException`

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
    ▼
영속 (managed)  ←─── em.merge()
    │  em.detach() / em.clear()
    ▼
준영속 (detached)
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

### JpaTransactionManager와의 관계

```text
@Transactional 진입
        │
        ▼
JpaTransactionManager
  1. EntityManagerFactory에서 EntityManager 생성
  2. 트랜잭션 시작 (EntityTransaction.begin())
  3. EntityManager를 ThreadLocal에 바인딩
        │
        ▼
비즈니스 로직 (Repository → EntityManager 사용)
        │
        ▼
JpaTransactionManager
  4. flush() → 쓰기 지연 SQL 실행
  5. commit() 또는 rollback()
  6. EntityManager close() → 영속성 컨텍스트 종료
  7. ThreadLocal 해제
```

→ [[개념-Spring 트랜잭션 관리 (Transaction Management)]]의 `JpaTransactionManager`가 EntityManager 생명주기를 통제.

### flush vs clear vs close

| 메서드 | 동작 |
|--------|------|
| `flush()` | 쓰기 지연 SQL을 DB에 실행 (1차 캐시 유지) |
| `clear()` | 1차 캐시 전체 초기화 (엔티티 준영속 전환) |
| `close()` | 영속성 컨텍스트 종료 |

## 관련 본질

- [[본질-영속성 (Persistence)]] — 엔티티 상태의 지속성 관리
- [[본질-값의 신뢰성 (Value Trustworthiness)]] — 1차 캐시와 DB 간 일관성
