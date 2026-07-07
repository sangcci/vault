---
aliases: [Event Loop Blocked by CPU Work, Don't Block Event Loop, Single Thread HOL Blocking]
tags: [문제, 작성중, EventLoop, AsyncIO, Performance]
difficulty: High
type: Problem
---

# Problem: 35-이벤트 루프에 CPU 작업을 올려 모든 요청이 지연됨

## 상황

Node.js, Redis, Netty event loop, nginx 같은 이벤트 루프 기반 구조에서 특정 요청 하나가 오래 걸리는 CPU 작업을 수행한다. 그동안 다른 연결의 I/O 이벤트는 준비되어도 callback이 실행되지 못한다.

```text
Event Loop Thread
  request A callback 시작
    └─ heavyCpuWork() 500ms
  request B socket ready
  request C timer expired
  request D promise resolved

하지만 A callback이 끝날 때까지 B/C/D 실행 불가
```

---

## 관찰된 증거

- CPU 작업 하나가 들어오면 전체 요청 latency가 동시에 증가한다.
- socket ready, timer, promise callback이 밀린다.
- 이벤트 루프 lag metric이 증가한다.
- thread 수를 늘리지 않은 단일 이벤트 루프 구조에서 p99 latency가 튄다.
- Redis의 무거운 명령, Node.js의 동기 JSON 파싱/암호화/압축 같은 작업 후 전체 응답이 늦어진다.

---

## 의심 문제

가장 가능성 높은 문제는 **I/O 대기 최적화 모델인 이벤트 루프에 CPU-bound 작업을 올린 것**이다.

이벤트 루프는 I/O 대기 중인 스레드를 많이 만들지 않기 위해 효율적이다. 하지만 callback 실행 자체는 한 스레드가 순차로 처리하므로, callback 하나가 오래 실행되면 루프 전체가 막힌다.

---

## 원인

```text
이벤트 루프의 강점
  - I/O 준비 상태 감시를 커널에 맡김
  - 준비된 이벤트만 callback으로 처리
  - 요청마다 thread를 만들지 않음

이벤트 루프의 약점
  - callback 실행 중에는 다음 이벤트를 처리하지 못함
  - CPU 작업은 await/epoll로 자동 양보되지 않음
  - 단일 루프에서는 하나의 긴 작업이 전체 HOL blocking을 만듦
```

핵심은 “논블로킹 I/O”가 “모든 코드가 논블로킹”이라는 뜻이 아니라는 점이다.

---

## 확인 방법

- event loop lag, timer delay, queue delay를 측정한다.
- 긴 callback, 동기 파일/암호화/압축/JSON 작업을 찾는다.
- CPU profile에서 event loop thread가 오래 점유되는 구간을 확인한다.
- Redis라면 O(N) 명령, 큰 Lua script, 큰 key scan을 확인한다.
- Node.js라면 sync API, 큰 정규식, 큰 JSON 처리, crypto/zlib 사용 위치를 본다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| CPU 작업을 worker thread/process로 분리 | 이벤트 루프 지연 감소 | 직렬화/전송 비용 |
| 작업을 작은 chunk로 쪼개 yield | 긴 점유 시간 감소 | 코드 복잡도 증가 |
| blocking/sync API 제거 | 루프 정지 방지 | 비동기 API로 재작성 필요 |
| Redis heavy command 회피 | 단일 루프 보호 | 자료구조/쿼리 재설계 필요 |
| backpressure와 queue limit | 지연 폭증 방지 | 거부/재시도 정책 필요 |

---

## 트레이드오프

이벤트 루프는 I/O-bound workload에서 thread와 context switch 비용을 줄인다. 대신 CPU-bound 작업을 같은 루프에 올리면 병렬성이 없기 때문에 모든 요청이 한 줄로 밀린다. 효율을 얻는 대신 “callback은 짧아야 한다”는 규칙을 지켜야 한다.

---

## 연결되는 본질

- [[본질-IO 준비 통지와 실행 책임 분리]]
- [[본질-협력형 스케줄링과 양보 지점]]
- [[본질-단일 실행 흐름과 직렬화 비용]]

---

## 참고

> "The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that a single JavaScript thread is used by default" — [Node.js Docs: The Node.js Event Loop](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick)

> "Node.js runs JavaScript code in the Event Loop (initialization and callbacks), and offers a Worker Pool to handle expensive tasks like file I/O." — [Node.js Docs: Don't Block the Event Loop](https://nodejs.org/en/guides/dont-block-the-event-loop)
