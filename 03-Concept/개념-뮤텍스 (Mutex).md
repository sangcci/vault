---
aliases: [Mutual_Exclusion]
tags: [개념, 완료]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 공유 자원에 대해 단 하나의 스레드만 접근할 수 있도록 보장하는 동기화 메커니즘.
> (이해용) 화장실 열람권처럼, 한 명이 들어가면 문을 잠그고 나올 때까지 다른 사람을 대기시키는 도구.

---

## 해결하는 문제

- **[[현상-경쟁 조건]]**: 데이터 동시 수정으로 인한 정합성 파괴 방지.
- **임계 구역 보호**: 로직의 원자적 실행 보장.

---

## 치르는 비용

- **[[개념-문맥 교환 (Context Switch)]]**: 락 획득 실패 시 스레드가 잠들고 깨어나는 오버헤드.
- **교착 상태(Deadlock)**: 여러 뮤텍스를 잘못된 순서로 획득 시 시스템 마비 위험.

---

## 동작 원리

뮤텍스는 하드웨어의 저수준 명령어를 OS 레벨에서 추상화하여 제공합니다.

1. **내부 엔진**: **[[개념-원자적 명령어 (TAS, CAS)]]**를 사용하여 락 상태를 원자적으로 변경.
2. **대기 전략**: 락 획득 실패 시 CPU를 점유하며 도는 대신, 스스로를 대기 큐에 넣고 휴면 상태로 전환 (OS 스케줄러 개입).
3. **가시성 보장**: **[[개념-메모리 배리어 (Memory Barrier)]]**를 묵시적으로 포함하여, 락 해제 전의 모든 수정사항이 다음 획득자에게 보이도록 보장.


---

## Java에서의 실제 작동 원리

Java의 뮤텍스는 보통 `synchronized`와 `ReentrantLock`으로 만난다. 둘은 구현체는 다르지만 본질은 같다.

> "The Java programming language provides multiple mechanisms for communicating between threads. The most basic of these methods is synchronization, which is implemented using monitors." — [Java Language Specification §17.1](https://docs.oracle.com/javase/specs/jls/se22/html/jls-17.html#jls-17.1)

> "The monitorenter instruction is used to enter the monitor associated with an object." — [JVM Specification: monitorenter](https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-6.html#jvms-6.5.monitorenter)

---
### 1. `synchronized`: 객체마다 붙은 출입관리소

`Object lock = new Object()`가 있을 때, `synchronized (lock)`은 그 객체의 monitor에 들어가는 것이다. 객체 자체가 자물쇠라기보다, 객체 옆에 숨은 출입관리소가 있다고 보면 쉽다.

```text
Thread A              lock 객체의 monitor              Thread B
   │                         │                          │
   │ monitorenter 성공        │                          │
   ├────────────────────────>│                          │
   │ 임계 구역 실행           │                          │
   │                         │<─────────────────────────┤
   │                         │ monitorenter 대기         │
   │ monitorexit             │                          │
   ├────────────────────────>│ 다음 스레드 진입 가능      │
   │                         ├─────────────────────────>│
   │                         │                          │ monitorenter 성공
```

본질은 `monitorenter`가 문을 잠그고, `monitorexit`가 문을 여는 것이다. JVM은 이 두 지점을 기준으로 한 번에 한 스레드만 임계 구역에 들어오게 만든다.

---
### 2. `ReentrantLock`: CAS로 먼저 찍고, 실패하면 줄 세우기

`ReentrantLock`은 내부적으로 AQS 계열 구조를 사용한다. 먼저 CAS로 락 상태를 `0 → 1`로 바꾸려 한다. 성공하면 바로 들어가고, 실패하면 대기 큐에 들어간 뒤 잠든다.

> "A reentrant mutual exclusion Lock with the same basic behavior and semantics as the implicit monitor lock accessed using synchronized methods and statements, but with extended capabilities." — [ReentrantLock API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)

> "This class associates, with each thread that uses it, a permit. A call to park will return immediately if the permit is available, consuming it in the process; otherwise it may block." — [LockSupport API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/concurrent/locks/LockSupport.html)

```text
lock state = 0  // 비어 있음

Thread A: CAS(0 → 1) 성공 → 임계 구역 진입
Thread B: CAS(0 → 1) 실패 → 대기 큐 등록 → park()로 잠듦
Thread A: unlock()        → state = 0 → unpark(B)
Thread B: 깨어남          → CAS 재시도 → 성공하면 진입
```

쉬운 비유로는 은행 창구다. 창구가 비어 있으면 바로 업무를 본다. 이미 누가 업무 중이면 번호표를 뽑고 의자에 앉는다. 앞사람이 끝나면 직원이 다음 번호를 부른다.

---

### 3. 재진입성: 같은 주인은 다시 들어갈 수 있음

Java의 `synchronized`와 `ReentrantLock`은 재진입 가능하다. 이미 락을 가진 스레드가 같은 락을 다시 요청하면 막지 않고 횟수만 증가시킨다.

```text
owner = Thread-A
holdCount = 1

Thread-A가 같은 lock 재진입
holdCount = 2

unlock 한 번
holdCount = 1

unlock 두 번
holdCount = 0
owner = 없음
```

본질은 "누가 주인인지"와 "몇 번 들어왔는지"를 같이 기록하는 것이다. 그래서 같은 스레드가 자기 자신 때문에 막히지 않는다.

---
### 4. 락 해제는 문 열기만 아니라 기억 공개

락은 순서만 강제하지 않는다. 이전 스레드가 락 안에서 쓴 값을 다음 스레드가 볼 수 있게 하는 메모리 가시성 경계도 만든다.

> "An unlock on a monitor happens-before every subsequent lock on that monitor." — [Java Language Specification §17.4.5](https://docs.oracle.com/javase/specs/jls/se22/html/jls-17.html#jls-17.4.5)

```text
Thread A synchronized(lock) 안에서 shared = 42 기록
        ↓ monitorexit / unlock
변경 내용 공개
        ↓ monitorenter / lock
Thread B synchronized(lock) 안에서 shared == 42 관찰 가능
```

따라서 Java mutex의 본질은 하나다. 공유 메모리에 들어가는 순서를 직렬화하고, 그 순서 사이에 기억이 전달되는 경계를 세우는 JVM/OS 협력 프로토콜이다.

---

## 관련 본질

- [[본질-원자성 (Atomicity)]]
- [[본질-선점 (Preemption)]]
- [[탐구-뮤텍스 락의 내부 동작과 하드웨어 추상화]]
