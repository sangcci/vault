---
aliases: [Inversion of Control, IoC]
tags: [본질, 완료]
created: 2026-03-02
updated: 2026-03-02
type: Principle
difficulty: High
---
**핵심 질문**: "주도권(Control Flow)을 누가 쥐고 있는가? 나의 코드인가, 아니면 프레임워크/OS인가?"

## One-liner Definition

> 프로그램의 제어 흐름을 개발자가 직접 제어하지 않고 외부(프레임워크, 컨테이너 등)에 위임하는 설계 원칙.
> **"할리우드 원칙: Don't call us, we'll call you."**

## 영역별 IoC의 발현

1. **Low-level (HW/OS)**:
   - **Interrupt**: CPU가 폴링(무한 질문)하지 않고, 하드웨어가 신호를 주면 그때 처리합니다.
   - **Preemption**: OS가 프로세스의 생사여탈권을 쥐고 강제로 멈추거나 깨웁니다.
2. **Framework (Spring/DI)**:
   - **Object Wiring**: 내가 `new` 하지 않습니다. Spring이 객체를 만들고 내 코드에 꽂아(Inject)줍니다.
   - **Lifecycle Management**: 객체의 생성부터 소멸까지의 주기도 프레임워크가 담당합니다.

## 왜 주도권을 포기하는가?

- **관심사의 분리(SoC)**: 개발자는 '어떻게 비즈니스를 처리할지'만 고민합니다. '언제 실행할지', '어떻게 연결할지'는 인프라에 맡깁니다.
- **확장성(Pluggability)**: 내가 불리는 존재이기에, 나를 부르는 쪽(프레임워크)은 나 대신 다른 부품을 끼워 넣을 수 있습니다. 코드 수정 없는 기능 확장이 가능해집니다.

## Persistence

이 원칙은 소프트웨어의 규모가 커질수록 **복잡도를 관리하는 유일한 방법**으로 남습니다. 개별 부품이 서로를 직접 부르면 '스파게티 코드'가 되지만, 중앙에서 제어권을 통제하면 시스템은 예측 가능해집니다.

## Related Cases

- [[개념-의존성 주입 (Dependency Injection)]]
- [[본질-관심사의 분리 (Separation of Concerns)]]
- [[본질-선점 (Preemption)]]
- [[탐구-Spring을 사용하는 보이지 않는 이유]]
