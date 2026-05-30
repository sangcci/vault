---
aliases: [DNAT, SNAT, MASQUERADE, 주소 변환, NAT]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) 패킷의 IP 주소를 변환하는 기술로, DNAT은 목적지 주소를, SNAT은 출발지 주소를 바꾼다.
> (이해용) 편지 봉투의 수신자(DNAT) 또는 발신자(SNAT) 주소 라벨을 바꿔 붙이는 것.

---

## 해결하는 문제 (Problem Solved)

- 공인 IP 하나로 내부 여러 서버에 트래픽 분산 (DNAT)
- 사설 IP를 가진 VM이 외부 인터넷과 통신 (SNAT/MASQUERADE)
- 포트 포워딩: 외부 포트를 내부 서버의 다른 포트로 연결

---

## 치르는 비용 (Cost/Trade-off)

- 변환 상태(Connection Tracking)를 커널이 관리 → 메모리 사용
- DNAT 후 FORWARD 체인에서 별도 허용 규칙 필요 (흔한 실수 포인트)
- NAT 경유 시 end-to-end 투명성 손실 (실제 출발지 IP가 숨겨짐)

---

## 동작 원리 (Mechanism)

**DNAT (Destination NAT) — 목적지 주소 변경**
```
[nat/PREROUTING 체인에서 동작]

외부 패킷: 공인IP:80 도착
      ↓
DNAT 규칙 적용: 목적지를 192.168.122.10:80으로 교체
      ↓
이후 패킷은 192.168.122.10:80을 향해 이동
```

**SNAT / MASQUERADE — 출발지 주소 변경**
```
[nat/POSTROUTING 체인에서 동작]

VM에서 나가는 패킷: 출발지 192.168.122.10
      ↓
MASQUERADE 규칙 적용: 출발지를 공인IP로 교체
      ↓
외부에서는 공인IP에서 온 것으로 인식
```

**MASQUERADE vs SNAT 차이**
```
SNAT        출발지를 고정 IP로 변환    → 공인 IP가 고정된 서버
MASQUERADE  출발지를 인터페이스 현재 IP로 변환 → IP가 동적으로 바뀌는 환경
```

**NAT과 라우팅 테이블의 역할 구분**
```
NAT           "주소 라벨 교체"    공인IP:80 → 192.168.122.10:80
라우팅 테이블  "경로 결정"        192.168.122.x → virbr0 인터페이스로
```

---

## 관련 본질 (Related Principles)

- [[본질-추상화 (Abstraction)]] — 내부 사설망을 외부에서 보이지 않게 숨김

---

## 연결된 개념 (Links)

- [[개념-Netfilter와 iptables]]
- [[개념-라우팅 테이블 (Routing Table)]]
- [[사례-DNAT 후 FORWARD chain에서 패킷 차단]]
