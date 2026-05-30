---
aliases: [Concurrency]
tags: [본질, 완료]
created: 2026-02-12
updated: 2026-03-17
type: Principle
difficulty: High
---

**핵심 질문**: "CPU가 아무것도 안 하는 '노는 시간(Idle Time)'을 어떻게 돈으로 바꿀 것인가?"

## One-liner Definition

> 여러 작업이 겹치는 기간 동안 실행될 수 있음을 보장하는 성질. OS의 스케쥴러를 생각하면 쉽다.

---

## 대기 시간의 자원화 (Wait-time Optimization)

- **Problem**: DB 조회(100ms) 동안 CPU 연산(1ms)은 단 1%만 사용되고 나머지 99%는 낭비됩니다.
- **Solution**: I/O 요청 후 주도권을 반납(IoC)하고 다음 작업을 수행합니다. 작업이 완료되면 이벤트 신호(Interrupt)를 받아 결과를 처리합니다.
- **Result**: 단위 시간당 처리할 수 있는 일의 양(**Throughput**)이 비약적으로 향상됩니다.

---

## Concurrency vs Parallelism

- **동시성 (Concurrency)**: 한 명의 점원이 여러 손님의 주문을 번갈아 받는 것. (논리적 단위)
- **병렬성 (Parallelism)**: 점원 여러 명이 동시에 여러 손님을 응대하는 것. (물리적 단위)

---

## 동시성의 두 층위 (Two Layers)

같은 "동시성"이지만 **제어권의 주체**에 따라 두 층위가 존재한다. 이것이 OS 동시성과 이벤트루프 동시성이 다른 느낌인 이유다.

| 층위 | 방식 | 제어권 주체 | 목적 |
|---|---|---|---|
| OS 레벨 | 선점형 (Preemptive) | OS가 강제로 뺏음 | 공정성 (시스템 마비 방지) |
| App 레벨 | 협력형 (Cooperative) | 작업이 스스로 양보 | 효율성 (Context Switch 최소화) |

```
OS Level (Preemptive) — [[개념-소프트웨어 스레드 (Software Thread)]]
  SW Thread A ──▶ Timer Interrupt ──▶ SW Thread B
                  (OS 강제 교체)

App Level (Cooperative) — [[개념-이벤트 루프]], Coroutine, Goroutine
  Task A ──▶ await / yield ──▶ Task B
             (자발적 양보)
```

- 두 층위는 **중첩**된다: 이벤트루프 스레드도 OS 입장에선 하나의 SW Thread → OS가 선점 가능

---

## Why It Is Difficult

여러 작업이 공유 자원을 향해 동시에 달려들 때, 순서와 상호작용이 꼬이며 버그(Heisenbug)를 만들어내기 때문입니다. 이를 위해 격리성(Isolation)과 원자성(Atomicity)이 뒷받침되어야 합니다.

---

## Related Cases

- [[탐구-멀티스레드와 이벤트루프의 OS 활용 차이]]
- [[본질-제어의 역전 (Inversion of Control)]]
- [[개념-프로세스 스케줄러 (Process Scheduler)]]
- [[본질-병렬성 (Parallelism)]]
