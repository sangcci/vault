---
aliases: [Pull_Model_and_Push_Model]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) pull 모델은 수집기가 대상을 주기적으로 읽어 오는 방식이고, push 모델은 대상이 데이터를 수집기로 밀어 넣는 방식이다.
> (이해용) 내가 직접 돌아다니며 체온을 재면 pull이고, 각 사람이 알아서 체온계를 보내면 push다.

## 해결하는 문제

- [[개념-Prometheus]]가 왜 pull 중심인지 설명해야 하는 문제
- [[개념-Loki]]는 왜 push로 로그를 받는지 비교해야 하는 문제
- metrics와 logs가 수집 방식부터 달라지는 이유를 정리해야 하는 문제

## 치르는 비용

- pull: 대상이 `/metrics`를 노출해야 하고, 네트워크 도달성이 필요함
- push: 송신 측 에이전트 관리가 늘고, 유실·재시도·버퍼링 설계를 더 챙겨야 함
- 어느 쪽이든 무조건 우월한 게 아니라 데이터 성격이 다름

## 동작 원리

```text
[pull]
Prometheus ──scrape──> target:/metrics

[push]
agent/app ──send logs──> Loki / gateway / SaaS
```

- metrics는 같은 수치를 계속 다시 읽어도 의미가 유지되므로 pull과 잘 맞는다.
- 로그는 순간 이벤트라서, 지나간 뒤 다시 "읽어 오기"가 어려운 경우가 많다. 그래서 push가 자연스럽다.

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-Prometheus]]
- [[개념-Loki]]
- [[개념-시계열 메트릭 저장소 (TSDB)]]

## 참고

> "time series collection happens via a pull model over HTTP" — [Prometheus Overview](https://prometheus.io/docs/introduction/overview/)

> "Loki differs from Prometheus by focusing on logs instead of metrics, and collecting logs via push, instead of pull." — [Loki Overview](https://grafana.com/docs/loki/latest/get-started/overview/)
