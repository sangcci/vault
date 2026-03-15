---
aliases: [PCB, Process Control Block, task_struct, 프로세스 제어 블록]
tags: [개념, OS, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) OS가 각 프로세스를 관리하기 위해 유지하는 커널 데이터 구조로, 프로세스의 상태·CPU 레지스터·메모리 정보 등을 저장.
> (이해용) 프로세스 자체가 아니라 프로세스의 **신분증 + 이력서** — 큐에 넣고, 스케줄링하고, 문맥 교환할 때 이 구조체를 다룸.

## 해결하는 문제

- 프로세스는 주소 공간 + CPU 상태 + 파일 등 복합적인 컨텍스트 → 이것을 직접 큐에 넣을 수 없음
- PCB라는 **표현(representation)**을 통해 프로세스를 관리 가능한 데이터 구조로 변환
- [[개념-문맥 교환 (Context Switch)]] 시 CPU 상태 스냅샷의 저장소 역할

## 치르는 비용

- 프로세스 수 × PCB 크기만큼 커널 메모리 소모
- PCB가 비대해지면 문맥 교환 시 저장/복원 오버헤드 증가

## 동작 원리

### PCB 구조

```text
┌─── PCB (Process Control Block) ───────────────┐
│                                                │
│  PID              : 고유 식별자                  │
│  State            : New / Ready / Running /     │
│                     Waiting / Terminated        │
│  ─── CPU 상태 (Context Switch 시 저장) ───       │
│  Program Counter  : 다음 실행할 명령어 주소       │
│  Registers        : GPR, SP, Flags, IR          │
│  ─── 메모리 관리 ───                              │
│  Memory Limits    : 주소 공간의 시작/끝 주소       │
│  Page Table Ptr   : 가상 → 물리 주소 매핑         │
│  ─── 자원 ───                                    │
│  Open Files       : 파일 디스크립터 테이블         │
│  IO Devices       : 할당된 장치 목록               │
│  ─── 계층 관계 ───                                │
│  Parent Pointer   : 부모 프로세스의 PCB 포인터     │
│  Children List    : 자식 프로세스들의 PCB 목록     │
│                                                │
└────────────────────────────────────────────────┘
```

### PCB ≠ 프로세스

```text
프로세스:  실제 실행 중인 컨텍스트 전체 (메모리 + CPU + 자원)
PCB:      그 프로세스를 관리하기 위한 메타데이터 구조체

비유: 환자(프로세스) vs 환자 차트(PCB)
      → 차트를 넘기는 것이 환자를 옮기는 것은 아님
      → 스케줄러가 큐에 넣는 것은 PCB
```

### Linux 구현: task_struct

- 경로: `include/linux/sched.h`
- Linux에서는 **task**라고 부름 — 프로세스와 스레드를 하나의 구조체로 통합 관리
- 스케줄링 관점에서 스레드와 프로세스를 동일한 실행 단위로 취급

### 문맥 교환에서의 역할

```text
[프로세스 A → B 전환]
1. A의 CPU 상태 → PCB_A에 저장 (스냅샷)
2. PCB_B에서 CPU 상태 읽기 → CPU에 복원
3. B 실행 재개

PCB가 없으면 "어디까지 했는지" 기록할 곳이 없음
→ 문맥 교환 자체가 불가능
```

## 관련 본질

- [[개념-프로세스 (Process)]]: PCB가 표현하는 대상
- [[개념-문맥 교환 (Context Switch)]]: PCB에 저장된 스냅샷을 사용하는 메커니즘
- [[개념-프로세스 스케줄러 (Process Scheduler)]]: PCB를 큐에 넣어 관리
- [[탐구-동시성 해결 패턴은 왜 계층을 초월하여 반복되는가]]: PCB = CPU 레벨의 스냅샷 저장소
