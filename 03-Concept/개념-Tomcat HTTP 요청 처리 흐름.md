---
aliases: [Tomcat Request Processing, NIO Selector, Worker Thread, HTTP Request Flow]
tags: [개념, 작성중, WAS, 네트워크]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Tomcat이 클라이언트의 HTTP 요청을 수신하여 응답을 반환하기까지, OS 레벨의 TCP 연결부터 NIO Selector의 이벤트 감지, Worker Thread 할당, Spring MVC 처리를 거치는 전체 흐름.
> (이해용) "전화가 오면 교환원(NIO Selector)이 받아서 담당자(Worker Thread)에게 연결해주고, 담당자가 응대를 마치면 전화를 끊는" 과정.

## 해결하는 문제

- HTTP 요청 하나당 스레드 하나를 점유하는 전통 모델(BIO)의 자원 낭비 문제.
- 대량의 동시 연결을 제한된 스레드 풀로 효율적으로 처리하는 문제.

## 치르는 비용

- NIO 모델의 복잡도 증가 (Selector, Channel, Buffer 관리).
- Worker Thread 풀 크기 설정을 잘못하면 병목 또는 자원 낭비 발생.

## 동작 원리

### 전체 흐름

```text
[Client]          [OS Kernel]         [Tomcat]              [Spring MVC]
   │                  │                  │                      │
   │── TCP SYN ──────>│                  │                      │
   │<─ TCP SYN+ACK ──│                  │                      │
   │── TCP ACK ──────>│                  │                      │
   │                  │ TCP 연결 완료     │                      │
   │                  │── fd 전달 ──────>│                      │
   │                  │            NIO Selector Thread          │
   │                  │            (연결 감지, 비동기)            │
   │                  │                  │                      │
   │── HTTP Request ─────────────────>│                      │
   │                  │            Selector가 읽기 이벤트 감지    │
   │                  │                  │                      │
   │                  │            Worker Thread 할당           │
   │                  │                  │── 요청 파싱 ────────>│
   │                  │                  │   HttpServletRequest │
   │                  │                  │<─ 응답 생성 ─────────│
   │                  │                  │   HttpServletResponse│
   │<─ HTTP Response ────────────────│                      │
   │                  │            Worker Thread 반환           │
```

### 각 단계 상세

**1단계: TCP 연결 (OS 레벨)**
- TCP 3-way handshake는 **OS 커널**이 처리한다.
- Tomcat은 이 과정에 스레드를 할당하지 않는다.
- 연결 완료 후 OS가 서버 소켓으로 file descriptor를 전달.

**2단계: 요청 감지 (NIO Selector Thread)**
- NIO Selector Thread가 비동기적으로 네트워크 이벤트를 감시.
- 새로운 데이터(HTTP 요청)가 도착하면 읽기 이벤트를 감지.
- 이 스레드는 감시 역할만 하며, 요청 처리는 하지 않음.

**3단계: 요청 처리 (Worker Thread)**
- Selector가 감지한 요청을 Worker Thread에 할당.
- 하나의 Worker Thread가 파싱 → DispatcherServlet → 비즈니스 로직 → 응답 생성을 모두 처리.
- "하나의 요청 = 하나의 스레드"는 이 단계를 의미.

**4단계: 연결 종료/유지**
- 응답 완료 후 Worker Thread는 풀로 반환.
- Keep-Alive 상태에서도 **스레드를 점유하지 않음** — 새 요청이 오면 Selector가 다시 감지.

### 스레드 점유 구간

```text
시간 →
───────────────────────────────────────────────
TCP 연결    │ 대기(Selector) │ 요청 처리  │ 대기
           │               │           │
스레드:  0개│  Selector 1개  │ Worker 1개 │  0개
───────────────────────────────────────────────
           NIO 덕분에       ↑ 이 구간만
           스레드 미점유      스레드 점유
```

## 관련 본질

- [[본질-처리량과 지연시간 (Throughput and Latency)]] — Worker Thread 풀 크기가 처리량의 상한을 결정.
- [[본질-동시성 (Concurrency)]] — NIO Selector는 단일 스레드로 다수의 연결을 동시에 감시하는 동시성 모델.
