---
aliases: [Flyway, DB Migration Tool, 플라이웨이]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) SQL 파일을 버전 번호로 관리하고 미적용 파일을 순서대로 실행해 스키마를 일관되게 유지하는 마이그레이션 도구.
> (이해용) "스키마 변경 이력을 Git처럼 버전으로 추적하고, 어느 환경에서든 같은 순서로 재현하는 도구."

## 해결하는 문제

- 팀원마다 다른 DB 스키마 상태 → 공유 이력으로 동기화
- 배포 환경(dev·staging·prod)마다 스키마가 달라지는 문제

## 치르는 비용

- 한 번 적용된 파일 수정 불가 — 체크섬 검증으로 감지 후 실행 거부
- 마이그레이션 실패 시 수동 repair 필요 (특히 MySQL — 트랜잭션 DDL 미지원)

## 동작 원리

**파일 명명 규칙:**
```
V{버전}__{설명}.sql

V1__create_users_table.sql
V2__add_email_index.sql
V3__create_orders_table.sql
```

**실행 흐름:**
```
애플리케이션 시작
   ↓
DataSource 초기화
   ↓
Flyway.migrate() 호출
   ↓
flyway_schema_history 테이블 조회
   ↓
미적용 파일만 버전 순서대로 실행
   ↓
체크섬 저장 (기존 파일 변경 감지용)
   ↓
JPA EntityManagerFactory 초기화  ← Flyway 이후
```

**Spring Boot 초기화 순서:**
```
Flyway가 JPA보다 먼저 실행된다.
→ 스키마 생성: Flyway 담당
→ 스키마 검증: JPA (spring.jpa.hibernate.ddl-auto=validate)
→ 둘이 충돌하면 Flyway가 만든 테이블을 JPA가 다시 만들려 해서 오류 발생
```

**flyway_schema_history 구조:**
```
version | description          | checksum   | success
--------|----------------------|------------|--------
1       | create users table   | 1234567890 | true
2       | add email index      | 0987654321 | true
```

## 관련 본질

- [[본질-코드와 상태의 비대칭성 (Code-State Asymmetry)]]

## 관련 개념

- [[개념-스키마 마이그레이션 (Schema Migration)]]
- [[탐구-왜 코드 배포와 스키마 변경은 함께 관리해야 하는가]]
