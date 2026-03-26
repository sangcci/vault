---
aliases: [Throughput, Latency]
tags: [본질, 작성중]
created: 2026-02-03
updated: 2026-02-04
type: Principle
difficulty: Medium
---
# Principle: 처리량과 지연시간 (Throughput and Latency)
**핵심 질문**: "빠른 것이 성능의 전부인가? 시스템이 감당하는 무게와 반응 속도를 어떻게 균형 잡을 것인가?"

## One-liner Definition
> (사전적) 처리량은 단위 시간당 처리 가능한 요청 수, 지연시간은 단일 요청이 완료되기까지 걸리는 시간.
> (이해용) **"고속도로의 차선 수(처리량)와 자동차의 최고 속도(지연시간)의 관계."**

## Usage Examples (문장 3개)
1. "배치 처리 시스템을 도입하여 전체적인 **처리량**은 높였지만, 개별 데이터의 처리 **지연시간**은 늘어났다."
2. "사용자 경험을 개선하기 위해 평균 응답 시간보다 P99 **지연시간**을 낮추는 최적화에 집중했다."
3. "서버를 수평 확장(Scale-out)하여 초당 처리할 수 있는 **처리량**(TPS)을 두 배로 끌어올렸다."

## Recurring Core Problem
성능을 단순히 "빠르다"라고 정의하면 오해가 생깁니다. 시스템이 얼마나 많은 일을 동시에 할 수 있는지(Capacity)와 하나의 일을 얼마나 빨리 끝내는지(Response Time)는 서로 다른 최적화 지점을 갖기 때문입니다. 특히 처리량을 늘리기 위한 병렬화가 오히려 지연시간을 늘리는 역설적인 상황을 어떻게 관리할 것인가가 핵심입니다.

## Why It Doesn't Disappear
시스템 자원(CPU, Memory, Network)은 항상 한정되어 있기 때문입니다. 자원을 최대한 효율적으로 쓰려 하면(High Throughput) 대기 줄이 생겨 지연시간이 늘어나고, 지연시간을 최소화하려 하면(Low Latency) 자원을 넉넉하게 비워둬야 하므로 효율이 떨어지는 물리적 제약이 존재합니다.

## Trade-offs
- **처리량 vs 지연시간**: 배치 처리(Batching)는 오버헤드를 줄여 처리량을 높이지만 지연시간을 늘립니다. 반면 즉시 처리(Immediate)는 지연시간은 낮추지만 잦은 I/O로 전체 처리량이 떨어집니다.
- **P99 지연시간 vs 평균 지연시간**: 대부분의 사용자가 빨라도(평균), 특정 사용자에게 치명적으로 느린 경험(Tail Latency)을 제공한다면 시스템의 신뢰도가 하락합니다.

## Appears As
- **TPS/RPS**: 초당 트랜잭션/요청 수 (처리량)
- **Response Time/RTT**: 응답 시간 (지연시간)
- **P95, P99 Percentiles**: 지연시간 분포의 하위 5%, 1% 경험

## Related Cases
- [[본질-가용성 (Availability)]]
- [[본질-확장성 (Scalability)]]
- [[본질-트레이드오프 (Trade-off)]]
