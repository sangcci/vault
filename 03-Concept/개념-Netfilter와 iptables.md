---
aliases: [iptables, Netfilter, 패킷 필터링]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) Linux 커널에 내장된 패킷 처리 프레임워크로, 테이블과 체인 구조를 통해 패킷의 필터링·주소 변환·포워딩을 제어한다.
> (이해용) 커널 안에서 패킷이 지나가는 관문마다 규칙을 세워두는 검문소 시스템.

## 해결하는 문제 (Problem Solved)

- 외부에서 들어오는 패킷을 허용/차단하는 방화벽 기능
- 공인 IP를 사설 IP로 변환하는 NAT(DNAT/SNAT)
- 호스트를 경유해 다른 서버로 패킷을 전달하는 포워딩

## 치르는 비용 (Cost/Trade-off)

- 규칙이 많아질수록 패킷마다 순차 검사 → 성능 저하
- 직접 다루기 복잡 → ufw, firewalld 같은 wrapper가 필요한 이유
- iptables-persistent와 ufw 같은 도구 간 충돌 위험 (규칙 로드 역할 중복)

## 동작 원리 (Mechanism)

**Netfilter vs iptables 계층 구분**
```
커널 공간   Netfilter   패킷이 지나는 훅 포인트 제공
                        커널 모듈 API로 콜백 등록 가능
                        직접 다룰 일 없음 (커널 모듈 개발 제외)

유저 공간   iptables    Netfilter API를 호출해 규칙을 커널에 등록하는 CLI
            nftables    iptables 후속작, 동일한 Netfilter 기반
            ufw         iptables 규칙 생성을 대신하는 wrapper
```

**테이블: 역할에 따른 분류**
```
nat 테이블     주소 변환 담당   PREROUTING(DNAT), POSTROUTING(SNAT)
filter 테이블  허용/차단 담당   INPUT, FORWARD, OUTPUT
```

**nat vs filter — 방화벽과 NAT의 역할 구분**
```
NAT (nat 테이블)
  PREROUTING   → 목적지 주소 변경 (DNAT)   공인IP:80 → 192.168.122.10:80
  POSTROUTING  → 출발지 주소 변경 (SNAT)   192.168.x.x → 공인IP

방화벽 (filter 테이블)
  INPUT        → Host 자신이 목적지인 패킷 허용/차단
  FORWARD      → Host를 경유해 다른 곳으로 가는 패킷 허용/차단
```
→ NAT은 "주소를 바꾸는 것", 방화벽은 "통과를 허용하는 것". 역할이 완전히 다름

**체인: 패킷이 지나는 관문**
```
PREROUTING   패킷 도착 직후   → 목적지 주소 변경 (DNAT)
INPUT        Host 자신이 목적지
FORWARD      Host를 경유해 다른 곳으로 전달
OUTPUT       Host에서 나가는 패킷
POSTROUTING  패킷이 나가기 직전  → 출발지 주소 변경 (SNAT)
```

**외부 패킷의 전체 여정**
```
외부 패킷 도착
      │
[물리 NIC 수신]
      │
[nat/PREROUTING]   목적지 주소 변경 (DNAT)
      │              공인IP:80 → 192.168.122.10:80
[Routing Table]    어느 인터페이스로 보낼지 결정
      │
[filter/FORWARD]   통과 허용 여부 판단
      │              ufw route allow가 없으면 여기서 DROP
[nat/POSTROUTING]  출발지 주소 변경 (SNAT/MASQUERADE)
      │
[가상 NIC → VM]
```

**Host 자신이 목적지인 경우 (Cockpit 9090 등)**
```
외부 패킷 → PREROUTING → Routing Table → INPUT → 프로세스
```

## 관련 본질 (Related Principles)

- [[본질-우선순위 계층 구조 (Priority Hierarchy)]] — 체인 내 규칙 순서가 결과를 결정
- [[본질-간접 참조 (Indirection)]] — ufw가 iptables를 감싸는 추상화 계층

## 연결된 개념 (Links)

- [[개념-DNAT과 SNAT]]
- [[개념-ufw]]
- [[개념-라우팅 테이블 (Routing Table)]]
