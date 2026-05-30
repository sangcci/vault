---
aliases: [MVCC, Multi-Version Concurrency Control, 다중 버전 동시성 제어, xmin, xmax, 트랜잭션 가시성, Transaction Visibility]
tags: [개념, 작성중]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) PostgreSQL이 각 row version의 생성·종료 트랜잭션 ID와 snapshot을 이용해, 트랜잭션마다 서로 다른 가시성을 판단하는 다중 버전 동시성 제어 메커니즘.
> (이해용) row를 바로 덮어쓰거나 지우지 않고 버전을 잠깐 같이 남겨 둔 뒤, 각 트랜잭션이 자기 차례에 보여야 할 row만 보게 만드는 방식.

---

## 해결하는 문제

- 읽기와 쓰기 간 잠금 충돌 없는 동시성 보장
- 트랜잭션 격리 (Dirty Read, Non-repeatable Read 방지)

---

## 치르는 비용

- UPDATE/DELETE 시 dead tuple 누적 → heap bloat
- VACUUM이 dead tuple 정리 못 하면 Seq Scan 성능 저하
- 장기 트랜잭션이 있으면 예전 snapshot 때문에 dead tuple을 오래 못 지움
- 오래된 XID를 계속 방치하면 wraparound 방지를 위한 freeze / aggressive vacuum 비용이 커짐

---

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

핵심은 **UPDATE가 덮어쓰기가 아니라 "구 tuple 종료 + 새 tuple 생성"** 이라는 점이다.
그래서 VACUUM 전까지는 예전 버전이 heap에 남아 있고, 먼저 시작한 트랜잭션은 그 구버전을 아직 볼 수 있다.

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

---

## 중요한 가시성 종류

### 1. Insert Visibility

- 이 row를 만든 `xmin` 트랜잭션이 **내 snapshot 기준으로 이미 commit 되었는가**
- 아직 진행 중이거나, 내 시작 시점 이후에 생긴 row면 안 보임

### 2. Delete / Update Visibility

- `xmax`가 0이면 아직 끝나지 않은 row version일 가능성이 큼
- `xmax`가 있더라도 그 트랜잭션이 **내 snapshot 기준으로 아직 반영되지 않았으면** 내 눈에는 여전히 살아 있음
- UPDATE도 본질은 delete+insert처럼 동작하므로, old version의 종료 시점과 new version의 시작 시점을 같이 봐야 함

### 3. Snapshot Visibility

- `xmin < 내 TX ID` 같은 숫자 비교만으로는 부족함
- 내가 시작할 때 진행 중이던 트랜잭션 목록(`xip`)에 있으면, 나중에 commit하더라도 내 snapshot에서는 안 보임
- 즉 가시성 판단의 본체는 `xmin/xmax + commit 상태 + snapshot` 조합임

### 4. Vacuum / Freeze Visibility

- 더는 어떤 트랜잭션도 볼 수 없는 old version은 VACUUM이 정리함
- 아주 오래된 XID는 wraparound 방지를 위해 freeze 대상이 됨
- 그래서 MVCC는 읽기-쓰기 충돌을 줄여 주지만, 대신 백그라운드 청소 비용을 요구함

**PostgreSQL vs MySQL MVCC 구조**

```
PostgreSQL                    MySQL InnoDB
────────────────────────────────────────────────
old version → heap에 그대로    old version → undo log
new version → heap에 새 추가   new version → 기존 페이지 덮어씀
정리        → VACUUM           정리        → purge thread
bloat 위험  → 있음             undo log 비대화 위험 → 있음
```

---

## 관련 본질

- [[본질-논리 순서와 물리 순서는 다르다]]
- [[본질-쓰기 시 분리 (Copy-on-Write)]]
- [[본질-격리성 (Isolation)]]

---

## 참고

- [PostgreSQL Documentation — Introduction to MVCC](https://www.postgresql.org/docs/current/mvcc-intro.html) — "each SQL statement sees a snapshot of data (a database version) as it was some time ago"
- [PostgreSQL Documentation — System Columns](https://www.postgresql.org/docs/current/ddl-system-columns.html) — "xmin" is "The identity (transaction ID) of the inserting transaction for this row version." / "xmax" is "The identity (transaction ID) of the deleting transaction, or zero for an undeleted row version."
- [PostgreSQL Documentation — Routine Vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html) — "VACUUM will mark rows as frozen" and old row versions must be cleaned to avoid transaction ID wraparound problems.
