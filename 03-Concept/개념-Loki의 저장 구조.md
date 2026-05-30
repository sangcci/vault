---
aliases: [Loki_Storage_Architecture, Loki_저장_구조]
tags: [개념, 작성중]
difficulty: High
type: Concept
---

## 한 문장 정의

> (사전적) Loki는 label set별 로그 스트림을 ingester에 append하고, index와 chunk를 object storage에 분리 저장하는 구조를 가진다.
> (이해용) 일반 RDB처럼 행을 여기저기 바로 고쳐 쓰는 저장소가 아니라, 들어온 로그를 먼저 받아 적고 압축 묶음으로 넘겨 보관하는 쪽에 가깝다.

---

## 해결하는 문제

- [[개념-Loki]]를 단순히 "로그 DB"라고만 외우면 왜 싼지, 왜 검색이 다른지 이해가 안 되는 문제
- object storage를 써도 조회가 가능한 이유가 안 보이는 문제
- TSDB와 달리 Loki를 어떤 구조적 관점으로 봐야 하는지 헷갈리는 문제

---

## 치르는 비용

- RDB처럼 자유로운 임의 갱신, 복잡한 조건 검색에는 맞지 않음
- query 성능이 label 설계와 chunk 분포에 크게 영향을 받음
- 설계를 모르면 "왜 S3 위에 올렸는데도 로그 시스템처럼 동작하지?"가 직관적으로 안 들어옴

---

## 동작 원리

```text
write path
client push
   │
   ▼
distributor
   ▼
ingester
   ├── stream(label set)별로 append
   ├── 메모리에서 chunk 형성
   └── 내구성 보강(WAL/replication)
            │
            ▼
     flush / ship
            │
            ▼
  object storage
   ├── index
   └── chunks
```

### 핵심 포인트

- Loki의 저장 단위는 대충 "문서 1건"보다 **label set을 공유하는 log stream**에 더 가깝다.
- ingester는 같은 stream으로 들어온 로그를 받아 **chunk에 이어 붙인다**.
- 나중에 index는 "어느 label 조합의 로그가 어디 chunk에 있는가"를 찾는 안내판 역할을 한다.
- 그래서 이 구조는 일반 RDB보다 **append-oriented 로그 저장 구조**라고 보는 편이 더 맞다.

---

## 관련 본질

- [[본질-옵저버빌리티 (Observability)]]
- [[개념-Loki]]
- [[개념-label 기반 로그 검색]]
- [[개념-시계열 메트릭 저장소 (TSDB)]]

---

## 참고

> "Loki stores all data in a single object storage backend" — [Loki Architecture](https://grafana.com/docs/loki/latest/get-started/architecture/)

> "Grafana Loki has two main file types: index and chunks." — [Loki Architecture](https://grafana.com/docs/loki/latest/get-started/architecture/)

> "The index is a table of contents of where to find logs for a specific set of labels." — [Loki Architecture](https://grafana.com/docs/loki/latest/get-started/architecture/)

> "The chunk is a container for log entries for a specific set of labels." — [Loki Architecture](https://grafana.com/docs/loki/latest/get-started/architecture/)
