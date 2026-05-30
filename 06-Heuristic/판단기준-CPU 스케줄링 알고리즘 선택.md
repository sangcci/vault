---
aliases: [CPU 스케줄링 선택 기준, 스케줄링 알고리즘 비교]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준

- 응답 시간 최우선 + 공정성 필요 → **Round Robin** (시분할·대화형 시스템)
- 평균 대기 시간 최소화 (이론) → **SJF** (비선점) / **SRT** (선점)
- 우선순위 차이 있는 작업 → **Priority Scheduling** (단, Aging 필수)
- 기아 걱정 없이 단순 구현 → **FCFS** (배치 처리)
- SJF 기아 해결 필요 → **HRN**
- 실제 범용 OS → **MLFQ / CFS** ([[개념-프로세스 스케줄러 (Process Scheduler)]])

---

## 알고리즘 비교표

| 알고리즘 | 선점 | 기아 | 평균대기 | 구현 | 적합 환경 |
|---------|------|------|---------|------|----------|
| FCFS    | ✗   | ✗   | 나쁨    | 단순 | 배치 처리 |
| SJF     | ✗   | ✓   | 최적    | 중간 | 이론·배치 |
| SRT     | ✓   | ✓   | 최적    | 복잡 | 시분할 이론 |
| RR      | ✓   | ✗   | 중간    | 단순 | 대화형·범용 |
| Priority| 양쪽 | ✓  | 중간    | 중간 | RTOS·실시간 |
| HRN     | ✗   | ✗   | 좋음    | 중간 | SJF 보완 이론 |

---

## 효과적인 상황

- **RR**: 사용자 응답성이 중요한 웹 서버, 터미널
- **Priority**: 하드 실시간 시스템, OS 커널 인터럽트 처리
- **FCFS**: 작업 시간 동일한 배치 시스템

---

## 실패하는 상황

- **FCFS**: 짧은 작업이 많은 대화형 시스템 (Convoy Effect)
- **SJF/SRT**: 작업 시간 예측 불가 환경 (= 거의 모든 실제 OS)
- **Priority**: Aging 없이 낮은 우선순위 작업이 많을 때 (기아)
- **RR**: Time Quantum 설정 실패 시 성능 급락

---

## 관련 노트

- [[개념-FCFS (First Come First Served)]]
- [[개념-SJF (Shortest Job First)]]
- [[개념-SRT (Shortest Remaining Time)]]
- [[개념-Round Robin (라운드 로빈)]]
- [[개념-Priority Scheduling (우선순위 스케줄링)]]
- [[개념-HRN (Highest Response Ratio Next)]]
