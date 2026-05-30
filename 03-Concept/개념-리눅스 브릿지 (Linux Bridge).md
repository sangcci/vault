---
aliases: [Linux Bridge, 리눅스 브릿지, 소프트웨어 스위치, virbr0]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) Linux 커널에서 여러 네트워크 인터페이스를 L2 계층에서 연결하는 소프트웨어 스위치.
> (이해용) 물리 스위치 없이 커널 안에서 여러 인터페이스를 하나의 네트워크로 묶어주는 허브.

---

## 해결하는 문제 (Problem Solved)

- VM·컨테이너가 Host와 동일한 네트워크 대역에서 통신해야 할 때
- 물리 NIC 없이 여러 가상 인터페이스를 L2 수준에서 연결

---

## 치르는 비용 (Cost/Trade-off)

- 브릿지 모드는 VM이 외부 네트워크에 직접 노출 → NetworkManager와 충돌 위험
- 수동 설정 시 `/etc/network/interfaces`와 NetworkManager 간 관리 충돌 발생 가능
- NAT 모드(virbr0) 대비 네트워크 설정 복잡도 증가

---

## 동작 원리 (Mechanism)

**구조**
```
       Linux Kernel
       ┌──────────────────────────────┐
       │   브릿지 (br0 / virbr0)      │
       │   L2 소프트웨어 스위치        │
       │   MAC 주소 테이블로 포워딩    │
       └────────┬──────────┬──────────┘
                │          │
           [eth0 (물리)]  [vnet0 (VM)]
                │          │
           외부 네트워크    VM Guest
```

**KVM의 두 가지 네트워크 모드**
```
NAT 모드 (기본, virbr0)
    VM → virbr0 → MASQUERADE → eth0 → 외부
    VM은 사설 IP (192.168.122.x), 외부에서 VM으로 직접 접근 불가
    DNAT + FORWARD 규칙으로 포트 포워딩 필요

브릿지 모드 (br0)
    VM → br0 → eth0 → 외부
    VM이 외부 네트워크와 동일 대역 IP 획득 (DHCP)
    외부에서 VM으로 직접 접근 가능
```

**패킷 포워딩 활성화 여부**
```
/proc/sys/net/ipv4/ip_forward
    0 → FORWARD 체인 동작 안 함 (VM 간 통신 불가)
    1 → 인터페이스 간 패킷 전달 가능
```

---

## 관련 본질 (Related Principles)

- [[본질-환경 격리 (Environment Isolation)]]
- [[본질-추상화 (Abstraction)]]

---

## 연결된 개념 (Links)

- [[개념-Netfilter와 iptables]]
- [[개념-가상 네트워크 (Virtual Network)]]
- [[사례-리눅스 브릿지 수동 설정 실패와 libvirt NAT 전환]]
