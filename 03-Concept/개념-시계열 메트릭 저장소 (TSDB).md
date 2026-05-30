---
aliases: [TSDB, Time_Series_Database]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) 시간 순서로 계속 들어오는 수치 데이터를 저장하고 집계·압축·보존하도록 설계된 데이터베이스 계열.
> (이해용) 매 순간 찍히는 센서 기록이나 심전도처럼, 숫자를 시간축 위에 길게 이어 붙여 보는 저장소.

---

## 해결하는 문제

- CPU, 메모리, 에러율, p99 latency처럼 **계속 누적되는 숫자 흐름**을 싸게 저장하고 빨리 조회해야 하는 문제
- 일반 RDB로도 저장은 되지만, 다운샘플링·보존 기간·구간 집계가 귀찮아지는 문제
- [[개념-Prometheus]] 같은 metrics 시스템이 왜 따로 필요한지 잘 안 보이는 문제

---

## 치르는 비용

- 자유로운 트랜잭션 처리나 복잡한 조인에는 맞지 않음
- 로그 본문 검색처럼 비정형 데이터 조회에는 약함
- label/cardinality가 커지면 비용이 급격히 늘 수 있음

---

## 동작 원리

```text
metric sample
(cpu_usage=0.73, host=api-1, ts=10:00:01)
(cpu_usage=0.71, host=api-1, ts=10:00:02)
(cpu_usage=0.76, host=api-1, ts=10:00:03)

          ↓ 시간축 기준 저장

series: cpu_usage{host="api-1"}
  ├── 10:00:01 → 0.73
  ├── 10:00:02 → 0.71
  └── 10:00:03 → 0.76

          ↓ 나중에 구간 집계

avg_over_time / rate / sum / max
```

- 핵심 단위는 보통 **시계열(series)** 이다.
- 한 시계열은 `metric name + label set`으로 식별된다.
- 조회도 “특정 행 1건 조회”보다 “최근 5분 평균”, “에러율 증가 속도”처럼 **구간 집계**가 중심이다.

---

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-Prometheus]]
- [[개념-pull 모델과 push 모델]]

---

## 참고

> "Prometheus's main features are: a multi-dimensional data model with time series data identified by metric name and key/value pairs" — [Prometheus Overview](https://prometheus.io/docs/introduction/overview/)

> "InfluxDB 3 Core is a database built to collect, process, transform, and store event and time series data" — [InfluxDB 3 Core Documentation](https://docs.influxdata.com/influxdb3/core/)
