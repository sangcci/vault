---
aliases: [GC Metric Interpretation, JVM GC Monitoring]
tags: [판단기준, 작성중]
difficulty: High
type: Heuristic
---

## 판단 기준

- heap used가 톱니처럼 오르내린다 → 정상 GC 패턴일 수 있다.
- GC 후에도 used baseline이 계속 올라간다 → leak 또는 cache 누적을 의심한다.
- GC pause와 request latency spike가 같은 시점에 움직인다 → GC가 사용자 지연에 영향을 줄 수 있다.
- GC pause와 CPU spike가 같이 튄다 → object allocation pressure를 본다.
- thread 수가 함께 증가한다 → GC보다 request backlog나 blocking I/O 문제도 본다.

```text
heap used   /\/\/\/\____/\/\
latency        ^      ^
GC pause       ^      ^

같은 시점이면 GC 영향 의심
```

## 효과적인 상황

- JVM memory chart를 보고 정상 sawtooth와 이상 증가를 구분할 때.
- G1 GC pause가 실제 응답 시간 문제인지 판단할 때.
- observability dashboard에서 heap, GC, CPU, thread, latency를 함께 볼 때.

## 실패하는 상황

- heap used 하나만 보고 leak을 단정하면 안 된다.
- 평균 pause만 보면 p95/p99 latency spike를 놓칠 수 있다.
- container memory limit, `-Xmx`, metaspace, direct memory를 같이 보지 않으면 전체 메모리 압박을 놓친다.

## 체크 순서

```pseudo
check heap used baseline
check GC pause p95/p99
check request latency at same timestamp
check CPU and allocation rate
check thread count and DB connection usage
```

## 관련 노트

- [[개념-JVM Heap Metric]]
- [[개념-G1 Evacuation Pause]]
- [[04-Principle/본질-옵저버빌리티 (Observability)|옵저버빌리티]]

## 참고

> "G1 is a generational, incremental, parallel, mostly concurrent, stop-the-world, and evacuating garbage collector which monitors pause-time goals" — [Oracle, Garbage-First Garbage Collector](https://docs.oracle.com/en/java/javase/23/gctuning/garbage-first-g1-garbage-collector1.html)
