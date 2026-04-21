---
aliases: [Repository Pattern, 리포지토리 패턴]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 도메인 레이어와 데이터 접근 레이어 사이를 중재하는, 컬렉션과 같은 인터페이스로 도메인 객체 접근을 제공하는 패턴. (Martin Fowler, PoEAA 2002 / Eric Evans, DDD 2003)
> (이해용) DB가 MySQL이든 MongoDB든 Entity는 모르고, Repository라는 창구 하나만 알면 되는 구조.

## 해결하는 문제

- Entity가 DB 접근 방식(SQL, ORM, DataSource)을 알게 되면 인프라 변경 시 도메인 코드를 수정해야 함
- Entity는 여러 레이어(Controller, Service, Repository)에서 공유되는 객체 → 어느 레이어에도 종속되면 안 됨

## 치르는 비용

- 클래스 수 증가 (Entity + Repository 인터페이스 + 구현체)
- 단순 CRUD 앱에서는 과한 구조일 수 있음 → Active Record 패턴이 대안

## 의존 방향

```
Controller
    ↓
Service        ← Repository 알아도 됨 (같은 애플리케이션 레이어)
    ↓
Repository     ← DataSource, JPA, SQL 담당
    ↓
DB

Entity         ← 레이어를 가로지르는 순수 도메인 객체
               ← 누군가를 의존하는 순간 그 레이어에 종속됨
```

Entity가 Repository를 알면:
- Entity는 더 이상 순수 도메인 객체가 아님
- 저장소 교체 시 Entity 수정 필요
- 테스트 시 DB 없이 Entity 단독 테스트 불가

## Repository는 프레임워크 진입점이다

```java
// Spring Data JPA
interface UserRepository extends JpaRepository<User, Long> { }
```

`JpaRepository`를 상속하는 순간 Spring 컨테이너, Hibernate, DataSource가 모두 연결됨.
이 의존성을 Entity 안으로 끌어들이면 도메인 객체가 프레임워크에 오염됨.

```java
// Entity 안에서 DI를 받으려면 아래 중 하나를 선택해야 함
class User {
    // 방법 1: static 필드 → 구현체 고정
    static UserRepository repository = new MySQLUserRepository();

    // 방법 2: 파라미터 주입 → 호출부가 이상해짐
    static User load(Long id, UserRepository repo) { ... }

    // 방법 3: 컨텍스트에서 꺼내기 → Spring이 도메인에 침투
    static User load(Long id) {
        return ApplicationContext.getBean(UserRepository.class).findById(id);
    }
}
```

어떤 방법도 Entity를 인프라에 종속시킴.

## Active Record와의 비교

| | Repository 패턴 | Active Record |
|---|---|---|
| DB 접근 위치 | 별도 Repository 클래스 | Entity 내부 |
| 테스트 | Mock 교체 가능 | DB 없이 테스트 어려움 |
| 저장소 교체 | Repository만 수정 | Entity 수정 필요 |
| 코드량 | 많음 | 적음, 직관적 |
| 적합한 규모 | 복잡한 도메인 로직 | 단순 CRUD 앱 |
| 사용 예 | Spring Data JPA | Rails, Laravel |

## 관련 본질

- [[본질-관심사의 분리 (Separation of Concerns)]]
- [[본질-간접 참조 (Indirection)]]

## 관련 개념

- [[판단기준-추상화 계층 추가 기준]]
- [[탐구-왜 Entity는 Repository를 의존하면 안 되는가]]
