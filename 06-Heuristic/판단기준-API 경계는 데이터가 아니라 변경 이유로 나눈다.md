---
aliases: [API Boundary by Reason to Change, API 경계, Admin API 분리, 일반 API와 Admin API]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준

- API 경계는 같은 데이터를 반환하거나 수정하는지가 아니라, 같은 행위자와 변경 이유를 가지는지를 기준으로 나눈다.
- 일반 사용자 API와 Admin API는 같은 도메인 데이터를 다루더라도 사용자, 권한, 트래픽, 장애 영향, 변경 라이프사이클이 다르다.
- 서로 다른 변경 라이프사이클을 하나의 API에 묶으면 고객 UX 변경과 운영 정책 변경이 같은 유지보수 단위에 누적된다.
- 트래픽 분산은 중요한 장점이지만, 더 근본적인 이유는 API의 유지보수 라이프사이클을 분리하는 것이다.

> "The Single Responsibility Principle (SRP) states that each software module should have one and only one reason to change." — [Clean Coder Blog, The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

---

## 판단 흐름

```text
Product API를 설계한다
│
├─ 같은 데이터를 다루는가?
│  └─ 예: Product, Review, User
│
├─ 같은 행위자가 쓰는가?
│  ├─ 고객
│  ├─ 관리자
│  ├─ 정산 담당자
│  └─ 검색/추천 시스템
│
├─ 같은 이유로 바뀌는가?
│  ├─ 고객 UX / 성능 / 공개 스펙
│  ├─ 운영 정책 / CS / 검수 / 권한
│  ├─ 수수료 / 회계 / 정산 기준
│  └─ 색인 / 추천 점수 / 노출 정책
│
└─ 다르면 API 경계 분리
```

```pseudo
function designApiBoundary(apiUseCases):
    if apiUseCases.shareSameDataOnly:
        return "분리 검토"

    if apiUseCases.haveDifferentActors:
        return "API 경계 분리 우선"

    if apiUseCases.changeForDifferentReasons:
        return "API 경계 분리 우선"

    if apiUseCases.needDifferentAuthTrafficFailurePolicy:
        return "API 경계 분리 우선"

    return "같은 API로 묶어도 됨"
```

---

## 일반 API와 Admin API 분리

Admin API를 일반 API와 분리하는 핵심 이유는 단순히 URL prefix가 다르거나 권한이 다르기 때문만은 아니다. 더 본질적으로는 **사용자와 변경 이유가 달라 유지보수 라이프사이클이 다르기 때문**이다.

```text
일반 사용자 API
├─ 사용자: 고객
├─ 변경 이유: UX, 성능, 공개 스펙 안정성
├─ 트래픽: 많음
├─ 장애 영향: 고객 경험 직접 영향
└─ 관심사: 빠른 조회, 캐시, 하위 호환성

Admin API
├─ 사용자: 운영자, CS, 검수자
├─ 변경 이유: 운영 정책, 내부 업무 흐름, 권한, 감사 로그
├─ 트래픽: 적지만 무거운 조회/수정 가능
├─ 장애 영향: 내부 운영 업무 영향
└─ 관심사: 권한, 감사 로그, 복잡한 검색, 엑셀 다운로드
```

같은 `Product`나 `Review`를 다루더라도 일반 API는 고객 경험을 위해 바뀌고, Admin API는 운영 정책을 위해 바뀐다. 이 둘을 하나의 API로 묶으면 고객 화면 변경과 운영 업무 변경이 서로의 코드에 영향을 준다.

---

## 예시

### 나쁜 기준: Product 데이터라서 하나의 API로 묶는다

```text
/api/products
├─ 고객 상품 상세 조회
├─ 관리자 상품 상태 변경
├─ 관리자 검수 메모 수정
├─ 정산용 판매 정보 조회
└─ 검색 색인용 필드 조회
```

문제는 `Product`라는 데이터가 같다는 이유로 서로 다른 변경 이유가 한 API에 섞인다는 점이다.

### 좋은 기준: 변경 이유와 행위자별 API 경계

```text
/customer/products
└─ 고객 조회, 구매 흐름, 캐시, 공개 스펙

/admin/products
└─ 운영자 수정, 검수, 권한, 감사 로그

/settlement/products
└─ 정산 기준, 수수료, 판매 집계

/search-index/products
└─ 색인 필드, 검색 노출 정책
```

API 경계를 나누면 각 API가 자기 행위자와 변경 이유에 맞춰 독립적으로 진화할 수 있다.

---

## 효과적인 상황

- Admin API와 일반 사용자 API를 같은 컨트롤러나 endpoint에 둘지 고민할 때.
- 같은 도메인 데이터를 여러 행위자가 서로 다른 목적으로 사용할 때.
- 권한, 감사 로그, 트래픽 패턴, timeout, rate limit 정책이 다를 때.
- 고객 API의 안정성과 운영 API의 빠른 변경을 동시에 만족해야 할 때.

---

## 실패하는 상황

- 같은 데이터를 쓴다는 이유로 API를 하나로 합치면, 서로 다른 변경 이유가 같은 endpoint와 DTO에 누적된다.
- Admin의 무거운 조회나 내부 정책 변경이 고객 API의 지연시간과 안정성 요구를 침범할 수 있다.
- 반대로 변경 이유가 같은 API까지 과하게 나누면 endpoint, DTO, 권한 설정, 문서화 비용이 증가한다.
- URL prefix만 나누고 내부 service/DTO가 완전히 공유되면 실제 변경 경계는 분리되지 않을 수 있다.

---

## 판단 질문

| 질문 | 의미 |
|---|---|
| 같은 데이터라서 묶는가, 같은 변경 이유라서 묶는가? | API 경계 기준 점검 |
| API를 사용하는 행위자가 다른가? | 고객·관리자·정산·검색 등 사용자 차이 |
| 권한과 감사 로그 요구가 다른가? | Admin API 분리 필요성 |
| 트래픽 패턴과 timeout이 다른가? | 운영 정책 분리 필요성 |
| 한쪽 변경이 다른쪽 DTO나 endpoint 변경을 강제하는가? | 결합도 확인 |
| URL만 나뉘었는가, 유지보수 단위도 나뉘었는가? | 형식적 분리 여부 확인 |

---

## 관련 노트

- [[판단기준-변경 경계는 데이터가 아니라 변경 이유로 나눈다]]
- [[판단기준-UI 조회 API는 변경 가능성 기준으로 분리한다]]
- [[본질-응집도와 결합도 (Cohesion and Coupling)]]
- [[본질-관심사의 분리 (Separation of Concerns)]]
- [[본질-의존성 방향 (Dependency Direction)]]
