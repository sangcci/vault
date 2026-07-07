---
aliases: [JPA Flush Timing Exception, DataIntegrityViolationException Commit, Transactional Catch Failure]
tags: [문제, 작성중, JPA, Spring, Transaction]
difficulty: Medium
type: Problem
---

# Problem: 17-save 호출을 try-catch로 감쌌는데 DB 제약 예외를 잡지 못함

## 상황

중복 저장을 막기 위해 DB Unique Key를 걸어두고, 저장 코드에서 `DataIntegrityViolationException`을 잡으려고 한다.

```java
@Transactional
public void create(User user) {
    try {
        userRepository.save(user);
    } catch (DataIntegrityViolationException e) {
        throw new DuplicateUserException();
    }
}
```

하지만 중복 데이터가 들어와도 catch 블록이 실행되지 않고, 메서드 밖에서 예외가 터진다.

---

## 관찰된 증거

```text
@Transactional method 진입
  ↓
repository.save(entity)
  ↓
영속성 컨텍스트에 등록만 됨
  ↓
try-catch 블록 정상 통과
  ↓
메서드 종료
  ↓
@Transactional proxy가 commit 전 flush
  ↓
DB unique constraint violation 발생
  ↓
catch 블록 밖에서 예외 발생
```

증상은 다음과 같다.

- `save()` 직후에는 SQL이 실행되지 않는다.
- DB 제약 위반 예외가 서비스 메서드 내부 catch가 아니라 트랜잭션 commit 과정에서 발생한다.
- `saveAndFlush()` 또는 `entityManager.flush()`를 넣으면 catch가 동작한다.

---

## 의심 문제

가장 가능성 높은 문제는 **JPA flush 타이밍과 트랜잭션 commit 시점을 혼동한 것**이다.

`save()`는 곧바로 DB에 SQL을 보내는 명령이라기보다, 영속성 컨텍스트에 변경을 등록하는 동작에 가깝다. 실제 SQL은 flush 시점에 나간다.

---

## 원인

Spring의 JPA 트랜잭션은 현재 thread에 실제 EntityManager를 바인딩하고, 주입된 EntityManager/Repository는 그 문맥 안에서 동작한다. JPA는 쓰기 지연을 사용하므로 SQL 실행과 Java 메서드 호출 시점이 분리된다.

```text
Application Service
  ↓ save()
Persistence Context
  ↓ write-behind queue
flush 시점
  ↓ SQL 전송
DB constraint check
```

flush는 보통 다음 시점에 발생한다.

```text
- 트랜잭션 commit 직전
- JPQL/Criteria 쿼리 실행 직전
- 명시적 entityManager.flush()
```

따라서 예외를 특정 try-catch 안에서 처리해야 한다면, 그 블록 안에서 flush까지 발생시켜야 한다.

---

## 확인 방법

- SQL 로그에서 `save()` 직후 INSERT/UPDATE가 실행되는지 확인한다.
- 예외 stack trace가 service method 내부인지, transaction interceptor commit 경로인지 본다.
- `entityManager.flush()`를 try 블록 안에 넣었을 때 예외 위치가 바뀌는지 확인한다.
- 예외 처리 정책이 application service 계층에 있어야 하는지, 전역 exception handler에서 처리해도 되는지 결정한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/위험 |
|---|---|---|
| 명시적 `flush()` | 원하는 위치에서 DB 제약 예외 포착 | DB 왕복 시점이 앞당겨짐 |
| `saveAndFlush()` | repository API로 간단히 처리 | 과도하게 쓰면 성능 저하 |
| 전역 exception handler 처리 | 트랜잭션 commit 예외도 일관 처리 | usecase별 세밀한 분기 어려움 |
| 사전 존재 검사 + Unique Key | 사용자 메시지 개선 | race condition은 Unique Key가 최종 방어 |
| Application Service에서 예외 변환 | usecase 문맥 반영 | flush 타이밍 이해 필요 |

---

## 트레이드오프

쓰기 지연은 성능과 일관된 변경 감지를 위해 유리하지만, 예외 발생 위치를 직관과 다르게 만든다. 예외를 어디서 비즈니스 예외로 바꿀지 정하려면 트랜잭션 commit과 flush 시점을 함께 설계해야 한다.

---

## 연결되는 본질

- [[본질-스레드 바인딩 트랜잭션 문맥]]
- [[본질-유스케이스 조립과 트랜잭션 경계]]
- [[본질-원자적 상태 전이]]

---

## 참고

> "The injected JPA EntityManager ... delegates all calls to the current transactional EntityManager" — [Spring Framework Reference: JPA](https://docs.spring.io/spring-framework/reference/data-access/orm/jpa.html)

> "Central delegate that manages resources and transaction synchronizations per thread." — [Spring Framework Javadoc: TransactionSynchronizationManager](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/support/TransactionSynchronizationManager.html)
