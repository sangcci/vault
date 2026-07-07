---
aliases: [Cloudflare Tunnel 메커니즘, cloudflared 동작 원리]
tags: [탐구, 작성중]
type: Question
difficulty: Medium
---

# Question: Cloudflare Tunnel은 어떻게 포트 개방 없이 외부 접속을 가능하게 하는가

## 핵심 질문

> 인바운드 포트를 열지 않았는데, 어떻게 외부에서 내 서버로 접속이 가능한가?

---

## 왜 중요한가

Cloudflare Tunnel의 핵심은 홈서버나 사설망 서버가 먼저 Cloudflare 쪽으로 아웃바운드 연결을 맺는다는 점이다. 그래서 방화벽이나 공유기에서 인바운드 포트를 직접 열지 않아도 외부 요청을 기존 터널 세션으로 되돌려 받을 수 있다.

```text
[home server: cloudflared]
        ↓ outbound tunnel
[Cloudflare edge]
        ↑ public request
[external user]
```

> "Cloudflare Tunnel provides you with a secure way to connect your resources to Cloudflare without a publicly routable IP address." — [Cloudflare One docs](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)

---

## 파생 노트

- [[본질-네트워크 경계와 노출면]]
- [[본질-사설 접근 경로와 권한 판단의 분리]]
- [[15-Cloudflare Tunnel 환경에서 fail2ban으로 공격자 IP를 차단하지 못함]]
