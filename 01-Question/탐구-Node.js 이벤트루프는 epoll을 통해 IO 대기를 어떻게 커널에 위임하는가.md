---
aliases: [epoll Event Loop, Kernel Sleep Delegation]
tags: [탐구, 작성중]
type: Question
difficulty: High
---

## 핵심 질문

> Node.js 이벤트루프는 I/O 대기가 필요할 때 `epoll_wait()`을 호출해 스레드를 커널에서 잠재우는가? 그리고 이것이 논블로킹 I/O의 실제 구현 방식인가?

---

## 파생 노트

- [[개념-이벤트 루프]]
- [[개념-차단 IO (Blocking IO)]]
- [[탐구-이벤트 루프와 OS 스케줄링의 공존]]
