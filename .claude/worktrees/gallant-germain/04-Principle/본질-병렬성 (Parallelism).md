---
aliases: [Parallelism]
tags: [본질, 작성중]
created: 2026-02-04
updated: 2026-02-04
type: Principle
difficulty: Medium
---
# Principle: 병렬성 (Parallelism)
**핵심 질문**: "물리적으로 동시에 일을 처리하는 것은 어떤 한계를 갖는가?"

## One-liner Definition
> (사전적) 여러 작업이 물리적으로 정확히 같은 시점에 동시에 실행되는 성질.
> (이해용) **"여러 명의 일꾼(CPU 코어)이 각자 자신의 망치를 들고, 실제로 동시에 못을 박고 있는 상태"**.

## Usage Examples (문장 3개)
1. "수만 개의 데이터를 신속하게 처리하기 위해 Java의 Parallel Stream을 사용하여 **병렬성**을 확보했다."
2. "GPU는 수천 개의 코어를 활용한 데이터 **병렬성** 처리에 특화되어 있어 딥러닝 연산에 유리하다."
3. "암달의 법칙에 따르면, 시스템의 특정 부분이 **병렬성**을 갖더라도 순차적 구간에 의해 전체 성능 향상은 제한된다."

## Recurring Core Problem (Parallelism vs Concurrency)
병렬성은 여러 일을 실제로 한꺼번에 '수행하는(Doing)' 물리적 개념입니다. 반면 동시성(Concurrency)은 여러 일을 한꺼번에 '다루는(Dealing with)' 논리적 개념입니다. 핵심 문제는 어떻게 하면 작업을 독립적인 단위로 잘게 쪼개어 물리 코어에 효율적으로 배분하고, 처리된 결과를 다시 하나로 합칠 것인가(Fork-Join)에 있습니다.

## Why It Doesn't Disappear
빅데이터 처리, 실시간 렌더링, 인공지능 학습 등 현대 소프트웨어가 다루는 연산의 규모가 단일 코어의 성능 발전 속도를 훨씬 앞질렀기 때문입니다. 물리적인 하드웨어 자원을 극한으로 끌어쓰기 위해서는 병렬 처리가 유일한 해결책입니다.

## Trade-offs
- **암달의 법칙 (Amdahl's Law)**: 아무리 코어를 늘려도 병렬화할 수 없는 '순차적 구간' 때문에 성능 향상에는 임계점이 존재합니다.
- **분할 및 병합 오버헤드**: 작업을 쪼개고(Divide), 다른 코어에 배분하고, 다시 합치는(Merge/Shuffle) 과정에서 발생하는 비용이 실제 연산 이득을 갉아먹을 수 있습니다.

## Appears As
- **Data Parallelism**: GPU 연산, MapReduce
- **Task Parallelism**: 멀티 코어 CPU 스케줄링
- **Fork-Join Framework**: 작업을 쪼개고 합치는 분할 정복형 실행

## Related Cases
- [[본질-동시성 (Concurrency)]]
- [[본질-처리량과 지연시간 (Throughput and Latency)]]
- [[개념-문맥 교환 (Context Switch)]]
