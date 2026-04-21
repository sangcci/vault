---
aliases: [Heap Page, Page Structure, 페이지 구조, heap page]
tags: [개념, 작성중]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) PostgreSQL이 데이터를 저장하는 8KB 단위의 물리적 구조로, Header/Item Pointer/Tuple로 구성.
> (이해용) 테이블의 row들이 실제로 디스크에 담기는 그릇. Seq Scan은 이 그릇을 처음부터 끝까지 순서대로 열어보는 것.

## 해결하는 문제

- 데이터 저장 및 접근의 기본 단위 제공
- MVCC를 위한 버전 정보(xmin/xmax) 저장

## 치르는 비용

- UPDATE/DELETE 시 dead tuple 누적 → 페이지 bloat
- VACUUM 없으면 dead tuple이 Seq Scan 시 함께 읽힘 → 성능 저하

## 동작 원리

**페이지 내부 레이아웃**

```
┌─────────────────────────────────────┐  ← 8KB (8192 bytes)
│          Page Header (24 bytes)     │
│  LSN, checksum, flags, free space   │
├─────────────────────────────────────┤
│       Item Pointer Array            │
│  [ptr1][ptr2][ptr3]...[ptrN]        │  각 4 bytes
│    ↓     ↓     ↓                   │
│  offset offset offset              │
├─────────────────────────────────────┤
│                                     │
│           Free Space                │  ← FSM이 추적
│                                     │
├─────────────────────────────────────┤
│  Tuple N  (row data)                │
│  ...                                │
│  Tuple 2  (row data)                │
│  Tuple 1  (row data)                │  ← 아래서 위로 채워짐
└─────────────────────────────────────┘
```

Item Pointer는 위→아래, Tuple은 아래→위로 채워짐.
Free Space가 0이 되면 페이지 가득 참.

**Tuple 내부 구조**

```
┌────────────────────────────────────┐
│       Tuple Header (23 bytes)      │
│  xmin │ xmax │ ctid │ infomask    │
├────────────────────────────────────┤
│       실제 column 데이터            │
│  boarding_date │ rent_id │ ...     │
└────────────────────────────────────┘
```

**TID (Tuple Identifier)**

```
TID = (page 번호, Item Pointer 번호)
TID (892, 3) = page 892의 3번째 Item Pointer가 가리키는 tuple

Index Scan: 인덱스 → TID → 해당 heap page만 접근
Seq Scan:   page 0부터 순서대로 → 각 page의 모든 tuple 순회
```

**Dead Tuple 발생**

```
UPDATE passenger_num = 3 WHERE id = 1:

기존 tuple: xmin=100, xmax=200, passenger_num=2  ← dead
새 tuple:   xmin=200, xmax=0,   passenger_num=3  ← live

VACUUM이 주기적으로 dead tuple 정리
→ Free Space 반환 → 새 row 삽입 가능
```

## 관련 본질

- [[본질-쓰기 시 분리 (Copy-on-Write)]]
- [[본질-영속성 (Persistence)]]
