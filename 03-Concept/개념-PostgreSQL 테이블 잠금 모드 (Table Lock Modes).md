---
aliases: [Table Lock Modes, PostgreSQL Lock Modes, 테이블 잠금 모드, PostgreSQL 잠금 모드]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) PostgreSQL이 동시 테이블 접근을 제어하기 위해 정의한 8가지 잠금 모드와 그 충돌 규칙 체계.
> (이해용) "락은 독립된 동작이 아니라 관리자가 정의한 모드 목록 + 충돌 매트릭스로 구성된 권한 시스템 — SELECT와 DROP이 충돌하는 이유는 규칙표에 X가 있기 때문이다."

---

## 해결하는 문제

- 여러 트랜잭션이 같은 테이블에 동시 접근할 때 데이터 일관성 보장
- 명령어 간 안전한 실행 순서 정의 (어떤 명령이 어떤 명령을 블로킹하는지 명시)
- [[현상-잠금 경합 (Lock Contention)]] 발생 원인 추적 — 명령어가 어떤 잠금을 획득하는지 알면 경합 예측 가능

---

## 치르는 비용

- 잠금 획득 실패 시 대기 발생 → [[현상-잠금 경합 (Lock Contention)]]
- 잠금 모드가 강할수록 동시성 저하 — AccessExclusiveLock은 SELECT조차 블로킹

---

## 동작 원리

**핵심 설계:** 락은 독립적으로 동작하지 않는다. PostgreSQL은 잠금 모드 목록 + 충돌 매트릭스를 미리 정의해두고, 명령어들이 실행 시 자동으로 적절한 잠금을 획득하는 구조다.

> "most PostgreSQL commands automatically acquire locks of appropriate modes to ensure that referenced tables are not dropped or modified in incompatible ways while the command executes."
> — [PostgreSQL 16 Docs: Explicit Locking](https://www.postgresql.org/docs/16/explicit-locking.html)

**8가지 테이블 잠금 모드 (약한 순):**

```
모드                        획득 명령어
─────────────────────────────────────────────────────
AccessShareLock          ← SELECT
RowShareLock             ← SELECT FOR UPDATE / SHARE
RowExclusiveLock         ← INSERT / UPDATE / DELETE / MERGE
ShareUpdateExclusiveLock ← VACUUM, ANALYZE, CREATE INDEX CONCURRENTLY
ShareLock                ← CREATE INDEX (일반)
ShareRowExclusiveLock    ← CREATE TRIGGER, ALTER TABLE (일부)
ExclusiveLock            ← 특수 명령어
AccessExclusiveLock      ← DROP TABLE, TRUNCATE, VACUUM FULL, ALTER TABLE (대부분)
```

**충돌 매트릭스 (X = 충돌 → 대기 발생):**

```
요청 →          AS  RS  RE  SUE  S  SRE  E   AE
보유 ↓
AS               .   .   .   .   .   .   .   X
RS               .   .   .   .   .   .   X   X
RE               .   .   .   .   X   X   X   X
SUE              .   .   .   X   X   X   X   X
S                .   .   X   X   .   X   X   X
SRE              .   .   X   X   X   X   X   X
E                .   X   X   X   X   X   X   X
AE               X   X   X   X   X   X   X   X
```

**CREATE INDEX 잠금 비교:**

```
일반 CREATE INDEX → ShareLock (S)
INSERT/UPDATE/DELETE → RowExclusiveLock (RE)
S vs RE → 충돌 (X) → DML 전체 블로킹

CONCURRENTLY → ShareUpdateExclusiveLock (SUE)
SUE vs RE → 비충돌 (.) → DML 허용
```

**AccessExclusiveLock 특성:**

```
> "Only an ACCESS EXCLUSIVE lock blocks a SELECT (without FOR UPDATE/SHARE) statement."
  — PostgreSQL 16 Docs
```

즉, SELECT를 블로킹하는 유일한 모드. DROP / TRUNCATE / VACUUM FULL 실행 시 서비스 전체 읽기가 차단될 수 있음.

---

## 관련 본질

- [[본질-동시성 (Concurrency)]]

---

## 관련 개념

- [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] — SUE 잠금으로 DML 허용하는 메커니즘
- [[현상-잠금 경합 (Lock Contention)]] — 잠금 충돌이 경합으로 이어지는 구조

---

## 참고

- [PostgreSQL 16 Docs: Explicit Locking — Table-Level Locks](https://www.postgresql.org/docs/16/explicit-locking.html#LOCKING-TABLES)
