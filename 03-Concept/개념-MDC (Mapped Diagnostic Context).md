---
aliases: [MDC, Mapped Diagnostic Context, Correlation ID, 로그 추적]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 스레드 로컬 저장소에 키-값 쌍을 저장해 로그 출력 시 자동으로 컨텍스트 정보를 함께 기록하는 메커니즘.
> (이해용) "요청마다 고유한 ID를 실에 꿰어두면, 그 실을 따라 로그를 추적할 수 있는 구조."

---

## 해결하는 문제

- 멀티스레드 환경에서 여러 요청의 로그가 뒤섞일 때 특정 요청의 흐름만 추적 — [[현상-멀티스레드 로그 혼재 (Log Interleaving)]]

---

## 치르는 비용

- 스레드 로컬 기반 → 비동기·코루틴 환경에서 컨텍스트가 전파되지 않음 (별도 처리 필요)
- MDC 값을 명시적으로 제거하지 않으면 스레드 풀 재사용 시 이전 요청 값이 남음

---

## 동작 원리

```
요청 진입 (Filter/Interceptor)
   ↓
MDC.put("requestId", UUID.randomUUID())
   ↓
Controller → Service → Repository
   (모든 계층에서 requestId 자동 포함)
   ↓
로그 출력: [requestId=abc-123] SELECT * FROM orders ...
   ↓
요청 종료
   ↓
MDC.clear()  ← 반드시 호출
```

**logback 설정:**
```xml
<pattern>%d [%X{requestId}] %-5level %msg%n</pattern>
```

**스레드 풀(비동기) 환경에서의 전파 문제:**
```
메인 스레드: MDC에 requestId 존재
    ↓
@Async / CompletableFuture → 새 스레드
    ↓
MDC 비어있음 (전파 안 됨)
    ↓
해결: TaskDecorator로 MDC 복사
```

---

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]

---

## 관련 개념

- [[개념-구조화된 로그 (Structured Logging)]]
- [[현상-멀티스레드 로그 혼재 (Log Interleaving)]]
