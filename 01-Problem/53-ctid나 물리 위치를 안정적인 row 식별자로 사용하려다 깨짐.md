---
aliases: [PostgreSQL ctid Misuse, Physical Row Location as Identifier, Slotted Page Indirection]
tags: [문제, 작성중, DB, Storage]
difficulty: High
type: Problem
---

# Problem: 53-ctid나 물리 위치를 안정적인 row 식별자로 사용하려다 깨짐

## 상황

PostgreSQL에서 `ctid`로 row를 빠르게 찾을 수 있다는 사실을 보고, 이를 API나 외부 참조의 식별자로 사용하려 했다. 하지만 UPDATE, VACUUM FULL, tuple 이동 이후 `ctid`가 바뀌어 같은 논리 row를 가리키지 못한다.

```sql
SELECT ctid, * FROM orders;
-- (892,3)을 저장해두고 나중에 재사용
```

---

## 관찰된 증거

- UPDATE 후 같은 논리 row의 `ctid`가 달라진다.
- VACUUM FULL 또는 테이블 재작성 후 물리 위치가 바뀐다.
- 인덱스가 가리키는 TID와 애플리케이션 식별자를 혼동한다.
- page/slot 구조를 안정적인 비즈니스 ID처럼 사용한다.
- 물리 저장 구조와 논리 식별자 경계를 구분하지 못한다.

---

## 의심 문제

가장 가능성 높은 문제는 **물리적 접근 주소와 논리적 row 식별자를 혼동한 것**이다.

DB 내부에서 page id, slot number, item pointer, `ctid`는 빠른 물리 접근을 위한 주소다. 하지만 row가 업데이트되거나 페이지가 정리되면 물리 위치는 바뀔 수 있다. 외부 식별자는 primary key처럼 논리적으로 안정적인 값을 사용해야 한다.

---

## 원인

```text
DB page
  - 고정 크기 I/O 단위
  - table/index는 page 배열로 저장

Slotted page
  - slot array가 tuple offset을 가리킴
  - tuple 이동 시 slot만 갱신 가능
  - 외부 index는 (page, slot)을 참조

ctid / TID
  - physical location of row version
  - row version이 바뀌면 달라질 수 있음
```

---

## 확인 방법

- 외부 API나 다른 테이블에서 `ctid`를 저장하는 코드가 있는지 찾는다.
- UPDATE 후 `ctid` 변화 여부를 확인한다.
- 논리 row 식별자로 primary key가 존재하는지 확인한다.
- 인덱스 scan에서 TID는 내부 접근 주소일 뿐임을 구분한다.
- page bloat, dead tuple, VACUUM 동작을 함께 본다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| Primary Key 사용 | 논리 식별 안정성 | 키 설계 필요 |
| ctid는 일회성 내부 최적화에만 제한 | 빠른 단발 작업 가능 | 장기 저장 금지 |
| 대량 작업 시 PK 기반 pagination | 안정성 | offset/seek 전략 설계 필요 |
| vacuum/bloat 관측 | 물리 구조 문제 이해 | 운영 지식 필요 |

---

## 트레이드오프

물리 위치는 빠르지만 안정적이지 않다. 논리 키는 한 단계 추상화를 거치지만 row의 의미와 생명주기를 보존한다. DBMS는 내부에서 물리 주소를 쓰되, 사용자에게는 논리 식별자를 제공하는 이유가 여기에 있다.

---

## 연결되는 본질

- [[본질-물리 주소와 논리 식별자의 분리]]
- [[본질-페이지 단위 저장과 간접 참조]]
- [[본질-논리 순서와 물리 접근 비용]]

---

## 참고

> "Every table and index is stored as an array of pages of a fixed size (usually 8 kB, although a different page size can be selected when compiling the server)." — [PostgreSQL Documentation: Database Page Layout](https://www.postgresql.org/docs/current/storage-page-layout.html)

> "The physical location of the row version within its table." — [PostgreSQL Documentation: System Columns — ctid](https://www.postgresql.org/docs/current/ddl-system-columns.html)

> "Therefore ctid should not be used as a row identifier. A primary key should be used to identify logical rows." — [PostgreSQL Documentation: System Columns — ctid](https://www.postgresql.org/docs/current/ddl-system-columns.html)
