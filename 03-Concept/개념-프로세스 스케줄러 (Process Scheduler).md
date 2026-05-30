---
aliases: [Process Scheduler, 스케줄러, CPU 스케줄러]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
created: 2026-02-14
updated: 2026-03-17
---

## 한 문장 정의

> (사전적) 다음에 실행할 SW Thread를 선택하고, context_switch()로 HW Thread에 올리는 OS 커널 모듈.
> (이해용) 공장 라인(HW Thread) 배정 담당자. 대기 목록에서 다음 작업을 골라 라인에 올려놓는다.

---

## 해결하는 문제

- [[개념-하드웨어 스레드 (Hardware Thread)]] 수보다 훨씬 많은 [[개념-소프트웨어 스레드 (Software Thread)]]를 공정하게 실행
- 특정 SW Thread가 CPU를 독점해 시스템이 마비되는 현상 방지

---

## 치르는 비용

- context_switch() 호출마다 [[개념-문맥 교환 (Context Switch)]] 비용 발생
- SW Thread 수 ↑ → run queue 탐색 비용 ↑, context switch 빈도 ↑

---

## 동작 원리

```
① Timer Interrupt  (CPU 내부 하드웨어, Device Driver 아님)
         │
         ▼
② scheduler_tick() ← 현재 SW Thread 잔여 time_slice 차감
         │ time_slice <= 0
         ▼
③ set_need_resched() ← 재스케줄링 플래그 세팅
         │
         ▼  (user space 복귀 직전 자동 체크)
④ schedule()
         │
         ▼
⑤ pick_next_task() ← CFS: vruntime 가장 작은 task 선택
         │                 (가장 덜 실행된 SW Thread)
         ▼
⑥ context_switch() ← 현재 레지스터 저장 → 다음 레지스터 적재
         │
         ▼
   다음 SW Thread가 이 HW Thread 위에서 실행 시작
```

- ①~⑥ 전 과정이 `kernel/sched/` **커널 코드**로 구현
- CPU는 특권 명령어로 직접 제어 가능 → 중간 계층(Device Driver 등) 불필요
- SW Thread 상태 전이: Running → Waiting (I/O), Waiting → Ready (I/O 완료), Running → Ready (선점)

---

## 스케줄링 알고리즘 (별도 노트)

| 알고리즘 | 선점 | 특징 |
|---------|------|------|
| [[개념-FCFS (First Come First Served)]] | ✗ | 단순, Convoy Effect |
| [[개념-SJF (Shortest Job First)]] | ✗ | 평균 대기 최적, 기아 |
| [[개념-SRT (Shortest Remaining Time)]] | ✓ | SJF 선점형 |
| [[개념-Round Robin (라운드 로빈)]] | ✓ | 범용 OS, 로드밸런서 |
| [[개념-Priority Scheduling (우선순위 스케줄링)]] | 양쪽 | RTOS, Linux prio |
| [[개념-HRN (Highest Response Ratio Next)]] | ✗ | SJF + Aging |

→ 선택 전략: [[판단기준-CPU 스케줄링 알고리즘 선택]]

---

## 관련 본질

- [[본질-동시성 (Concurrency)]]
- [[본질-선점 (Preemption)]]
- [[본질-제어의 역전 (Inversion of Control)]]
- [[개념-문맥 교환 (Context Switch)]]
- [[개념-하드웨어 스레드 (Hardware Thread)]]
- [[개념-소프트웨어 스레드 (Software Thread)]]
- [[탐구-OS 스케줄러와 HW Thread 배치 사이에 어떤 계층은 없고 바로 전달하는가]]
- [[탐구-스케줄링과 정합성의 충돌]]
