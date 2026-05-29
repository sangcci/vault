---
aliases: [Structured_Logging, 구조화_로그]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 로그 메시지를 자유 형식 문자열이 아닌, key-value 쌍의 정형 포맷(JSON 등)으로 기록하는 방식.
> (이해용) 사람이 읽는 일기 대신, 데이터베이스가 읽을 수 있는 표 형태로 로그를 남기는 것.

## 해결하는 문제

- [[현상-멀티스레드 로그 혼재 (Log Interleaving)]] — requestId 필드로 요청별 로그 필터링 가능
- 비정형 로그의 검색·집계 불가 문제 — `grep`으로 파싱하던 로그를 쿼리로 집계 가능
- 로그에서 메트릭 추출 불가 — 필드 값 집계로 에러율, 응답시간 분포 등 메트릭 생성

## 치르는 비용

- 로그 메시지 크기 증가 (JSON 키 오버헤드)
- 로그 생성 시 직렬화 비용 (미미하지만 고빈도 로그에서 누적)
- 로그 포맷 설계를 사전에 합의해야 함 (필드명 일관성)

## 동작 원리

```
# 비정형 로그 (Plain Text)
2024-01-15 10:30:45 [Thread-7] ERROR 결제 실패 - userId=A, orderId=123, elapsed=320ms

          ↓  구조화

# 구조화 로그 (JSON)
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level":     "ERROR",
  "thread":    "Thread-7",
  "message":   "결제 실패",
  "userId":    "A",
  "orderId":   "123",
  "elapsed":   320,
  "traceId":   "req-abc-001"   ← MDC에서 주입
}
```

### Loki와 Elasticsearch가 이 로그를 다루는 방식 차이

```text
구조화 로그(JSON)
   │
   ├── Loki
   │    ├── label 중심 탐색
   │    └── 비용·운영 단순성 유리
   │
   └── Elasticsearch
        ├── 본문/필드 색인 강화
        └── 검색 자유도 유리
```

- 구조화된 로그는 [[개념-Loki]]에서는 label 설계를 좋게 만드는 재료가 된다.
- 같은 구조화 로그라도 [[개념-ELK 스택 (Elasticsearch, Logstash, Kibana)]]에서는 필드 검색과 분석 자유도를 더 크게 끌어올리는 쪽으로 쓰인다.

### 메트릭으로 활용되는 흐름

```
애플리케이션
  │  JSON 로그 출력
  ▼
로그 수집기 (Logstash / Promtail)
  │  필드 파싱 & 전달
  ▼
저장소 (Elasticsearch / Loki)
  │  필드 기반 인덱싱
  ▼
시각화 (Kibana / Grafana)
  │
  ├── level=ERROR 집계          → 에러율 그래프
  ├── elapsed 분포              → 응답시간 히스토그램
  └── traceId 필터링            → 단일 요청 전체 흐름 재구성
```

### 주요 필드 패턴

| 필드 | 역할 |
|------|------|
| `traceId` | 단일 요청 전체 로그 묶음 (MDC 주입) |
| `userId` | 특정 사용자 행동 추적 |
| `elapsed` | 처리 시간 → 성능 메트릭 |
| `level` | 심각도 집계 → 에러율 알람 |
| `service` | 마이크로서비스 환경에서 출처 식별 |

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-Loki]]
- [[개념-label 기반 로그 검색]]
- [[개념-ELK 스택 (Elasticsearch, Logstash, Kibana)]]
