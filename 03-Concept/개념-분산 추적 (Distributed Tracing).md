---
aliases: [Distributed Tracing, 분산 추적, TraceId, W3C Trace Context, traceparent]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) MSA 환경에서 하나의 요청이 여러 서비스를 거칠 때 동일한 traceId를 헤더로 전파하여 전체 호출 흐름을 단일 단위로 추적할 수 있게 하는 기법.
> (이해용) 여러 서버에 흩어진 로그를 하나의 요청 단위로 묶어주는 실.

---

## 해결하는 문제

- API 간헐적 실패 시 어느 서비스에서 문제가 발생했는지 특정하기 어려운 문제.
- 서버마다 로그가 분산되어 특정 요청의 전체 흐름을 파악할 수 없는 문제.
- 데이터 분석가가 사용자별 평균 응답시간 등을 쿼리하기 어려운 문제.

---

## 치르는 비용

- 모든 서비스가 traceId를 헤더로 전파하는 구현 필요.
- 로그 집계 인프라(Zipkin, Jaeger, OpenTelemetry 등) 운영 비용.

---

## 동작 원리

```text
클라이언트 요청
     │
     ▼  traceId: abc-123 생성
[API Gateway]
     │ HTTP Header: traceparent: 00-abc123-spanA-01  ← W3C Trace Context 표준
     ▼
[주문 서비스]  → log: { "traceId": "abc-123", "event": "주문 생성 완료" }
     │
     ▼ traceId: abc-123 전파
[결제 서비스]  → log: { "traceId": "abc-123", "event": "결제 실패" }
     │
     ▼
[알림 서비스]  → log: { "traceId": "abc-123", "event": "알림 미발송" }

traceId로 검색하면 3개 서비스 로그를 한 번에 조회 가능
Google Dapper 이후 표준화 → W3C Trace Context 규격 (traceparent 헤더)
```

### 로그 구조화가 중요한 이유
```text
텍스트 로그: grep으로 분석 어려움

JSON 구조화 로그:
{
  "traceId": "abc-123",
  "userId": "u1",
  "endpoint": "/orders",
  "latency": 320,
  "status": "ERROR"
}

→ 로그 전용 DB(Elasticsearch)에서 필드 기반 검색 가능
→ "사용자별 평균 응답시간" 같은 분석 쿼리 실행 가능
```

---

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[본질-연동 (Integration)]]
