---
aliases: [Instruction_Reordering, Out-of-Order_Execution]
tags: [현상, 완료]
type: Phenomenon
difficulty: High
---

## 한 문장 정의

> (사전적) 컴파일러나 CPU가 성능 최적화를 위해 명령어의 실행 순서를 임의로 변경하는 현상.
> (이해용) 앞사람이 느리면 뒷사람이 먼저 가서 업무를 처리하는 '비순차적 공정'.

## 발생 환경

- **CPU 파이프라인(Pipeline)**: 여러 명령어를 겹쳐서 처리하는 구조에서 병목(Stall)을 줄이기 위해 발생.
- **컴파일러 최적화**: 코드 레벨에서 데이터 의존성이 없는 구문의 순서를 바꿈.
- **멀티코어 환경**: 각 코어가 독립적으로 재배치를 수행하여 다른 코어에 일관되지 않은 상태를 보여줌.

## 관찰되는 증상

- **데이터 정합성 파괴**: 분명 `A`를 먼저 쓰고 `B`를 썼는데, 다른 스레드에선 `B`가 바뀌었는데 `A`는 예전 값인 상황 발생.
- **소프트웨어 동기화 실패**: Peterson's Algorithm 등 순수 로직 기반 동기화 기법이 현대 장비에서 작동하지 않음.

## 추측되는 원인

- **[[본질-최소 단위의 불일치 (Granularity Mismatch)]]**: CPU 연산 속도(ns)와 메모리 접근 속도(ns * 100)의 거대한 간극을 메우기 위한 생존 전략.
- **비순차 실행 (Out-of-Order Execution)**: 데이터 의존성(Read-After-Write 등)이 없는 한, 준비된 명령어부터 실행 유닛에 할당.

## 시각적 증거

### CPU 파이프라인 재배치 (ASCII)
```text
[코드] Inst 1: x = 100 (Memory Load - 느림)
       Inst 2: flag = true (Register Set - 빠름)

[In-Order Execution]
T1: [Inst 1: Fetch]
T2: [Inst 1: Decode]
T3: [Inst 1: Execute (Waiting Memory...)] <-- 파이프라인 정지 (Stall)
T4: [Inst 1: Execute (Waiting Memory...)] [Inst 2: Decode (Wait)]

[Out-of-Order Execution]
T1: [Inst 1: Fetch]
T2: [Inst 1: Decode]
T3: [Inst 1: Execute (Wait)] [Inst 2: Fetch/Decode]
T4: [Inst 1: Execute (Wait)] [Inst 2: Execute (Done!)] <-- flag가 먼저 true가 됨!
```

## 관련 사례

- **해결책**: [[개념-메모리 배리어 (Memory Barrier)]]
- **동기화 도구**: [[개념-원자적 명령어 (TAS, CAS)]], [[개념-뮤텍스 (Mutex)]]
