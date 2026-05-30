---
aliases: [WHERE없는 UPDATE 장애, Full Table Scan Lock, 게임 서버 전체 장애]
tags: [사례, 작성중]
type: Case
difficulty: Medium
---

## 상황

- 약 20년 전 게임 서비스 운영 중
- 회원 테이블에 WHERE 절 없는 UPDATE 쿼리 실수로 실행
- 출처: 유튜브 "코딩하는 기술사" — WHERE절 없는 UPDATE 사건

---

## 실제 발생한 일

```sql
UPDATE member SET status = 1   -- WHERE 절 없음
```

장애 전파 경로:

```
WHERE 없는 UPDATE
  → 조건 없음 → Full Table Scan
  → 모든 Row에 Row Lock 순차 획득 (사실상 Table Lock)
  → 모든 쓰기 트랜잭션 blocking
  → Lock wait timeout / DB 응답 지연 급증
  → 커넥션 풀 고갈
  → 스레드 고갈
  → 게임 서버 전체 세션 강제 종료 → 전체 유저 접속 끊김
```

---

## 근본 원인

- [[현상-커넥션 풀 고갈 (Connection Pool Exhaustion)]]
- [[개념-Lock 범위 (Row Lock vs Table Lock)]]

---

## 교훈 및 조치

- 운영 DB에 직접 쿼리 금지
- WHERE 없는 UPDATE/DELETE 금지
- 실행 전 `EXPLAIN`으로 실행 계획 확인
- 실행 전 `SELECT`로 영향 범위 먼저 확인
- 대량 UPDATE는 배치/LIMIT으로 분할 처리
- 트랜잭션은 짧게 유지

---

## 파생 판단기준

- [[판단기준-트랜잭션 범위 설계]]
