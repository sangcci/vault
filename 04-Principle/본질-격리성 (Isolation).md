---
aliases: [Isolation]
tags: [본질, 작성중]
created: 2026-02-04
updated: 2026-02-04
type: Principle
difficulty: Medium
---
# Principle: 격리성 (Isolation)
**핵심 질문**: "동시성 제어와 격리 수준의 트레이드오프는 무엇인가?"

 ![InkDrawing](<97-Image/Ink/Drawing/2026.2.6 - 22.45pm.svg>)

## One-liner Definition
> (사전적) 둘 이상의 트랜잭션이 동시에 실행될 때, 서로의 연산에 끼어들지 못하도록 보장하는 성질.
> (이해용) **"마치 나 혼자서만 자원을 사용하고 있는 것처럼 느끼게 만들어 데이터 오염을 막는 보호막"**.

## Usage Examples (문장 3개)
1. "데이터베이스의 **격리성** 수준을 Read Committed로 설정하여 Dirty Read를 방지했다."
2. "Docker는 네임스페이스 기술을 사용하여 프로세스 간의 **격리성**을 물리적으로 보장한다."
3. "멀티테넌시 환경에서는 고객 간의 자원 **격리성**이 성능 보장의 핵심이다."

## Recurring Core Problem
공유 자원에 여러 주체(스레드, 유저, 트랜잭션)가 동시에 접근할 때, 서로의 중간 작업 상태를 침범하거나 덮어씌워 데이터의 일관성을 깨뜨리는 문제가 반복됩니다.

## Why It Doesn't Disappear
시스템의 처리량(Throughput)을 높이려면 동시 처리가 필수적이지만, 동시성이 높아질수록 데이터 오염의 위험도 비례해서 커지기 때문입니다.

## Trade-offs
- **성능 저하**: 격리 수준이 높을수록 락(Lock) 점유 시간이 길어지고 대기 시간이 발생하여 처리량이 감소합니다.
- **교착 상태(Deadlock)**: 엄격한 격리를 위해 자원을 서로 선점하려다 보면 순환 대기가 발생할 수 있습니다.

## Appears As
- **Isolation Levels**: Read Committed, Serializable
- **Containerization**: Docker, VM
- [[개념-스레드 안전성 (Thread Safety)]]: ThreadLocal, Immutability

## Related Cases
- [[본질-원자성 (Atomicity)]]
- [[본질-일관성의 종류 (Consistency Types)]]
