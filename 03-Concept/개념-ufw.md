---
aliases: [ufw, Uncomplicated Firewall, 방화벽]
tags: [개념, 작성중]
type: Concept
difficulty: Low
---

## 한 문장 정의 (Definition)

> (사전적) iptables의 복잡한 문법을 감싸 사람이 쓰기 쉽게 만든 Linux 방화벽 관리 도구.
> (이해용) iptables라는 복잡한 기계에 붙인 쉬운 조작 패널.

## 해결하는 문제 (Problem Solved)

- iptables 직접 작성의 복잡성 제거
- 규칙을 재부팅 후에도 유지 (iptables 규칙은 기본적으로 재부팅 시 초기화)

## 치르는 비용 (Cost/Trade-off)

- iptables-persistent 등 다른 도구와 공존 시 규칙 충돌 위험
- iptables에 비해 세밀한 제어가 제한적

## 동작 원리 (Mechanism)

**ufw 명령과 iptables 체인의 대응**
```
ufw allow 80          →  filter/INPUT 체인에 규칙 추가
                          (Host 자신이 목적지인 트래픽 허용)

ufw route allow ...   →  filter/FORWARD 체인에 규칙 추가
                          (Host를 경유해 VM으로 가는 트래픽 허용)
```

**INPUT과 FORWARD를 구분해야 하는 이유**
```
목적지 = Host 자신  →  INPUT   ufw allow만으로 충분
목적지 = VM        →  FORWARD  ufw route가 추가로 필요

예시: Cockpit 9090 (Host)  → ufw allow 9090
     nginx 80 (VM)         → ufw route allow proto tcp to 192.168.122.10 port 80
```

**iptables-persistent와의 충돌**
```
부팅 시 iptables 규칙 로드 역할이 중복됨
    ufw           → /etc/ufw/ 규칙 로드
    iptables-persistent → /etc/iptables/ 규칙 로드

→ 두 도구가 서로의 규칙을 덮어쓸 수 있음
→ 하나로 통일 필요 (ufw 권장)
```

## 관련 본질 (Related Principles)

- [[본질-추상화 (Abstraction)]] — iptables 위에 올린 단순화 계층

## 연결된 개념 (Links)

- [[개념-Netfilter와 iptables]]
- [[탐구-FORWARD chain과 INPUT chain은 왜 별도로 존재하는가]]
- [[사례-ufw와 iptables-persistent 충돌]]
