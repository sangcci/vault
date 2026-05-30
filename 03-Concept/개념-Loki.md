---
aliases: [Loki, Grafana_Loki]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) label 메타데이터만 인덱싱하고, 로그 본문은 압축 chunk로 object storage에 저장하는 log aggregation system.
> (이해용) 로그를 Elasticsearch처럼 전부 무겁게 색인하지 않고, "이 로그는 어디서 나온 것인가"를 먼저 묶어 싸게 보관하는 로그 시스템.

---

## 해결하는 문제

- 로그를 오래 보관하고 싶지만 ELK급 운영 비용은 부담되는 문제
- [[개념-Grafana]]와 한 화면에서 metrics와 logs를 같이 보고 싶은 문제
- full-text 검색 최강보다는 **운영 단순성·비용 효율**이 더 중요한 문제

---

## 치르는 비용

- 본문 전체를 강하게 인덱싱하지 않으므로, 검색 경험은 Elasticsearch보다 약할 수 있음
- label 설계가 나쁘면 쿼리 성능이 바로 흔들림
- 로그 분석 플랫폼이라기보다 **비용 효율적인 로그 저장/조회 시스템**에 더 가까움

---

## 동작 원리

```text
agent(promtail/alloy)
        │
        │ labels 추가 + push
        ▼
       Loki
        ├── label index
        └── compressed chunks
                 │
                 ▼
          object storage(S3/GCS)
```

- Loki는 Prometheus처럼 아이디어를 단순하게 가져가되, 대상 데이터가 metrics가 아니라 **logs**다.
- 핵심 차이는 "무엇을 인덱싱하느냐"다.
  - Elasticsearch: 문서 본문 검색을 강하게 지원
  - Loki: label 메타데이터 중심 탐색

---

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-구조화된 로그 (Structured Logging)]]
- [[개념-Loki의 저장 구조]]
- [[개념-label 기반 로그 검색]]
- [[개념-ELK 스택 (Elasticsearch, Logstash, Kibana)]]

---

## 참고

> "Loki is a horizontally-scalable, highly-available, multi-tenant log aggregation system" — [Loki Overview](https://grafana.com/docs/loki/latest/get-started/overview/)

> "Unlike other logging systems, Loki does not index the contents of the logs, but only indexes metadata about your logs as a set of labels for each log stream." — [Loki Overview](https://grafana.com/docs/loki/latest/get-started/overview/)

> "A small index and highly compressed chunks simplify the operation and significantly lower the cost of Loki." — [Loki Overview](https://grafana.com/docs/loki/latest/get-started/overview/)
