---
aliases: [PLG_vs_ELK, Prometheus_Grafana_Loki_vs_ELK]
tags: [판단기준, 작성중]
difficulty: High
type: Heuristic
---

## 판단 기준

- **운영 모니터링이 중심**이고, metrics + logs를 한 화면에서 싸게 보고 싶다 → **Prometheus + Grafana + Loki**
- **로그 본문 검색·분석 자유도**가 더 중요하다 → **ELK**
- 메트릭은 Prometheus로 보고, 로그 분석은 ELK로 깊게 파는 식의 **혼합 선택**도 충분히 현실적이다

```text
무엇이 더 중요한가?

운영 단순성 / 비용 / Grafana 연동
        └──> PLG

본문 검색 / 필드 분석 / 검색 자유도
        └──> ELK
```

---

## 효과적인 상황

- PLG
  - Kubernetes / microservice 환경
  - 빠른 도입, 낮은 운영 부담, object storage 활용이 중요할 때
  - metrics가 주이고 logs는 원인 확인 보조일 때
- ELK
  - 보안 로그, 감사 로그, 검색성 높은 이벤트 분석
  - 본문 검색과 필드 분석을 자주 해야 할 때
  - 로그 자체가 제품 데이터에 가까울 때

---

## 실패하는 상황

- PLG를 골랐는데 사실상 원하는 건 "grep보다 훨씬 강한 로그 검색 플랫폼"인 경우
- ELK를 골랐는데 실제 요구는 단순 운영 로그 보관·조회 수준인 경우
- 둘 다 데이터 모델 차이를 무시하고 한 도구로 다 해결하려는 경우

---

## 출처

- [[개념-Prometheus]]
- [[개념-Grafana]]
- [[개념-Loki]]
- [[개념-Loki의 저장 구조]]
- [[개념-ELK 스택 (Elasticsearch, Logstash, Kibana)]]

> "Unlike other logging systems, Loki does not index the contents of the logs, but only indexes metadata about your logs as a set of labels for each log stream." — [Loki Overview](https://grafana.com/docs/loki/latest/get-started/overview/)

> "Reliably and securely take data from any source, in any format, then search, analyze, and visualize." — [Elastic Stack](https://www.elastic.co/elastic-stack)
