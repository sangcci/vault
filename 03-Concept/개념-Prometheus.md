---
aliases: [Prometheus]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) pull 기반 수집, 다차원 시계열 모델, PromQL을 중심으로 동작하는 오픈소스 모니터링 및 alerting toolkit.
> (이해용) 서비스마다 숫자 상태를 조금씩 걷어 와서, 장애가 오기 전에 그래프와 알람으로 보여주는 메트릭 수집기.

## 해결하는 문제

- 서버와 애플리케이션의 상태를 **숫자 흐름**으로 계속 관찰해야 하는 문제
- 장애가 났을 때 "지금 어디가 얼마나 이상한가"를 빠르게 봐야 하는 문제
- [[개념-Grafana]] 같은 시각화 도구와 붙여 대시보드·알람을 구성해야 하는 문제

## 치르는 비용

- 장기 보관, 글로벌 집계, 멀티테넌시가 커지면 단일 Prometheus만으로는 한계가 옴
- pull 모델이라 외부에서 밀어 넣는 환경에는 별도 중계가 필요할 수 있음
- metrics에는 강하지만 로그 본문 검색은 못 함

## 동작 원리

```text
애플리케이션 / node exporter
        │
        │ /metrics 노출
        ▼
Prometheus가 주기적으로 scrape
        │
        ├── 로컬 TSDB 저장
        ├── PromQL 조회
        └── Alert rule 평가
                │
                ▼
          Alertmanager / Grafana
```

- Prometheus는 대상이 내놓는 `/metrics`를 **주기적으로 읽어 오는 쪽**이다.
- 저장 단위는 [[개념-시계열 메트릭 저장소 (TSDB)]]의 시계열이다.
- 즉, "로그를 다 저장"하는 시스템이 아니라 **숫자로 요약된 상태 변화**를 보는 시스템이다.

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-시계열 메트릭 저장소 (TSDB)]]
- [[개념-pull 모델과 push 모델]]
- [[개념-Grafana]]

## 참고

> "Prometheus is an open-source systems monitoring and alerting toolkit" — [Prometheus Overview](https://prometheus.io/docs/introduction/overview/)

> "time series collection happens via a pull model over HTTP" — [Prometheus Overview](https://prometheus.io/docs/introduction/overview/)

> "Prometheus works well for recording any purely numeric time series." — [Prometheus Overview](https://prometheus.io/docs/introduction/overview/)
