---
aliases: [Atomicity]
tags: [본질, 완료]
created: 2026-02-03
updated: 2026-03-02
type: Principle
difficulty: Medium
---
**핵심 질문**: "더 이상 나눌 수 없는 최소 단위로 작업을 보호하여 '중간 상태'를 없앨 수 있는가?"

## One-liner Definition

> 더 이상 나눌 수 없는 최소 단위의 성질.
> **"중간 단계 없이, 전부 실행되거나 아예 안 된 상태(All or Nothing)로만 존재하게 만드는 원자적 보호막"**.

## 구현 원리: 하드웨어와 소프트웨어의 협력

1. **Hardware Level (CAS)**: `Compare-And-Swap` 명령은 CPU가 "이 연산은 절대 쪼개지지 않는다"고 직접 보증합니다. 선점 타이머조차 이 명령 한 줄이 끝나기 전에는 끼어들 수 없습니다.
2. **Software Level (Lock/Transaction)**: 긴 코드 블록의 원자성을 위해 잠금(Lock)을 사용합니다. OS가 나를 잠시 멈춰도(Preempt), 다른 이들이 내 자원을 못 만지게 '문'을 잠그고 쫓겨나는 방식입니다.

## 스케줄링과의 관계 (Scheduling Context)

OS의 **선점(Preemption)**이 발생하여 작업이 중단되더라도, 하드웨어(CAS)나 소프트웨어(Lock)가 제공하는 원자적 보호막 덕분에 데이터가 불완전한 상태로 다른 스레드에게 노출되지 않습니다. 즉, **물리적인 실행은 멈출 수 있어도 논리적인 원자성은 유지됩니다.**

## Recurring Core Problem

컴퓨터 명령은 수많은 미세 단계로 나뉩니다. 이 사이에서 OS 스케줄링에 의해 작업이 끊기거나 다른 스레드가 침범하면, 데이터가 '반만 처리된' 상태로 남게 됩니다. 이 **경쟁 조건(Race Condition)**이 시스템의 신뢰성을 파괴합니다.

## Trade-offs

- **데이터 정합성 vs 처리량**: 원자성을 위해 락을 걸면, 기다리는 스레드가 늘어나 전체 성능은 하락합니다.
- **복잡성**: 고성능을 위해 락을 쓰지 않는 'Lock-free' 알고리즘을 쓰면 구현 난이도가 기하급수적으로 올라갑니다.

## Related Cases

- [[본질-선점 (Preemption)]]
- [[개념-임계 구역 (Critical Section)]]
- [[탐구-스케줄링과 정합성의 충돌]]
