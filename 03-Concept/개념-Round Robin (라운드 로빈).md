---
aliases: [Round Robin, RR, 라운드 로빈, 시간 할당량]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 각 프로세스에 동일한 Time Quantum(시간 할당량)을 순환 배분하는 선점형 스케줄링.
> (이해용) 식당 테이블 순환 서비스 — 모든 손님에게 3분씩 돌아가며 서빙.

---

## 해결하는 문제

- 대화형 시스템의 응답성 — 모든 프로세스가 일정 주기 내 CPU 획득 보장
- 특정 프로세스의 CPU 독점 방지
- 기아(Starvation) 없음

---

## 치르는 비용

- Time Quantum 크기가 성능 결정:
  - 너무 작으면 → Context Switch 오버헤드 증가
  - 너무 크면 → FCFS와 동일해짐
- CPU 사용률 집중 작업에는 비효율

---

## 동작 원리

```
Time Quantum = 4, 프로세스: A(도착0,burst=8), B(도착1,burst=4),
                             C(도착2,burst=9), D(도착3,burst=5)

t= 0~ 4: A 실행 (잔여 4)
t= 4~ 8: B 실행 → 완료 (대기: 8-1-4=3)
t= 8~12: C 실행 (잔여 5)
t=12~16: D 실행 (잔여 1)
t=16~20: A 실행 → 완료 (대기: 20-0-8=12)
t=20~24: C 실행 (잔여 1)
t=24~25: D 실행 → 완료 (대기: 25-3-5=17)
t=25~26: C 실행 → 완료 (대기: 26-2-9=15)

평균 대기 = (3+12+17+15)/4 = 11.75

[ Time Quantum 영향 ]
작은 Q: A─B─A─B─A─B (Context Switch 폭발)
큰  Q: A──────B──────  (FCFS와 동일)
적절한 Q: 80% 작업이 Q 내 완료 → 실용적
```

---

## 실제 사용처

- **Linux/Windows/macOS** 기본 스케줄링의 핵심 원리
- **DNS Round Robin** — 로드밸런싱 (서버 순환 배분)
- **Kubernetes** — 네임스페이스 간 CPU 쿼터 분배
- **Nginx upstream** — 기본 로드밸런싱 방식

---

## 관련 본질

- [[본질-선점 (Preemption)]]
- [[본질-동시성 (Concurrency)]]
- [[본질-처리량과 지연시간 (Throughput and Latency)]]
- [[개념-프로세스 스케줄러 (Process Scheduler)]]
- [[판단기준-CPU 스케줄링 알고리즘 선택]]
