---
aliases: [Persistence Context and Database State Synchronization, JPA First Level Cache]
tags: [본질, 작성중, JPA]
difficulty: Medium
type: Principle
---

# Principle: 영속성 컨텍스트와 DB 상태 동기화

**핵심 질문**: 지금 읽는 값은 DB 값인가, 1차 캐시 값인가?

## 한 문장 정의

영속성 컨텍스트와 DB 상태 동기화는 JPA가 트랜잭션 안에서 Entity를 1차 캐시에 보관하므로 DB에 직접 반영되는 연산 이후에는 캐시와 DB의 불일치를 명시적으로 flush/clear해야 한다는 원리.

---

## 판단 기준

```text
Entity 변경
  Entity 상태 변경
    ↓ flush
  DB 반영

Bulk update/delete
  JPQL 실행
    ↓
  DB 직접 반영
    ↓
  Persistence Context는 자동 갱신되지 않음
```

---

## 실무 기준

- 벌크 연산은 대량 처리용이지 Entity 생명주기 이벤트용이 아니다.
- 같은 트랜잭션에서 벌크 후 Entity를 다시 믿어야 하면 clear 후 재조회한다.
- `@Modifying(clearAutomatically = true)`를 사용할 때는 미반영 변경 손실 가능성도 함께 본다.
- 개별 Entity 검증/이벤트가 중요하면 벌크보다 도메인 단위 변경을 선택한다.

---

## 대표 문제

- [[57-JPQL 벌크 업데이트 후 같은 트랜잭션에서 오래된 값을 읽음]]

---

## 참고

> "The persistence context is not synchronized with the result of the bulk update or delete." — [Jakarta Persistence 3.1 Specification](https://jakarta.ee/specifications/persistence/3.1/jakarta-persistence-spec-3.1.html)
