---
aliases: [DNAT Forward Chain Blocked, VM Port Forwarding Failure, NAT Routing Forward]
tags: [문제, 작성중, Network, NAT, VM]
difficulty: High
type: Problem
---

# Problem: 14-DNAT 설정 후에도 VM 서비스에 외부 접속이 되지 않음

## 상황

KVM/libvirt NAT 모드에서 VM 내부 nginx를 외부에 노출하려고 한다.

```text
Host 공인 IP:80
  ↓ DNAT
VM 192.168.122.10:80
```

DNAT 규칙은 추가했고 패킷 카운터도 증가한다. 그런데 외부에서 접속하면 VM 서비스에 도달하지 않는다.

---

## 관찰된 증거

```text
외부 패킷
  ↓
[nat/PREROUTING] DNAT → 192.168.122.10:80  ✓
  ↓
[Routing Table] virbr0로 경로 결정          ✓
  ↓
[filter/FORWARD] ufw-reject-forward DROP    ✗
```

증상은 다음처럼 나타난다.

- Host에서 VM IP로 직접 `curl 192.168.122.10`은 성공한다.
- `iptables -t nat -L PREROUTING -v -n`에서는 DNAT 규칙 카운터가 증가한다.
- `ufw allow 80`을 했는데도 외부 접속은 실패한다.
- `iptables -L FORWARD -v -n`에서 DROP 카운터가 증가한다.

---

## 의심 문제

가장 가능성 높은 문제는 **NAT, routing, firewall chain의 역할을 한 단계로 착각한 것**이다.

DNAT은 목적지 주소를 바꿀 뿐이고, VM으로 보내도 되는지는 FORWARD 체인에서 다시 판단한다.

---

## 원인

포트 포워딩은 한 규칙으로 끝나지 않는다. 패킷은 여러 계층을 순서대로 통과한다.

```text
1. DNAT       : 목적지 주소 교체
2. Routing    : 변경된 목적지를 보고 나갈 인터페이스 결정
3. FORWARD    : Host를 경유해 다른 인터페이스로 가도 되는지 허용 판단
4. SNAT/MASQ  : 필요하면 출발지 주소 교체
```

`ufw allow 80`은 Host 자신이 받는 INPUT 체인을 여는 규칙이다. DNAT 후 목적지가 VM이면 Host 프로세스가 받는 패킷이 아니므로 INPUT이 아니라 FORWARD 체인으로 간다.

```text
Host 자신이 목적지: INPUT
VM/컨테이너가 목적지: FORWARD
```

따라서 VM으로 가는 포트 포워딩에는 DNAT 규칙과 함께 `ufw route allow` 또는 FORWARD 허용 규칙이 필요하다.

---

## 확인 방법

- `iptables -t nat -L PREROUTING -v -n`으로 DNAT 카운터 증가 여부를 확인한다.
- `ip route get <vm-ip>`로 변경된 목적지가 어떤 인터페이스로 가는지 확인한다.
- `iptables -L FORWARD -v -n`으로 FORWARD 체인 DROP 여부를 확인한다.
- `/proc/sys/net/ipv4/ip_forward`가 `1`인지 확인한다.
- Host 자신이 받는 서비스인지, Host를 경유해 VM/컨테이너로 가는 서비스인지 구분한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/위험 |
|---|---|---|
| `ufw route allow` 추가 | ufw 체계 안에서 FORWARD 허용 | ufw route와 allow 차이를 이해해야 함 |
| iptables FORWARD 규칙 직접 추가 | 세밀한 제어 가능 | ufw/firewalld와 충돌 가능 |
| libvirt NAT 기본 네트워크 사용 | host 네트워크 안정성 유지 | 외부 노출에는 포트 포워딩 필요 |
| 브릿지 모드 사용 | VM이 외부망 IP를 직접 받아 단순 | Host NIC 설정 실패 시 SSH 단절 위험 |
| Cloudflare Tunnel 사용 | 인바운드 포트 개방 불필요 | Cloudflare/WAF 계층 의존 |

---

## 트레이드오프

NAT 모드는 Host 네트워크를 크게 건드리지 않아 안전하지만, 외부 노출 시 DNAT/FORWARD/SNAT 흐름을 이해해야 한다. 브릿지 모드는 외부에서 VM에 직접 접근하기 쉽지만, 물리 NIC와 Host IP 설정을 잘못 다루면 Host 접속 자체가 끊길 수 있다.

네트워크 격리는 “접근을 막는 것”과 “필요한 통로만 여는 것”을 동시에 설계하는 문제다.

---

## 연결되는 본질

- [[본질-주소 변환과 경로 결정의 분리]]
- [[본질-네트워크 경계와 노출면]]
- [[본질-폭발 반경과 격벽]]

---

## 참고

> "You can use a NAT gateway so that instances in a private subnet can connect to services outside your VPC" — [AWS VPC NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)

> "but external services can't initiate a connection with those instances." — [AWS VPC NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)

> "An internet gateway is a horizontally scaled, redundant, and highly available VPC component that allows communication between your VPC and the internet." — [AWS VPC Internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
