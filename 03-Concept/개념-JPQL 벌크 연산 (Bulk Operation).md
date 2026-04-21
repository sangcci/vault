---
aliases: [JPQL Bulk Operation, 벌크 업데이트, @Modifying, clearAutomatically]
tags: [개념, 작성중, JPA, DB]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) JPQL의 UPDATE/DELETE 문이 영속성 컨텍스트(1차 캐시)를 거치지 않고 DB에 직접 반영되는 연산.
> (이해용) JPA가 관리하는 메모리 장부를 무시하고 DB에 직접 쓰는 것 — 장부와 DB가 불일치해진다.

## 해결하는 문제

- N건을 개별 UPDATE하면 N번의 쿼리 → 벌크 연산으로 1번에 처리

## 치르는 비용

**1차 캐시 불일치 문제**

```text
[영속성 컨텍스트 (1차 캐시)]     [DB]
  User(id=1, age=20)           User(id=1, age=21)
        ↑                             ↑
   캐시된 값                    벌크 UPDATE 반영됨

같은 트랜잭션에서 user.getAge() → 20 반환 (잘못된 값)
```

JPQL 벌크 연산은 `flush()`는 수행하지만 1차 캐시를 **초기화하지 않는다**.

## 동작 원리

```text
@Modifying
@Query("UPDATE User u SET u.age = u.age + 1 WHERE u.status = 'ACTIVE'")
void bulkAgeUp();

흐름:
1. flush() → 영속성 컨텍스트의 변경사항을 DB에 반영
2. JPQL → DB에 직접 UPDATE (1차 캐시 미반영)
3. 이후 동일 트랜잭션에서 조회 → 캐시에서 old 값 반환 ← 문제 지점
```

### 해결: 1차 캐시 초기화

```java
// 방법 1: 어노테이션
@Modifying(clearAutomatically = true)
@Query("UPDATE User u SET u.age = u.age + 1")
void bulkAgeUp();

// 방법 2: 수동
entityManager.flush();
entityManager.clear();
```

`clearAutomatically = true` → 벌크 연산 직후 1차 캐시 전체 초기화.
이후 조회 시 DB에서 다시 로딩.

### 다른 트랜잭션은?

다른 트랜잭션은 자신의 영속성 컨텍스트를 가지므로 무관.
단, JPA 연관관계 설정이 되어 있다면 조회 타이밍 주의 필요.

## 관련 본질

- [[본질-영속성 (Persistence)]] — 영속성 컨텍스트와 DB 간 동기화 책임
- [[개념-JPA EntityManager]] — 1차 캐시와 flush/clear 동작의 주체
