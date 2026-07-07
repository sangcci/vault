---
aliases: [JPQL Bulk Update Stale Persistence Context, Bulk Operation First Level Cache]
tags: [문제, 작성중, JPA, Spring]
difficulty: Medium
type: Problem
---

# Problem: 57-JPQL 벌크 업데이트 후 같은 트랜잭션에서 오래된 값을 읽음

## 상황

여러 row를 한 번에 갱신하려고 JPQL bulk update를 사용했다. DB 값은 바뀌었지만 같은 트랜잭션 안에서 이미 조회한 Entity를 다시 읽자 이전 값이 반환된다.

```java
User user = userRepository.findById(1L).get(); // age=20
userRepository.bulkAgeUp();                    // DB age=21
user.getAge();                                 // still 20
```

---

## 관찰된 증거

- DB를 직접 조회하면 값이 바뀌어 있다.
- 애플리케이션 객체는 이전 값을 유지한다.
- 벌크 연산 후 같은 트랜잭션에서 후속 로직이 잘못된 판단을 한다.
- 테스트가 트랜잭션 경계에 따라 통과/실패한다.

---

## 원인

JPQL bulk update/delete는 영속성 컨텍스트의 Entity를 하나씩 변경하지 않고 DB에 직접 쿼리를 날린다. 따라서 1차 캐시와 DB 상태가 어긋날 수 있다.

---

## 해결 방향

- 벌크 연산 전 `flush()`로 기존 변경을 DB에 반영한다.
- 벌크 연산 후 `clear()` 또는 `@Modifying(clearAutomatically = true)`로 영속성 컨텍스트를 비운다.
- 벌크 연산 이후 같은 트랜잭션에서 Entity 상태를 믿지 않는다.
- 도메인 이벤트/후속 로직이 필요하면 개별 Entity 변경과 벌크 연산을 분리한다.

---

## 연결되는 본질

- [[본질-영속성 컨텍스트와 DB 상태 동기화]]
- [[본질-스레드 바인딩 트랜잭션 문맥]]

---

## 참고

> "The persistence context is not synchronized with the result of the bulk update or delete." — [Jakarta Persistence 3.1 Specification](https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html)

> "Defines whether we should clear the underlying persistence context after executing the modifying query." — [Spring Data JPA API: Modifying.clearAutomatically](https://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/Modifying.html)
