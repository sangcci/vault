---
aliases: [Command Query Separation, CQRS, Command Query Responsibility Segregation]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) Command Query 분리는 상태를 변경하는 모델과 조회하는 모델을 분리해 각각의 목적에 맞게 설계하는 방식이다.
> (이해용) 쓰기는 규칙을 지키는 길이고, 읽기는 화면이 빨리 원하는 모양으로 보는 길이다.

---

## 해결하는 문제

- 저장용 aggregate와 화면 조회용 projection 요구가 충돌하는 문제.
- command repository가 복잡한 목록/상세 조회까지 떠안는 문제.
- 성능을 위해 조회 SQL을 최적화하고 싶은데 domain model에 억지로 맞추는 문제.

```text
command side
Repository -> Aggregate 복원/저장

query side
FinderPort -> Summary/Detail projection 조회
```

---

## 치르는 비용

- 모델과 port가 늘어난다.
- 단순 조회까지 분리하면 복잡도만 커진다.
- read model과 write model의 정합성 지연을 설명해야 할 수 있다.

---

## 동작 원리

```java
// command
Rent rent = rentRepository.get(rentId);
rent.close();
rentRepository.save(rent);

// query
RentDetailResult result = rentFinderPort.findDetail(rentId);
```

command는 업무 규칙과 상태 변경을 보호한다. query는 API 화면 요구와 성능 최적화에 맞춘다.

---

## 관련 본질

- [[본질-정합성과 무결성의 차이]]
- [[본질-모듈성 (Modularity)]]
- [[판단기준-Application Domain Implementation 경계]]

---

## 참고

> "At its heart is the notion that you can use a different model to update information than the model you use to read information." — [Martin Fowler, CQRS](https://martinfowler.com/bliki/CQRS.html)

> "For some situations, this separation can be valuable, but beware that for most systems CQRS adds risky complexity." — [Martin Fowler, CQRS](https://martinfowler.com/bliki/CQRS.html)
