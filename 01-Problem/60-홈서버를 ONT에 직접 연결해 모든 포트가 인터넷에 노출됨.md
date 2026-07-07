---
aliases: [Home Server Direct Public IP Exposure, ONT Router Firewall NAT]
tags: [문제, 작성중, Network, Security, HomeLab]
difficulty: Medium
type: Problem
---

# Problem: 60-홈서버를 ONT에 직접 연결해 모든 포트가 인터넷에 노출됨

## 상황

홈서버를 벽면 포트나 ONT에 직접 연결했더니 서버가 공인 IP를 받았다. SSH, DB, 관리자 포트가 공유기 NAT/방화벽을 거치지 않고 인터넷에서 직접 접근 가능한 상태가 된다.

```text
위험한 구조
Internet -> ONT -> Home Server(public IP)

권장 구조
Internet -> ONT -> Router(NAT/Firewall) -> Home Server(private IP)
```

---

## 관찰된 증거

- 서버 NIC에 사설 IP가 아니라 공인 IP가 할당된다.
- 공유기 포트포워딩 설정 없이 외부에서 서버 포트가 열린다.
- 스캔 로그, SSH brute force, 알 수 없는 요청이 바로 서버에 들어온다.
- ufw/iptables가 유일한 방어선이 된다.

---

## 원인

ONT는 광신호를 전기 신호로 바꾸는 망 종단 장치일 뿐, 일반적으로 가정용 공유기처럼 NAT와 방화벽 정책을 제공하는 경계 장비가 아니다. 서버가 공인 IP를 직접 받으면 네트워크 경계가 서버 내부 방화벽으로 밀려난다.

---

## 해결 방향

- 홈서버는 공유기 하단 사설망에 둔다.
- 외부 노출은 포트포워딩, Cloudflare Tunnel, VPN 중 필요한 방식만 선택한다.
- SSH는 key 기반 인증, IP 제한, fail2ban보다 앞선 노출면 축소를 우선한다.
- 운영 서비스와 관리 포트를 분리한다.
- 외부 스캔으로 실제 노출 포트를 확인한다.

---

## 연결되는 본질

- [[본질-네트워크 경계와 노출면]]
- [[본질-보안 통제 지점과 방어 심층화]]

---

## 참고

> "Firewalls provide protection against outside cyber attackers by shielding your computer or network from malicious or unnecessary network traffic." — [CISA: Understanding Firewalls for Home and Small Office Use](https://www.cisa.gov/news-events/news/understanding-firewalls-home-and-small-office-use)

> "Enable router firewall: Most routers come with a built-in firewall to prevent unauthorized incoming internet traffic." — [CISA: Small Office/Home Office Router Security](https://www.cisa.gov/sites/default/files/publications/HomeRouterSecurity2011.pdf)
