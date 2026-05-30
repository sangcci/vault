---
aliases: [Lazy Loading, 프록시 지연 로딩, Hibernate Proxy]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 객체가 실제로 필요한 시점까지 DB 조회를 미루는 로딩 전략.
> (이해용) 빈 껍데기(프록시)를 먼저 돌려주고, 실제로 건드릴 때 DB에 다녀오는 것.

---

## 해결하는 문제

- Eager Loading: 연관 엔티티를 항상 함께 조회 → 사용하지 않아도 DB 왕복 발생
- 지연 로딩: 실제 접근 시점까지 조회 미룸 → 불필요한 쿼리 제거

---

## 치르는 비용

- 프록시 초기화 시점에 DB 조회 → 순회 컨텍스트에서 N+1 문제 유발 가능 ([[개념-N+1 문제 (N+1 Query Problem)]])
- 영속성 컨텍스트 종료 후 접근 시 `LazyInitializationException` 발생

---

## 동작 원리

```
findById(1L) 호출
    ↓
실제 User 로드 안 함
UserProxy 즉시 반환  ← User를 상속한 빈 껍데기
    ↓
user.getTeam() 호출  ← 처음 접근하는 시점
    ↓
"아직 초기화 안 됐네" → SELECT * FROM team WHERE id=?
    ↓
데이터 채움 → 결과 반환
```

---

## 프록시 구현 방식

Hibernate가 런타임에 원본 클래스를 **상속**해서 메서드를 가로채는 서브클래스를 동적으로 생성.

```java
// 원본
class User {
    Team team;
    Team getTeam() { return team; }
}

// Hibernate가 ByteBuddy로 런타임에 생성하는 프록시
class User$HibernateProxy extends User {
    boolean initialized = false;
    EntityLoader loader;

    @Override
    Team getTeam() {
        if (!initialized) {
            User real = loader.load(id);  // DB 조회
            this.team = real.team;
            initialized = true;
        }
        return super.getTeam();
    }
}
```

| 도구 | 설명 |
|---|---|
| ByteBuddy | 현재 Hibernate(5.x~)에서 사용 |
| cglib | 이전 방식, 클래스 상속 기반 |
| Javassist | 구버전 방식 |
| java.lang.reflect.Proxy | Java 표준, 인터페이스만 가능 |

---

## 프록시로 인한 제약

```java
// 1. final 클래스·메서드 불가
//    상속으로 override해야 하는데 final이면 막힘
final class User { }  // 프록시 생성 불가

// 2. 기본 생성자 필요
//    프록시 객체 생성 시 super() 호출
class User {
    protected User() { }  // 없으면 오류
}

// 3. 타입 비교 주의
user.getClass() == User.class  // false → User$HibernateProxy
user instanceof User           // true
```

---

## 관련 본질

- [[본질-제어의 역전 (Inversion of Control)]] — "언제 로딩할지"의 제어권이 호출자가 아닌 프록시에게 있음
- [[본질-간접 참조 (Indirection)]] — 실제 객체 앞에 프록시라는 중간 층을 두는 구조
