---
aliases: [JPA Flush, FlushModeType, 쓰기 지연, Write-Behind]
tags: [개념, 검증됨, JPA]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) JPA 영속성 컨텍스트가 쓰기 지연 SQL 저장소의 쿼리를 실제 DB로 전송하는 시점.
> (이해용) `save()`는 메모리에만 올려두고, flush가 호출될 때 비로소 DB에 SQL이 날아간다.

## 해결하는 문제

- DB 왕복 횟수 최소화: 여러 변경을 모아 한 번에 전송 (배치 최적화)
- 불필요한 중간 쿼리 제거: 동일 트랜잭션 내 여러 번 수정해도 최종 상태만 반영

## 치르는 비용

- **try-catch와 타이밍 불일치**: `save()` 직후 catch를 기대하면 flush 전이라 예외가 발생하지 않음
- **예외 발생 위치 역전**: DB 제약 위반 예외가 commit 단계에서 터지면 `@Transactional` 프록시 밖이라 catch 불가

## 동작 원리

### FlushModeType

```
FlushModeType.AUTO (기본값)
  ├── JPQL/Criteria 쿼리 실행 직전 (관련 엔티티 한정)
  └── 트랜잭션 commit 직전

FlushModeType.COMMIT
  └── 트랜잭션 commit 직전만 (JPQL도 flush 안 함)
```

### flush 타이밍과 예외 catch 관계

```
[AUTO 기본값 — try-catch 실패 케이스]

@Transactional
fun save() {
    try {
        repo.save(entity)          ← SQL은 1차 캐시에만 적재
    } catch (e: DIVE) { ... }      ← 이 시점엔 아직 SQL 미전송
}
// 메서드 종료 → @Transactional 프록시 → flush → commit
//                                        ↑ 여기서 UK 위반 예외 발생 → catch 밖

[명시적 flush — try-catch 성공 케이스]

@Transactional
fun save() {
    try {
        repo.save(entity)
        em.flush()                 ← 강제 SQL 전송 → 이 시점에 UK 위반 예외 발생
    } catch (e: DIVE) { ... }      ← 예외 catch 가능
}
```

## 관련 본질

- [[개념-JPA EntityManager]] — flush 포함 영속성 컨텍스트 전체 메커니즘
- [[본질-원자성 (Atomicity)]] — 트랜잭션 commit과 flush의 원자적 관계
- [[사례-JPA Unique Key 중복 저장 방지]] — flush 타이밍 문제의 실제 발생 사례
