---
aliases: [API Boundary by Reason to Change, Admin Customer API Coupling, Change Boundary]
tags: [문제, 작성중, API, Architecture]
difficulty: Medium
type: Problem
---

# Problem: 28-같은 데이터를 다룬다는 이유로 고객 API와 관리자 API를 합쳐 변경이 꼬임

## 상황

고객 API와 관리자 API가 같은 `Product`, `Review`, `Order` 데이터를 다룬다는 이유로 같은 endpoint, DTO, service를 공유한다.

```text
/products/{id}
  ├─ 고객 상품 상세 조회
  ├─ 관리자 검수 상태 조회
  ├─ 운영 메모 수정
  └─ 정산용 필드 조회
```

처음에는 중복이 줄어든 것처럼 보인다. 하지만 고객 UX 변경과 운영 정책 변경이 같은 DTO/service를 건드리면서 API 버전과 조건문이 늘어난다.

---

## 관찰된 증거

- 고객 화면 변경 때문에 관리자 응답 필드가 영향을 받는다.
- Admin 전용 권한, 감사 로그, 검색 조건이 고객 API service에 들어간다.
- DTO에 고객용/관리자용 nullable field가 섞인다.
- 고객 API의 latency 요구와 관리자 API의 무거운 조회 요구가 충돌한다.
- “같은 데이터니까 같이 쓰자”로 만든 API가 V2/V3로 빠르게 늘어난다.

---

## 의심 문제

가장 가능성 높은 문제는 **경계를 데이터 이름 기준으로 나누고, 변경 이유 기준으로 나누지 않은 것**이다.

같은 데이터를 다뤄도 사용하는 행위자, 권한, 트래픽, 장애 영향, 변경 주기가 다르면 다른 유지보수 단위로 보는 편이 안전하다.

---

## 원인

```text
같은 Product 데이터
  ├─ 고객: UX, 성능, 공개 스펙 안정성 때문에 변경
  ├─ 관리자: 운영 정책, CS, 검수, 권한 때문에 변경
  ├─ 정산: 회계/수수료 정책 때문에 변경
  └─ 검색: 색인/노출 정책 때문에 변경

같은 데이터 ≠ 같은 변경 이유
```

API 경계, DTO 경계, service 경계는 모두 변경 경계가 코드로 드러난 형태다.

```text
변경 이유가 다름
  ↓
같은 endpoint/DTO/service에 묶임
  ↓
서로 다른 요구가 조건문으로 누적
  ↓
결합도 증가
```

---

## 확인 방법

- API 사용자가 고객/관리자/정산/검색 등 서로 다른지 확인한다.
- 변경 요청자가 고객 UX, 운영 정책, 회계 정책처럼 다른지 확인한다.
- 권한, 감사 로그, timeout, rate limit, cache 정책이 다른지 본다.
- 한쪽 변경이 다른 쪽 DTO나 테스트를 깨는지 확인한다.
- URL prefix만 나뉘고 내부 service/DTO가 완전히 공유되는지 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 행위자별 API 분리 | 변경 이유 명확 | endpoint/DTO 증가 |
| 조회 DTO 분리 | 응답 변경 영향 축소 | mapping 코드 증가 |
| service/usecase 분리 | 권한/정책 분리 | 공통 로직 추출 기준 필요 |
| 내부 공통 query component 사용 | 중복 감소 | 다시 결합되지 않게 주의 |
| BFF/화면별 조합 | UI 변경 대응 쉬움 | 요청 수/조합 복잡도 증가 |

---

## 트레이드오프

중복을 줄이려고 경계를 합치면 변경 이유가 다른 요구가 한 코드에 모인다. 반대로 무조건 나누면 DTO와 endpoint가 늘어난다. 기준은 데이터가 같은지가 아니라 함께 바뀌어도 되는지다.

---

## 연결되는 본질

- [[본질-변경 이유와 경계]]
- [[본질-변경 이유와 경계]]
- [[본질-변경 이유와 경계]]

---

## 참고

> "The Single Responsibility Principle (SRP) states that each software module should have one and only one reason to change." — [Clean Coder Blog: The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

> "X is coupled to Y if a change to Y can potentially require a change in X" — [SEforSDL: Software Design Fundamentals](http://se-education.org/se-book/designFundamentals/index.html)
