---
aliases: [N+1 Query Problem, Lazy Loading Query Explosion, 목록 조회 SQL 폭증]
tags: [문제, 작성중, JPA, ORM, 성능]
difficulty: Medium
type: Problem
---

# Problem: 04-목록 조회 API에서 연관 데이터 접근으로 SQL이 폭증함

## 상황

목록 조회 API에서 부모 엔티티 목록을 먼저 조회한 뒤, 응답 DTO를 만들면서 각 엔티티의 연관 컬렉션이나 연관 객체에 접근한다.

```java
List<Post> posts = postRepository.findAll();

return posts.stream()
    .map(post -> new PostResponse(
        post.getTitle(),
        post.getComments().size()   // 여기서 지연 로딩 초기화
    ))
    .toList();
```

코드만 보면 단순한 목록 조회처럼 보이지만, 실제 SQL은 부모 목록 1회 + 부모 수만큼의 연관 데이터 조회로 늘어난다.

---

## 관찰된 증거

```text
요청 1회
  ↓
SELECT * FROM post;                       -- 1회
  ↓
for each post
  ├─ SELECT * FROM comment WHERE post_id=? -- N회
  ├─ SELECT * FROM comment WHERE post_id=?
  └─ SELECT * FROM comment WHERE post_id=?
```

확인할 수 있는 증거는 다음과 같다.

- Hibernate SQL 로그에서 같은 패턴의 `SELECT ... WHERE foreign_key = ?`가 반복된다.
- 데이터가 10건일 때보다 100건일 때 응답 시간이 선형 또는 그 이상으로 증가한다.
- DB 커넥션 사용 시간과 네트워크 왕복 횟수가 증가한다.

---

## 의심 문제

가장 가능성 높은 문제는 **지연 로딩 기반 N+1 쿼리**다.

연관관계를 Lazy로 둔 것 자체가 문제라기보다, 목록 순회 중 연관 데이터를 건드리는 조회 시나리오와 결합될 때 문제가 된다.

---

## 원인

ORM은 연관 데이터를 항상 즉시 가져오지 않고, 필요한 시점까지 조회를 미룰 수 있다. 이 덕분에 불필요한 조회는 줄어들지만, 목록 순회 안에서 연관 데이터에 접근하면 각 행마다 별도 SQL이 발생한다.

```text
목록 조회
  ↓
엔티티 N개 반환
  ↓
응답 변환 중 연관 필드 접근
  ↓
프록시/컬렉션 초기화
  ↓
N번의 추가 SELECT
```

핵심은 조회 의도를 SQL에 명시하지 않고 객체 탐색에 맡긴 점이다. API 응답에 필요한 데이터가 정해져 있는데도, 쿼리 설계가 그 모양을 반영하지 못하면 ORM 추상화 뒤에서 SQL이 폭증한다.

---

## 확인 방법

- Hibernate SQL 로그 또는 p6spy로 실제 발생 SQL 개수를 센다.
- 테스트 데이터 수를 10건, 100건, 1000건으로 늘려 쿼리 수와 응답 시간을 비교한다.
- API 응답 필드가 어떤 연관관계를 요구하는지 DTO 기준으로 역추적한다.
- `EXPLAIN` 이전에 먼저 “쿼리 하나가 느린가, 쿼리 개수가 많은가”를 구분한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/위험 |
|---|---|---|
| Fetch Join | 필요한 연관 데이터를 한 번에 가져올 수 있음 | 컬렉션 조인 시 중복 row, 페이징 제약, 카테시안 곱 위험 |
| Batch Size | N개의 개별 조회를 `IN (...)` 묶음 조회로 줄임 | batch 크기 튜닝 필요, 근본적으로 응답 모양을 명시하는 방식은 아님 |
| EntityGraph | 조회 시점에 필요한 연관 로딩 계획을 선언 가능 | 복잡한 화면별 조회에서는 관리 포인트 증가 |
| DTO Projection | API 응답에 필요한 컬럼만 직접 조회 | 영속성 컨텍스트의 객체 그래프 편의 감소 |
| 쿼리 분리 | 부모 목록과 연관 집계를 별도 쿼리로 명시 | 애플리케이션 조립 코드 필요 |

---

## 트레이드오프

N+1을 없애려고 모든 연관관계를 즉시 로딩으로 바꾸면 다른 화면에서 불필요한 JOIN과 데이터 중복이 생긴다.

따라서 기본 연관관계는 보수적으로 두고, **조회 API 단위로 필요한 데이터 모양을 명시**하는 쪽이 안전하다. 성능 문제는 `LAZY` 자체보다 “조회 시나리오와 쿼리 모양의 불일치”에서 시작된다.

---

## 연결되는 본질

- [[본질-지연 로딩과 조회 폭발]]
- [[본질-연관 방향과 변경 경계]]
- [[본질-공유 자원 점유와 대기열]]

---

## 참고

> "'now' is generally termed eager or immediate. 'later' is generally termed lazy or delayed." — [Hibernate ORM User Guide: Fetching](https://docs.hibernate.org/orm/5.2/userguide/html_single/chapters/fetching/Fetching.html)

> "SELECT Performs a separate SQL select to load the data. This can either be EAGER ... or LAZY ... This is the strategy generally termed N+1." — [Hibernate ORM User Guide: Fetching](https://docs.hibernate.org/orm/5.2/userguide/html_single/chapters/fetching/Fetching.html)
