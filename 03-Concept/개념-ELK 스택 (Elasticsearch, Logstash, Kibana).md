---
aliases: [ELK, Elastic_Stack]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) Elasticsearch, Logstash, Kibana를 중심으로 데이터를 수집·색인·검색·시각화하는 로그/검색 플랫폼 조합.
> (이해용) 로그를 그냥 쌓아 두는 게 아니라, 나중에 이것저것 많이 찾아볼 생각으로 미리 잘게 정리해 두는 무거운 공구함.

## 해결하는 문제

- 로그 본문을 강하게 검색하고 분석해야 하는 문제
- 필드별 매핑, 샤드, 다양한 질의를 써야 하는 문제
- 운영 로그뿐 아니라 검색·보안·분석 워크로드까지 한 플랫폼에 태우고 싶은 문제

## 치르는 비용

- 색인 비용과 운영 복잡도가 큼
- 저장량이 커질수록 샤드·클러스터 운영 부담이 늘어남
- 단순 로그 보관만 필요할 때는 과할 수 있음

## 동작 원리

```text
logs / events
    │
    ▼
Logstash / Beats
    │  parse, transform
    ▼
Elasticsearch
    │  index, search, analyze
    ▼
Kibana
    ├── discover
    ├── dashboard
    └── visualization
```

- ELK의 힘은 **본문과 필드를 적극적으로 색인**해서 나중 검색 자유도를 높이는 데 있다.
- 그래서 비용은 더 들지만, 복잡한 탐색과 분석에는 강하다.

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-구조화된 로그 (Structured Logging)]]
- [[개념-Loki]]
- [[개념-Grafana]]

## 참고

> "It's comprised of Elasticsearch, Kibana, Beats, and Logstash (also known as the ELK Stack) and more." — [Elastic Stack](https://www.elastic.co/elastic-stack)

> "Reliably and securely take data from any source, in any format, then search, analyze, and visualize." — [Elastic Stack](https://www.elastic.co/elastic-stack)

> "An index is the fundamental unit of storage in Elasticsearch" — [Elasticsearch Index fundamentals](https://www.elastic.co/docs/manage-data/data-store/index-basics)
