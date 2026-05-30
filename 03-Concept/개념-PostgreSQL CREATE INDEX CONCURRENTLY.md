---
aliases: [CREATE INDEX CONCURRENTLY, 비잠금 인덱스 생성, Concurrent Index Build]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 테이블 쓰기 잠금 없이 인덱스를 백그라운드로 구축하는 PostgreSQL 전용 DDL 옵션.
> (이해용) "서비스 중단 없이 인덱스를 추가하되, 대신 시간이 두 배 걸리고 트랜잭션 안에선 쓸 수 없는 옵션."

---

## 해결하는 문제

- 운영 중인 대용량 테이블에 일반 `CREATE INDEX` 실행 시 AccessExclusiveLock으로 INSERT/UPDATE/DELETE 전체 블로킹
- 인덱스 생성 수 분 동안 서비스 장애 발생

> "Very large tables can take many hours to be indexed, and even for smaller tables, an index build can lock out writers for periods that are unacceptably long for a production system."
> — [PostgreSQL 16 Docs: CREATE INDEX — Building Indexes Concurrently](https://www.postgresql.org/docs/16/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)

PostgreSQL 공식 문서는 운영 환경에서의 인덱스 추가 표준 방법으로 CONCURRENTLY를 권고한다:

> "since it allows normal operations to continue while the index is built, this method is useful for adding new indexes in a production environment."
> — [PostgreSQL 16 Docs: CREATE INDEX — Building Indexes Concurrently](https://www.postgresql.org/docs/16/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)

---

## 치르는 비용

- 테이블을 두 번 스캔 → 소요 시간 약 2배
- 트랜잭션 내부에서 실행 불가 — `flyway:executeInTransaction=false`로 SQL 래퍼를 제거해도, Flyway의 `flyway_schema_history` 외부 잠금 트랜잭션은 유지되어 3단계에서 무한 대기 발생 (해결: `postgresql.transactional-lock=false`로 세션 advisory lock 전환)
- 실패 시 `INVALID` 상태 인덱스가 남아 수동 삭제 필요
- 고유 인덱스(Unique Index) 생성 중 중복 행 존재 시 실패

---

## 동작 원리

**일반 CREATE INDEX vs CONCURRENTLY:**
```
-- 일반: AccessExclusiveLock → 모든 DML 블로킹
CREATE INDEX idx_users_email ON users(email);

-- CONCURRENTLY: ShareUpdateExclusiveLock → DML 허용
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

**CONCURRENTLY Two-Pass 알고리즘:**

> "In a concurrent index build, the index is actually entered as an 'invalid' index into the system catalogs in one transaction, then two table scans occur in two more transactions. Before each table scan, the index build must wait for existing transactions that have modified the table to terminate."
> — [PostgreSQL 16 Docs: CREATE INDEX — Building Indexes Concurrently](https://www.postgresql.org/docs/16/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)

```
1단계: INVALID 인덱스를 시스템 카탈로그에 등록
       (ShareUpdateExclusiveLock 획득)
          ↓
       카탈로그에 등록된 순간부터
       신규 INSERT/UPDATE/DELETE는 자동으로 이 인덱스에 기록
       → 이후 발생하는 모든 쓰기는 누락 없이 인덱스에 반영됨
          ↓
2단계: 기존 트랜잭션 완료 대기 → 첫 번째 테이블 전체 스캔
          ↓
3단계: 기존 트랜잭션 완료 대기 → 두 번째 스캔
       (1~2단계 사이 변경된 행 반영)
          ↓
4단계: 2단계 이전 스냅샷을 가진 트랜잭션 모두 완료 대기
          ↓
5단계: 인덱스 VALID 상태로 전환 → 쿼리에 사용 가능
```

두 번 스캔하는 이유: 1차 스캔 중 실행 중이던 트랜잭션이 변경한 행을 2차 스캔이 포착. 카탈로그 등록 이후 시작된 트랜잭션은 자동으로 인덱스를 유지하므로 별도 처리 불필요.

**Flyway에서 CONCURRENTLY — 문제와 해결:**
```sql
-- [문제] executeInTransaction=false만 지정한 경우
-- flyway:executeInTransaction=false
-- → SQL 래퍼(내부 트랜잭션)는 제거되지만
-- → flyway_schema_history 잠금용 외부 트랜잭션(pg_advisory_xact_lock)은 유지됨
-- → 3단계: CONCURRENTLY가 Flyway 자신을 기다려 무한 대기

CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id); -- 무한 대기

-- [해결] postgresql.transactional-lock=false 추가
-- application.yml: spring.flyway.postgresql.transactional-lock=false
-- → pg_advisory_lock(세션 수준)으로 전환 → 트랜잭션 미보유
-- → 3단계: 진행 중인 트랜잭션 없음 → 즉시 통과

-- flyway:executeInTransaction=false
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id); -- 정상 완료
```

**INVALID 인덱스 처리:**
```sql
-- 실패 후 남은 INVALID 인덱스 확인
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users';

SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;

-- 삭제 후 재시도
DROP INDEX CONCURRENTLY idx_users_email;
```

---

## 관련 본질

- [[본질-동시성 (Concurrency)]]

---

## 관련 개념

- [[개념-PostgreSQL 테이블 잠금 모드 (Table Lock Modes)]] — SUE 잠금이 RE(DML)와 충돌하지 않는 원리
- [[현상-잠금 경합 (Lock Contention)]]
- [[개념-Flyway]]
- [[개념-데이터베이스 인덱스 (Database Index)]]

---

## 참고

- [PostgreSQL 16 Docs: CREATE INDEX — Building Indexes Concurrently](https://www.postgresql.org/docs/16/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)
- [PostgreSQL 16 Docs: Explicit Locking](https://www.postgresql.org/docs/16/explicit-locking.html)
