---
aliases: [Leaky Bucket, 누수 버킷, 트래픽 쉐이핑, Traffic Shaping]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 입력이 불규칙해도 일정한 속도로만 출력하는 큐 기반 트래픽 제어 알고리즘.
> (이해용) 물통에 구멍 — 위에서 쏟아부어도 아래로 떨어지는 속도는 항상 일정.

## 해결하는 문제

- 버스트 트래픽을 평탄화(smoothing)하여 수신 측 과부하 방지
- 네트워크 QoS에서 일정 출력 속도 보장

## 치르는 비용

- 순간 버스트 처리 불가 → 정당한 요청도 큐에서 대기
- 큐가 가득 차면 패킷 드롭
- 지연 발생 (큐 대기)

## 동작 원리

```
[ 구조 ]
입력 (불규칙)        큐          출력 (일정)
───────────→  [■■■■■■□□□]  →──────→  r 패킷/s
  버스트 허용      ↑ 가득 차면 드롭     항상 일정

[ 시뮬레이션: r=2/s, 큐 크기=5 ]
시간  도착  큐 상태  출력  드롭
 0s    5   [■■■■■]   2     0
 1s    3   [■■■■■■] → 드롭 1, 출력 2
 2s    0   [■■■]     2     0
 3s    1   [■■]      2     0

[ Token Bucket vs Leaky Bucket ]
                Token Bucket    Leaky Bucket
버스트 처리       가능           불가 (큐 대기)
출력 속도         가변           일정 (r/s)
구현 방식         카운터         큐(FIFO)
적합 상황         API Rate Limit  QoS 트래픽 평탄화
```

## 실제 사용처

- **네트워크 QoS** — ISP 트래픽 쉐이핑
- **Linux tc** — `sfq`, `tbf` 큐 기반
- **일부 API Gateway** — 엄격한 처리율 제한 (버스트 불허)

## 관련 본질

- [[본질-역압 (Backpressure)]]
- [[본질-처리량과 지연시간 (Throughput and Latency)]]
- [[개념-Token Bucket (토큰 버킷)]]
- [[판단기준-Token Bucket vs Leaky Bucket 선택]]
