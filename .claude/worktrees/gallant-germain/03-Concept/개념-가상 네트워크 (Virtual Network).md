---
aliases: [Virtual Network, 가상 네트워크 인터페이스, veth, virbr0]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) 물리 NIC 없이 커널이 소프트웨어로 생성한 네트워크 인터페이스. VM·컨테이너·루프백 통신에 사용된다.
> (이해용) 실제 랜선 없이 커널이 만들어낸 가상의 네트워크 포트.

## 해결하는 문제 (Problem Solved)

- VM·컨테이너가 물리 NIC 없이 네트워크 통신
- Host와 VM 간, VM끼리 격리된 채널 제공
- 루프백(`lo`)으로 Host 내부 프로세스 간 통신

## 치르는 비용 (Cost/Trade-off)

- 가상 인터페이스가 늘어날수록 커널의 라우팅·브릿지 관리 부하 증가
- 실제 물리 NIC가 아니므로 트러블슈팅 시 혼동 유발 (`ip addr`로 구분 필요)

## 동작 원리 (Mechanism)

**Linux 네트워크 인터페이스 종류**
```
물리 NIC      eth0, enp1s0, enx...   실제 하드웨어 연결
가상 브릿지   virbr0                 KVM 기본 NAT 네트워크
veth 쌍       veth0 ↔ veth1          컨테이너-Host 간 터널 (한쪽 → 다른쪽)
루프백        lo (127.0.0.1)         Host 내부 통신 전용
```

**veth 쌍 동작 원리**
```
[Container]          [Host Kernel]
  eth0(veth1)  ←→    veth0
               패킷이 한쪽으로 들어오면 반대쪽으로 나옴
               컨테이너 네트워크 격리의 핵심
```

**KVM의 가상 네트워크 인터페이스**
```
Host
 ├── eth0       물리 NIC (외부 인터넷)
 ├── virbr0     가상 브릿지 (VM 기본 게이트웨이 192.168.122.1)
 └── vnet0      VM과 연결된 tap 인터페이스

VM
 └── enp1s0     VM 내부에서 보이는 가상 NIC
```

## 관련 본질 (Related Principles)

- [[본질-환경 격리 (Environment Isolation)]]
- [[본질-추상화 (Abstraction)]]

## 연결된 개념 (Links)

- [[개념-리눅스 브릿지 (Linux Bridge)]]
- [[개념-Netfilter와 iptables]]
