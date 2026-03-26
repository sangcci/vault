---
aliases: [Software Thread, OS Thread, Kernel Thread, SW Thread]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
created: 2026-03-17
---

## 한 문장 정의

> (사전적) OS가 스케줄링 단위로 관리하는 추상적 실행 흐름. [[개념-하드웨어 스레드 (Hardware Thread)]]에 의해 실제 실행된다.
> (이해용) 공장 라인(HW Thread)을 기다리는 작업 목록. 라인보다 훨씬 많이 존재할 수 있다.

## 해결하는 문제

- HW Thread 수보다 많은 작업을 동시에 처리해야 하는 필요
- [[개념-프로세스 스케줄러 (Process Scheduler)]]가 Time Slicing으로 각 SW Thread에 HW Thread를 번갈아 할당

## 치르는 비용

- 생성 비용: 스레드 하나당 수 MB 메모리 (Stack 등) 점유
- [[개념-문맥 교환 (Context Switch)]] 비용: HW Thread에 올렸다 내렸다 반복
- SW Thread 수 ↑ → OS 스케줄러 부하 ↑ → Context Switch 빈도 ↑

## 동작 원리

```
SW Thread Pool (수천 개)
  ├── Thread-1 (Running)  ─┐
  ├── Thread-2 (Ready)     ├─→ OS Scheduler ─→ HW Thread (16개)
  ├── Thread-3 (Blocked)   │    (Time Slicing)   (실제 실행)
  └── ...                 ─┘
                    ↑
         선점형 (Preemptive): OS가 타이머 인터럽트로 강제 교체
```

- **이벤트루프**와의 차이: [[개념-이벤트 루프]]는 SW Thread 1개 위에서 협력형으로 작업을 직접 스케줄링 → OS 개입 최소화

## 관련 본질

- [[본질-동시성 (Concurrency)]]
- [[본질-선점 (Preemption)]]
