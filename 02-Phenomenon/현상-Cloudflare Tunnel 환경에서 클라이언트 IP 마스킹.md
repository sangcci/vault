---
aliases: [Cloudflare IP Masking, Tunnel IP 마스킹, XFF 마스킹]
tags: [현상, 완료]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의

> (사전적) Cloudflare Tunnel을 사용하는 환경에서 서버가 수신하는 패킷의 source IP가 실제 클라이언트 IP가 아닌 Cloudflare 인프라 IP로 대체되는 현상.
> (이해용) "손님이 누군지 모르고 배달원(Cloudflare)만 보이는 상황 — 배달원을 차단하면 모든 손님이 끊김."

---

## 발생 환경

- Cloudflare Tunnel(`cloudflared`)로 서버를 외부에 노출한 환경
- iptables / fail2ban 등 source IP 기반 차단 도구를 사용하려는 경우

---

## 관찰되는 증상

- nginx access log의 `$remote_addr`이 항상 Cloudflare IP 또는 Docker 내부 IP로 찍힘
- fail2ban이 공격자 IP를 탐지해 iptables에 차단 룰을 추가해도 공격이 계속됨
- XFF(`X-Forwarded-For`) 헤더에는 실제 클라이언트 IP가 있으나, iptables는 이를 읽지 못함

---

## 발생 메커니즘

```
공격자(185.x.x.x)
    │  HTTP 요청
    ▼
Cloudflare Edge (XFF: 185.x.x.x 추가)
    │  Cloudflare Tunnel (암호화)
    ▼
cloudflared 데몬 (로컬 프로세스)
    │  source IP = 127.0.0.1 or Docker bridge IP
    ▼
nginx → Spring Boot

iptables 차단 대상: source IP (=Cloudflare/localhost)
실제 공격자 IP: XFF 헤더 안에만 존재 (L7, iptables 접근 불가)
```

---

## 추측되는 원인

- Cloudflare Tunnel은 L7 프록시 → iptables는 L3/L4 레벨에서 동작
- 두 계층이 다르기 때문에 iptables는 XFF 헤더를 읽을 수 없음

---

## 관련 사례

- [[사례-stag 서버 env 탈취 시도 및 Cloudflare WAF 적용]]
