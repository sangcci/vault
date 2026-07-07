---
aliases: [API Parameter DTO Naming Confusion, Domain Language Boundary]
tags: [문제, 작성중, API, Design]
difficulty: Low
type: Problem
---

# Problem: 69-API와 DTO 이름을 기술 기준으로 정해 도메인 의미가 흐려짐

## 상황

API를 만들 때 단건 식별자와 목록 필터를 모두 path variable로 넣거나, Entity와 DTO 변환을 전부 Mapper라고 부른다. Mapping table 이름도 두 테이블 이름을 습관적으로 붙여서, 코드 이름만 봐서는 어떤 도메인 관점인지 알기 어렵다.

```text
나쁜 예
GET /users/{userId}/reservations/{status}/{page}
ProductCategory인지 CategoryProduct인지 기준 없음
모든 변환 클래스 이름이 XxxMapper
```

---

## 관찰된 증거

- 필터 조건이 추가될 때마다 endpoint가 늘어난다.
- DTO 변환, 타입 변환, 문자열 포맷팅 책임이 한 클래스에 섞인다.
- 연결 테이블 이름이 도메인 언어가 아니라 알파벳순/습관으로 결정된다.
- API와 DB 이름을 보고 업무 중심 개념을 추론하기 어렵다.

---

## 원인

인터페이스와 이름은 단순 문법이 아니라 사용자가 어떤 자원을 식별하는지, 어떤 조건으로 조회하는지, 팀이 어떤 개념을 중심으로 보는지를 드러내는 계약이다.

---

## 해결 방향

- 단건 자원 식별은 path variable, 검색·필터·페이징은 query parameter로 둔다.
- Converter/Formatter/Mapper는 변환 책임에 따라 이름을 분리한다.
- Mapping table 이름은 중심 도메인 개념과 팀 언어를 기준으로 정한다.
- API/DTO/Entity 이름은 구현 편의보다 변경 이유와 읽는 사람의 이해를 우선한다.

---

## 연결되는 본질

- [[본질-인터페이스 의미와 도메인 언어]]
- [[본질-변경 이유와 경계]]
- [[본질-함수적 종속과 사실의 소유권]]

---

## 참고

> "There are at least three main layer types: presentation, domain, and data source." — [Martin Fowler, Layering Principles](https://martinfowler.com/bliki/LayeringPrinciples.html)
