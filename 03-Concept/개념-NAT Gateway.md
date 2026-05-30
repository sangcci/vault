---
aliases: [NAT Gateway, 나트 게이트웨이, 프라이빗 서브넷 인터넷]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) VPC 프라이빗 서브넷의 인스턴스가 공인 IP 없이 인터넷으로 아웃바운드 통신할 수 있게 해주는 매니지드 SNAT 장치.
> (이해용) 공인 IP 없는 내부 서버 대신 자신의 공인 IP로 외부에 대신 나갔다 오는 대리인.

---

## 해결하는 문제 (Problem Solved)

- 프라이빗 서브넷 인스턴스(WAS 등)가 외부 API를 호출해야 하는 상황
- 보안상 인바운드는 차단하면서 아웃바운드만 허용해야 하는 요구

---

## 치르는 비용 (Cost/Trade-off)

- 트래픽 양에 따른 과금 (GB당 비용)
- NAT Gateway 자체가 단일 장애점이 될 수 있음 (가용 영역별 배치 권장)
- 인바운드 통신 불가 — 외부에서 프라이빗 서브넷으로 직접 접근은 여전히 차단

---

## 동작 원리 (Mechanism)

**SNAT 기반 아웃바운드 흐름**
```
프라이빗 서브넷 인스턴스 (10.0.2.10)
    │
    ↓  라우팅 테이블: 0.0.0.0/0 → NAT Gateway
[NAT Gateway]
    출발지 IP 교체: 10.0.2.10 → 52.x.x.x (NAT Gateway 공인 IP)
    Connection Tracking 테이블에 기록
    │
    ↓
[Internet Gateway] → 외부 인터넷

응답 패킷 수신 시:
    NAT Gateway가 Connection Tracking으로 10.0.2.10을 찾아 전달
```

**Internet Gateway vs NAT Gateway**
```
                  Internet Gateway      NAT Gateway
통신 방향         양방향               아웃바운드 전용
인바운드 가능     ✓                    ✗
공인 IP 필요      인스턴스 직접 보유   NAT Gateway가 대신 보유
배치 위치         퍼블릭 서브넷 연결   퍼블릭 서브넷에 위치
사용 대상         Web, Load Balancer   WAS, 배치 서버 등
```

**서브넷별 라우팅 테이블 설계**
```
퍼블릭 서브넷 라우팅
    0.0.0.0/0 → Internet Gateway   (외부 직접 통신)

프라이빗 서브넷 (WAS) 라우팅
    0.0.0.0/0 → NAT Gateway        (아웃바운드만)

프라이빗 서브넷 (DB) 라우팅
    인터넷 경로 없음               (완전 격리)
```

---

## 관련 본질 (Related Principles)

- [[본질-환경 격리 (Environment Isolation)]] — 격리와 통신을 동시에 충족
- [[본질-추상화 (Abstraction)]] — Linux iptables MASQUERADE를 매니지드 서비스로 추상화

---

## 연결된 개념 (Links)

- [[개념-DNAT과 SNAT]]
- [[탐구-VPC 격리 환경에서 WAS는 어떻게 외부 API와 통신하는가]]
