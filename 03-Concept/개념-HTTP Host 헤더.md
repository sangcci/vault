---
aliases: [Host Header, Virtual Hosting, 가상 호스팅]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) HTTP 요청 시 클라이언트가 접속하려는 도메인을 서버에 알려주는 헤더.
> (이해용) 아파트 건물 주소(IP)는 같아도 몇 호(도메인)인지를 알려주는 표지판.

---

## 해결하는 문제

- DNS는 여러 도메인을 같은 IP로 연결할 수 있음
- TCP 연결은 IP:Port 기반 → 서버는 어느 도메인으로 들어왔는지 알 수 없음
- Host 헤더 없이는 서버 1대 = 도메인 1개로 제한됨

---

## 치르는 비용

- 없음. 단순 메타데이터 헤더

---

## 동작 원리

```
DNS 조회:
  a.com → 123.45.67.89
  b.com → 123.45.67.89  ← 같은 IP

TCP 연결:
  클라이언트 → 123.45.67.89:80
  (이 시점에 서버는 어느 도메인인지 모름)

HTTP 요청:
  GET /index.html HTTP/1.1
  Host: a.com           ← 여기서 처음 알 수 있음

서버(Nginx):
  server_name a.com → a.com용 응답 반환
  server_name b.com → b.com용 응답 반환
```

---

## HTTP 버전별 차이

```
HTTP/1.0:
  GET /index.html HTTP/1.0
  (Host 헤더 없음 — 선택 사항)
  → IP 1개 = 도메인 1개만 가능

HTTP/1.1:
  GET /index.html HTTP/1.1
  Host: a.com           ← 필수 (없으면 400 Bad Request)
  → IP 1개에 도메인 여러 개 가능 (Virtual Hosting)
```

Host 헤더 필수화가 오늘날 웹 호스팅 구조의 기반.

---

## 현대에서의 쓰임

```
인터넷
  ↓
L7 라우터 (Nginx / ALB / Cloudflare)
  Host: a.com → container A
  Host: b.com → container B
  Host: c.com → container C
```

Host 헤더를 읽는 주체가 바뀌었을 뿐, 역할은 동일.

| 주체 | 예시 |
|---|---|
| Reverse Proxy | Nginx, HAProxy |
| 클라우드 LB | AWS ALB, GCP Load Balancer |
| CDN / Edge | Cloudflare, CloudFront |
| API Gateway | Kong, AWS API Gateway |

---

## 관련 본질

- [[본질-계층 분리 (Layered Architecture)]]

---

## 관련 개념

- [[개념-HTTP Keep-Alive]]
- [[판단기준-L3L4 vs L7 라우팅]]
