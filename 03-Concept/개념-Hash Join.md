---
aliases: [Hash Join, 해시 조인]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 작은 쪽 테이블을 메모리 해시 테이블로 Build하고, 큰 쪽 테이블로 Probe하는 조인 전략.
> (이해용) 먼저 한쪽을 해시 사전으로 만들어두고, 다른 쪽이 오면 O(1)로 찾아보는 방식.

---

## 해결하는 문제

- 인덱스 없는 대용량 테이블 간 조인
- Nested Loop의 O(N×M) 비용 회피

---

## 치르는 비용

- Build 테이블 전체를 메모리에 적재
- 메모리 부족 시 디스크 spill → 성능 급락 (`Batches > 1`)
- Build를 위한 Inner 테이블 풀스캔 불가피

---

## 동작 원리

**2단계 구조**

```
Phase 1 — Build
  Inner 테이블 전체 스캔
  → 각 row를 hash(join_key) → bucket에 저장
  → 메모리에 해시 테이블 완성

Phase 2 — Probe
  Outer 테이블 순회
  → 각 row의 join_key로 해시 테이블 탐색 O(1)
  → 매칭 시 결과 emit
```

**EXPLAIN 출력 구조**

```
Hash Left Join  (actual time=668..668 rows=34 loops=1)
  Hash Cond: (rbs.date = rp.boarding_date)
  →  Index Scan on rent_boarding_slot      ← Probe (Outer, 출력 1번)
  →  Hash  (rows=34 Batches=1 Memory=8kB) ← Build (출력 2번, 실행은 먼저)
       →  Seq Scan on rent_participants    ← Build 대상 스캔
```

**Hash 노드 필드**

| 필드 | 의미 |
|---|---|
| `rows` | 해시 테이블에 들어간 row 수 |
| `Batches: 1` | 메모리에 전부 올라감 (정상) |
| `Batches: N>1` | 디스크 spill 발생 (위험 신호) |
| `Memory Usage` | 해시 테이블 메모리 점유량 |

**LEFT JOIN 제약**

```
A LEFT JOIN B → A(왼쪽)가 반드시 Probe(Outer) 고정
                B(오른쪽)가 반드시 Build(Inner) 고정
이유: A의 모든 row가 결과에 포함되어야 하므로
      A를 빠짐없이 순회해야 함
```

---

## 관련 본질

- [[본질-처리량과 지연시간 (Throughput and Latency)]]
