---
aliases: [L3 L4 L7 라우팅, iptables vs Nginx, 레이어별 라우팅 선택]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: Medium
---

## 판단 기준

- 기준이 **IP:Port** 뿐이다 → L3/L4 (iptables, NAT)
- 기준이 **도메인, 경로, 헤더, 쿠키** 등이다 → L7 (Nginx, ALB, Cloudflare)

## 효과적인 상황

```
L3/L4 (iptables):
  특정 IP 차단 (방화벽)
  포트 기반 포워딩 (80 → 8080)
  DNAT / SNAT (IP 변환)

L7 (Nginx / ALB):
  Host: a.com → container A 라우팅
  /api/* → backend, /* → frontend
  WAF, 인증, 헬스체크, SSL 종료
```

## 실패하는 상황

```
L3/L4로 L7 역할 시도:
  iptables는 Host 헤더를 읽지 못함 (패킷 레벨)
  → 같은 IP의 두 도메인을 분기 불가

L7으로 L3/L4 역할 시도:
  Nginx는 IP 수준 패킷 필터링 불가
  → DDoS IP 차단, 포트 포워딩은 iptables 역할
```

## 계층 관계

```
인터넷
  ↓
iptables / NAT     ← L3/L4: IP:Port 기준, 패킷 레벨
  ↓
Nginx / ALB        ← L7: Host·경로·헤더 기준, HTTP 레벨
  ↓          ↓
container A  container B
```

둘은 **대체 관계가 아니라 역할 분담 관계**.

## 클라우드에서의 확장

Nginx가 하는 L7 라우팅을 클라우드 managed 서비스로 대체 가능.
역할의 본질은 같고, 운영 자동화(헬스체크, 오토스케일링, WAF 통합)가 추가됨.

| | Nginx | AWS ALB / Cloudflare |
|---|---|---|
| L7 라우팅 | O | O |
| SSL 종료 | O | O |
| 헬스체크 자동화 | 수동 | O |
| Auto Scaling 연동 | 수동 | O |
| WAF 통합 | 별도 설정 | O |

## 출처

- [[개념-HTTP Host 헤더]]
- [[개념-Netfilter와 iptables]]
