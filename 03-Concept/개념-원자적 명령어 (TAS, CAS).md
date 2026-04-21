---
aliases: [Atomic_Instructions, Test_and_Set, Compare_and_Swap]
tags: [개념, 완료]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) 읽기-수정-쓰기(Read-Modify-Write) 과정을 쪼개지지 않는 단일 단계로 수행하는 하드웨어 명령어.
> (이해용) 중간에 스케줄러가 절대 끼어들 수 없는 '한 호흡' 연산.

## 해결하는 문제

- **[[현상-명령어 재배치 (Instruction Reordering)]]** 없이도 원자성 자체를 하드웨어가 보장.
- **[[현상-경쟁 조건]]**: 여러 스레드가 공유 변수를 동시에 수정할 때 발생하는 데이터 오염 방지.

## 치르는 비용

- **[[현상-ABA 문제 (ABA Problem)]]**: CAS는 값의 이력을 추적하지 못해 중간 변화를 놓칠 수 있음.
- **스핀 오버헤드(Busy-Wait)**: TAS 기반 스핀락은 락 획득 실패 시 CPU를 점유하며 폴링.
- **경합 증폭**: 스레드 수가 많아질수록 CAS 재시도가 폭발적으로 증가(Thundering Herd).

## 동작 원리

이 명령어들은 하드웨어가 직접 메모리나 캐시의 제어권을 독점하여 수행합니다.

1. **Cache Locking (신식)**: 연산 대상이 되는 캐시 라인(Cache Line)을 **MESI 프로토콜**을 통해 독점(Exclusive) 상태로 만들고, 그동안 다른 코어의 접근을 차단한 채 레지스터 값과 메모리 값을 원자적으로 교체합니다.
2. **Bus Locking (구식)**: 메모리 버스(Memory Bus) 자체를 잠가 버려서 다른 CPU가 메모리 근처에도 못 오게 막은 뒤 연산합니다.

---

## 1. TAS (Test-and-Set)

**핵심**: 비교 없이 **무조건** 값을 1(True)로 바꿉니다.

### TAS 수도 코드
```c
bool test_and_set(bool *target) {
    bool old = *target; // 1. 이전 값을 읽고
    *target = true;     // 2. 무조건 1(true)로 덮어씀
    return old;         // 3. 읽었던 이전 값을 반환
}
```

### TAS 시간 순서 다이어그램
```text
Time | Thread A (Winner)         | Thread B (Looser)          | Lock State
-----|---------------------------|----------------------------|------------
T1   | TAS(&lock) -> 0 (Success) | (Waiting)                  | 0 -> 1
T2   | [ Critical Section ]      | TAS(&lock) -> 1 (Fail)     | 1
T3   | [ Critical Section ]      | TAS(&lock) -> 1 (Fail)     | 1
T4   | Unlock (lock = 0)         | (Spinning)                 | 1 -> 0
T5   | (Done)                    | TAS(&lock) -> 0 (Success) | 0 -> 1
```

---

## 2. CAS (Compare-and-Swap)

**핵심**: 현재 값이 내가 알던 값과 같은지 **비교**합니다. 락(Lock)의 개념이 아니라 작업의 유효성을 검증하는 방식이기에 **낙관적 락(Optimistic Lock)**이라 불립니다.

### CAS 수도 코드
```c
bool compare_and_swap(int *val, int expected, int new_val) {
    if (*val == expected) { // 1. 비교: 내가 알던 그 상태인가?
        *val = new_val;     // 2. 일치하면 새 값으로 교체
        return true;
    }
    return false;           // 3. 다르면 실패 (누군가 그새 바꿨음)
}
```

### CAS 시간 순서 다이어그램
```text
Time | Thread A (Worker)         | Thread B (Interrupter)      | Memory Value
-----|---------------------------|-----------------------------|--------------
T1   | Read V (old=10)           | (Wait)                      | 10
T2   | (Calculate new=11)        | CAS(V, 10, 20) -> Success   | 10 -> 20
T3   | CAS(V, 10, 11) -> Fail    | (Working...)                | 20
T4   | (Retry) Read V (old=20)   | (Working...)                | 20
```

### CAS 활용: increment() 예제
```c
void increment(int *count) {
    int old, next;
    do {
        old = *count;       // 1. 현재 값을 읽음
        next = old + 1;     // 2. 증가 연산 (아직 메모리 반영 안 됨)
    } while (!CAS(count, old, next)); // 3. 충돌 시 다시 시도 (낙관적 락 전략)
}
```

## 관련 본질

- [[본질-원자성 (Atomicity)]]
- [[본질-임계 구역 해결의 3대 조건]]
