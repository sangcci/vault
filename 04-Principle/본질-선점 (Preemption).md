---
aliases: [Preemption, Preemptive Scheduling]
tags: [본질, 완료]
created: 2026-02-05
updated: 2026-03-02
type: Principle
difficulty: High
---
**핵심 질문**: "누가 CPU라는 한정된 자원의 통제권을 쥐고 있는가? (사용자인가, 운영체제인가?)"

## One-liner Definition

> 운영체제(커널)가 실행 중인 프로세스로부터 강제로 CPU 제어권을 빼앗아 다른 프로세스에게 할당할 수 있는 방식.

## 동작 원리 (Sudo Code)

```python
def timer_interrupt_handler():
    # 1. 현재 실행 중인 프로세스 상태 저장 (Context Save)
    save_context_to_pcb(current_proc)

    # 2. 할당된 시간(Time Slice) 소진 여부 확인
    if current_proc.time_slice <= 0:
        current_proc.state = READY # 주도권 박탈

        # 3. 다음 실행 프로세스 선택 및 상태 복구
        next_proc = scheduler.pick_next()
        restore_context_from_pcb(next_proc)
        jump_to(next_proc.pc) # 제어권 전이
```

## Recurring Core Problem

자원을 독점하려는 프로세스로부터 시스템 전체를 보호해야 합니다. 하지만 **락(Lock)을 쥔 채로 선점**당했을 때, 다른 프로세스들이 해당 락을 기다리느라 시스템 전체가 멈추는 '우선순위 역전'이나 '대기 확산' 문제가 발생합니다.

## Why It Doesn't Disappear

현대 컴퓨팅의 핵심인 '멀티태스킹'과 '반응성'을 보장하기 때문입니다. 하드웨어 타이머와 커널의 강제 개입이 없다면, 하나의 무한 루프가 전체 시스템을 마비시킬 수 있습니다.

## Trade-offs

- **공정성 vs 문맥 교환 비용**: 모든 프로세스에 기회를 주지만, 잦은 전환은 CPU가 실제 일이 아닌 관리 작업에 시간을 쓰게 만듭니다.
- **강제성 vs 정합성**: 어디서든 멈출 수 있기에, 공유 자원을 다룰 때 원자성(Atomicity)을 보장하기 위한 락 메커니즘이 필수적입니다.

## Related Cases

- [[본질-원자성 (Atomicity)]]
- [[개념-문맥 교환 (Context Switch)]]
- [[탐구-스케줄링과 정합성의 충돌]]
