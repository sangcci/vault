---
aliases: [Async Await Race Condition, Logical Race in Event Loop, Coroutine Suspension Boundary]
tags: [문제, 작성중, Coroutine, EventLoop, Concurrency]
difficulty: High
type: Problem
---

# Problem: 36-await으로 중간에 끊긴 로직 사이에 다른 요청이 끼어들어 상태가 꼬임

## 상황

싱글 스레드 이벤트 루프라서 race condition이 없다고 생각했다. 하지만 `await` 전후로 하나의 비즈니스 로직이 여러 조각으로 나뉘고, 그 사이에 다른 요청이 같은 데이터를 바꿔 최종 상태가 꼬인다.

```text
Request A
  balance = await readBalance(user)   # 100 읽음
  ── suspend ──

Request B
  balance = await readBalance(user)   # 100 읽음
  await updateBalance(user, 50)

Request A resume
  await updateBalance(user, 70)       # B 결과를 덮어씀
```

---

## 관찰된 증거

- 단일 스레드인데 Lost Update와 비슷한 결과가 나온다.
- `await`, callback, promise 경계가 많은 로직에서 재현된다.
- 요청 하나의 usecase가 한 번에 끝난다는 가정이 깨진다.
- DB transaction이나 atomic update 없이 read-modify-write를 수행한다.
- 로컬 메모리 경합은 없지만 외부 상태(DB/Redis/API)의 논리 순서가 꼬인다.

---

## 의심 문제

가장 가능성 높은 문제는 **스레드 안전성과 비즈니스 원자성을 혼동한 것**이다.

싱글 스레드는 “한 순간에 한 callback만 실행”을 보장한다. 하지만 `await`로 suspend된 로직 전체가 하나의 atomic section으로 보호되는 것은 아니다.

---

## 원인

```text
일반 함수
  start → 끝까지 실행 → return

async/coroutine
  start → await/suspend → 다른 task 실행 → resume

보장되는 것
  - 한 callback 내부의 동시 실행 없음

보장되지 않는 것
  - await 전후 전체 비즈니스 로직의 원자성
  - 외부 상태 read-modify-write의 격리
```

이벤트 루프는 실행 흐름을 직렬화하지만, 비동기 경계는 로직을 여러 turn으로 쪼갠다. 그래서 물리적 race가 없어도 논리적 race가 생긴다.

---

## 확인 방법

- read-modify-write가 `await` 경계를 넘어가는지 확인한다.
- 같은 key/user/order를 여러 요청이 동시에 갱신하는지 본다.
- DB transaction, atomic update, unique constraint, compare-and-set 여부를 확인한다.
- coroutine/task 취소와 재시도 시 중간 상태가 남는지 본다.
- 이벤트 루프가 단일인지, worker/event loop가 여러 개인지도 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| DB transaction/lock 사용 | 외부 상태 원자성 보장 | lock 범위와 대기 비용 |
| Atomic UPDATE/CAS 사용 | read-modify-write 단일화 | 조건식 설계 필요 |
| key별 queue/actor 모델 | 같은 key 직렬 처리 | hot key 병목 |
| idempotency key | 재시도 중복 방어 | 상태 저장 필요 |
| await 경계 전후 상태 재검증 | stale state 방지 | 코드 복잡도 증가 |

---

## 트레이드오프

싱글 스레드 모델은 메모리 동기화 비용을 줄이지만, 비즈니스 트랜잭션을 자동으로 보호하지 않는다. `await`는 성능을 위해 제어권을 양보하는 지점이면서 동시에 원자성이 끊기는 경계다.

---

## 연결되는 본질

- [[본질-협력형 스케줄링과 양보 지점]]
- [[본질-단일 실행 흐름과 직렬화 비용]]
- [[본질-원자적 상태 전이]]
- [[본질-동시성 제어와 격리]]

---

## 참고

> "Tasks are used to schedule coroutines concurrently. Event loops use cooperative scheduling: an event loop runs one Task at a time." — [Python Docs: Coroutines and Tasks](https://docs.python.org/3/library/asyncio-task.html)

> "Coroutines can suspend their execution instead of blocking a thread." — [Kotlin Docs: Coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html)
