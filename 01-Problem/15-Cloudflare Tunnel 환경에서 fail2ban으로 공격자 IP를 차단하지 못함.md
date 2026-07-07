---
aliases: [Cloudflare Tunnel IP Masking, fail2ban Cloudflare Tunnel, XFF IP Blocking Failure]
tags: [문제, 작성중, Network, Cloudflare, Security]
difficulty: Medium
type: Problem
---

# Problem: 15-Cloudflare Tunnel 환경에서 fail2ban으로 공격자 IP를 차단하지 못함

## 상황

Cloudflare Tunnel로 홈서버나 staging 서버를 외부에 노출했다. nginx 로그에서 `.env`, `.git`, `wp-admin` 같은 악성 경로 탐색이 보여 fail2ban으로 공격자 IP를 차단하려고 한다.

```text
공격자 → Cloudflare Edge → cloudflared tunnel → nginx → WAS
```

하지만 fail2ban이 iptables 규칙을 추가해도 공격이 계속 들어오거나, 잘못 차단하면 정상 트래픽 전체가 끊길 수 있다.

---

## 관찰된 증거

- nginx `$remote_addr`가 실제 공격자 IP가 아니라 Cloudflare IP, Docker bridge IP, localhost로 찍힌다.
- 실제 클라이언트 IP는 `X-Forwarded-For` 또는 `CF-Connecting-IP` 같은 HTTP header에 있다.
- fail2ban은 로그에서 공격자 IP를 읽을 수 있어도, iptables는 L3/L4 source IP만 차단한다.
- iptables로 Cloudflare IP를 막으면 Cloudflare를 통해 들어오는 모든 요청이 막힌다.

```text
실제 공격자 IP: HTTP header 안
iptables가 보는 source IP: Cloudflare/cloudflared/Docker bridge
```

---

## 의심 문제

가장 가능성 높은 문제는 **L7 프록시/터널 계층의 클라이언트 식별자와 L3/L4 방화벽 계층의 source IP를 같은 것으로 본 것**이다.

Cloudflare Tunnel은 서버가 먼저 Cloudflare로 outbound 연결을 맺고, 외부 요청은 그 기존 터널을 통해 전달된다. 원본 서버 입장에서는 실제 클라이언트가 직접 TCP 연결을 맺은 것이 아니다.

---

## 원인

Cloudflare Tunnel은 인바운드 포트를 열지 않는 대신, `cloudflared`가 Cloudflare 네트워크로 outbound-only 연결을 만든다.

```text
[origin server]
  cloudflared ── outbound tunnel ──> [Cloudflare]

[client]
  ── HTTPS ──> [Cloudflare]
                ── existing tunnel ──> [origin]
```

이 구조에서는 네트워크 계층 source IP와 애플리케이션 계층 client IP가 분리된다.

```text
L3/L4: source IP = Cloudflare/cloudflared 경로
L7:    CF-Connecting-IP / X-Forwarded-For = 실제 client IP
```

fail2ban + iptables는 L3/L4 차단 도구이므로 HTTP header 안의 실제 IP를 기준으로 패킷을 차단할 수 없다. 따라서 Tunnel 환경에서는 Cloudflare WAF, Access, nginx L7 차단처럼 같은 계층에서 판단하는 도구가 필요하다.

---

## 확인 방법

- nginx access log에서 `$remote_addr`, `$http_x_forwarded_for`, `$http_cf_connecting_ip`를 함께 출력한다.
- iptables 차단 대상 IP가 실제 client IP인지 Cloudflare IP인지 확인한다.
- Cloudflare Tunnel/Proxy를 쓰는지, 서버가 직접 공인 IP를 받는지 구분한다.
- 공격 패턴이 path/user-agent/country 기준이면 WAF rule로 차단 가능한지 확인한다.
- 원본 서버가 외부에서 직접 접근 가능한 host port를 열어두지 않았는지 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/위험 |
|---|---|---|
| Cloudflare WAF Rule | Edge에서 path/UA/country/IP 기준 차단 | Cloudflare 계층 의존 |
| Cloudflare Access | staging/admin 경로 인증 추가 | 사용자 인증 흐름 필요 |
| nginx L7 차단 | origin에서도 악성 path 차단 | 요청이 origin까지 도달한 뒤 차단 |
| Tunnel public hostname 축소 | 불필요 서비스 노출 제거 | 운영 접근 경로 재설계 필요 |
| 직접 공인 IP 환경에서 fail2ban | L3 source IP 차단 가능 | Tunnel/Proxy 환경에는 부적합 |

---

## 트레이드오프

Tunnel은 인바운드 포트를 열지 않아 노출면을 줄이지만, 실제 클라이언트 식별과 차단 위치가 Cloudflare 계층으로 이동한다. 원본 서버의 iptables만으로 모든 보안 제어를 하겠다는 가정은 깨진다.

따라서 Tunnel을 쓰면 보안 정책도 Tunnel 앞단, 즉 Cloudflare WAF/Access와 origin nginx 정책으로 나누어 설계해야 한다.

---

## 연결되는 본질

- [[본질-네트워크 경계와 노출면]]
- [[본질-주소 변환과 경로 결정의 분리]]
- [[본질-폭발 반경과 격벽]]

---

## 참고

> "Cloudflare Tunnel provides you with a secure way to connect your resources to Cloudflare without a publicly routable IP address." — [Cloudflare Docs: Connect networks](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)

> "instead, a lightweight daemon in your infrastructure (cloudflared) creates outbound-only connections to Cloudflare's global network." — [Cloudflare Docs: Connect networks](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)

> "cloudflared establishes outbound connections (tunnels) between your resources and Cloudflare's global network." — [Cloudflare Docs: Connect networks](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
