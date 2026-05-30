---
aliases: [Context Switch, 컨텍스트 스위칭]
tags: [개념, OS, 성능]
created: 2026-02-06
updated: 2026-03-06
type: Concept
difficulty: Medium
---
![[Pasted image 20260311223846.png]]
## 한 문장 정의 (Definition)

> (사전적) CPU가 현재 실행 중인 프로세스나 스레드의 상태(Context)를 저장하고, 다음 차례의 프로세스/스레드 상태를 복구하여 실행권을 전환하는 커널의 핵심 메커니즘.
> (이해용) 하던 일을 멈추고 다른 일을 하기 위해 '어디까지 했는지' 기록하고, 새로운 작업에 필요한 도구(레지스터, 메모리 맵)를 재배치하는 과정.

---

## 해결하는 문제 (Problem Solved)

- **자원 공유**: 단일 또는 한정된 수의 CPU 코어에서 수많은 프로세스가 동시에 실행되는 것처럼 보이게 함([[본질-동시성 (Concurrency)]]).
- **우선순위 관리**: 더 시급한 작업(인터럽트 등)이 발생했을 때 현재 작업을 안전하게 중단하고 즉시 전환 가능하게 함.
- **보안 + 정확성**: 단순히 CPU를 넘기면 이전 프로세스의 레지스터 값이 노출(보안 위협)되고, 다음 프로세스가 레지스터를 덮어써 이전 프로세스의 실행 결과가 파괴됨(정확성 위협). 문맥 교환은 이 두 문제를 동시에 해결.

---

## 문맥 교환이 없으면 생기는 일 (Why It Exists)

프로세스 A가 레지스터에 12, 20을 넣고 덧셈 직전에 CPU를 빼앗기는 상황:

```text
[Process A]                    [Process B]
R0=12, R1=20                         |
  ──(CPU 전환, 상태 저장 없음)──→      |
                               R0=100, R1=35  ← B가 레지스터 덮어씀
  ←──(CPU 복귀)──                     |
ADD R0, R1 → 135 (기대값: 32)   ← 정확성 파괴
```

- **보안**: B가 A의 레지스터(패스워드 해싱 중간값 등)를 읽을 수 있음
- **정확성**: A가 복귀해도 자신의 데이터가 사라져 잘못된 결과 산출
- **비결정성**: 프로세스 수나 타이밍이 바뀌면 매번 다른 오답 발생

### 해결: Snapshot 방식 — "찍고 교체"

CPU를 넘기기 전에 현재 프로세스의 **전체 CPU 상태를 스냅샷**으로 저장하고, 다음 프로세스의 저장된 스냅샷을 복원:

```text
[Process A 중단]
 1. Save: R0=12, R1=20, PC=0x04 → PCB_A에 저장 (스냅샷)
 2. Restore: PCB_B에서 R0=0, R1=0, PC=0x1013 → CPU에 로드

[Process A 복귀]
 1. Save: PCB_B에 현재 CPU 상태 저장
 2. Restore: PCB_A에서 R0=12, R1=20, PC=0x04 → CPU에 로드
 → ADD R0, R1 = 32 ✓ 정확한 결과
```

이 패턴은 **DB의 MVCC(스냅샷 격리)**와 구조적으로 동일 → [[탐구-동시성 해결 패턴은 왜 계층을 초월하여 반복되는가]]

---

## 치르는 비용 (Cost/Trade-off)

- **Direct Overhead**: PCB(Process Control Block)나 TCB에 상태를 기록하고 읽는 동안 CPU는 순수 연산을 수행하지 못함.
- **Indirect Overhead (Cache Miss)**:
	- **TLB Flush**: 주소 공간 전환(CR3 교체) 시 가상 주소 매핑 정보인 TLB가 무효화되어 메모리 접근 속도가 급격히 저하됨.
	- **Cache Cold Start**: L1/L2 캐시에 쌓인 이전 프로세스의 데이터가 무용지물이 되어 RAM까지 다녀와야 하는 지연 시간 발생.

---

## 동작 원리 (Mechanism)

### 1. 교체되는 데이터의 실체
- **CPU Registers**: GPR, PC(Program Counter), SP(Stack Pointer) 등.
- **Kernel Stack**: 각 프로세스가 시스템 콜 처리 중 사용하는 독립적인 커널 스택 주소.
- **Memory Mapping (CR3)**: x86 기준, 페이지 테이블의 루트 주소를 가진 레지스터를 교체하여 주소 공간을 격리.

### 2. 전환 과정 시각화
```text
[ Process A ]          [ OS Kernel (Scheduler) ]          [ Process B ]
      |                          |                             |
 (Interrupt/Syscall) ----------> |                             |
      |                   [1] Save Context A                   |
      |                    - Registers -> Kernel Stack         |
      |                    - SP -> PCB_A (Memory)              |
      |                          |                             |
      |                   [2] Switch Memory (ASID/CR3)         |
      |                    - Page Table Pointer 교체           |
      |                    - TLB Flush 발생                    |
      |                          |                             |
      |                   [3] Restore Context B                |
      |                    - SP <- PCB_B (Memory)              |
      |                    - Kernel Stack -> Registers         |
      |                          |                             |
      |                          | --------------------------> |
      |                          |                      (Run Process B)
```

---

## 관련 본질 (Related Principles)

- [[본질-동시성 (Concurrency)]]: 문맥 교환이 있어야만 동시성이 성립함.
- [[본질-처리량과 지연시간 (Throughput and Latency)]]: 잦은 문맥 교환은 지연시간을 높이고 처리량을 갉아먹음.
- [[탐구-뮤텍스와 스핀락 언제 무엇을 선택해야 할까]]: 뮤텍스의 '대기'가 유발하는 핵심 비용이 바로 문맥 교환임.
- [[개념-PCB (Process Control Block)]]: 스냅샷이 저장되는 구조체.
- [[탐구-동시성 해결 패턴은 왜 계층을 초월하여 반복되는가]]: CPU 스냅샷 ↔ DB MVCC ↔ App 트랜잭션의 구조적 동형.
