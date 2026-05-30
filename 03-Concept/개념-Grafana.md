---
aliases: [Grafana]
tags: [개념, 작성중]
difficulty: Low
type: Concept
---

## 한 문장 정의

> (사전적) 여러 관측 데이터 소스를 조회해 대시보드, 탐색, 시각화, 알림을 제공하는 시각화 계층.
> (이해용) Prometheus, Loki, Elasticsearch 같은 저장소 위에 앉아서 사람 눈에 보이게 정리해 주는 관제 화면.

---

## 해결하는 문제

- 메트릭, 로그, 트레이스를 저장소마다 따로 들어가 보는 불편함
- 대시보드와 알림을 한 화면에서 묶어 보고 싶은 요구
- "데이터는 있는데 팀이 같이 보기 어렵다"는 문제

---

## 치르는 비용

- 저장소 자체는 아니므로, 결국 뒤에 붙는 데이터 소스 품질에 의존함
- 대시보드가 많아지면 관리 기준이 없을 때 금방 난잡해짐
- Grafana가 있다고 observability가 자동으로 생기지는 않음

---

## 동작 원리

```text
Prometheus ─┐
Loki       ─┼──> Grafana
Elastic    ─┤      ├── Dashboard
Tempo      ─┘      ├── Explore
                   └── Alerting
```

- Grafana의 강점은 "자기 저장소"보다 **여러 데이터 소스를 한 화면에 묶는 역할**에 있다.
- 그래서 Prometheus 전용 UI라기보다, observability 데이터를 연결하는 **표현 계층**에 가깝다.

---

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-Prometheus]]
- [[개념-Loki]]
- [[개념-ELK 스택 (Elasticsearch, Logstash, Kibana)]]

---

## 참고

> "Dashboards — Query, transform, visualize, and understand your data no matter where it’s stored." — [Grafana Documentation](https://grafana.com/docs/grafana/latest/)

> "Panels and Visualizations — Easily collect, correlate, and visualize data to make informed decisions in real-time." — [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
