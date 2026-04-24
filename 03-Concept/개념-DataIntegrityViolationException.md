---
aliases: [DataIntegrityViolationException, DB 제약 위반 예외, ConstraintViolationException]
tags: [개념, 검증됨]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Spring이 DB 제약 위반(Unique, FK, NOT NULL 등)을 벤더 중립적으로 추상화한 런타임 예외.
> (이해용) DB 엔진이 던지는 다양한 제약 위반 예외를 Spring이 하나의 타입으로 묶어준 포장지.

## 해결하는 문제

- DB 벤더(MySQL, PostgreSQL, H2 등)마다 다른 예외 클래스를 통일된 타입으로 catch 가능
- `DataAccessException` 계층 구조로 일관된 예외 처리 체계 유지

## 치르는 비용

- 원인이 Unique 위반인지 FK 위반인지 알려면 cause chain을 직접 파야 함
- `message` 파싱은 DB 벤더마다 포맷이 달라 위험 → Hibernate 표준 API 사용 필요
- H2는 `getConstraintName()` null 반환 케이스 있어 fallback 처리 필요

## 동작 원리

### 예외 계층 구조

```
DataAccessException (Spring 추상)
  └── NonTransientDataAccessException
        └── DataIntegrityViolationException   ← catch 대상
              └── cause: org.hibernate.exception.ConstraintViolationException
                    └── cause: java.sql.SQLIntegrityConstraintViolationException (JDBC)
```

### 원인별 분류

```
DataIntegrityViolationException 발생 원인:
  ├── Unique Key 위반   → WARN 로깅, 409 응답
  ├── FK 위반           → WARN 로깅, 400/409 응답
  ├── NOT NULL 위반     → WARN 로깅, 400 응답
  └── 미분류            → ERROR 로깅, 500 응답
```

### 제약명 추출 (권장 패턴)

```kotlin
val constraintName = (e.cause?.cause as? ConstraintViolationException)
    ?.constraintName       // Hibernate 표준 API — DB 벤더 중립
    ?.uppercase()
    ?: e.rootCause?.message  // H2 fallback: getConstraintName() null 반환 시

when {
    constraintName?.contains("UK_CONCERT_NAME") == true ->
        throw CustomException(DUPLICATED_CONCERT)
    else -> throw e
}
```

### flush 타이밍과의 관계

```
이 예외는 flush 시점에 발생함
→ 명시적 flush() 없이 @Transactional commit 시 발생하면 catch 블록 우회
→ 반드시 [[개념-JPA Flush 타이밍]] 참고
```

## 관련 본질

- [[본질-원자성 (Atomicity)]] — DB 제약은 트랜잭션 원자성의 DB 수준 보장 장치
- [[개념-JPA Flush 타이밍]] — 예외 발생 시점 제어
- [[판단기준-예외 처리 레이어 설계]] — 어느 레이어에서 이 예외를 처리할 것인가
