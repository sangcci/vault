---
aliases: [Resource Contention, 자원 경합, Contention]
tags: [본질, 작성중]
difficulty: Medium
type: Principle
---
# Principle: 자원 경합 (Resource Contention)

**핵심 질문**: "쓸 수 있는 자원보다 쓰려는 주체가 많아질 때, 시스템은 왜 느려지고 어떤 방식으로 제어해야 하는가?"

## 한 문장 정의

> (사전적) 자원 경합은 여러 실행 주체가 같은 제한 자원을 동시에 요구해 일부가 접근을 기다리는 상태다.
> (이해용) 화장실은 하나인데 줄이 길어지는 상황이다.

> "Resource contention profiling collects detailed call stack information each time competing threads in an application are forced to wait for access to a shared resource." — [Microsoft Learn](https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2017/profiling/understanding-resource-contention-data-values?view=vs-2017)

```text
공유 자원 capacity = 3
동시 수요 demand   = 7

실행 주체: A B C D E F G
자원 사용: A B C
대기열:       D E F G

결과: 대기 증가 → Latency 증가 → Timeout 위험
```

---

## 사용 예시

1. DB connection 수보다 동시에 connection을 요구하는 thread가 많으면 [[현상-커넥션 풀 고갈 (Connection Pool Exhaustion)]]이 발생한다.
2. 여러 transaction이 같은 row나 table lock을 잡으려 하면 [[현상-잠금 경합 (Lock Contention)]]이 발생한다.
3. CPU core보다 runnable thread가 많으면 scheduler가 CPU 시간을 나누고 [[개념-문맥 교환 (Context Switch)]] 비용이 늘어난다.

---

## 핵심 구조

자원 경합은 단순히 자원이 부족하다는 뜻이 아니다. 더 정확히는 **자원 수, 자원 점유 시간, 동시 수요**가 맞지 않아 대기가 생기는 구조다.

```text
경합 압력 = 동시 수요 × 점유 시간 / 자원 수

동시 수요 증가 ─┐
점유 시간 증가 ─┼─> 대기열 증가 ─> Latency 증가 ─> Timeout / 장애
자원 수 감소  ─┘
```

따라서 해결도 하나가 아니다.

```text
자원 수 늘리기     → pool size, CPU core, replica
점유 시간 줄이기   → transaction 축소, lock 범위 축소, slow query 개선
동시 수요 줄이기   → rate limit, queue, [[본질-역압 (Backpressure)]]
사용권 회수하기    → [[본질-선점 (Preemption)]]
자원 쪼개기        → sharding, partitioning, lock striping
```

---

## 선점과 역압과의 관계

자원 경합은 문제 상황이고, 선점과 역압은 그 문제를 다루는 제어 전략이다.

```text
본질 문제: 자원 경합
├─ [[본질-선점 (Preemption)]]
│  └─ 사용 중인 자원 통제권을 강제로 회수한다
│
├─ [[본질-역압 (Backpressure)]]
│  └─ 처리 능력보다 빠른 유입을 앞단에서 늦춘다
│
└─ [[본질-처리량과 지연시간 (Throughput and Latency)]]
   └─ 경합 결과는 대기 시간과 처리량 변화로 관찰된다
```

모든 자원 경합이 선점이나 역압만으로 해결되지는 않는다. Lock 경합은 임계 구역 축소가 더 직접적일 수 있고, DB connection 경합은 connection 점유 시간 단축이 더 중요할 수 있다.

---

## 트레이드오프

- 자원 수를 늘리면 대기는 줄지만 비용과 운영 복잡도가 증가한다.
- 동시 수요를 제한하면 장애 전파는 줄지만 일부 요청은 늦게 처리되거나 거절된다.
- 선점은 독점을 막지만 문맥 교환 비용과 정합성 문제가 생긴다.
- Lock이나 transaction 범위를 줄이면 경합은 줄지만 코드 경계와 책임 분리가 더 중요해진다.

---

## 왜 사라지지 않는가

컴퓨팅 자원은 항상 유한하고, 수요는 시간에 따라 흔들린다. CPU, memory, DB connection, lock, network bandwidth처럼 공유되는 모든 자원은 동시에 무한히 사용할 수 없다.

> "Latency increases are often a leading indicator of saturation." — [Google SRE Book, Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

```text
자원 포화에 가까워짐
        ↓
대기열 증가
        ↓
Latency 먼저 증가
        ↓
Timeout / error / throughput 저하
```

---

## 다른 모습들

- **OS**: CPU time 경합, lock 경합, I/O queue 증가
- **DB**: connection pool 대기, row lock wait, buffer contention
- **Network**: bandwidth 경합, packet queue, drop
- **Application**: thread pool 고갈, queue backlog, external API 호출 대기

---

## 관련 노트

- [[본질-처리량과 지연시간 (Throughput and Latency)]]
- [[본질-역압 (Backpressure)]]
- [[본질-선점 (Preemption)]]
- [[현상-커넥션 풀 고갈 (Connection Pool Exhaustion)]]
- [[현상-잠금 경합 (Lock Contention)]]
- [[개념-문맥 교환 (Context Switch)]]
