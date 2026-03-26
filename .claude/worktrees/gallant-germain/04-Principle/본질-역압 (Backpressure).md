---
aliases: [Backpressure, 흐름 제어, 역압]
tags: [본질, 시스템, 제어]
created: 2026-02-14
updated: 2026-02-14
type: Principle
difficulty: Medium
---
# Principle: 역압 (Backpressure)

**핵심 질문**: "공급이 소비보다 빠를 때, 시스템은 어떻게 붕괴를 막는가?"

## One-liner Definition
> 하류(Downstream)의 처리 능력이 한계에 도달했을 때, 상류(Upstream)의 공급 속도를 강제로 억제하여 시스템 전체의 오버플로를 방지하는 제어 원리.

## Real-world Examples
1. **고속도로 램프 미터링**: 고속도로 본선의 교통량이 가득 차면, 진입로(램프)의 신호등을 조절하여 차량 진입 속도를 늦춤으로써 본선의 마비를 막는다.
2. **댐의 수문 조절**: 하류 지역의 범람을 막기 위해 댐에서 방류하는 물의 양을 조절하며, 필요시 상류의 유입을 가두어 둔다.
3. **식당의 대기 줄**: 주방의 요리 속도보다 손님이 들어오는 속도가 빠르면, 입구에서 대기 명단을 작성하게 하여 매장 내부의 혼란을 방지한다.

## Recurring Core Problem
모든 시스템에는 **유한한 버퍼(Buffer)**가 존재한다. 생산자와 소비자의 속도 차이가 지속되면 버퍼는 반드시 가득 차게 되며, 이때 아무런 조치가 없다면 데이터 유실(Packet Drop), 시스템 다운(OOM), 혹은 제어 불능 상태에 빠진다. 핵심 문제는 "어떻게 소비자의 상태를 생산자에게 전달하여 생산을 멈추게 할 것인가"에 있다.

## Why It Doesn't Disappear
물리적 자원(메모리, 대역폭, 인력)은 항상 한정되어 있는 반면, 수요는 가변적이고 때로는 폭발적이기 때문이다. 시스템의 안정성을 보장하기 위해서는 단순히 성능을 높이는 것보다, 부하가 한계를 넘었을 때 **'우아하게 멈추는(Graceful Degradation)'** 능력이 필수적이다.

## Appears As
- **OS Pipe**: 파이프 버퍼가 가득 차면 쓰기 프로세스를 잠재움 (`[[개념-유닉스 파이프 (Unix Pipe)]]`)
- **TCP Flow Control**: 수신 측의 Window Size가 작아지면 송신 측의 전송 속도를 줄임
- **Reactive Streams**: 소비자가 요청한 개수(request n)만큼만 생산자가 데이터를 전달함

## Related Concepts
- [[개념-차단 IO (Blocking IO)]] — 역압을 실현하는 OS 차원의 구체적 수단
- [[본질-처리량과 지연시간 (Throughput and Latency)]] — 역압이 발생할 때 변화하는 지표
