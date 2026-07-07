---
aliases: [Wrong Security Layer Blocking, WAF vs Firewall, Fail2Ban Behind Proxy]
tags: [문제, 작성중, Security, WAF, Firewall]
difficulty: Medium
type: Problem
---

# Problem: 49-iptables나 fail2ban으로 막으려 했지만 공격자가 이미 프록시나 CDN 뒤에 있음

## 상황

웹 공격자가 `.env`, `.git`, `wp-admin` 같은 경로를 계속 스캔한다. 서버 로그에는 공격 흔적이 보이지만, 실제 연결은 Cloudflare Tunnel/CDN/프록시에서 들어온다. 그래서 `iptables`나 `fail2ban`으로 차단해도 공격자 원 IP가 막히지 않는다.

```text
Client IP
  → Cloudflare Edge
  → Tunnel / reverse proxy
  → origin server

origin iptables가 보는 source IP:
  Cloudflare / proxy IP
```

---

## 관찰된 증거

- access log의 header에는 원 client IP가 있지만 L3/L4 source IP는 proxy다.
- fail2ban은 로그에서 IP를 뽑지만 iptables는 HTTP header를 읽지 못한다.
- iptables로 차단하면 Cloudflare edge나 proxy를 차단하게 된다.
- URI path, User-Agent, country, header 기준으로 막아야 한다.
- WAF에서는 차단되지만 origin firewall에서는 같은 조건을 표현할 수 없다.

---

## 의심 문제

가장 가능성 높은 문제는 **공격 식별 정보가 존재하는 계층과 차단 도구의 계층이 맞지 않은 것**이다.

HTTP path, header, user-agent, country, bot score 같은 정보는 L7에서 보인다. iptables/ufw/fail2ban은 주로 IP/port/log 기반으로 동작하므로, CDN 뒤 환경에서는 실제 공격자 식별과 차단이 어긋난다.

---

## 원인

```text
L3/L4 firewall
  - source IP
  - destination IP/port
  - protocol
  - packet 기준

L7 WAF
  - Host/path/header/body
  - User-Agent
  - cookie/session
  - country/bot score
  - HTTP request 기준

Proxy/CDN 뒤 origin
  - source IP = proxy
  - real client IP = header
```

---

## 확인 방법

- origin에서 보는 TCP source IP와 HTTP real client header를 비교한다.
- 차단 조건이 IP/port인지, URI/header/body인지 구분한다.
- proxy header를 신뢰할 수 있는 경계에서만 사용하는지 확인한다.
- Cloudflare WAF/security rule에서 같은 조건을 표현할 수 있는지 본다.
- origin firewall은 proxy IP allowlist 용도로 제한하는지 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| Cloudflare WAF/custom rule 사용 | L7 조건 차단 가능 | provider 종속 |
| origin은 Cloudflare IP만 allow | 우회 접근 차단 | IP range 갱신 필요 |
| nginx/app에서 header 기반 rate limit | 세밀한 제어 | header 신뢰 경계 필요 |
| fail2ban은 직접 노출 서버에 제한 사용 | 단순 IP 차단 가능 | proxy 뒤에서는 한계 |
| WAF + app validation 병행 | 방어 심층화 | 중복 정책 관리 |

---

## 트레이드오프

하위 계층 차단은 단순하고 빠르지만 HTTP 맥락을 모른다. 상위 계층 WAF는 요청 의미를 보고 차단할 수 있지만 provider와 rule 관리 비용이 생긴다. 보안 도구는 공격 정보가 관찰되는 계층과 맞춰야 한다.

---

## 연결되는 본질

- [[본질-계층별 관찰 가능 정보]]
- [[본질-보안 통제 지점과 방어 심층화]]
- [[본질-네트워크 경계와 노출면]]

---

## 참고

> "The Cloudflare Web Application Firewall (Cloudflare WAF) checks incoming web and API requests and filters undesired traffic based on sets of rules called rulesets." — [Cloudflare WAF Docs: Concepts](https://developers.cloudflare.com/waf/concepts/)

> "Fail2Ban scans log files like /var/log/auth.log and bans IP addresses conducting too many failed login attempts." — [Fail2Ban README](https://github.com/fail2ban/fail2ban/blob/8be17b09/README.md)
