---
aliases: [External API Test Leakage, WireMock Stubbing, Test Environment Isolation]
tags: [문제, 작성중, Test, API]
difficulty: Medium
type: Problem
---

# Problem: 58-테스트가 실제 외부 API를 호출해 느리고 불안정해짐

## 상황

결제, 알림, 인증 같은 외부 API 연동 테스트가 실제 서버를 호출한다. 네트워크 상태, 외부 서버 장애, 호출 제한, 테스트 데이터 오염 때문에 CI가 간헐적으로 실패한다.

```text
CI test
  -> real payment API
  -> timeout / rate limit / real data changed
  -> flaky test
```

---

## 관찰된 증거

- 로컬에서는 통과하지만 CI에서 간헐적으로 실패한다.
- 외부 API 장애가 내부 테스트 실패로 전파된다.
- 테스트 실행 시간이 외부 응답 속도에 좌우된다.
- 실패 케이스, timeout, 500 응답을 재현하기 어렵다.
- 테스트 설정이 운영 설정을 상속해 실제 endpoint를 바라본다.

---

## 원인

테스트가 검증하려는 대상은 내 애플리케이션의 요청 생성/응답 처리 로직인데, 실제 외부 시스템까지 테스트 범위에 포함해버렸다. 테스트 경계가 넓어지면 실패 원인이 코드인지 외부 환경인지 구분하기 어렵다.

---

## 해결 방향

- 외부 HTTP API는 WireMock 같은 stub server로 대체한다.
- 테스트 profile에서 endpoint를 명시적으로 stub server로 덮어쓴다.
- 정상 응답뿐 아니라 timeout, 4xx, 5xx, 잘못된 body를 시나리오로 둔다.
- 실제 외부 API를 호출하는 테스트는 소수의 contract/e2e 테스트로 분리한다.
- 테스트 기동 시 실제 운영 endpoint가 들어오면 fail-fast한다.

---

## 연결되는 본질

- [[본질-테스트 경계와 외부 의존성 격리]]
- [[본질-설정 우선순위와 출처 추적]]

---

## 참고

> "A core feature of WireMock is the ability to return canned HTTP responses for requests matching criteria." — [WireMock Docs: Stubbing](https://wiremock.org/docs/stubbing/)

> "WireMock enables flexible definition of a mock API by supporting rich matching of incoming requests." — [WireMock Docs: Request Matching](https://wiremock.org/docs/request-matching/)
