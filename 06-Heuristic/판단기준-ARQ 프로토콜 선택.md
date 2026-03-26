---
aliases: [ARQ 선택 기준, ARQ 프로토콜 비교, 슬라이딩 윈도우 선택]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준

- 단순성 최우선 + 저대역폭 환경 → **Stop-and-Wait**
- 고대역폭 + 수신 버퍼 최소화 → **Go-Back-N**
- 고대역폭 + 손실률 높은 환경 → **Selective Repeat** (현대 TCP SACK)
- TCP 최적화 이해 필요 → Selective Repeat이 TCP SACK의 기반

## 알고리즘 비교표

| 프로토콜 | 회선 이용률 | 수신 버퍼 | 재전송 범위 | 구현 복잡도 |
|---------|------------|----------|------------|------------|
| Stop-and-Wait | 매우 낮음 | 1 | 해당 프레임만 | 매우 단순 |
| Go-Back-N | 높음 | 1 | 오류 이후 전부 | 중간 |
| Selective Repeat | 높음 | N/2 | 오류 프레임만 | 복잡 |

## 회선 이용률 공식

```
Stop-and-Wait: U = T_f / (T_f + 2T_p)
Go-Back-N:    U = W × T_f / (T_f + 2T_p)   (W = 윈도우 크기)
              단, W ≥ 2a+1 이면 U = 1 (100%)
```

## 효과적인 상황

- **Stop-and-Wait**: RTT 매우 짧은 로컬 링크, 임베디드 시스템
- **Go-Back-N**: 오류율 낮고 수신 버퍼 제약 있는 환경
- **Selective Repeat**: 오류율 높은 무선 환경, 고대역폭 WAN (현대 TCP)

## 실패하는 상황

- **Stop-and-Wait**: 위성 통신 (RTT 500ms+) — 이용률 0.1% 이하
- **Go-Back-N**: 오류율 높은 환경 — 대량 재전송으로 효율 급락
- **Selective Repeat**: 수신 버퍼 제약 심한 환경 — 버퍼 오버플로우 위험

## 관련 노트

- [[개념-Stop-and-Wait]]
- [[개념-Go-Back-N]]
- [[개념-Selective Repeat]]
- [[개념-Sliding Window]]
