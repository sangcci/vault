---
aliases: [G1 Evacuation Pause, G1 Young Pause, Garbage Collection End of Minor GC]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) G1 Evacuation Pause는 G1 GC가 live object를 한 region에서 다른 region으로 복사해 공간을 회수하는 stop-the-world pause다.
> (이해용) JVM이 잠깐 세상을 멈추고 살아있는 객체만 새 공간으로 이사시키는 시간이다.

---

## 해결하는 문제

- `garbage collection end of minor GC` 같은 metric이 무엇을 의미하는지 설명한다.
- GC pause 수치가 요청 지연과 함께 튀는지 관찰하는 기준을 만든다.
- heap used가 톱니 모양으로 움직이는 이유를 설명한다.

```text
Before GC
[ live ][ dead ][ live ]

Evacuation pause
live object copy

After GC
[ live ][ live ][ free ]
```

---

## 치르는 비용

- stop-the-world 구간이므로 application thread가 멈춘다.
- pause가 짧아도 빈도가 높으면 전체 latency에 영향을 줄 수 있다.
- object copy 비용은 live set 크기와 관련된다.

---

## 동작 원리

G1은 heap을 region으로 나누고, 회수 효율이 좋은 region을 선택한다. young collection에서는 young region의 live object를 survivor/old region으로 옮긴다. 이때 application thread가 잠깐 멈춘다.

---

## 관련 본질

- [[개념-JVM Heap Metric]]
- [[판단기준-GC Metric을 어떻게 해석할 것인가]]

---

## 참고

> "G1 is a generational, incremental, parallel, mostly concurrent, stop-the-world, and evacuating garbage collector" — [Oracle, Garbage-First Garbage Collector](https://docs.oracle.com/en/java/javase/23/gctuning/garbage-first-g1-garbage-collector1.html)

> "G1 reclaims space mostly by using evacuation" — [Oracle, Garbage-First Garbage Collector](https://docs.oracle.com/en/java/javase/23/gctuning/garbage-first-g1-garbage-collector1.html)
