---
aliases: [Hardware Thread, Logical Processor, HW Thread, 논리 프로세서]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
created: 2026-03-17
---

## 한 문장 정의

> (사전적) CPU가 동시에 독립적으로 명령어를 실행할 수 있는 물리적 실행 경로.
> (이해용) 공장의 실제 조립 라인 수. 라인이 16개면 동시에 16개 작업만 진짜로 처리 가능.

## 해결하는 문제

- [[개념-소프트웨어 스레드 (Software Thread)]]를 수천 개 만들어도 실제 실행은 그 수만큼 되지 않는 이유
- 멀티스레딩과 이벤트루프를 비교할 때 빠진 하드웨어 계층

## 치르는 비용

- 물리적 한계: 코어 수 이상의 진정한 병렬 실행 불가
- SW 스레드 수와 1:1 대응되지 않으므로, 초과분은 [[개념-프로세스 스케줄러 (Process Scheduler)]]가 Time Slicing으로 처리

## 동작 원리

```
Physical Core (예: 8개)
  │
  ├── Hyper-Threading (Intel) / SMT (AMD)
  │   → 1 Physical Core = 2 Logical Core (HW Thread)
  │
  └── 결과: 8 Physical Core × 2 = 16 HW Thread
             → 동시에 실행 가능한 최대 단위 = 16개
             → 나머지 SW Thread는 OS 스케줄러 대기열에서 대기
```

## 관련 본질

- [[본질-동시성 (Concurrency)]]
- [[본질-병렬성 (Parallelism)]]
