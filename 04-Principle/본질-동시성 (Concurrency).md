---
aliases: [Concurrency]
tags: [본질, 작성중]
created: 2026-02-04
updated: 2026-02-04
type: Principle
difficulty: Medium
---
# Principle: 동시성 (Concurrency)
**핵심 질문**: "동시에 실행되는 것인가, 동시에 실행되는 것처럼 보이는 것인가?"

## One-liner Definition
> (사전적) 여러 작업이 겹치는 기간 동안 실행되는 성질. (반드시 같은 순간에 실행될 필요는 없음)
> (이해용) **"단일 CPU가 여러 일을 아주 빠르게 번갈아 가며 처리하여, 사용자에게는 마치 동시에 일어나는 것처럼 느끼게 만드는 관리의 마법"**.

## Usage Examples (문장 3개)
1. "Node.js는 싱글 스레드 기반이지만 비동기 I/O를 통해 높은 **동시성**을 처리한다."
2. "웹 서버는 **동시성** 모델을 활용하여 수천 명의 사용자 요청을 동시에 다루는 것처럼 응답한다."
3. "멀티스레딩 환경에서는 **동시성** 제어 실패로 인해 데이터 정합성이 깨지기 쉽다."

## Recurring Core Problem (Concurrency vs Parallelism)
동시성은 여러 일을 한꺼번에 '다루는(Dealing with)' 논리적 개념입니다. 반면 병렬성(Parallelism)은 여러 일을 실제로 한꺼번에 '수행하는(Doing)' 물리적 개념입니다. 핵심 문제는 제한된 물리적 자원(CPU 코어) 위에서 어떻게 하면 작업들 간의 간섭 없이 높은 응답성을 유지하며 작업을 교체할 것인가에 있습니다.

## Why It Doesn't Disappear
사용자 경험(UX) 측면에서 '즉각적인 응답'은 필수적이기 때문입니다. 대용량 요청을 처리해야 하는 백엔드 환경에서 자원을 놀리지 않고 효율적으로 작업을 배분하는 것은 영원한 숙제입니다.

## Trade-offs
- **동기화 오버헤드**: 공유 자원 접근 시 발생하는 락(Lock) 비용과 데이터 오염 위험이 따릅니다.
- **컨텍스트 스위칭 비용**: 너무 많은 작업을 동시에 다루려 하면, 실제 작업보다 작업을 교체하는 데 드는 비용이 더 커질 수 있습니다.

## Appears As
- **Asynchronous I/O**: 대기 시간을 활용한 작업 전환
- **Multithreading**: 하나의 프로세스 내 동시 실행
- **Context Switching**: CPU 점유권의 빠른 교체

## Related Cases
- [[본질-격리성 (Isolation)]]
- [[본질-처리량과 지연시간 (Throughput and Latency)]]
- [[본질-병렬성 (Parallelism)]]
