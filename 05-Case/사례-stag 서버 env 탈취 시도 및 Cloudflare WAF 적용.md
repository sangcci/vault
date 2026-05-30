---
aliases: [stag 서버 보안 사건, env 탈취 시도, Cloudflare WAF 적용 사례]
tags: [사례, 완료]
type: Case
difficulty: Medium
---

## 상황

- 홈서버 KVM 위 staging 환경, Cloudflare Tunnel로 외부 노출
- 공인 IP 등록 후 자동화 봇이 탐지, `.env` / `.git` 경로를 brute force로 탐색
- nginx 뒤에 Spring Boot WAS가 있는 구조

---

## 실제 발생한 일

nginx 로그에서 탐지:

```
GET /examples/10-subscriptions/.env HTTP/1.1  200  curl/8.7.1  185.177.72.13
GET /examples/11-transactions/.env HTTP/1.1   200  curl/8.7.1  185.177.72.13
```

Spring Boot 로그:

```
HTTP GET /api/v1/.env → 401 (88ms)  ip=185.177.72.56
```

- actuator 등은 nginx 단에서 차단됨 (정상)
- `/api/v1/*` 경로는 Spring Boot까지 도달 → 401 반환 (Spring Security가 막음)
- 봇이 공인 IP를 탐지해 모든 URL 조합을 자동으로 탐색한 것으로 판단

grafana, prometheus도 nginx 우회 후 cloudflare에서 host port로 직접 노출된 상태 → 무인증 접근 가능 심각도 높음.

---

## 시도한 해결책과 실패

**fail2ban 시도 → 불가:**
- fail2ban은 nginx 로그 → 정규식 패턴 → iptables 차단 구조
- Cloudflare Tunnel 환경에서 source IP는 항상 Cloudflare IP → 실제 공격자 IP를 iptables로 차단해도 Cloudflare 전체 트래픽 차단됨
- XFF 헤더로 실제 IP를 로그에 기록해도 iptables는 source IP 기준 → 불일치
- → [[현상-Cloudflare Tunnel 환경에서 클라이언트 IP 마스킹]] 참고

---

## 근본 원인

- [[본질-환경 격리 (Environment Isolation)]] 미적용 — staging을 외부에 그대로 노출
- Cloudflare Tunnel 구조상 IP 레벨 차단이 불가능한 아키텍처

---

## 교훈 및 조치

**Cloudflare WAF Security Rule 적용:**

```
Domain → Security → WAF → Security Rules
- Block Malicious Paths  : .env, .git, wp-admin 등 악성 경로 차단
- Block Scanner UA       : curl, sqlmap 등 스캐너 User-Agent 차단
- Block Abroad Requests  : 해외 IP 차단 (필요 시)
```

**nginx 추가 보안 설정:**

```
nginx/
  ├── nginx.conf
  ├── conf.d/
  │   ├── upstream.conf
  │   └── default.conf
  └── snippets/
      ├── proxy-params.conf
      ├── security-headers.conf
      └── block-malicious.conf      ← 악성 경로 차단
```

- swagger: nginx Basic Auth 적용
- prometheus: Cloudflare Tunnel 자체를 닫음
- grafana: 내장 Basic Auth 활용

---

## 파생 판단기준

- [[판단기준-Cloudflare Tunnel 환경에서 IP 차단 방법 선택]]
