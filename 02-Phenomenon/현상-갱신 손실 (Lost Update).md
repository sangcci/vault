---
aliases: [Lost Update, 갱신 손실]
tags: [현상, 작성중]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의

> (사전적) 두 트랜잭션이 동일한 레코드를 동시에 Read-Modify-Write할 때 한 트랜잭션의 갱신이 다른 트랜잭션의 갱신에 덮어씌워져 사라지는 현상.
> (이해용) "두 사람이 같은 문서를 동시에 열어 각자 수정 후 저장하면, 먼저 저장한 사람의 변경이 사라지는 것."

---

## 발생 환경

- 여러 트랜잭션이 동일 레코드에 동시 접근하는 환경
- 격리 수준이 Read Committed 이하일 때

---

## 관찰되는 증상

- 분명히 반영했는데 DB에는 이전 값이 남아있음
- 동시 요청이 많을수록 데이터 손실 빈도 증가

---

## 발생 메커니즘

```
재고: 10개

T1: READ(10) ──→ 계산(10-1=9) ──────────→ WRITE(9)
T2: READ(10) ──────────→ 계산(10-1=9) ──→ WRITE(9)

결과: 9 (T1의 갱신 소멸, 실제로는 8이어야 함)
```

근본 원인: READ와 WRITE 사이의 간격에서 다른 트랜잭션이 개입 가능 → [[판단기준-동시성 이상 현상 분류 체계]]의 RMW 패턴

---

## 해결 방법

```
1. Atomic UPDATE (가장 단순)
   UPDATE stock SET count = count - 1 WHERE id = 1

2. 비관적 락 (Pessimistic Lock)
   SELECT ... FOR UPDATE → 읽는 순간 잠금

3. 낙관적 락 (Optimistic Lock)
   version 컬럼 비교 → 충돌 시 재시도

4. Serializable 격리 수준
   트랜잭션 직렬화 → 성능 비용 높음
```

---

## 추측되는 원인

- [[판단기준-동시성 이상 현상 분류 체계]] — RMW 패턴

---

## 관련 사례

- [[사례-Allreva 차량 대절 동시성 문제 해결]]
- [[본질-원자성 (Atomicity)]]
- [[본질-격리성 (Isolation)]]
