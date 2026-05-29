---
aliases: [Label_Based_Log_Search]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) 로그 본문 전체를 먼저 인덱싱하는 대신, 서비스명·인스턴스·레벨 같은 label 메타데이터로 검색 범위를 줄이고 그 안에서 로그를 읽는 방식.
> (이해용) 책 내용을 전부 색인하지 않고, 먼저 책장·분류표를 보고 후보를 좁힌 뒤 그 책을 펼쳐 보는 검색 방식.

## 해결하는 문제

- [[개념-Loki]]가 왜 본문 인덱싱 없이도 동작하는지 이해가 안 되는 문제
- 로그 저장 비용을 줄이면서도 운영에서 필요한 조회는 하고 싶은 문제
- 구조화된 로그를 남기지 않으면 label 중심 탐색이 왜 약해지는지 설명하기 어려운 문제

## 치르는 비용

- 자유로운 full-text 검색은 Elasticsearch보다 약함
- label을 너무 많이 넣으면 cardinality 폭발이 날 수 있음
- 로그를 아무 생각 없이 plain text로만 남기면 장점이 반감됨

## 동작 원리

```text
query: {service="api", level="error"}
          │
          ▼
   index에서 관련 stream 찾기
          │
          ▼
  해당 chunk만 읽기
          │
          ▼
 필요하면 본문 필터 추가
```

- 이 방식의 핵심은 "모든 로그를 똑같이 뒤지지 않는다"는 점이다.
- 먼저 label로 후보를 줄이고, 그다음 chunk를 읽는다.
- 그래서 label 설계가 곧 검색 성능과 비용에 직결된다.

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-구조화된 로그 (Structured Logging)]]
- [[개념-Loki]]
- [[개념-Loki의 저장 구조]]

## 참고

> "A log stream is a set of logs which share the same labels." — [Loki Overview](https://grafana.com/docs/loki/latest/get-started/overview/)

> "Labels help Loki to find a log stream within your data store, so having a quality set of labels is key to efficient query execution." — [Loki Overview](https://grafana.com/docs/loki/latest/get-started/overview/)
