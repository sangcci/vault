---
aliases: [Schema Migration, DB Migration, 데이터베이스_마이그레이션, Flyway, Liquibase]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 데이터베이스 스키마의 변경 이력을 코드처럼 버전 관리하여, 모든 환경에서 동일한 스키마 상태를 보장하는 기법.
> (이해용) **"SQL ALTER TABLE을 git commit처럼 관리하는 것."**

---

## 해결하는 문제

- **Schema Drift**: dev/stag/prod DB 스키마가 점진적으로 달라지는 현상
- **추적 불가**: "이 컬럼이 언제, 누가, 왜 추가했는지" 알 수 없는 문제
- **배포 사고**: 코드 배포와 스키마 변경 타이밍이 안 맞아 앱이 터지는 상황
- **멱등성 부재**: 같은 SQL을 두 번 실행했을 때 오류 발생

---

## 치르는 비용

- 마이그레이션 파일 관리 부담 (팀 협업 시 버전 충돌 가능)
- 스키마 롤백 불가 → Fix-Forward 전략 강제
- 대형 테이블 변경 시 운영 중 락(Lock) 위험 → Expand-Contract 패턴 필요

---

## 두 가지 접근 방식

```
버전 기반 (Versioned / Imperative)
  V1__create_users.sql
  V2__add_phone.sql        ← "어떻게 변경할지" 기록
  V3__create_orders.sql

상태 기반 (State-based / Declarative)
  model User {             ← "어떤 상태여야 하는지" 선언
    id    Int
    phone String?          ← 추가하면 툴이 diff 계산 → SQL 자동 생성
  }
```

---

## 주요 툴 비교

| | Flyway | Liquibase | Alembic | Prisma Migrate |
|---|---|---|---|---|
| 방식 | 버전 기반 | 버전 기반 | 상태 기반 | 상태 기반 |
| 포맷 | SQL / Java | XML·YAML·SQL | Python | Prisma DSL |
| 자동 생성 | 없음 | 없음 | ORM diff | Schema diff |
| 롤백 | 없음 (유료) | 명시적 지원 | downgrade() | 없음 |
| 학습 비용 | 낮음 | 중간 | 중간 | 낮음 |
| 생태계 | JVM (any) | JVM (any) | Python | Node/TS |

---

## Flyway 동작 원리

```
1. DB에 flyway_schema_history 테이블 자동 생성
2. migrations/ 폴더에서 V{버전}__{설명}.sql 파일 탐색
3. 체크섬으로 기존 적용 파일 변조 감지 (멱등성 보장)
4. 미적용 파일만 순서대로 실행

flyway_schema_history
| version | description   | checksum   | success |
|---------|---------------|------------|---------|
| 1       | create users  | 1234567890 | true    |
| 2       | add phone     | 0987654321 | true    |
```

---

## Flyway 주요 한계

```
1. 롤백 없음 (Community 버전)
   → 실수한 V2를 되돌리려면 V3에서 수동으로 복구

2. 버전 번호 충돌 (팀 협업)
   → 브랜치 A: V3__add_phone.sql
   → 브랜치 B: V3__add_address.sql  ← 충돌
   → 해결: 타임스탬프 버전 사용 (V20260315143022__...)

3. 네이밍 규칙 실수 시 조용히 스킵
   → V1_create.sql  (언더스코어 하나)   → 무시됨, 오류 없음
   → v1__create.sql (소문자 v)          → Linux에서 무시됨
```

---

## 안전한 컬럼 추가 패턴 (Expand-Contract)

```sql
-- 1단계: Nullable로 추가 (기존 row 락 없음)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- 2단계: 앱 배포 후 데이터 채움 (배치)
UPDATE users SET phone = '' WHERE phone IS NULL;

-- 3단계: NOT NULL 제약 추가 (2차 배포)
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;

-- 절대 금지: 한 번에 NOT NULL + 기본값 없이 추가
-- → 대용량 테이블에서 전체 row 업데이트 → 테이블 락
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NOT NULL;  ❌
```

---

## 관련 본질

- [[본질-코드와 상태의 비대칭성 (Code-State Asymmetry)]] — 마이그레이션 툴이 필요한 근본 이유
- [[본질-멱등성 (Idempotency)]] — 체크섬 검증으로 중복 실행 방지
- [[본질-환경 격리 (Environment Isolation)]] — Schema Drift 방지가 목표

---

## 관련 개념

- [[개념-Flyway]]
