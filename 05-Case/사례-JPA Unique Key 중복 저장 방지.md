---
aliases: [JPA Unique Key 중복 저장, Duplicate Save Prevention, DataIntegrityViolationException]
tags: [사례, 검증됨]
type: Case
difficulty: Medium
---

## 상황

- Kotlin + JPA 환경에서 Concert 엔티티 저장 시 동일 이름 중복 저장 방지 요구
- DB에 `UK_CONCERT_NAME` Unique Key 제약 설정
- `@Transactional` 메서드 내에서 `DataIntegrityViolationException` catch 시도

## 실제 발생한 일

```kotlin
// 문제 — 예외가 catch 블록에 도달하지 않음
@Transactional
fun save(command: CreateConcertCommand) {
    try {
        concertRepository.save(Concert(command.name))
        // flush는 트랜잭션 종료 시점에 발생 → catch 블록 밖에서 예외 터짐
    } catch (e: DataIntegrityViolationException) {
        throw CustomException(DUPLICATED_CONCERT)
    }
}
```

JPA는 기본적으로 트랜잭션 commit 직전에 flush하므로, `save()` 호출 시점에는 SQL이 DB로 전송되지 않음. 예외 발생 지점이 `@Transactional` 프록시의 commit 단계여서 catch 블록을 우회함.

```
[잘못된 흐름]
save() 호출 → JPA 1차 캐시에만 적재 → commit → DB flush → UK 위반 → 예외 발생
                                                              ↑
                                                    이 시점엔 catch 범위 밖
```

## 근본 원인

- [[본질-원자성 (Atomicity)]] 보장 메커니즘과 JPA flush 타이밍의 충돌
- JPA의 지연 flush 전략: 성능 최적화를 위해 SQL 전송을 최대한 미룸

## 교훈 및 조치

**해결: Service에서 명시적 flush + try-catch**

```kotlin
@Transactional
fun save(command: CreateConcertCommand) {
    try {
        concertRepository.save(Concert(command.name))
        entityManager.flush() // 강제로 SQL 전송 → 이 시점에 UK 위반 예외 발생
    } catch (e: DataIntegrityViolationException) {
        val constraintName = (e.cause?.cause as? ConstraintViolationException)
            ?.constraintName?.uppercase()
            ?: e.rootCause?.message
        when {
            constraintName?.contains("UK_CONCERT_NAME") == true ->
                throw CustomException(DUPLICATED_CONCERT)
            else -> throw e
        }
    }
}
```

**레이어 단위로 해결 방법 찾기:**

```
DB Layer    → Unique Key 제약 (원천 차단, 최후 보루)
App Layer   → flush + try-catch + CustomException 변환
            → Lock (비관적/낙관적)
            → 멱등성 키
Infra Layer → Redis 분산 락 (다중 서버 환경)
```

각 레이어 해결책은 독립적으로 쓰이거나 조합 가능. DB 제약은 항상 마지막 방어선으로 유지.

**제약명 파싱 주의:**
- `message` 문자열 파싱은 DB 엔진마다 포맷이 달라 위험
- Hibernate 표준 API `ConstraintViolationException.getConstraintName()` 사용
- H2는 `getConstraintName()` null 반환 케이스 있음 → fallback 처리 필요

## 파생 판단기준

- [[판단기준-중복 저장 방지 방법 선택 (Unique Key vs Lock)]]
- [[판단기준-예외 처리 레이어 설계]]
