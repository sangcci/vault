---
aliases: [Rate Limit Burst Rejection, Token Bucket Leaky Bucket, Redis Rate Limiter]
tags: [문제, 작성중, RateLimit, Redis, API]
difficulty: Medium
type: Problem
---

# Problem: 30-API Rate Limit을 걸었는데 정상 사용자의 순간 요청까지 막힘

## 상황

API 보호를 위해 초당 요청 수 제한을 걸었다. 하지만 정상 사용자가 화면 진입 시 여러 API를 동시에 호출하거나, 모바일 네트워크 재시도로 순간 요청이 몰릴 때도 차단된다.

```text
사용자 화면 진입
  ├─ GET /profile
  ├─ GET /notifications
  ├─ GET /products
  ├─ GET /recommendations
  └─ GET /coupons

순간 5개 요청
  ↓
rate limit: 3 req/s
  ↓
일부 정상 요청 차단
```

---

## 관찰된 증거

- bot/abuse가 아닌 사용자도 429를 받는다.
- 요청 평균은 낮지만 짧은 시간에 몰리는 burst가 있다.
- Leaky Bucket처럼 일정 속도 처리로 설정하면 지연이 커진다.
- Token Bucket처럼 burst를 허용하면 순간 부하는 통과한다.
- Redis counter 기반 구현에서 INCR/EXPIRE 원자성이나 TTL 누락 문제가 보인다.

---

## 의심 문제

가장 가능성 높은 문제는 **rate limit을 평균 처리율, burst 허용량, 대기/거부 정책으로 나누지 않고 단일 숫자로만 설계한 것**이다.

“초당 10개”라는 제한은 충분하지 않다. 정상 burst를 허용할지, 수신 시스템을 일정 속도로 보호할지, 초과 요청을 기다리게 할지 바로 거부할지 결정해야 한다.

---

## 원인

```text
Token Bucket
  - 토큰이 일정 속도로 채워짐
  - 저장된 토큰만큼 순간 burst 허용
  - API rate limit에 자주 적합

Leaky Bucket
  - 큐에서 일정 속도로만 출력
  - burst를 평탄화
  - 수신 측 처리율 보호에 적합
```

분산 환경에서는 rate limit 상태도 공유되어야 한다.

```text
App instance A: count=3
App instance B: count=3
App instance C: count=3

로컬 카운터만 쓰면 전체 제한 실패
  ↓
Redis counter / Lua script / gateway rate limit 필요
```

---

## 확인 방법

- 제한 목표가 abuse 방어인지, backend 보호인지, 과금 정책인지 구분한다.
- 사용자별/IP별/API key별/endpoint별 어떤 key로 제한하는지 확인한다.
- 평균 rate와 burst size를 따로 정의한다.
- 초과 요청을 즉시 429로 거부할지, 큐잉할지, 지연시킬지 결정한다.
- Redis 구현이면 INCR와 EXPIRE가 원자적으로 묶이는지, Lua script가 필요한지 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| Token Bucket | 정상 burst 허용 | burst가 downstream을 압도할 수 있음 |
| Leaky Bucket | 일정 처리율 보장 | 정상 burst도 지연/거부 가능 |
| Redis + Lua | 분산 환경 원자성 | Redis 의존/지연 추가 |
| Gateway rate limit | 애플리케이션 보호 전 선차단 | 세밀한 도메인 정책은 어려움 |
| endpoint별 quota | 핵심 API 보호 | 정책 관리 복잡도 증가 |
| 사용자 등급별 limit | UX 개선 | 권한/요금제 정책 필요 |

---

## 트레이드오프

Rate Limit은 단순 차단 장치가 아니라 부하를 어디서, 어떤 모양으로 흡수할지 정하는 제어 장치다. 정상 burst를 허용하면 UX는 좋아지지만 순간 부하가 커지고, 일정 출력으로 제한하면 downstream은 보호되지만 사용자는 지연이나 429를 경험한다.

---

## 연결되는 본질

- [[본질-부하 평탄화와 버스트 허용]]
- [[본질-유한 버퍼와 역압]]
- [[본질-전송 배치 크기와 메모리 압력]]

---

## 참고

> "Building a rate limiter with Redis is easy because of two commands INCR and EXPIRE." — [Redis Glossary: Rate Limiting](https://redis.io/glossary/rate-limiting/)

> "The following guides show how to build a token bucket rate limiter with Redis and Lua scripts." — [Redis Docs: Rate limiter](https://redis.io/docs/latest/develop/use-cases/rate-limiter/)

> "The ngx_http_limit_req_module module ... is used to limit the request processing rate per a defined key" — [NGINX Docs: ngx_http_limit_req_module](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
