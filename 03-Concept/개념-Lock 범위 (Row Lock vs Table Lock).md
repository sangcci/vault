---
aliases: [Row Lock, Table Lock, Lock Granularity, 락 범위, Lock 경합]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) DB가 동시성 충돌을 방지하기 위해 잠금을 거는 데이터의 단위(Row 또는 Table).
> (이해용) 잠금 단위가 작을수록 동시성이 높아지지만, WHERE 없는 쿼리 하나로 Row Lock 수천 개가 사실상 Table Lock이 된다.

---

## 해결하는 문제

- 동시 쓰기 요청 간 데이터 충돌 방지
- 트랜잭션 격리 보장

---

## 치르는 비용

- 잠금 범위가 넓을수록 동시성 처리량 감소
- Lock wait timeout → 커넥션 점유 연장 → [[현상-커넥션 풀 고갈 (Connection Pool Exhaustion)]]

---

## 동작 원리

### DB별 동작 차이

```
[MySQL MyISAM]
- Row Lock 없음, Table Lock만 지원
- WHERE 없는 UPDATE → 진짜 Table Lock
- SELECT 포함 모든 쓰기 차단

[MySQL InnoDB (5.5+ 기본)]
- 기본: Row Lock (인덱스 기반)
- WHERE 없는 UPDATE → Full Table Scan → 모든 Row에 Row Lock
- 기술적으로 Row Lock의 집합이지만 실질적으로 Table Lock과 동일
- MVCC 적용: SELECT는 통과, INSERT/UPDATE/DELETE는 대기

[PostgreSQL]
- WHERE 없는 UPDATE → ROW EXCLUSIVE Lock(테이블 수준, 경량) + 각 Row Lock
- 새 행 INSERT: 대기 없음
- 기존 행 UPDATE/DELETE: 대기
- InnoDB보다 MVCC가 강건하나 기존 행 UPDATE 많은 워크로드에서는 동일하게 위험
```

### WHERE 없는 UPDATE의 락 확산 경로

```
WHERE 없는 UPDATE
      ↓
Full Table Scan (인덱스 미사용)
      ↓
모든 Row에 Row Lock 순차 획득
      ↓
사실상 Table Lock과 동일한 효과
      ↓
다른 모든 쓰기 트랜잭션 blocking
      ↓
Lock wait timeout → 커넥션 점유 연장
      ↓
커넥션 풀 고갈 → 서비스 장애
```

**결론: DB 종류에 관계없이 "WHERE 없는 UPDATE → 커넥션 풀 고갈 → 장애" 경로는 동일하게 유효**

---

## 관련 본질

- [[본질-동시성 (Concurrency)]]
- [[본질-격리성 (Isolation)]]
