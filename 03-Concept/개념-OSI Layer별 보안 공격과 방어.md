---
aliases: [OSI Security, Network Security Layers, 계층별 보안]
tags: [개념, 작성중]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) OSI 7계층 각 레이어에서 발생하는 보안 공격 유형과 그에 대응하는 방어 수단의 체계적 분류.
> (이해용) 공격자는 위에서 막히면 아래 계층으로 내려가고, 방어자는 각 층마다 문을 잠근다.

---

## 공격 대분류

| 유형 | 목적 | 대표 공격 |
|------|------|-----------|
| 서비스 거부 (DoS/DDoS) | 가용성 파괴 | SYN Flooding, Slowloris |
| 침투 및 탈취 | 기밀성 파괴 | Sniffing, ARP Spoofing, XSS |
| 침투 이후 파괴 | 무결성 파괴 | Ransomware |
| 사회공학 & 사기 | 인간 신뢰 악용 | Phishing, Typosquatting |

---

## L7 — Application

### Web 취약점: 공격-방어 인과 체인

```
[ 공격자 시나리오 ]                              [ 방어 수단 ]
        |                                               |
        v                                               v
[1] 네트워크 도청                     ──▶  HTTPS + Secure Flag
    Sniffing                               (전송 중 암호화)
        │
        └─ [실패] ──▶ [2] 스크립트 주입         ──▶  HttpOnly Flag
                        XSS                            (JS의 쿠키 접근 차단)
                          │
                          └─ [실패] ──▶ [3] 브라우저 자동 전송 악용  ──▶  Anti-CSRF Token
                                           CSRF                            (요청 진위 검증)
                                             │
                                             └─ [실패] ──▶ [4] 교차 도메인 우회  ──▶  SameSite=Lax/Strict
                                                              Same-Origin 우회         (쿠키 전송 정책 강화)
                                                                │
                                                                └─ [성공 시] ──▶ [5] 세션 탈취  ──▶  Session Timeout
                                                                                  Session             + 재인증 요구
                                                                                  Hijacking
```

> 공격은 위에서 막히면 다음 우회로를 찾는다. 방어는 각 단계를 독립적으로 막아야 한다.

**파생 노트 (심화 예정):**
- [[개념-XSS (Cross-Site Scripting)]]
- [[개념-CSRF (Cross-Site Request Forgery)]]
- [[개념-Session Hijacking]]
- [[개념-Sniffing]]

---

### SOP & CORS 취약점

```
[ 보안 원칙 ]                          [ 완화 및 취약점 ]
      |                                      |
SOP (동일 출처 정책) ───────────────▶ CORS (교차 출처 허용)
(다른 사이트 응답 차단)                 (필요에 의해 장벽을 낮춤)
      │                                      │
      ▼                                      ▼
[ 방어 실패 시 ]                       [ 백엔드 수칙 ]
공격자가 API 응답 탈취        ──▶  1. Allow-Origin을 특정 도메인으로 한정
(Sensitive Data 노출)              2. Credentials 허용 시 Origin * 금지
                                   3. 보안 민감 API는 CORS 대상에서 제외
```

**파생 노트 (심화 예정):**
- [[개념-SOP와 CORS]]

---

### 사회공학 & 사기 계열

> 사회공학 기법: 기술적 취약점이 아닌 **인간의 신뢰·심리·습관**을 악용해 정보를 탈취하거나 행동을 유도하는 공격의 총칭.

| 공격 유형 | 유인 수단 | 핵심 메커니즘 |
|-----------|-----------|---------------|
| Watering Hole | 신뢰하는 웹사이트 | 표적이 자주 가는 곳을 오염시켜 잠복 감염 |
| Phishing | 이메일 / 문자 / QR | 긴급 상황 위장 → 가짜 사이트 유도 → 자격증명 탈취 |
| Spear Phishing | 개인 맞춤 이메일 | 표적 조사 후 실명·직책 등 개인정보 활용해 신뢰 유도 |
| Vishing | 음성 전화 | 금융기관·공공기관 사칭으로 정보 요구 |
| Typosquatting | 유사 도메인 (URL) | 사용자 오타를 이용해 악성 사이트 연결 |
| Spam / SCAM | 대량 메일 / 메신저 | 보상·이익 미끼로 금전 편취 또는 정보 요구 |

**파생 노트 (심화 예정):**
- [[개념-Phishing]]
- [[개념-Watering Hole]]

---

### L7 DoS

| 공격 | 메커니즘 | 방어 |
|------|----------|------|
| HTTP GET Flooding | 정상 GET 요청을 대량 발송 | Rate Limiting, CDN |
| Slowloris | HTTP 헤더를 의도적으로 천천히 전송해 커넥션 독점 | 요청 타임아웃 단축 |
| RUDY (R-U-Dead-Yet) | POST Body를 매우 느리게 전송해 서버 자원 소진 | 최소 전송 속도 제한 |

---

## L6 — Presentation

| 공격 | 유형 | 메커니즘 | 방어 |
|------|------|----------|------|
| Heartbleed | 침투·탈취 | OpenSSL의 Heartbeat 버퍼 오버리드 → 메모리 내 평문 데이터 유출 | OpenSSL 패치, 인증서 재발급 |

---

## L5 — Session

| 공격 | 유형 | 메커니즘 | 방어 |
|------|------|----------|------|
| Session Hijacking | 침투·탈취 | 유효한 세션 ID 탈취 후 정상 사용자로 위장 | HTTPS 강제, 세션 ID 재발급, Timeout |

---

## L4 — Transport

| 공격 | 유형 | 메커니즘 | 방어 |
|------|------|----------|------|
| SYN Flooding | DoS | 3-way handshake의 SYN만 대량 전송 → 서버 연결 큐 고갈 | SYN Cookie, Firewall |
| UDP Flooding | DoS | 대량 UDP 패킷으로 대역폭·처리 자원 소진 | Rate Limiting, 트래픽 필터링 |
| TCP Hijacking | 침투·탈취 | TCP 시퀀스 번호 예측 후 세션 가로채기 | 시퀀스 번호 랜덤화, TLS |

---

## L3 — Network

| 공격 | 유형 | 메커니즘 | 방어 |
|------|------|----------|------|
| IP Spoofing | 침투·탈취 | 출발지 IP 위조로 신뢰 관계 악용 | Ingress Filtering (BCP38) |
| Smurfing | DoS | Broadcast로 ICMP Echo 발송 → 피해자에게 응답 쏠림 | Directed Broadcast 차단 |
| Ping of Death | DoS | 최대 크기 초과 ICMP 패킷으로 버퍼 오버플로 | 패킷 크기 검증 |
| Teardrop | DoS | IP 단편화 오프셋 조작 → 재조합 시 충돌 | 재조합 로직 패치 |
| Land Attack | DoS | 출발지·목적지 IP/포트를 동일하게 설정 → 무한 루프 | 동일 출발지 패킷 차단 |
| ICMP Flooding | DoS | 대량 ICMP로 대역폭 소진 | ICMP Rate Limiting |

---

## L2 — Data Link

| 공격 | 유형 | 메커니즘 | 방어 |
|------|------|----------|------|
| ARP Spoofing | 침투·탈취 | 위조 ARP Reply로 MAC 테이블 오염 → 트래픽 가로채기 | Dynamic ARP Inspection (DAI) |
| Switching Jamming | DoS/침투 | MAC 주소 테이블 포화 → 스위치가 허브처럼 동작 → 전체 브로드캐스트 | Port Security (MAC 제한) |
| Evil Twin Attack | 침투·탈취 | 정상 AP와 동일한 SSID의 가짜 AP 구축 → 클라이언트 연결 유도 | 802.1X 인증, VPN |

---

## 악성코드 (Malware)

| 유형 | 분류 | 메커니즘 | 핵심 특징 |
|------|------|----------|-----------|
| Worm | 자기복제 | 숙주 파일 없이 네트워크를 통해 자동 전파 | 대역폭 소진·DDoS 유발; Morris Worm, Blaster |
| Spyware | 정보 탈취 | 사용자 동의 없이 설치 후 브라우저 기록·자격증명 수집 | Adware와 함께 번들 설치되는 경우 多 |
| Key Logger | 정보 탈취 | 키 입력 가로채기 → 패스워드·카드번호 탈취 | HW(물리 장치) / SW(프로세스) 두 종류 |
| Ransomware | 파괴·협박 | 파일 AES 암호화 → 복호화 키를 대가로 Bitcoin 요구 | WannaCry; 무결성·가용성 동시 침해 |
| Rootkit | 은닉·지속 | OS 커널 수준에서 자신을 숨기며 관리자 권한 유지 | 백신 무력화; 탐지·제거 극히 어려움 |
| Bootkit | 은닉·지속 | MBR/UEFI 감염 → OS 부팅 전 실행으로 탐지 우선권 선점 | Rootkit보다 낮은 계층 (펌웨어 수준) |
| Logic Bomb | 트리거형 | 특정 날짜·조건 충족 시 파괴 동작 실행 | 내부자 위협(퇴직 직원 등) 사례 다수 |
| ATM 스키밍 | 물리·금융 | ATM에 카드 리더 장치 부착 → 카드 정보·PIN 탈취 | 파밍(Pharming)과 결합해 금융 사기로 연결 |

---

## 교차 계층 위협 패턴

### MITM (Man-in-the-Middle, 중간자 공격)

```
[정상 통신]   A ─────────────────── B

[MITM]        A ──▶ 공격자 ──▶ B
                   (도청·변조)

계층별 구현:
L2: ARP Spoofing     — MAC 테이블 오염으로 트래픽 우회
L4: TCP Hijacking    — 시퀀스 번호 탈취 후 세션 가로채기
L7: SSL Stripping    — HTTPS를 HTTP로 다운그레이드
```

방어: HTTPS 강제 + HSTS, 인증서 고정 (Certificate Pinning)

### APT (Advanced Persistent Threat, 지능형 지속 공격)

```
[1] 정찰      → 표적 조직 정보 수집 (OSINT, 소셜미디어)
[2] 침투      → 스피어피싱·공급망 공격으로 거점 마련
[3] 거점 확보 → Rootkit/Backdoor 설치, C&C 서버 연결
[4] 수평 이동 → 내부망 탐색, 권한 상승 (Lateral Movement)
[5] 정보 수집 → 민감 데이터 색인
[6] 유출      → 암호화 채널로 외부 전송 (탐지 회피)
```

특징: 국가 수준 행위자가 배후인 경우 多, 수개월~수년 단위 은밀 작전

---

## 방어 도구 및 프로그램

| 도구 | 유형 | 설명 |
|------|------|------|
| Honeypot | 탐지 | 의도적으로 취약하게 설계한 유인 시스템 → 공격자 기법·경로 분석 |
| XDR | 탐지·대응 | 엔드포인트·네트워크·클라우드를 통합한 위협 탐지·대응 플랫폼 (EDR + NDR의 통합) |
| Bug Bounty | 예방 | 취약점 발견·신고자에게 보상하는 프로그램 → 화이트햇 해커 활용한 사전 예방 |

---

## 계층별 공격-방어 요약

```
L7  Application  │ XSS, CSRF, Session Hijacking, Phishing, Slowloris, RUDY, HTTP GET Flooding
L6  Presentation │ Heartbleed, SSL Stripping (MITM)
L5  Session      │ Session Hijacking
L4  Transport    │ SYN Flooding, UDP Flooding, TCP Hijacking
L3  Network      │ IP Spoofing, Smurfing, Ping of Death, Teardrop, Land Attack, ICMP Flooding
L2  Data Link    │ ARP Spoofing, Switching Jamming, Evil Twin
Host (OS)        │ Rootkit, Bootkit, Worm, Spyware, Ransomware, Key Logger, Logic Bomb
Cross-layer      │ MITM, APT
물리·금융         │ ATM 스키밍
방어 도구         │ Honeypot, XDR, Bug Bounty
```

> 상위 계층일수록 애플리케이션 로직·신뢰 관계를 노린다.
> 하위 계층일수록 프로토콜 구조 자체의 취약점을 노린다.
> Host/물리 계층 위협은 OS·펌웨어·인간을 직접 겨냥한다.

---

## 관련 본질

- [[본질-기밀성·무결성·가용성 (CIA Triad)]]
