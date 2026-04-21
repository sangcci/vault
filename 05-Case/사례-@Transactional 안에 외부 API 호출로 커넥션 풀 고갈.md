---
aliases: [@Transactional 남용, Transactional Abuse, Connection Idle Holding]
tags: [사례, 작성중]
type: Case
difficulty: Medium
---

## 상황

- Spring Boot 서비스에서 `@Transactional` 메서드 안에 외부 API 호출 포함
- 출처: Reddit r/SpringBoot — Why shouldn't we use @Transactional every time?

## 실제 발생한 일

```java
@Transactional
public void process() {
    dbWrite();           // DB 커넥션 획득
    callExternalApi();   // 수백ms ~ 수초 — 커넥션 idle 상태로 점유 중
    dbWrite2();
}                        // 여기서야 커넥션 반납
```

장애 전파 경로:

```
@Transactional + 느린 외부 호출
  → 외부 호출 동안 커넥션 idle 상태로 점유 (메서드 종료 전까지 반납 불가)
  → 동시 요청 증가 시 커넥션 풀 고갈
  → 스레드 고갈
  → 서비스 장애
```

**참고**: `HibernateTransactionManager`는 실제 필요 시점까지 커넥션 획득을 지연(lazy)하므로,
트랜잭션 매니저 구현체에 따라 커넥션 획득 시점이 다를 수 있음.

## 근본 원인

- [[현상-커넥션 풀 고갈 (Connection Pool Exhaustion)]]
- [[개념-Spring 트랜잭션 관리 (Transaction Management)]]

## 교훈 및 조치

- 외부 API 호출, 파일 처리 등 느린 작업은 `@Transactional` 범위 밖으로 분리
- 롤백 연동이 필요한 경우 대안:
  1. `PROPAGATION_NOT_SUPPORTED` — 해당 구간만 커넥션 반납 후 재획득
  2. 외부 호출 실패 시 트랜잭션이 필요한 구조 자체를 재설계
  3. Saga / Transactional Outbox 패턴 (분산 트랜잭션)
- `TransactionTemplate`으로 트랜잭션 범위를 메서드보다 좁게 제어 가능

## 파생 판단기준

- [[판단기준-트랜잭션 범위 설계]]
