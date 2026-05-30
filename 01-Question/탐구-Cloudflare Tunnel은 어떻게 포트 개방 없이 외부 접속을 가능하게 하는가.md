---
aliases: [Cloudflare Tunnel 메커니즘, cloudflared 동작 원리]
tags: [탐구, 작성중]
type: Question
difficulty: Medium
---

## 핵심 질문 (Core Question)

> 인바운드 포트를 열지 않았는데, 어떻게 외부에서 내 서버로 접속이 가능한가?

---

## 가설 및 추론 (Hypothesis)

- cloudflared가 먼저 Cloudflare Edge에 연결을 맺으므로, 방화벽 입장에선 **아웃바운드 트래픽** → 차단되지 않음
- 브로커(Cloudflare Edge)가 외부 요청을 받아, 이미 수립된 세션으로 **역방향 전달**하면 포트 개방 없이 통신 가능
- 연결이 끊기지 않는 한 세션을 재사용하므로 매 요청마다 새 연결이 필요 없을 것

---

## 검증 및 팩트 (Verification)

**연결 수립 흐름**
```
[vm: cloudflared]  →→→  아웃바운드 연결 (QUIC, UDP 7844)  →→→  [Cloudflare Edge]
                         persistent session × 4 PoP 동시 연결
                         (단절 시 자동 재수립)

[외부 사용자]  →→→  도메인  →→→  [Cloudflare Edge]  →→→  기존 세션 재사용  →→→  [vm]
               인바운드 포트 불필요, ISP 포트 차단 우회
```

**Route(Public Hostname)와 DNS Record의 역할 분리**
```
Public Hostname (Route)  "이 도메인 요청을 어느 서비스로 보낼까?"
        ↓ 저장 시 자동 생성
DNS Record (CNAME)       "이 도메인의 실제 주소는?"
        example.com  →  <tunnel-id>.cfargotunnel.com
```
- Route가 없으면 터널이 살아있어도 목적지를 모름 → **Error 1016** 발생
- Route와 DNS Record는 독립적으로 존재하지 않음 — Route 설정이 DNS를 자동 생성

**프로토콜 선택**
```
1순위  QUIC (UDP 7844)   — 멀티플렉싱, 연결 수립 빠름
2순위  HTTP/2 (TCP 443)  — QUIC 불가 환경 fallback
```

---

## 결론 (Conclusion)

- 핵심은 **연결 주도권이 수신 서버(cloudflared)에 있다**는 것
- 방화벽은 아웃바운드를 허용하고 인바운드를 차단하는데, cloudflared는 아웃바운드로 먼저 연결을 맺어 이 규칙을 우회
- 이후 모든 요청은 기존 세션을 재사용 → 포트 개방 없이 외부 접속 가능
- `[[개념-아웃바운드 터널링]]` 패턴의 구체적 구현체

---

## 연결된 개념 (Links)

- [[개념-아웃바운드 터널링 (Outbound Tunneling)]]
- [[사례-ISP 포트 차단으로 인한 Cloudflare Tunnel 전환]]
