---
aliases: [Bridge_to_libvirt_NAT, 네트워크_설정_시행착오]
tags: [사례, 작성중]
type: Case
difficulty: Medium
---

## 구조도 (Diagram)

```text
[1차 시도: 수동 브릿지 설정 - 실패]
Admin (SSH) --X-- [Physical NIC (No IP)] <---- [Manual Bridge (br0)]
                  (NIC가 브릿지에 종속되며 IP가 증발하여 SSH 단절)

[2차 시도: libvirt NAT 도입 - 성공]
Admin (SSH) ----> [Physical NIC (192.168.0.10)] ----> Host OS (Gateway)
                               |
                        (libvirt NAT / Forwarding)
                               |
                    [Virtual Bridge (virbr0)]
                       |            |
                    [VM 1]       [VM 2]
                (192.168.122.x) (192.168.122.x)
```

## 상황 (Situation)

- KVM 가상 머신(VM) 구축을 위해 호스트의 물리 네트워크와 VM들을 연결하는 작업 진행.
- **초기 계획**: 물리 NIC를 `br0` 브릿지에 직접 묶어 VM들이 물리 네트워크 대역의 IP를 직접 할당받게 하려 함 (L2 Bridge).
- **변경 계획**: 수동 설정 중의 SSH 단절 이슈와 복잡성을 해결하기 위해, libvirt가 관리하는 가상 네트워크(NAT 방식)로 선회함.

## 실제 발생한 일 (What Happened)

1. **수동 설정 실패**: `netplan` 등을 통해 물리 NIC를 브릿지의 Slave로 설정하는 순간, 물리 NIC의 IP 할당이 해제되면서 원격 SSH 접속이 즉시 끊김. 
2. **복구 및 대안**: 물리적 콘솔 접근을 통해 설정을 롤백한 후, 호스트의 접속 안정성을 유지하기 위해 물리 NIC는 그대로 두고 libvirt의 가상 네트워크(`default` network, NAT 모드)를 활성화함.
3. **결과**: 호스트는 기존 IP로 안정적인 접속이 가능해졌으며, VM들은 `virbr0`를 통해 내부 사설망을 구축하고 호스트의 NAT를 통해 외부와 통신하게 됨.

## 근본 원인 (Root Cause)

- **L3 IP 증발**: 물리 인터페이스가 L2 브릿지에 종속되면, 해당 인터페이스는 더 이상 직접적인 IP 통신(L3)을 수행하지 않고 데이터 전달자 역할만 하게 됨. 브릿지 자체에 IP를 다시 할당하기 전까지 통신이 불가능해지는 '설계상의 필연적 단절'임.
- **라우팅 관리의 복잡성**: 수동 브릿지 설정 시 기본 게이트웨이와 라우팅 테이블을 직접 정교하게 수정해야 하지만, libvirt는 이를 자동화(`iptables`, `dnsmasq`)하여 설정 오류를 방지함.

## 교훈 및 조치 (Lessons & Fixes)

- **추상화 도구 활용**: 네트워크 스택이 복잡해질수록 수동 설정보다는 libvirt와 같은 검증된 가상화 관리 도구의 기능을 활용하는 것이 안전함.
- **NAT 모드의 장점**: 호스트의 네트워크 설정을 크게 건드리지 않으면서도 가상 환경 간의 독립적인 네트워크 대역을 손쉽게 구축할 수 있음.
- **장애 전파 방지**: 수동 브릿지 설정 실패는 호스트 전체의 네트워크 마비를 초래하지만, libvirt NAT 방식은 호스트의 통신에 영향을 주지 않고 격리된 네트워크를 제공함.

## 연결 지식
- [[본질-환경 격리 (Environment Isolation)]]
- [[개념-리눅스 브릿지 (Linux Bridge)]]
- [[개념-ONT와 공유기의 구조적 차이]]
