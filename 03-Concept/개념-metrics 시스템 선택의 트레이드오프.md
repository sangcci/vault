---
aliases: [Metrics_System_Tradeoffs]
tags: [개념, 작성중]
difficulty: High
type: Concept
---

## 한 문장 정의

> (사전적) metrics 시스템 선택은 수집 방식, 저장 기간, 확장 방식, 운영 주체를 어디까지 직접 가져갈지 결정하는 문제다.
> (이해용) 빨리 붙여서 현재 상태를 볼 것인지, 오래 저장하고 크게 확장할 것인지, 아니면 돈을 내고 관리형으로 넘길 것인지 고르는 문제.

## 해결하는 문제

- 왜 [[개념-Prometheus]] 하나로 시작하다가 Mimir, VictoriaMetrics, Datadog 같은 대안을 보게 되는지 설명하기 어려운 문제
- metrics 시스템 선택이 단순 제품 비교가 아니라 운영 구조 선택이라는 점이 잘 안 보이는 문제

## 치르는 비용

- 단순한 시작점은 빠르지만 장기 보관·전역 집계에서 한계가 온다
- 확장형 backend나 SaaS는 편의나 규모 면에서 유리하지만 비용 구조와 운영 모델이 달라진다

## 동작 원리

```text
metrics 시스템 선택
├── 빠른 도입 / 표준 생태계 / 단일 운영 모니터링
│     └── Prometheus
├── 장기 보관 / 수평 확장
│     └── Mimir / VictoriaMetrics
└── 관리형 운영 / SaaS
      └── Datadog
```

- [[개념-Prometheus]]는 pull 기반 수집과 exporter 생태계 덕분에 시작점으로 좋다.
- Mimir, VictoriaMetrics는 Prometheus 호환성을 유지하면서 장기 저장과 확장을 보강하는 쪽에 가깝다.
- Datadog는 관리형 운영을 선택하는 대신 비용 구조와 SaaS 종속성을 같이 본다.

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-Prometheus]]
- [[개념-시계열 메트릭 저장소 (TSDB)]]
- [[판단기준-Prometheus 대신 다른 metrics 시스템을 고려해야 하는 경우]]

## 참고

> "time series collection happens via a pull model over HTTP" — [Prometheus Overview](https://prometheus.io/docs/introduction/overview/)

> "Mimir is an open source, horizontally scalable, highly available, multi-tenant TSDB for long-term storage for Prometheus." — [Grafana Mimir](https://grafana.com/oss/mimir/)

> "The fast, cost-effective, scalable monitoring solution and time series database." — [VictoriaMetrics Docs](https://docs.victoriametrics.com/)

> "You can visualize your metrics and create graphs throughout Datadog" — [Datadog Metrics](https://docs.datadoghq.com/metrics/)
