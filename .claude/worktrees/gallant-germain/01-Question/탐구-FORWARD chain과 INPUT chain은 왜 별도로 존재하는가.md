---
aliases: [FORWARD chain, INPUT chain, iptables 체인 구분]
tags: [탐구, 작성중]
type: Question
difficulty: Medium
---

## 핵심 질문 (Core Question)

> ufw allow로 포트를 열었는데 왜 VM으로 가는 트래픽은 차단되었나? FORWARD와 INPUT은 왜 별도로 존재하는가?

## 가설 및 추론 (Hypothesis)

- Host 자신이 받는 트래픽과 Host를 경유하는 트래픽은 처리 주체가 다를 것
- Host가 라우터 역할을 할 때는 별도의 허용 지점이 필요할 것
- `ufw allow`는 "Host가 받는" 것을 허용하는 것이므로 VM으로 가는 트래픽엔 무관할 것

## 검증 및 팩트 (Verification)

**패킷 목적지에 따른 체인 분기**
```
외부 패킷 도착
      │
[PREROUTING] DNAT → 192.168.122.10:80
      │
[Routing Table] 목적지가 Host 자신인가?
      │
      ├── YES → [INPUT]   Host 프로세스가 수신
      │                   Cockpit 9090, SSH 22 등
      │
      └── NO  → [FORWARD] 다른 인터페이스로 전달
                           VM nginx 80 등
```

**ufw allow vs ufw route**
```
ufw allow 9090
    → filter/INPUT 체인에 규칙 추가
    → Host 자신이 목적지인 9090 허용 ✓

ufw allow 80  (FORWARD 규칙 없이)
    → filter/INPUT에만 추가
    → FORWARD 체인은 여전히 DROP ✗

ufw route allow proto tcp to 192.168.122.10 port 80
    → filter/FORWARD 체인에 규칙 추가
    → VM으로 가는 80 허용 ✓
```

**실제 트래픽 흐름으로 확인**
```
Cockpit 9090 접속 성공   → Host 자신이 목적지 → INPUT → ufw allow로 충분
nginx 80 접속 실패       → DNAT 됐지만 FORWARD에서 DROP
nginx 80 접속 성공       → ufw route 추가 후
```

## 결론 (Conclusion)

- INPUT과 FORWARD는 패킷의 **최종 목적지가 Host 자신인가 아닌가**로 분기
- Host가 라우터 역할을 하는 순간(VM·컨테이너 포워딩) FORWARD 체인이 개입
- `ufw allow`는 INPUT 전용, `ufw route allow`가 FORWARD를 제어
- 포트 포워딩(DNAT)을 설정했다면 반드시 FORWARD 규칙도 함께 필요

## 연결된 개념 (Links)

- [[개념-Netfilter와 iptables]]
- [[개념-ufw]]
- [[사례-DNAT 후 FORWARD chain에서 패킷 차단]]
