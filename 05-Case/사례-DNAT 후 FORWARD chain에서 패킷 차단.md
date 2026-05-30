---
aliases: [DNAT FORWARD 차단, ufw route, 포트 포워딩 실패]
tags: [사례, 작성중]
type: Case
difficulty: Low
---

## 상황 (Situation)

- Host: Debian 13 / KVM + libvirt (NAT 모드, virbr0)
- VM (192.168.122.10): nginx 컨테이너 80 포트 실행 중
- 목표: 외부에서 Host 공인 IP로 접속 시 VM nginx로 포워딩

---

## 실제 발생한 일 (What Happened)

DNAT 규칙과 `ufw allow 80`을 설정했음에도 외부에서 VM nginx 접속 불가.

```
외부 패킷
    │
[PREROUTING] DNAT → 192.168.122.10:80  ✓ (패킷 카운터 증가 확인)
    │
[FORWARD]
    ufw-reject-forward → DROP           ✗
    ACCEPT 규칙 (pkts: 0)              ← 여기까지 도달하지 못함
```

VM IP로 직접 접속(`curl 192.168.122.10`)은 성공 → DNAT 자체는 정상 동작.

---

## 근본 원인 (Root Cause)

- `ufw allow 80`은 `filter/INPUT` 체인에만 규칙을 추가
- DNAT 후 패킷의 목적지는 Host 자신이 아닌 VM → `FORWARD` 체인으로 분기
- `FORWARD` 체인에는 허용 규칙이 없어 ufw 기본 정책(DROP)에 걸림

연결된 원인: [[탐구-FORWARD chain과 INPUT chain은 왜 별도로 존재하는가]]

---

## 교훈 및 조치 (Lessons & Fixes)

**해결 명령**
```bash
ufw route allow proto tcp to 192.168.122.10 port 80
```

**핵심 체크리스트**
```
포트 포워딩(DNAT) 설정 시 반드시 확인:
  ☑ DNAT 규칙 (nat/PREROUTING)
  ☑ FORWARD 허용 규칙 (filter/FORWARD) ← 자주 빠뜨리는 항목
  ☑ ip_forward 활성화 여부 (/proc/sys/net/ipv4/ip_forward = 1)
```

**규칙 진단 방법**
```bash
# 패킷 카운터로 어느 체인에서 막히는지 확인
iptables -L FORWARD -v -n
iptables -t nat -L PREROUTING -v -n
```

---

## 연결된 개념 (Links)

- [[개념-Netfilter와 iptables]]
- [[개념-DNAT과 SNAT]]
- [[개념-ufw]]
