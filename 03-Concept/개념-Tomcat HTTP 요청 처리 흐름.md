---
aliases: [Tomcat Request Processing, NIO Selector, Worker Thread, HTTP Request Flow, Acceptor Thread, Poller Thread]
tags: [개념, 작성중, WAS, 네트워크]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Tomcat이 클라이언트의 HTTP 요청을 수신하여 응답을 반환하기까지, OS 레벨의 TCP 연결부터 Acceptor Thread의 연결 수거, Poller(NIO Selector)의 이벤트 감지, Worker Thread 할당, Spring MVC 처리를 거치는 전체 흐름.
> (이해용) "경비원(Acceptor)이 문 앞에서 손님을 받아 대기실에 안내하고, 안내데스크(Poller)가 손님 호출을 감지해 담당자(Worker)에게 연결하는" 과정.

## 해결하는 문제

- HTTP 요청 하나당 스레드 하나를 점유하는 전통 모델(BIO)의 자원 낭비 문제.
- 대량의 동시 연결을 제한된 스레드 풀로 효율적으로 처리하는 문제.

## 치르는 비용

- NIO 모델의 복잡도 증가 (Selector, Channel, Buffer 관리).
- Worker Thread 풀 크기 설정을 잘못하면 병목 또는 자원 낭비 발생.

## 동작 원리

### 전체 흐름

```text
[Client]       [OS Kernel]      [Acceptor Thread]  [Poller Thread]    [Worker Thread]   [Spring MVC]
   │               │                   │                  │                  │                │
   │─ TCP SYN ────>│                   │                  │                  │                │
   │<─ SYN+ACK ───│                   │                  │                  │                │
   │─ TCP ACK ────>│                   │                  │                  │                │
   │               │ TCP 연결 완료      │                  │                  │                │
   │               │                   │                  │                  │                │
   │               │  Acceptor가        │                  │                  │                │
   │               │  accept() 루프로  │                  │                  │                │
   │               │─ 연결 수거 ───────>│                  │                  │                │
   │               │                   │─ NioChannel 생성  │                  │                │
   │               │                   │─ Poller에 등록 ──>│                  │                │
   │               │                   │                  │ select() 루프     │                │
   │─ HTTP Request ──────────────────────────────────────>│                  │                │
   │               │                   │                  │ 읽기 이벤트 감지   │                │
   │               │                   │                  │─ 작업 디스패치 ───>│                │
   │               │                   │                  │                  │─ 요청 파싱 ────>│
   │               │                   │                  │                  │<─ 응답 생성 ────│
   │<─ HTTP Response ────────────────────────────────────────────────────────│                │
   │               │                   │                  │                  │ 풀로 반환        │
```

### 각 단계 상세

**1단계: TCP 연결 (OS 레벨)**
- TCP 3-way handshake는 **OS 커널**이 처리한다.
- Tomcat은 이 과정에 스레드를 할당하지 않는다.
- 연결 완료 후 OS가 서버 소켓의 accept 큐에 연결을 적재.

**2단계: 연결 수거 (Acceptor Thread)**
- Acceptor Thread가 `serverSocket.accept()`를 반복 호출하는 루프로 동작.
- `accept()`는 **blocking call** — 연결이 없으면 OS가 이 스레드를 sleep 상태로 전환. Busy Waiting이 아니므로 CPU를 소모하지 않음.
- 연결이 도착하면 OS가 Acceptor를 깨우고, 꺼낸 연결을 `NioChannel`로 래핑 → **Poller에 등록** 후 즉시 다음 `accept()`로 복귀(재차 sleep).
- Tomcat 기본값: 1개. `accept()` 자체가 빠르고 OS가 완료해둔 연결을 꺼내기만 하므로 1개로 충분.

**3단계: 이벤트 감지 (Poller Thread / NIO Selector)**
- Poller Thread가 `Selector.select()` 루프로 등록된 채널들을 감시.
- 클라이언트가 HTTP 요청 데이터를 보내면 **읽기 이벤트** 발생 → Poller가 감지.
- 감지한 이벤트를 Worker Thread Pool에 디스패치하고 즉시 다음 `select()`로 복귀.

**4단계: 요청 처리 (Worker Thread)**
- Worker Thread가 채널에서 데이터를 읽어 파싱 → DispatcherServlet → 비즈니스 로직 → 응답 생성을 모두 처리.
- "하나의 요청 = 하나의 스레드"는 이 단계만을 의미.

**5단계: 연결 종료/유지**
- 응답 완료 후 Worker Thread는 풀로 반환.
- Keep-Alive 상태에서도 **스레드를 점유하지 않음** — 새 데이터가 오면 Poller가 다시 감지.

### 스레드 점유 구간

```text
시간 →
─────────────────────────────────────────────────────────────
TCP 연결  │ accept() │ Poller 감시 │  요청 처리  │ Poller 감시
          │          │            │             │
Acceptor: │   1개    │    0개     │    0개      │    0개
Poller:   │   0개    │    1개     │    1개      │    1개
Worker:   │   0개    │    0개     │    1개      │    0개
─────────────────────────────────────────────────────────────
                                  ↑ Worker는 이 구간만 점유
```

- Acceptor는 `accept()` 순간만 활동, 처리 없이 즉시 복귀
- Poller는 상시 대기하지만 CPU를 점유하지 않음 (`select()` 블로킹 대기)
- Worker만이 실질적인 처리 스레드 — 풀 크기가 처리량의 상한을 결정

## 관련 본질

- [[본질-처리량과 지연시간 (Throughput and Latency)]] — Worker Thread 풀 크기가 처리량의 상한을 결정.
- [[본질-동시성 (Concurrency)]] — NIO Selector는 단일 스레드로 다수의 연결을 동시에 감시하는 동시성 모델.
