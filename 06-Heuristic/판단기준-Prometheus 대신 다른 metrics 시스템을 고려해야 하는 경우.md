---
aliases: [Prometheus_대안_선택_기준, Metrics_System_Alternatives]
tags: [판단기준, 작성중]
difficulty: High
type: Heuristic
---

## 판단 기준

- **단일 클러스터를 넘어 장기 보관·멀티테넌시·전역 집계**가 중요하다 → Mimir / VictoriaMetrics 같은 확장형 backend 고려
- **운영보다 관리형 경험**이 더 중요하다 → Datadog 같은 SaaS 고려
- **시계열 DB를 애플리케이션 데이터 저장소처럼 함께 쓰고 싶다** → InfluxDB 계열 검토

```text
Prometheus만으로 충분한가?

단기 운영 모니터링 중심
        └──> Prometheus

장기 보관 / 수평 확장
        └──> Mimir / VictoriaMetrics

관리형 SaaS 선호
        └──> Datadog

시계열 DB 자체 활용
        └──> InfluxDB
```

## 효과적인 상황

- Prometheus
  - 빠른 도입, 표준 exporter 생태계, 쿠버네티스 친화성
- Mimir / VictoriaMetrics
  - Prometheus 호환성을 유지하면서 장기 저장소를 붙이고 싶을 때
- Datadog
  - 에이전트, 대시보드, 알림, 과금까지 관리형으로 묶고 싶을 때
- InfluxDB
  - 시계열 데이터 자체를 제품·분석 쿼리와 함께 다루고 싶을 때

## 실패하는 상황

- Prometheus 하나로 모든 장기 분석을 해결하려는 경우
- SaaS 비용 구조를 무시하고 Datadog를 단순 대체재로만 보는 경우
- TSDB가 필요한데 로그 시스템이나 RDB로 억지로 대체하려는 경우

## 출처

- [[개념-Prometheus]]
- [[개념-시계열 메트릭 저장소 (TSDB)]]
- [[개념-Grafana]]

> "The fast, cost-effective, scalable monitoring solution and time series database." — [VictoriaMetrics Docs](https://docs.victoriametrics.com/)

> "Mimir is an open source, horizontally scalable, highly available, multi-tenant TSDB for long-term storage for Prometheus." — [Grafana Mimir](https://grafana.com/oss/mimir/)

> "InfluxDB 3 Core is a database built to collect, process, transform, and store event and time series data" — [InfluxDB 3 Core Documentation](https://docs.influxdata.com/influxdb3/core/)

> "You can visualize your metrics and create graphs throughout Datadog" — [Datadog Metrics](https://docs.datadoghq.com/metrics/)
