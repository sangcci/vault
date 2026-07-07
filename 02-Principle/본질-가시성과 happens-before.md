---
aliases: [Visibility and Happens-Before, Java Memory Model, Memory Barrier]
tags: [본질, 작성중, Java, Concurrency]
difficulty: High
type: Principle
---

# Principle: 가시성과 happens-before

**핵심 질문**: 한 스레드가 값을 썼는데 다른 스레드는 왜 예전 값을 볼 수 있는가?

## 한 문장 정의

가시성과 happens-before는 한 실행 흐름의 쓰기가 다른 실행 흐름의 읽기에 관찰되려면 언어·런타임이 인정하는 동기화 순서가 필요하다는 원리.

---

## 해결하는 문제

- flag는 `true`인데 data는 예전 값으로 보이는 문제
- CPU/컴파일러 명령어 재배치 때문에 순서 가정이 깨지는 문제
- `volatile`과 `synchronized`의 차이를 “빠른 락” 정도로 오해하는 문제
- CAS/Atomic/Lock이 단순 원자성뿐 아니라 메모리 순서까지 다룬다는 점을 놓치는 문제

---

## 깨지는 상황

```java
// Thread A
data = 42;
ready = true;

// Thread B
if (ready) {
    use(data); // 42가 아닐 수도 있음
}
```

동기화 경계가 없으면 다른 스레드가 관찰하는 순서는 코드 순서와 다를 수 있다.

```text
코드 순서
write data → write ready

관찰 순서
read ready=true → read data=old
```

---

## 판단 기준

- 공유 상태를 여러 thread가 읽고 쓰는가?
- 한 write가 다른 read보다 먼저 보여야 하는가?
- 값의 최신성뿐 아니라 쓰기 순서도 중요한가?
- lock, volatile, thread start/join, concurrent collection API 같은 happens-before 경계가 있는가?

없다면 “분명 먼저 썼다”는 코드상 순서는 스레드 간 보장이 아니다.

---

## 해결 방식

| 방식 | 보장 | 주의 |
|---|---|---|
| `synchronized` / monitor lock | unlock → subsequent lock happens-before | 같은 monitor를 써야 함 |
| `volatile` | write → subsequent read happens-before | 복합 갱신 원자성은 아님 |
| Atomic classes | 원자 갱신 + 메모리 효과 | 복잡한 불변식은 별도 설계 |
| Concurrent collections | API별 원자/가시성 보장 | 복합 로직 전체 보장은 아님 |
| Immutable publication | 생성 후 불변 상태 공유 | 안전한 공개 필요 |

---

## 대표 문제

- [[18-ConcurrentHashMap을 써도 중복 생성이나 덮어쓰기가 발생함]]
- [[19-락을 걸었는데 처리량이 급락하거나 요청이 멈춤]]

---

## 참고

> "An unlock on a monitor happens-before every subsequent lock on that monitor." — [Java Language Specification §17.4.5](https://docs.oracle.com/javase/specs/jls/se22/html/jls-17.html#jls-17.4.5)

> "Threads communicate primarily by sharing access to fields and the objects reference fields refer to." — [Oracle Java Tutorial: Synchronization](https://docs.oracle.com/javase/tutorial/essential/concurrency/sync.html)
