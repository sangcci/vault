---
aliases: [CPU Scheduling Convoy Effect, Bad Scheduling Policy, Time Quantum]
tags: [문제, 작성중, OS, Scheduling]
difficulty: Medium
type: Problem
---

# Problem: 34-CPU 스케줄링 정책을 잘못 잡아 짧은 요청이 긴 작업 뒤에서 밀림

## 상황

짧은 작업과 긴 작업이 같은 실행 큐에서 처리된다. 긴 작업이 먼저 CPU를 오래 점유하면 짧은 요청이 뒤에서 밀려 응답 시간이 급격히 나빠진다.

```text
작업 큐:
  long batch job: 10s
  short API job: 10ms
  short API job: 10ms

FCFS처럼 처리
  → 짧은 요청도 10s 뒤에 실행
```

운영체제 스케줄링뿐 아니라 애플리케이션 worker queue, batch executor, message consumer에서도 같은 문제가 반복된다.

---

## 관찰된 증거

- 평균 처리량은 괜찮지만 p95/p99 latency가 나쁘다.
- 짧은 요청이 긴 요청 뒤에서 대기한다.
- 우선순위가 낮은 작업은 계속 밀린다.
- time quantum이 너무 작아 context switch가 늘거나, 너무 커서 FCFS처럼 동작한다.
- batch 작업과 interactive 요청이 같은 thread pool을 공유한다.

---

## 의심 문제

가장 가능성 높은 문제는 **공정성, 응답성, 처리량 중 무엇을 최적화할지 정하지 않고 하나의 큐에 모든 작업을 넣은 것**이다.

스케줄링 알고리즘은 “다음에 무엇을 실행할지”를 정하는 정책이다. 정책이 다르면 같은 작업 집합도 latency와 starvation 특성이 달라진다.

---

## 원인

```text
FCFS
  - 도착 순서 보장
  - 긴 작업 앞에 있으면 convoy effect

SJF/SRT
  - 짧은 작업 우선
  - 평균 대기 시간 유리
  - 긴 작업 starvation 위험

Round Robin
  - 일정 time quantum 순환
  - 응답성/공정성 유리
  - quantum 너무 작으면 context switch 증가

Priority
  - 중요한 작업 우선
  - aging 없으면 낮은 우선순위 starvation
```

문제는 알고리즘 이름이 아니라 workload 요구다.

```text
interactive 요청
  → 응답 시간 중요

batch 작업
  → 처리량 중요

real-time 작업
  → deadline/priority 중요
```

---

## 확인 방법

- 작업 유형별 실행 시간 분포를 본다.
- 같은 queue/pool에 interactive와 batch가 섞여 있는지 확인한다.
- p95/p99 latency와 평균 throughput을 함께 본다.
- 우선순위가 낮은 작업의 starvation 여부를 확인한다.
- time quantum, pool size, queue policy 변경 실험을 한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| interactive/batch pool 분리 | latency 간섭 감소 | 리소스 할당 필요 |
| priority queue + aging | 중요 작업 우선 + starvation 완화 | 정책 설계 필요 |
| time slicing/RR | 공정성 증가 | context switch 비용 |
| shortest-job 계열 근사 | 짧은 요청 latency 개선 | 작업 시간 추정 필요 |
| backpressure/queue limit | 대기 폭증 방지 | 거부/재시도 정책 필요 |

---

## 트레이드오프

스케줄링은 모든 작업을 동시에 만족시키지 못한다. 짧은 작업을 우선하면 긴 작업이 밀릴 수 있고, 공정성을 높이면 문맥 교환 비용이 늘 수 있다. 핵심은 workload를 나누고, 각 큐가 최적화할 목표를 명확히 하는 것이다.

---

## 연결되는 본질

- [[본질-선점과 문맥 교환 비용]]
- [[본질-스케줄링 정책과 공정성]]
- [[본질-상황 제약 기반 기술 선택]]

---

## 참고

> "The scheduler makes its decisions based on knowledge of the scheduling policy and static priority of all threads on the system." — [Linux man-pages: sched(7)](https://man7.org/linux/man-pages/man7/sched.7.html)

> "In CFS the virtual runtime is expressed and tracked via the per-task p->se.vruntime" — [Linux Kernel Documentation: CFS Scheduler](https://docs.kernel.org/scheduler/sched-design-CFS.html)
