---
aliases: [Routing Table, 라우팅, ip route]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) 커널이 패킷의 목적지 IP를 보고 어느 네트워크 인터페이스로 내보낼지 결정하는 경로 정보 테이블.
> (이해용) 택배 분류 센터의 지역별 배송 경로표. "이 주소는 이 출구로 보내라."

---

## 해결하는 문제 (Problem Solved)

- 여러 네트워크 인터페이스(eth0, virbr0 등)가 있을 때 패킷을 올바른 인터페이스로 전달
- 기본 게이트웨이(default route) 설정으로 외부 인터넷 통신

---

## 치르는 비용 (Cost/Trade-off)

- 라우팅 규칙이 잘못되면 패킷이 엉뚱한 인터페이스로 나가거나 드롭됨
- 정적 라우팅은 네트워크 변경 시 수동 수정 필요

---

## 동작 원리 (Mechanism)

**라우팅 테이블 조회 시점**
```
패킷 도착
    │
[PREROUTING] DNAT으로 목적지 주소 변경
    │
[Routing Table] 변경된 목적지 IP 기준으로 인터페이스 결정
    │              192.168.122.x → virbr0
    │              0.0.0.0/0    → eth0 (default)
[FORWARD or INPUT]
```

**라우팅 테이블 예시**
```
Destination     Gateway         Iface
0.0.0.0/0       192.168.1.1     eth0      ← 기본 게이트웨이 (인터넷)
192.168.122.0   0.0.0.0         virbr0    ← KVM VM 대역
192.168.1.0     0.0.0.0         eth0      ← 로컬 네트워크
```

**NAT과의 역할 구분**
```
NAT           "주소 라벨 교체"   공인IP:80 → 192.168.122.10:80
라우팅 테이블  "경로 결정"       192.168.122.x → virbr0 인터페이스로

순서: DNAT(주소 바꾸기) → Routing(어디로 보낼지) → FORWARD(보내도 되는지)
```

---

## 관련 본질 (Related Principles)

- [[본질-간접 참조 (Indirection)]] — 목적지 직접 연결 대신 게이트웨이 경유

---

## 연결된 개념 (Links)

- [[개념-Netfilter와 iptables]]
- [[개념-DNAT과 SNAT]]
