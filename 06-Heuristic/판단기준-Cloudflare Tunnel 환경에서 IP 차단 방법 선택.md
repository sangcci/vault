---
aliases: [Cloudflare Tunnel IP 차단, fail2ban vs WAF, Tunnel 보안 방법]
tags: [판단기준, 완료]
type: Heuristic
difficulty: Medium
---

## 판단 기준

```
Cloudflare Tunnel을 사용하는가?
    │
    ├── YES → fail2ban 사용 불가 (source IP = Cloudflare IP)
    │           → Cloudflare WAF Security Rule 사용
    │
    └── NO  → 서버에 직접 공인 IP가 노출됨
                → fail2ban + iptables 조합 사용 가능
```

---

## 효과적인 상황

**Cloudflare WAF:**
- Cloudflare Tunnel 또는 Cloudflare Proxy 사용 환경
- L7 레벨 차단 (경로, UA, 국가 기준)
- 서버 리소스 소모 없이 Edge에서 차단

**fail2ban:**
- 서버에 직접 공인 IP가 연결된 환경 (Tunnel 미사용)
- nginx log에서 실제 클라이언트 IP가 `$remote_addr`에 찍히는 경우

---

## 실패하는 상황

**fail2ban + Cloudflare Tunnel 조합:**
- iptables 차단 대상이 Cloudflare IP → 전체 트래픽 차단
- XFF 헤더에 실제 IP가 있어도 iptables는 L3 source IP만 봄
- → [[현상-Cloudflare Tunnel 환경에서 클라이언트 IP 마스킹]] 참고

---

## 출처

- [[사례-stag 서버 env 탈취 시도 및 Cloudflare WAF 적용]]
