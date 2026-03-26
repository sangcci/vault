---
aliases: [Log_Interleaving, 로그_혼재]
tags: [현상, 작성중]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의

> (사전적) 멀티스레드 환경에서 복수의 요청 로그가 실행 타임스탬프 순으로 섞여 기록되는 현상.
> (이해용) 동시에 처리되는 여러 고객의 주문 로그가 뒤엉켜, "어느 요청에서 오류가 났는지" 역추적이 불가능한 상태.

## 발생 환경

- Tomcat, Jetty 등 스레드 풀 기반 웹 서버
- 동시 요청이 발생하는 모든 멀티스레드 환경

## 관찰되는 증상

```
[Thread-7] INFO  - 주문 시작 (userId=A)
[Thread-3] INFO  - 주문 시작 (userId=B)
[Thread-7] DEBUG - 재고 확인 중
[Thread-3] DEBUG - 결제 처리 중
[Thread-7] ERROR - 결제 실패!   ← A의 실패? B의 실패?
[Thread-3] INFO  - 주문 완료
```

- 스레드 이름은 식별되지만, **어떤 비즈니스 요청**을 처리하는지 알 수 없음
- 장애 발생 시 해당 요청의 전체 흐름을 재구성 불가

## 추측되는 원인

- 로그에 **요청 식별자(requestId, userId 등 맥락 정보)** 가 부재
- 동시성이 올라갈수록 스레드-요청 매핑이 더욱 불명확해짐

## 관련 사례

- [[개념-구조화된 로그 (Structured Logging)]] — 해결 방향
