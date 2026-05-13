---
aliases: [Java Collection Thread Safety, Java Concurrent Collections, Java 컬렉션 동시성]
tags: [개념, 작성중]
created: 2026-05-12
updated: 2026-05-12
type: Concept
difficulty: Medium
---

# Concept: Java 컬렉션의 스레드 안전성 보장 방식

## 한 문장 정의

> (사전적) Java 컬렉션은 기본 구현, 동기화 래퍼, 동시성 전용 컬렉션으로 나뉘며, 각 방식은 서로 다른 메커니즘으로 스레드 안전성을 보장한다.
> (이해용) "같은 장부를 여러 명이 볼 때, 한 명씩만 보게 막을지, 장부 구조 자체를 동시 접근에 맞게 바꿀지의 선택지".

## 해결하는 문제

- 여러 스레드가 같은 `List`, `Map`, `Set`을 동시에 읽고 쓸 때 생기는 [[현상-경쟁 조건]].
- 컬렉션 내부 구조가 바뀌는 도중 다른 스레드가 끼어들어 상태가 깨지는 문제.
- `containsKey` 후 `put`, 순회 중 수정처럼 복합 연산에서 의미가 무너지는 문제.

## 치르는 비용

- `Collections.synchronizedXxx()`는 전체 접근을 직렬화하므로, 경합이 많아지면 처리량이 눈에 띄게 떨어질 수 있다.
- `ConcurrentHashMap` 같은 동시성 컬렉션은 성능은 좋지만, 보장 범위를 정확히 모르면 복합 연산에서 실수하기 쉽다.
- `CopyOnWriteArrayList`는 읽기에는 강하지만, 쓸 때마다 복사가 일어나서 쓰기 비용이 크다.

## 동작 원리

## 1. 기본 컬렉션은 왜 thread-safe가 아닌가

`ArrayList`, `HashMap`, `HashSet` 같은 일반 컬렉션은 기본적으로 동기화를 제공하지 않는다. 그래서 단일 스레드에서는 가볍고 빠르지만, 여러 스레드가 한꺼번에 건드리기 시작하면 바로 위험해진다.

```text
Thread A: list.add(A)
Thread B: list.add(B)
동시에 내부 size/배열/버킷 구조 갱신
→ 순서 꼬임, 값 유실, 비결정성 가능
```

Oracle 문서도 일반 구현에 대해 명시적으로 말한다.

> "None are synchronized (thread-safe)." — [Oracle Java Tutorial: Collections Implementations](https://docs.oracle.com/javase/tutorial/collections/implementations/index.html)

## 2. synchronized 래퍼 방식

`Collections.synchronizedList(...)`, `synchronizedMap(...)`은 기존 컬렉션을 감싸서 메서드 접근을 직렬화한다.

```java
List<String> list = Collections.synchronizedList(new ArrayList<>());
```

여기서 중요한 건 **반드시 반환된 래퍼 객체로만 접근해야 한다는 점**이다.

```text
원본 ArrayList 직접 접근  ❌
반환된 synchronizedList만 접근 ✅
```

그리고 순회는 메서드 한 번으로 끝나는 작업이 아니라 여러 단계로 이어지기 때문에, 외부에서 한 번 더 동기화해줘야 한다.

```java
synchronized (list) {
    Iterator<String> it = list.iterator();
    while (it.hasNext()) {
        use(it.next());
    }
}
```

> "In order to guarantee serial access, it is critical that all access to the backing collection is accomplished through the returned collection." — [JDK Collections API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/Collections.html)

> "It is imperative that the user manually synchronize on the returned collection when traversing it via Iterator, Spliterator or Stream" — [JDK Collections API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/Collections.html)

## 3. 동시성 전용 컬렉션 방식

`java.util.concurrent`의 컬렉션은 "그냥 전체에 큰 락 하나"를 거는 식이 아니다. 읽기와 갱신의 성격을 나눠서, 실제 서버 환경에서 더 높은 동시성을 노린다.

대표 예시는 `ConcurrentHashMap`이다.

```text
HashMap
  → thread-safe 아님
  → 외부 lock 필요

Collections.synchronizedMap(HashMap)
  → 전체 접근 직렬화
  → 단순하지만 경합 높음

ConcurrentHashMap
  → 읽기는 높은 동시성
  → 갱신은 더 세밀한 제어
  → atomic API 제공
```

> "A hash table supporting full concurrency of retrievals and high expected concurrency for updates." — [JDK ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

여기서 많이 헷갈리는 지점이 있다. **메서드 단위 thread-safe**와 **복합 로직 전체 원자성**은 같은 말이 아니다.

## 4. 왜 복합 연산은 여전히 위험한가

아래 코드는 `ConcurrentHashMap`이어도 의미가 깨질 수 있다.

```java
if (!map.containsKey(key)) {
    map.put(key, value);
}
```

```text
Thread A: containsKey(key) = false
Thread B: containsKey(key) = false
Thread A: put(key, A)
Thread B: put(key, B)
결과: A가 덮여씀
```

이런 경우에는 `putIfAbsent`, `computeIfAbsent` 같은 원자 API를 써야 한다.

> "The entire method invocation is performed atomically." — [JDK ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

## 5. 대표 선택 기준

| 상황 | 적합한 선택 |
|---|---|
| 단일 스레드 또는 외부에서 이미 락 관리 | 기본 컬렉션 |
| 간단히 thread-safe만 붙이고 싶음 | `Collections.synchronizedXxx()` |
| 읽기 많고 경쟁 높은 서버 환경 | `ConcurrentHashMap` 등 동시성 컬렉션 |
| 읽기 압도적, 쓰기 매우 드묾 | `CopyOnWriteArrayList` |
| 레거시 호환만 필요 | `Vector`, `Hashtable` (신규 코드엔 비추천) |

## 비교 요약

정리하면, "그냥 안전하게만 만들자"와 "경쟁이 많은 환경에서도 버텨야 한다"는 요구는 다르다. 그래서 컬렉션도 상황에 맞게 골라야 한다.

```text
기본 컬렉션
  장점: 가볍고 빠름
  단점: 동시 접근 보호 없음

synchronized 래퍼
  장점: 이해 쉽고 적용 단순
  단점: 전체 직렬화, 순회 시 수동 동기화 필요

동시성 컬렉션
  장점: 높은 동시성, atomic API 제공
  단점: 복합 연산 안전성은 직접 이해해야 함
```

## 관련 본질

- [[개념-스레드 안전성 (Thread Safety)]]
- [[본질-동시성 (Concurrency)]]
- [[본질-원자성 (Atomicity)]]
- [[본질-격리성 (Isolation)]]

## 참고

> "None are synchronized (thread-safe)." — [Oracle Java Tutorial: Collections Implementations](https://docs.oracle.com/javase/tutorial/collections/implementations/index.html)

> "Returns a synchronized (thread-safe) collection backed by the specified collection." — [JDK Collections API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/Collections.html)

> "It is imperative that the user manually synchronize on the returned collection when traversing it via Iterator, Spliterator or Stream" — [JDK Collections API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/Collections.html)

> "A hash table supporting full concurrency of retrievals and high expected concurrency for updates." — [JDK ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

> "The entire method invocation is performed atomically." — [JDK ConcurrentHashMap API](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
