---
aliases: [Thread Safety, Thread-Safe, 스레드 안전]
tags: [개념, 작성중]
created: 2026-05-12
updated: 2026-05-12
type: Concept
difficulty: Medium
---

# Concept: 스레드 안전성 (Thread Safety)

## 한 문장 정의

> (사전적) 여러 스레드가 동시에 같은 상태에 접근하더라도 프로그램의 의미와 결과가 깨지지 않도록 보장하는 성질.
> (이해용) "여럿이 한 장부를 동시에 만져도 숫자가 틀어지지 않게 하는 보호 장치".

---

## 해결하는 문제

- 공유 가변 상태(shared mutable state)에 여러 스레드가 동시에 접근할 때 생기는 [[현상-경쟁 조건]].
- 단일 스레드에서는 멀쩡해 보이던 코드가, 실행 순서가 섞이는 순간 갑자기 다른 결과를 내는 문제.
- 읽기와 쓰기 사이에 다른 스레드가 끼어들어 중간 상태를 보게 되는 문제.

---

## 치르는 비용

- 락으로 보호하면 대기 시간과 문맥 교환 비용이 늘어난다.
- 동기화를 과하게 걸면 처리량이 떨어지고, 잘못 쓰면 교착 상태로 이어질 수 있다.
- thread-safe 컬렉션을 써도 복합 연산까지 저절로 안전해지는 건 아니라서, 설계에서 여전히 신경 쓸 부분이 남는다.

---

## 동작 원리

결국 핵심은 **"공유" + "변경 가능" + "동시 접근"** 이 세 조건이 한곳에 모일 때다. 이때는 끼어들기를 막아야 하고, 막지 못하더라도 결과가 깨지지 않게 만들어야 한다.

```text
[안전한가?]
공유 상태가 있는가?
  └─ 아니오 → 대체로 안전
  └─ 예
      변경 가능한가?
        └─ 아니오 → 대체로 안전
        └─ 예
            동시에 접근 가능한가?
              └─ 아니오 → 안전
              └─ 예 → 보호 장치 필요
                        (lock / atomic / volatile / ThreadLocal / immutable design)
```

대표적인 실패 패턴은 `Read-Modify-Write`다.

```java
count++;
```

이 한 줄은 실제로는 한 덩어리가 아니다.

```text
Thread A: read count = 0
Thread B: read count = 0
Thread A: +1 후 write 1
Thread B: +1 후 write 1
결과: 2가 아니라 1  ← 갱신 손실
```

그래서 thread-safe를 확보할 때는 보통 아래 방법들 중 하나를 쓴다.

1. **상태를 공유하지 않기** — 지역 변수, 메시지 전달, 함수형 스타일.
2. **상태를 불변으로 만들기** — 바꿀 수 없게 해서 경쟁 자체를 제거.
3. **임계 구역을 직렬화하기** — `synchronized`, `Lock`, [[개념-임계 구역 (Critical Section)]].
4. **원자 연산 사용하기** — CAS, `AtomicInteger`, `computeIfAbsent` 같은 API.
5. **스레드별로 상태를 분리하기** — `ThreadLocal`.
6. **동시성 전용 자료구조 사용하기** — `ConcurrentHashMap` 등.

---

## Java에서 자주 보는 보장 방식

### 1. synchronized / Lock
여러 스레드가 같은 객체 상태를 건드릴 때, 한 번에 한 스레드만 임계 구역에 들어오게 막는다.

### 2. Atomic 계열
단순 증가나 교체, CAS처럼 짧은 연산은 락 없이도 원자적으로 처리할 수 있다.

### 3. ThreadLocal
값을 아예 공유하지 않고 스레드마다 따로 둔다. 안전하게 만들기는 쉽지만, "원래 공유돼야 하는 상태"를 해결하는 방법은 아니다.

### 4. 컬렉션 래퍼와 동시성 컬렉션
- `Collections.synchronizedList(...)`, `synchronizedMap(...)`은 **컬렉션 전체 접근을 직렬화**하는 방식이다.
- `ConcurrentHashMap`은 **읽기 동시성은 높이고, 갱신은 더 잘게 나눈 제어**를 사용한다.
- 단, `containsKey(k)` 후 `put(k, v)` 같은 **복합 연산**은 컬렉션이 thread-safe여도 별도 원자 API가 필요하다.
- Java 컬렉션 관점의 상세 비교는 [[개념-Java 컬렉션의 스레드 안전성 보장 방식]] 참고.

---

## 자주 하는 오해

- **thread-safe = 빠르다** → 아니다. 보통은 안전성을 얻는 대신 성능 일부를 내준다.
- **thread-safe = 모든 연산이 원자적이다** → 아니다. 메서드 하나가 안전한 것과 비즈니스 로직 전체가 원자적인 건 다른 얘기다.
- **ConcurrentHashMap을 쓰면 끝이다** → 아니다. `check-then-act` 같은 복합 로직은 여전히 깨질 수 있다.
- **volatile만 붙이면 된다** → 아니다. `volatile`은 가시성에는 도움을 주지만, 복합 갱신을 자동으로 원자화해주지는 않는다.

---

## 관련 본질

- [[본질-동시성 (Concurrency)]]
- [[본질-원자성 (Atomicity)]]
- [[본질-격리성 (Isolation)]]
- [[본질-임계 구역 해결의 3대 조건]]

---

## 참고

> "Threads communicate primarily by sharing access to fields and the objects reference fields refer to. This form of communication is extremely efficient, but makes two kinds of errors possible: thread interference and memory consistency errors. The tool needed to prevent these errors is synchronization." — [Oracle Java Tutorial: Synchronization](https://docs.oracle.com/javase/tutorial/essential/concurrency/sync.html)

> "We have already seen that an increment expression, such as `c++`, does not describe an atomic action." — [Oracle Java Tutorial: Atomic Access](https://docs.oracle.com/javase/tutorial/essential/concurrency/atomic.html)

> "Returns a synchronized (thread-safe) collection backed by the specified collection. In order to guarantee serial access, it is critical that all access to the backing collection is accomplished through the returned collection." — [JDK Collections API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/Collections.html)

> "A hash table supporting full concurrency of retrievals and high expected concurrency for updates." — [JDK ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

> "None are synchronized (thread-safe)." — [Oracle Java Tutorial: Collections Implementations](https://docs.oracle.com/javase/tutorial/collections/implementations/index.html)
