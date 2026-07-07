---
aliases: [Long Transaction MVCC Bloat, Vacuum Blocked by Snapshot, PostgreSQL Dead Tuples]
tags: [문제, 작성중, PostgreSQL, MVCC, DB]
difficulty: High
type: Problem
---

# Problem: 24-장기 트랜잭션 때문에 테이블이 부풀고 VACUUM이 정리하지 못함

## 상황

PostgreSQL 테이블에 UPDATE/DELETE가 많은데 시간이 지나면서 Seq Scan이 느려지고 테이블 크기가 계속 커진다. VACUUM이 돌고 있어도 dead tuple이 기대만큼 줄지 않는다.

```text
UPDATE/DELETE 많은 테이블
  ↓
dead tuple 증가
  ↓
장기 트랜잭션이 오래된 snapshot 유지
  ↓
VACUUM이 old version을 지우지 못함
  ↓
heap bloat / scan 비용 증가
```

---

## 관찰된 증거

- `pg_stat_activity`에 오래 열린 transaction이 있다.
- `pg_stat_user_tables.n_dead_tup`이 계속 높다.
- 테이블 실제 row 수보다 디스크 크기가 과도하게 크다.
- UPDATE가 많은 테이블의 index/heap scan 비용이 증가한다.
- VACUUM이 실행돼도 오래된 row version을 회수하지 못한다.

---

## 의심 문제

가장 가능성 높은 문제는 **MVCC가 읽기/쓰기 충돌을 줄이는 대신 old row version 청소 비용을 뒤로 미루는 구조**다.

PostgreSQL은 UPDATE 시 기존 row를 덮어쓰지 않고 새 row version을 만든다. 기존 version은 그것을 볼 수 있는 snapshot이 모두 사라진 뒤에야 정리될 수 있다.

---

## 원인

```text
TX 100: 긴 조회 시작 → snapshot 유지

TX 200: row update
  old version: xmax=200
  new version: xmin=200

TX 100 관점
  old version이 여전히 보여야 함

VACUUM 관점
  TX 100이 끝나기 전까지 old version 제거 불가
```

MVCC는 동시성을 높인다.

```text
읽기와 쓰기 충돌 감소
  ↓
reader가 writer를 덜 막음
  ↓
대신 old version이 쌓임
  ↓
VACUUM/Freeze/스토리지 관리 필요
```

---

## 확인 방법

- `pg_stat_activity`에서 `state`, `xact_start`, `backend_xmin`을 확인한다.
- `pg_stat_user_tables`에서 `n_dead_tup`, `last_vacuum`, `last_autovacuum`을 본다.
- `pg_stat_all_tables`와 테이블 크기(`pg_total_relation_size`) 추이를 본다.
- 오래 열린 read-only transaction, idle in transaction, 긴 batch cursor를 찾는다.
- autovacuum 설정과 UPDATE/DELETE 빈도를 비교한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 장기 트랜잭션 종료/분할 | VACUUM 정리 가능 | 작업 재설계 필요 |
| idle in transaction timeout | 방치 세션 방어 | 긴 작업 오탐 주의 |
| batch 단위 commit | snapshot 보유 시간 감소 | 중간 실패 처리 필요 |
| autovacuum 튜닝 | dead tuple 누적 완화 | I/O 부하 증가 가능 |
| 테이블 재작성/REINDEX | bloat 회수 | 잠금/운영 절차 필요 |

---

## 트레이드오프

MVCC는 읽기와 쓰기를 덜 막아주는 대신, 과거 버전을 언제까지 보존할지라는 운영 비용을 만든다. 장기 트랜잭션은 “조회 하나”가 아니라 과거 세계를 계속 붙잡아 VACUUM의 청소 경계를 막는 행위다.

---

## 연결되는 본질

- [[본질-버전 가시성과 청소 비용]]
- [[본질-가시성과 happens-before]]
- [[본질-논리 순서와 물리 접근 비용]]

---

## 참고

> "each SQL statement sees a snapshot of data (a database version) as it was some time ago" — [PostgreSQL Documentation: MVCC Introduction](https://www.postgresql.org/docs/current/mvcc-intro.html)

> "The identity (transaction ID) of the inserting transaction for this row version." — [PostgreSQL Documentation: System Columns](https://www.postgresql.org/docs/current/ddl-system-columns.html)

> "The identity (transaction ID) of the deleting transaction, or zero for an undeleted row version." — [PostgreSQL Documentation: System Columns](https://www.postgresql.org/docs/current/ddl-system-columns.html)
