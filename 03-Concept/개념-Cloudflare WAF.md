---
aliases: [WAF, Web Application Firewall, Cloudflare 방화벽]
tags: [개념, 완료]
type: Concept
difficulty: Low
---

## 한 문장 정의

> (사전적) Cloudflare Edge에서 HTTP 요청을 L7 레벨로 검사하여 악성 요청을 원본 서버 도달 전에 차단하는 웹 애플리케이션 방화벽.
> (이해용) "배달원(Cloudflare)이 주문서(요청)를 확인해서 수상한 것은 집까지 오기 전에 걸러주는 것."

## 해결하는 문제

- 자동화 봇의 경로 스캔, 취약점 탐색, 해외 IP 공격
- [[현상-Cloudflare Tunnel 환경에서 클라이언트 IP 마스킹]] 환경에서 iptables 대체 수단

## 치르는 비용

- Cloudflare 종속 — CDN을 교체하면 WAF 설정도 이전해야 함
- 무료 플랜에서 커스텀 룰 수 제한 (5개)
- 오탐 시 정상 사용자 차단 가능 (특히 "Block Abroad" 룰)

## 동작 원리

```
클라이언트 요청
    │
    ▼
Cloudflare Edge (WAF Security Rule 평가)
    ├─ Block Malicious Paths  : URI가 .env/.git/wp-admin 등이면 → 403
    ├─ Block Scanner UA       : UA가 curl/sqlmap/nikto 등이면 → 403
    └─ Block Abroad Requests  : IP 국가가 허용 목록 외이면 → 403
    │  (모두 통과 시)
    ▼
Cloudflare Tunnel → 원본 서버
```

설정 경로: `Cloudflare Dashboard → Domain → Security → WAF → Security Rules`

Rate Limiting은 별도 룰로 관리하거나 nginx `limit_req`로 처리.

## 관련 본질

- [[본질-가용성 (Availability)]]
- [[본질-환경 격리 (Environment Isolation)]]
