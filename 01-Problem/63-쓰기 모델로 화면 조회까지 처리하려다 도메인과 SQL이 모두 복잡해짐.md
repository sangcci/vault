---
aliases: [Command Query Model Confusion, CQRS Overuse Underuse]
tags: [문제, 작성중, Backend, Architecture]
difficulty: Medium
type: Problem
---

# Problem: 63-쓰기 모델로 화면 조회까지 처리하려다 도메인과 SQL이 모두 복잡해짐

## 상황

도메인 Aggregate와 Repository를 모든 API에서 재사용하려 한다. 상태 변경에는 좋지만, 목록/상세 화면 조회에서는 여러 테이블 join, 정렬, 필터, 통계 필드가 필요해 도메인 모델과 조회 SQL이 동시에 복잡해진다.

```text
Command usecase
  Aggregate 복원 -> 규칙 검증 -> 상태 변경

Query API
  화면에 필요한 projection -> join/filter/sort/page
```

---

## 관찰된 증거

- 목록 조회를 위해 Aggregate를 대량 로딩한다.
- N+1이나 불필요한 Entity graph가 늘어난다.
- 조회용 DTO 요구가 도메인 객체 필드를 오염시킨다.
- Repository가 command 저장과 화면 조회를 모두 떠안는다.
- 단순 조회까지 과하게 CQRS를 적용해 파일만 늘어난다.

---

## 원인

쓰기 모델은 규칙과 불변식을 보호하기 위한 모델이고, 조회 모델은 화면 요구와 성능을 만족하기 위한 모델이다. 둘의 변경 이유가 다르면 분리할 수 있지만, 모든 기능에 무조건 분리하면 복잡도만 증가한다.

---

## 해결 방향

- 상태 변경 usecase는 Aggregate/Repository를 사용한다.
- 복잡한 목록·상세 조회는 Finder/QueryPort/Projection으로 분리한다.
- 단순 CRUD 조회는 굳이 CQRS를 적용하지 않는다.
- read model이 별도 저장소라면 정합성 지연을 API 계약에 반영한다.
- 분리 기준은 “데이터가 같은가”가 아니라 “변경 이유가 다른가”로 본다.

---

## 연결되는 본질

- [[본질-명령 모델과 조회 모델의 변경 이유 분리]]
- [[본질-변경 이유와 경계]]
- [[본질-유스케이스 흐름과 도메인 책임 분리]]

---

## 참고

> "At its heart is the notion that you can use a different model to update information than the model you use to read information." — [Martin Fowler, CQRS](https://martinfowler.com/bliki/CQRS.html)

> "For some situations, this separation can be valuable, but beware that for most systems CQRS adds risky complexity." — [Martin Fowler, CQRS](https://martinfowler.com/bliki/CQRS.html)
