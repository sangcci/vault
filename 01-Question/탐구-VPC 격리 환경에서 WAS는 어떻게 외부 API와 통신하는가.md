---
aliases: [VPC WAS 외부 통신, 프라이빗 서브넷 인터넷 통신]
tags: [탐구, 작성중]
type: Question
difficulty: Medium
---

## 핵심 질문 (Core Question)

> 프라이빗 서브넷에 있는 WAS는 공인 IP가 없는데, 어떻게 외부 API를 호출할 수 있는가?

## 가설 및 추론 (Hypothesis)

- 프라이빗 서브넷은 외부에서 직접 접근 불가 → 보안상 의도된 설계
- 하지만 WAS는 외부 결제 API, 지도 API 등을 호출해야 함
- 공인 IP 없이 외부로 나가려면 대신 공인 IP를 가진 중간 장치가 필요할 것
- 이 중간 장치가 출발지 IP를 자신의 공인 IP로 교체(SNAT)해서 내보낼 것

## 검증 및 팩트 (Verification)

**VPC 기본 구조**
```
인터넷
  │
[Internet Gateway]   VPC ↔ 인터넷 양방향 관문
  │
[퍼블릭 서브넷]      공인 IP 보유 (Web, Load Balancer 등)
  │
[NAT Gateway]        프라이빗 → 인터넷 아웃바운드 전용
  │
[프라이빗 서브넷]    공인 IP 없음 (WAS, DB 등)
```

**WAS → 외부 API 호출 흐름**
```
WAS (10.0.2.10)
    │  아웃바운드 요청
    ↓
[라우팅 테이블]  0.0.0.0/0 → NAT Gateway로
    │
[NAT Gateway]   출발지 IP를 NAT Gateway 공인 IP로 교체 (SNAT)
    │              10.0.2.10 → 52.x.x.x
    ↓
[Internet Gateway]
    │
외부 API 서버   52.x.x.x에서 온 요청으로 인식
    │
응답 패킷       52.x.x.x로 반환
    │
[NAT Gateway]   Connection Tracking으로 WAS(10.0.2.10)에게 전달
    ↓
WAS 응답 수신
```

**Internet Gateway와의 차이**
```
Internet Gateway   양방향 통신 가능
                   외부 → 퍼블릭 서브넷 인바운드 가능
                   공인 IP 직접 할당 필요

NAT Gateway        아웃바운드 전용
                   외부 → 프라이빗 서브넷 인바운드 불가
                   공인 IP 불필요 (NAT Gateway가 대신 보유)
```

**왜 DB는 NAT Gateway도 필요 없는가**
```
DB는 외부 API 호출 자체를 하지 않음
→ 아웃바운드 트래픽 없음
→ NAT Gateway 불필요
→ 라우팅 테이블에 인터넷 경로 자체를 두지 않음 (완전 격리)
```

## 결론 (Conclusion)

- 프라이빗 서브넷 WAS의 외부 통신은 **NAT Gateway의 SNAT**를 통해 가능
- 외부에서는 NAT Gateway 공인 IP만 보임 → WAS의 실제 IP 노출 없음
- **아웃바운드는 가능, 인바운드는 차단** — 격리와 통신을 동시에 충족하는 구조
- Linux iptables MASQUERADE와 동일한 원리, AWS가 매니지드 서비스로 제공하는 것

## 연결된 개념 (Links)

- [[개념-NAT Gateway]]
- [[개념-DNAT과 SNAT]]
- [[탐구-왜 Web-WAS-DB 계층 구조를 사용하는가]]
