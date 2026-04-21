---
aliases: [MVCC, Multi-Version Concurrency Control, 다중 버전 동시성 제어, xmin, xmax]
tags: [개념, 작성중]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) 각 row에 트랜잭션 ID 범위(xmin~xmax)를 기록해 잠금 없이 트랜잭션마다 독립된 스냅샷을 제공하는 동시성 메커니즘.
> (이해용) row를 지우지 않고 새 버전을 추가하면서, 각 트랜잭션이 "자신이 시작할 때의 세계"만 보도록 만드는 방식.

## 해결하는 문제

- 읽기와 쓰기 간 잠금 충돌 없는 동시성 보장
- 트랜잭션 격리 (Dirty Read, Non-repeatable Read 방지)

## 치르는 비용

- UPDATE/DELETE 시 dead tuple 누적 → heap bloat
- VACUUM이 dead tuple 정리 못 하면 Seq Scan 성능 저하
- 장기 트랜잭션이 있으면 VACUUM이 dead tuple 못 지움

## 동작 원리

**xmin / xmax 의미**

```
tuple header: xmin=100, xmax=0, data=...

xmin = 이 tuple을 삽입한 트랜잭션 ID
xmax = 이 tuple을 삭제한 트랜잭션 ID (0 = 아직 살아있음)
```

**INSERT / UPDATE / DELETE**

```
           xmin          xmax
INSERT     현재 TX ID     0
UPDATE     현재 TX ID     0      (새 tuple)
           그대로         현재 TX ID  (구 tuple → dead)
DELETE     그대로         현재 TX ID
```

**가시성 판단 (내 TX ID = 150)**

```
tuple A: xmin=100, xmax=200, passenger_num=2
tuple B: xmin=200, xmax=0,   passenger_num=3

TX 150이 읽을 때:
  tuple A: xmin=100 < 150 (내 시작 전 삽입)
           xmax=200 > 150 (내 시작 후 삭제 → 내 눈엔 살아있음) → 보임
  tuple B: xmin=200 > 150 (내 시작 후 삽입) → 안 보임
  → passenger_num=2 읽음

TX 250이 읽을 때:
  tuple A: xmax=200 < 250 → 이미 삭제됨 → 안 보임
  tuple B: xmin=200 < 250 → 보임
  → passenger_num=3 읽음
```

**Snapshot (정확한 구현)**

```
단순 ID 비교만으로는 부족:
  TX 150 시작 시점에 TX 130이 진행 중이면
  TX 130이 나중에 commit해도 TX 150은 볼 수 없어야 함

Snapshot = {
  xip: 현재 진행 중인 TX ID 목록
}
xmin이 xip에 있으면 → commit 여부 무관, 안 보임
```

**PostgreSQL vs MySQL MVCC 구조**

```
PostgreSQL                    MySQL InnoDB
────────────────────────────────────────────────
old version → heap에 그대로    old version → undo log
new version → heap에 새 추가   new version → 기존 페이지 덮어씀
정리        → VACUUM           정리        → purge thread
bloat 위험  → 있음             undo log 비대화 위험 → 있음
```

## 관련 본질

- [[본질-쓰기 시 분리 (Copy-on-Write)]]
- [[본질-격리성 (Isolation)]]
