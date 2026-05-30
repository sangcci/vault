---
aliases: [Event Loop Scheduling, User-level Threading]
tags: [탐구, 완료]
created: 2026-03-02
type: Question
difficulty: High
---
## 핵심 질문

"이벤트 루프는 OS 스케줄링을 '우회'하는 것인가? 그렇다면 OS는 비선점으로 동작하는가?"

---

## 가설 및 추론

이벤트 루프는 OS의 선점 권한을 박탈하는 것이 아니라, **OS 스케줄링에 최소한으로 개입(Least Involvement)**하도록 설계된 모델일 것이다.

---

## 검증 및 팩트

### 1. Spring Servlet vs Node.js vs Netty (물리적 구조)

- **Spring Servlet (Thread-per-request)**:
  - **구조**: 요청이 오면 Thread Pool에서 스레드 하나를 꺼내 해당 요청을 끝까지(DB 조회 등) 전담 마크시킵니다.
  - **OS 부하**: 요청이 1,000개면 스레드도 1,000개. OS 스케줄러가 이들을 번갈아 실행하느라 '문맥 교환(Context Switch)' 세금을 엄청나게 징수합니다.
- **Node.js (Event Loop & Worker Pool)**:
  - **진실**: **"JS 실행은 싱글 스레드지만, 전체 시스템은 멀티 스레드"**입니다.
  - **Main Thread (Event Loop)**: 오직 1개. JS 코드를 순차 실행하고 I/O 요청을 던지는 '지휘자' 역할.
  - **Worker Thread Pool (libuv)**: 보통 4~8개. 파일 읽기, 암호화 등 무거운 작업을 대신 수행하는 '일꾼' 역할.
  - **OS 부하**: OS는 지휘자 1명과 일꾼 소수(예: 8명)만 관리하면 되므로 스케줄링 부하가 매우 낮습니다.
- **Netty / WebFlux (Multi-threaded Event Loop)**:
  - **구조**: CPU 코어 수만큼의 '지휘자(Event Loop)'를 둡니다. 지휘자 한 명당 수천 개의 연결을 처리하는 고효율 모델입니다.

### 2. OS의 선점은 여전히 유효한가?

- **답: 예, OS는 여전히 선점형(Preemptive)입니다.**
- 이벤트 루프 스레드도 OS 스케줄러 입장에서는 하나의 '프로세스/스레드'일 뿐입니다.
- 이벤트 루프가 돌아가는 도중에도 OS는 언제든지 타이머 인터럽트를 통해 해당 스레드의 CPU를 뺏어 다른 프로세스(예: 백신, 웹 브라우저)에게 줄 수 있습니다.
- 즉, **이벤트 루프 모델을 쓴다고 OS가 비선점이 되는 것은 아닙니다.**

### 3. '비선점'으로 느껴지는 이유 (Cooperative Multi-tasking)

- 이벤트 루프 내부의 **작업들(Callbacks)** 사이에는 선점이 일어나지 않습니다.
- 루프 내부의 직원이 A 작업을 하다가 "그만하고 B 해!"라고 OS가 강제로 시키지 않습니다. A 작업이 끝나고 제어권을 반납해야 B가 실행됩니다.
- 이를 **협력적 멀티태스킹(Cooperative Multi-tasking)**이라 하며, 사용자 영역(User-level)에서의 동작 방식입니다.
- `await`를 사용하면 제어권을 반납합니다. 이외에는 작업이 끝날 때 까지 반납하지 않습니다.

---

## 최종 결론: 선점과 독점의 역설

1. **OS는 선점형(Preemptive)**: 개별 스레드(Event Loop)의 생사여탈권을 쥠.
2. **이벤트 루프는 협력형(Cooperative)**: 스레드 내부 작업들 간의 순서를 직접 결정.
3. **await의 역할**: `await`가 있다면 제어권을 양보(Yield)하지만, **그 외에는 작업이 끝날 때까지 스레드를 독점**합니다.
   - OS 수준에서는 선점당할 수 있어도, 이벤트 루프 수준에서는 다음 Task가 영원히 실행되지 못하는 **'애플리케이션 마비(Starvation)'** 현상이 발생합니다.

---

## 연결된 개념 (Links)

- [[본질-선점 (Preemption)]]
- [[개념-이벤트 루프]]
- [[개념-문맥 교환 (Context Switch)]]
- [[탐구-멀티스레드와 이벤트루프의 OS 활용 차이]]
