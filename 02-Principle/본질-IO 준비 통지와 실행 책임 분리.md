---
aliases: [IO Readiness Notification and Execution Responsibility, Event Loop, epoll]
tags: [본질, 작성중, IO, EventLoop]
difficulty: High
type: Principle
---

# Principle: I/O 준비 통지와 실행 책임 분리

**핵심 질문**: 논블로킹 I/O는 무엇을 커널에 맡기고 무엇을 애플리케이션이 직접 처리하는가?

## 한 문장 정의

I/O 준비 통지와 실행 책임 분리는 커널이 파일 디스크립터의 준비 상태를 알려주고, 애플리케이션 이벤트 루프가 그 알림을 받아 실제 callback 실행 순서를 결정한다는 원리.

---

## 해결하는 문제

- 요청마다 thread를 만들어 I/O 대기 동안 thread pool이 묶이는 문제
- 이벤트 루프가 OS 스케줄링을 우회한다고 오해하는 문제
- epoll, event loop, async/await를 하나의 개념으로 뭉뚱그리는 문제
- 논블로킹 I/O가 CPU 작업까지 자동으로 논블로킹으로 만든다고 착각하는 문제

---

## 판단 기준

```text
Blocking I/O
  user thread ─ read() ─> kernel
  데이터 없음 → thread sleep
  I/O 완료 → wakeup

Event Loop / I/O Multiplexing
  fd 등록
  epoll_wait()
  ready fd 목록 반환
  application callback 실행
```

핵심 분리:

```text
커널 책임
  - 어떤 fd가 읽기/쓰기 가능한지 감시
  - 준비된 이벤트를 알려줌

애플리케이션 책임
  - callback 실행
  - callback이 오래 걸리지 않게 유지
  - backpressure와 에러 처리
```

---

## 진단 포인트

- 대기 시간이 I/O 때문인지 callback 실행 때문인지 나눈다.
- event loop lag와 I/O readiness 지연을 구분한다.
- blocking syscall 또는 sync API가 event loop thread에서 실행되는지 확인한다.
- 준비된 이벤트가 많아도 callback 하나가 루프를 오래 점유하지 않는지 본다.

---

## 트레이드오프

I/O 준비 통지를 커널에 맡기면 적은 thread로 많은 연결을 다룰 수 있다. 하지만 실제 처리 코드는 애플리케이션 루프가 실행하므로, callback이 무거워지면 전체 이벤트 처리 흐름이 밀린다.

---

## 대표 문제

- [[35-이벤트 루프에 CPU 작업을 올려 모든 요청이 지연됨]]

---

## 참고

> "The epoll_wait() system call waits for events on the epoll(7) instance referred to by the file descriptor epfd." — [Linux man-pages: epoll_wait(2)](https://man7.org/linux/man-pages/man2/epoll_wait.2.html)

> "The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that a single JavaScript thread is used by default" — [Node.js Docs: The Node.js Event Loop](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick)
