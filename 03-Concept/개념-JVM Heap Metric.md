---
aliases: [JVM Heap Metric, Heap Used Committed Max]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) JVM heap metric은 객체 할당에 사용되는 heap memory의 used, committed, max 같은 상태값을 관측하는 지표다.
> (이해용) used는 실제 짐, committed는 JVM이 운영체제에서 확보한 창고, max는 창고가 커질 수 있는 상한이다.

---

## 해결하는 문제

- heap used가 위아래로 움직이는 이유를 GC와 연결해 해석한다.
- committed와 max가 왜 다른지 구분한다.
- 선형 증가가 memory leak인지 정상 할당 패턴인지 판단하는 출발점을 제공한다.

```text
max        ───────────────── 상한
committed  ───────── 확보된 heap
used       ──▲▼▲▼──── 실제 사용량
              GC 후 감소
```

---

## 치르는 비용

- heap metric만으로 leak 여부를 확정할 수 없다.
- GC 로그, allocation rate, object lifetime, request latency를 같이 봐야 한다.
- container memory limit과 JVM max heap 설정이 다르면 해석이 꼬일 수 있다.

---

## 동작 원리

- `used`: 현재 객체가 사용 중인 heap 양.
- `committed`: JVM이 사용 가능하도록 OS에서 확보한 heap 양.
- `max`: heap이 커질 수 있는 최대값.

GC가 일어나면 unreachable object가 회수되어 `used`가 내려간다. 요청 처리나 cache 적재로 객체가 늘면 다시 올라간다.

---

## 관련 본질

- [[개념-G1 Evacuation Pause]]
- [[판단기준-GC Metric을 어떻게 해석할 것인가]]
- [[04-Principle/본질-옵저버빌리티 (Observability)|옵저버빌리티]]

---

## 참고

> "Returns the current memory usage of the heap that is used for object allocation." — [Java SE API, MemoryMXBean](https://docs.oracle.com/en/java/javase/17/docs/api/java.management/java/lang/management/MemoryMXBean.html)

> "The heap consists of one or more memory pools." — [Java SE API, MemoryMXBean](https://docs.oracle.com/en/java/javase/17/docs/api/java.management/java/lang/management/MemoryMXBean.html)
