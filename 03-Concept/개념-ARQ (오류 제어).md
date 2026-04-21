---
aliases: [ARQ, Automatic Repeat reQuest, 오류 제어, BEC, Backward Error Correction, 전송 오류 수정]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 수신 측이 오류를 감지하면 송신 측에 재전송을 요청하는 오류 제어 메커니즘.
> (이해용) 틀리면 다시 보내달라고 요청하는 방식 — 수신자가 직접 고치는 FEC와 반대.

## 해결하는 문제

- 전송 중 발생하는 비트 오류, 프레임 손실 복구
- 신뢰성 있는 데이터 전달 보장

## 오류 제어 분류

```
오류 제어
├── FEC (Forward Error Correction, 전진 오류 수정)
│   수신 측이 오류를 스스로 교정 (재전송 불필요)
│   예: Hamming Code, Reed-Solomon
│
└── BEC (Backward Error Correction, 후진 오류 수정) = ARQ
    오류 감지 후 송신 측에 재전송 요청
    ├── Stop-and-Wait ARQ
    ├── Go-Back-N ARQ
    └── Selective Repeat ARQ
```

## ARQ 방식 비교

| 방식 | 동작 | 재전송 범위 | 수신 버퍼 | 회선 이용률 | 현대 사용 |
|------|------|------------|----------|------------|----------|
| Stop-and-Wait | ACK 올 때까지 대기 | 해당 프레임만 | 1 | 매우 낮음 | 레거시, 임베디드 |
| Go-Back-N | 오류 프레임부터 전부 재전송 | 오류 이후 전부 | 1 | 높음 (오류율 낮을 때) | 일부 링크 계층 |
| Selective Repeat | 오류 프레임만 선택 재전송 | 오류 프레임만 | N/2 | 높음 | **TCP SACK**, QUIC |

## 동작 원리

```
[ Stop-and-Wait ]
송신            수신
  ──Frame 0──→
  ←── ACK 0 ──
  ──Frame 1──→        ← ACK 올 때까지 다음 전송 불가
  ←── ACK 1 ──

이용률 = T_frame / (T_frame + 2×T_prop)
RTT가 클수록 효율 급락 (위성: 0.1% 이하)

[ Go-Back-N ]
송신: 0─1─2─3─4─5...
           ↑ 2번 오류

수신: 0✓ 1✓ 2✗ → 3,4,5 무시 (순서 어긋남)
재전송: 2─3─4─5 (2번부터 전부)

윈도우 크기 ≤ 2^n - 1  (n: 순서 번호 비트 수)

[ Selective Repeat ]
송신: 0─1─2─3─4─5...
           ↑ 2번 오류

수신: 0✓ 1✓ 2✗ 3✓(버퍼) 4✓(버퍼)
재전송: 2만 재전송 → 버퍼[3,4]와 합쳐 순서 복원

윈도우 크기 ≤ 2^(n-1)  (Go-Back-N보다 엄격)
```

## 회선 이용률 공식

```
Stop-and-Wait: U = T_f / (T_f + 2T_p)
Go-Back-N:     U = W × T_f / (T_f + 2T_p)   W = 윈도우 크기
               단, W ≥ 2a+1 이면 U = 1 (100%)
```

## TCP와의 연결

- **TCP SACK (Selective Acknowledgment)** = Selective Repeat의 직접 구현 (RFC 2018)
  - TCP 옵션 필드로 수신된 불연속 세그먼트 범위를 송신자에 알림
- **TCP 슬라이딩 윈도우** = Go-Back-N / Selective Repeat의 기반 메커니즘
- 자세한 윈도우 동작 → [[개념-Sliding Window]]

## 관련 본질

- [[본질-신뢰성 (Reliability)]]
- [[본질-처리량과 지연시간 (Throughput and Latency)]]
- [[본질-트레이드오프 (Trade-off)]]
