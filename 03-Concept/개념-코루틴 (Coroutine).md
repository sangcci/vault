---
aliases: [Coroutine, 코루틴, suspend, resume]
tags: [개념, 작성중]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) 실행을 임의 시점에 일시 중단(suspend)하고 재개(resume)할 수 있는 서브루틴의 일반화된 형태.
> (이해용) "함수가 중간에 멈추고 제어권을 넘겼다가, 나중에 멈춘 지점부터 정확히 다시 시작하는 구조."

## 해결하는 문제

- 스레드 생성 없이 동시성 달성 — I/O 대기 중 다른 작업 수행
- 콜백 지옥 없이 비동기 코드를 동기 코드처럼 작성

## 치르는 비용

- **협력적 멀티태스킹**: 코루틴이 직접 양보(yield)해야 다음 코루틴 실행 가능 — 한 코루틴이 CPU를 독점하면 나머지 전부 대기
- OS 선점 없음 → 애플리케이션 레벨에서 직접 스케줄링 관리

## 동작 원리

일반 함수(서브루틴)와의 차이:

```
서브루틴:  호출 → 실행 → 반환 (한 방향)

코루틴:    호출 → 실행 → suspend → (제어권 반환)
                        ↑              ↓
                       resume ←── 다른 작업
```

**언어별 구현:**

```
Kotlin:  suspend fun fetchData() { ... }
         → 컴파일러가 상태 머신으로 변환
         → suspend 지점마다 중단·재개 가능

Python:  async def fetch(): await asyncio.sleep(1)
         → await = suspend 지점

Go:      goroutine + channel
         → OS 스레드 위에서 런타임이 M:N으로 스케줄링
         → 선점 가능 (Go 1.14+) → 엄밀히는 코루틴과 다름
```

**싱글스레드 이벤트루프와의 관계:**

```
이벤트루프 (Node.js, nginx, Redis)
   ↓
콜백/Promise/async-await 모두 코루틴 메커니즘의 구현체
   ↓
I/O 대기 → suspend → 다음 태스크 실행 → resume
```

## JavaScript 비동기 진화

JavaScript가 async/await에 도달하기까지 거친 3단계. **형태만 바뀌었고, 근본 원인(비동기 결과를 순차적으로 사용해야 하는 상황)은 동일**하다.

```
1단계: Callback
─────────────────────────────────────────────
fetchUser(id, function(user) {
  fetchOrders(user, function(orders) {
    fetchDetail(orders[0], function(detail) {
      // 콜백 지옥 — 들여쓰기가 곧 깊이
    });
  });
});
문제: 중첩 깊이 ∝ 순차 의존 단계 수

2단계: Promise (ES6)
─────────────────────────────────────────────
fetchUser(id)
  .then(user => fetchOrders(user))
  .then(orders => fetchDetail(orders[0]))
  .then(detail => ...)
  .catch(err => ...);
개선: 들여쓰기 해결
문제: then() 체인 = Promise 지옥. 원인 미해결 (비동기를 순차로 다뤄야 한다는 사실)

3단계: async/await (ES2017)
─────────────────────────────────────────────
async function run() {
  const user    = await fetchUser(id);       // suspend 지점
  const orders  = await fetchOrders(user);   // suspend 지점
  const detail  = await fetchDetail(orders[0]);
}
개선: 동기 코드처럼 읽힘
실체: 컴파일 시 내부적으로 Promise 체인으로 변환
```

## 컴파일러 차이: JS vs Kotlin

**같은 `async/await` 문법이지만, 컴파일 결과가 다르다.**

```
JavaScript (Node.js)
─────────────────────────────────────────────
async function run() { ... }
     ↓ 컴파일
Promise 체인 (microtask queue 기반)
→ 단일 이벤트루프 스레드에서 실행
→ 멀티코어 활용 불가

Kotlin Coroutine
─────────────────────────────────────────────
suspend fun run() { ... }
     ↓ 컴파일
상태 머신 (Continuation 객체)
→ Dispatcher가 스레드풀에 코루틴 분배
→ 멀티코어 활용 가능
```

결국 같은 추상화(비동기 코드를 동기처럼)이지만, **런타임 실행 모델은 완전히 다르다**.

## 처리 효율성 비교: 이벤트루프 vs 경량 스레드

[[개념-이벤트 루프]](Node.js, Redis)는 I/O 처리 효율은 높지만, **단일 스레드라는 구조적 한계**가 있다.

```text
이벤트루프 (Node.js, Redis)
┌───────────────────────────────────────────┐
│  Single Thread (Event Loop)               │
│  Task-A → Task-B → Task-C → Task-D ...   │
│                                           │
│  코어 수: N개  →  활용: 1개만             │
│  CPU-bound 작업 1개가 루프 전체를 차단    │
└───────────────────────────────────────────┘

코루틴 (Kotlin) / 고루틴 (Go) / Virtual Thread (Java)
┌───────────────────────────────────────────┐
│  Thread Pool (코어 수만큼)                │
│                                           │
│  Core-1: Coroutine-A, C, E ...           │
│  Core-2: Coroutine-B, D, F ...           │
│                                           │
│  코어 수: N개  →  활용: N개              │
│  경량 단위가 스레드풀 위에서 분산 실행    │
└───────────────────────────────────────────┘
```

| | 이벤트루프 (Node.js/Redis) | 코루틴/고루틴/VT |
|---|---|---|
| **스레드 수** | 1개 (싱글스레드) | N개 (코어 수) |
| **멀티코어 활용** | 불가 | 가능 |
| **CPU-bound 대응** | 루프 차단 → 전체 지연 | 다른 스레드에서 처리 가능 |
| **I/O-bound 대응** | 우수 | 동등하게 우수 |
| **구현 복잡도** | 낮음 | 중간 (Dispatcher/Scheduler 존재) |

**언어별 멀티코어 구현 방식:**
```
Kotlin: Dispatchers.IO / Default → 공유 스레드풀에 코루틴 분배
Go:     M:N 스케줄링 → 고루틴 M개를 OS 스레드 N개에 매핑 (GOMAXPROCS)
Java:   Virtual Thread → carrier thread(platform thread)에 마운트
        I/O 블로킹 시 carrier thread 반환, 재개 시 재마운트
```

> Node.js도 `worker_threads`, `cluster`로 멀티코어를 우회할 수 있으나, 이는 별도 프로세스/스레드를 추가하는 것이지 이벤트루프 자체가 멀티코어를 활용하는 것이 아니다.

## 관련 본질

- [[본질-동시성 (Concurrency)]]
- [[본질-선점 (Preemption)]]
- [[본질-병렬성 (Parallelism)]]

## 관련 개념

- [[개념-이벤트 루프]]
- [[개념-차단 IO (Blocking IO)]]
- [[탐구-nginx, redis 처럼 싱글스레드 기반 프로그램도 내부 과정이 Coroutine과 동일하다고 봐야 하는가, 동일한 동시성 문제를 공유하고 있는가]]
