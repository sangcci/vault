---
aliases: [Atomic Update, 원자적 갱신, 원자적 업데이트]
tags: [개념, 완료]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) READ 없이 DB가 단일 SQL 문장 안에서 읽기·수정·쓰기를 원자적으로 수행하는 갱신 방식.
> (이해용) "애플리케이션이 값을 꺼내 계산하지 않고, DB에게 '지금 있는 값에서 +1해줘'라고 지시하는 것."

## 해결하는 문제

- [[현상-갱신 손실 (Lost Update)]] — READ와 WRITE 사이 간격에서 다른 트랜잭션이 개입하는 문제

## 치르는 비용

- 반환값(rowCount)으로만 성공·실패를 판단해야 함 → 실패 원인 세분화가 어려움
- 조건 분기가 복잡한 경우(읽은 값에 따라 다른 무언가를 결정) 적용 불가
  → 그 경우 [[판단기준-동시성 제어 방법 선택 (Atomic UPDATE vs Lock)]] 참고

## 동작 원리

```
일반 RMW 패턴 (문제):
T1: SELECT count(=10) → +1 → UPDATE count=11
T2: SELECT count(=10) → +1 → UPDATE count=11  ← T1의 갱신 소멸

Atomic UPDATE (해결):
T1: UPDATE SET count = count + 1 WHERE count < max  ← DB가 단일 연산으로 처리
T2: UPDATE SET count = count + 1 WHERE count < max  ← 직렬화됨
→ 결과: count = 12 (정상)
```

WHERE 절에 조건을 포함시켜 제약 위반 시 rowCount=0 반환:

```sql
UPDATE rent_boarding_slots
SET passenger_count = passenger_count + :delta
WHERE id = :id
  AND (passenger_count + :delta) <= recruitment_count
```

- rowCount = 1 → 성공
- rowCount = 0 → 만석 또는 조건 불충족

JPA에서는 JPQL `@Modifying @Query`로 구현. 1차 캐시·dirty checking을 우회하므로 `@Modifying(clearAutomatically = true)` 권장.

## 관련 본질

- [[본질-원자성 (Atomicity)]]
- [[본질-동시성 (Concurrency)]]
