---
aliases: [Redis Atomicity without Lock]
tags: [탐구, 작성중]
difficulty: High
type: Question
---
# Question: Redis는 왜 락(Lock) 없이 원자성을 보장할까?

## 핵심 질문 (Core Question)
> (멀티 스레드 환경에서는 필수인 락(Lock)이 왜 Redis에서는 불필요할까?)

## 가설 및 추론 (Hypothesis)
- 락은 **동시 접근(Concurrency)**을 제어하기 위한 수단이다.
- 만약 동시 접근 자체가 물리적으로 불가능하다면, 락도 필요 없을 것이다.

## 검증 및 팩트 (Verification)
- **물리적 직렬화 (Physical Serialization)**: Redis는 단일 스레드 이벤트 루프를 사용하므로, 모든 명령이 **한 줄로 서서(Queue)** 처리된다. 즉, 어떤 시점에도 오직 하나의 명령만 실행 중임이 보장된다.
- **논리적 락의 불필요성**: `INCR` 같은 연산이 중간에 끊길(Preempted) 염려가 없다. 문맥 교환이 발생하지 않기 때문이다.
- **성능 이득**: 락 획득/해제 오버헤드(Overhead)와 교착 상태(Deadlock) 위험이 완전히 사라진다.

## 결론 (Conclusion)
- Redis는 **구조적 제약(Single Thread)**을 통해 **논리적 복잡성(Lock Management)**을 제거했다.
- 이것이 Redis가 단순하면서도 고성능인 비결이다.

## 연결된 개념 (Links)
- [[본질-단일 스레드 모델]]
- [[본질-원자성 (Atomicity)]]
