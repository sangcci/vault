---
aliases: [ConcurrentHashMap Check Then Act Race, Thread Safe Collection Composite Operation, Race Condition]
tags: [문제, 작성중, Java, Concurrency]
difficulty: Medium
type: Problem
---

# Problem: 18-ConcurrentHashMap을 써도 중복 생성이나 덮어쓰기가 발생함

## 상황

공유 Map을 여러 스레드가 동시에 접근하므로 `HashMap` 대신 `ConcurrentHashMap`을 사용했다. 그런데 중복 생성, 값 덮어쓰기, 초기화 로직 중복 실행이 여전히 발생한다.

```java
ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();

public Session getOrCreate(String userId) {
    if (!sessions.containsKey(userId)) {
        sessions.put(userId, createSession(userId));
    }
    return sessions.get(userId);
}
```

컬렉션은 thread-safe인데 로직 결과는 안전하지 않다.

---

## 관찰된 증거

```text
Thread A: containsKey(k) == false
Thread B: containsKey(k) == false
Thread A: createSession(A) → put(k, A)
Thread B: createSession(B) → put(k, B)
결과: A가 B로 덮임 / 생성 로직 2회 실행
```

증상은 다음과 같다.

- 같은 key에 대한 초기화 로직이 여러 번 실행된다.
- 중복 생성 방지를 기대했지만 마지막 write가 앞선 값을 덮는다.
- `ConcurrentHashMap`을 썼는데도 테스트가 간헐적으로 실패한다.
- 부하 테스트에서만 재현되고 로컬 단일 실행에서는 재현되지 않는다.

---

## 의심 문제

가장 가능성 높은 문제는 **메서드 단위 thread-safe와 복합 로직 전체 원자성을 혼동한 것**이다.

`ConcurrentHashMap`의 개별 메서드는 동시 접근에 안전하지만, `containsKey()`와 `put()` 사이의 시간 창은 보호하지 않는다.

---

## 원인

문제의 핵심 패턴은 Check-then-Act다.

```text
Check: 지금 key가 없는가?
  ↓ race window
Act: 없으면 생성해서 넣는다
```

Check와 Act가 분리되면, 확인한 상태가 실행 시점에도 유효하다는 보장이 없다.

```text
공유 가변 상태 + 동시 접근 + 복합 연산
  ↓
실행 순서에 따라 결과가 달라짐
  ↓
Race Condition
```

`count++` 같은 Read-Modify-Write도 같은 구조다.

```text
read count
modify count + 1
write count
```

한 줄로 보여도 CPU/JVM 관점에서는 여러 단계이므로 중간에 다른 스레드가 끼어들 수 있다.

---

## 확인 방법

- `containsKey` 후 `put`, `get` 후 `set`, `size` 확인 후 `add` 같은 복합 연산을 찾는다.
- thread-safe 자료구조를 썼는지보다, 비즈니스 의미 전체가 하나의 원자 API로 표현됐는지 확인한다.
- `computeIfAbsent`, `putIfAbsent`, `AtomicInteger`, `synchronized`, `Lock`으로 바꾸면 재현이 사라지는지 본다.
- 부하 테스트에서 중복 생성 횟수와 최종 Map 크기를 비교한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| `computeIfAbsent` | key 단위 초기화를 원자 API로 표현 | mapping function 부작용 최소화 필요 |
| `putIfAbsent` | 단순 삽입 경쟁 방어 | 생성 비용이 선발생할 수 있음 |
| `AtomicInteger` 등 Atomic API | 짧은 RMW에 적합 | 복잡한 불변식에는 부족 |
| `synchronized` / `Lock` | 복합 로직 전체 보호 가능 | 경합과 대기 비용 증가 |
| 상태 불변화/비공유화 | 경쟁 자체 제거 | 구조 변경 필요 |

---

## 트레이드오프

thread-safe 컬렉션은 내부 구조가 깨지지 않게 해준다. 하지만 “사용자 없으면 생성한다”, “재고가 있으면 차감한다”, “한 번만 초기화한다” 같은 비즈니스 불변식은 별도 원자 경계로 묶어야 한다.

---

## 연결되는 본질

- [[본질-공유 가변 상태와 원자 경계]]
- [[본질-가시성과 happens-before]]
- [[본질-동시성 제어와 격리]]

---

## 참고

> "Threads communicate primarily by sharing access to fields and the objects reference fields refer to." — [Oracle Java Tutorial: Synchronization](https://docs.oracle.com/javase/tutorial/essential/concurrency/sync.html)

> "A hash table supporting full concurrency of retrievals and high expected concurrency for updates." — [JDK ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

> "The entire method invocation is performed atomically." — [JDK ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
