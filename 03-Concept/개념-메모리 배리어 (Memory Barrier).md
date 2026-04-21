---
aliases: [Memory_Barrier, Memory_Fence]
tags: [개념, 완료]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 특정 지점 앞뒤로 메모리 연산의 순서를 강제하고, 변경 사항을 다른 코어에 전파하도록 지시하는 CPU 명령어.
> (이해용) CPU에게 "여기까진 무조건 다 끝내고 넘어가!"라고 긋는 '금지선'.

## 해결하는 문제

- **[[현상-명령어 재배치 (Instruction Reordering)]]** 방지.
- **메모리 가시성(Visibility)** 확보: 한 코어가 수정한 값이 다른 코어의 캐시에도 즉시 반영(또는 무효화)되도록 강제.

## 치르는 비용

- **성능 저하**: CPU 파이프라인의 비순차 실행을 막으므로 연산 효율이 급감함.
- **파이프라인 플러시(Flush)**: 대기 중인 모든 명령어가 완료될 때까지 기다려야 함.

## 동작 원리

1. **Load Barrier (Read Fence)**: 배리어 이전의 모든 읽기 작업이 완료된 후 이후 읽기 수행.
2. **Store Barrier (Write Fence)**: 배리어 이전의 모든 쓰기 작업이 메모리에 반영된 후 이후 쓰기 수행.
3. **Full Barrier**: 읽기/쓰기 모두에 대해 엄격한 순서 보장.

### x86 하드웨어 구현
- `LFENCE`, `SFENCE`, `MFENCE` 명령어 제공.
- **[[개념-원자적 명령어 (TAS, CAS)]]**의 `lock` 접두사는 묵시적인 Full Barrier 역할을 수행함.

## 관련 본질

- [[본질-원자성 (Atomicity)]]
- [[본질-일관성의 종류 (Consistency Types)]]
