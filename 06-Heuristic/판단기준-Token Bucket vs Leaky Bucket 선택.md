---
aliases: [Token Bucket vs Leaky Bucket, Rate Limiting 전략 선택, 트래픽 제어 선택]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준

- 순간 버스트를 허용하되 장기 평균 속도 제한 → **Token Bucket** (API Rate Limiting)
- 출력을 항상 일정하게 평탄화 → **Leaky Bucket** (QoS 트래픽 쉐이핑)
- 클라이언트 친화적 (일시 대기 후 재시도) → **Token Bucket**
- 수신 측 처리 속도를 엄격히 보호 → **Leaky Bucket**

---

## 핵심 차이

```
Token Bucket             Leaky Bucket
────────────────         ────────────────
입력: 불규칙              입력: 불규칙
출력: 가변 (버스트 가능)  출력: 항상 r/s (일정)

토큰 축적 → 버스트 허용  큐 가득 차면 → 패킷 드롭
API: 초당 100req, 순간   네트워크 QoS: 1Gbps 출력
     200req 가능          초과 시 큐잉/드롭
```

---

## 효과적인 상황

- **Token Bucket**:
  - REST API Rate Limiting (Nginx, AWS API Gateway)
  - 사용자에게 버스트 크레딧 부여 (일시적 급증 허용)
  - Kubernetes API 서버 보호

- **Leaky Bucket**:
  - ISP 트래픽 쉐이핑 (SLA 보장)
  - 수신 측이 일정 처리율만 감당 가능한 경우
  - 네트워크 지터(Jitter) 제거

---

## 실패하는 상황

- **Token Bucket**: 버스트가 수신 측을 압도할 수 있는 환경 (버킷 크기 설계 중요)
- **Leaky Bucket**: 정당한 버스트 트래픽도 지연되는 UX 문제 발생

---

## 관련 노트

- [[개념-Token Bucket (토큰 버킷)]]
- [[개념-Leaky Bucket (누수 버킷)]]
- [[본질-역압 (Backpressure)]]
