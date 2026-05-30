---
aliases: [Token Bucket, 토큰 버킷, Rate Limiting, 속도 제한]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 일정 속도로 토큰이 채워지는 버킷에서 패킷 전송마다 토큰을 소비하는 트래픽 제어 알고리즘.
> (이해용) 게임 스태미너 — 초당 조금씩 차고, 행동마다 소비. 모아두면 순간 버스트 가능.

---

## 해결하는 문제

- API 과부하 방지 (Rate Limiting)
- 네트워크 트래픽 버스트 허용 + 장기 평균 속도 제한

---

## 치르는 비용

- 버킷 최대 크기만큼 순간 버스트 허용 → 수신 측이 버스트 처리 능력 필요
- Leaky Bucket 대비 출력 속도 불균등

---

## 동작 원리

```
[ 토큰 생성 & 소비 ]

토큰 생성: 초당 r개 (rate)
버킷 최대: b개 (burst size)

요청 처리:
  토큰 ≥ 1 → 토큰 1 소비, 요청 통과
  토큰 < 1 → 요청 거부 or 대기

[ 시뮬레이션: r=2/s, b=5 ]
시간  토큰  요청  결과
 0s    5    3    통과 (토큰 5→2)
 1s    4    1    통과 (토큰 4→3)
 2s    5    6    5개 통과, 1개 거부 (버킷 한도 초과)
 3s    2    0    토큰 축적

[ 버스트 허용 특성 ]
Leaky Bucket: 일정 속도로만 출력 (버스트 불가)
Token Bucket: 누적 토큰으로 순간 버스트 가능 ← 핵심 차이
```

---

## 실제 사용처

- **Nginx** — `limit_req_zone` (Token Bucket 기반)
- **AWS API Gateway** — 요청 속도 제한
- **Kubernetes** — `kube-apiserver` 요청 제한
- **Linux tc (Traffic Control)** — `tbf` (Token Bucket Filter) qdisc
- **Redis + Lua** — 분산 Rate Limiting 구현

---

## 관련 본질

- [[본질-역압 (Backpressure)]]
- [[본질-처리량과 지연시간 (Throughput and Latency)]]
- [[본질-트레이드오프 (Trade-off)]]
- [[개념-Leaky Bucket (누수 버킷)]]
- [[판단기준-Token Bucket vs Leaky Bucket 선택]]
