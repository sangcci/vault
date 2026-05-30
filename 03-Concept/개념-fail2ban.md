---
aliases: [fail2ban, Fail2Ban]
tags: [개념, 완료]
type: Concept
difficulty: Low
---

## 한 문장 정의

> (사전적) 로그 파일을 실시간으로 감시하여 정규식 패턴에 매칭되는 IP를 iptables 등 방화벽에 자동 차단하는 침입 차단 데몬.
> (이해용) "로그를 보다가 수상한 IP가 반복되면 자동으로 문을 잠그는 경비원."

---

## 해결하는 문제

- 반복적인 brute force, 경로 탐색 공격 IP를 수동 개입 없이 자동 차단

---

## 치르는 비용

- **Cloudflare Tunnel 환경에서 작동 불가** → [[현상-Cloudflare Tunnel 환경에서 클라이언트 IP 마스킹]]
- Docker 위 nginx 사용 시 로그 파일을 host에 마운트해야 함
- 오탐(false positive) 시 정상 사용자 IP도 차단될 수 있음

---

## 동작 원리

```
nginx access.log
    │  inotify 감시 (실시간)
    ▼
fail2ban (jail 규칙 + 정규식 필터)
    │  패턴 매칭 → N회 이상 감지
    ▼
iptables -A INPUT -s <공격자IP> -j DROP
    │  bantime 경과 후 자동 해제
    ▼
차단 해제
```

Cloudflare + Docker nginx 환경에서의 설정 고려사항:
- XFF 헤더를 로그에 출력하도록 nginx log_format 수정 필요
- 그러나 iptables는 XFF를 읽지 못함 → 근본적 한계

---

## 관련 본질

- [[본질-가용성 (Availability)]]
