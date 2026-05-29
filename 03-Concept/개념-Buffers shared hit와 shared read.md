---
aliases: [Buffers shared hit shared read, PostgreSQL Buffers, Shared Hit Shared Read]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) `Buffers: shared hit`는 shared buffer에 이미 있던 page를 읽은 횟수이고, `shared read`는 disk에서 page를 읽어 shared buffer에 올린 횟수다.
> (이해용) hit는 창고 안에 이미 있던 박스를 꺼낸 것이고, read는 창고 밖 디스크에서 새로 가져온 것이다.

## 해결하는 문제

- 쿼리가 느린 이유가 CPU/filter 문제인지 disk I/O 문제인지 구분한다.
- 같은 실행 계획인데 첫 실행과 두 번째 실행 시간이 다른 이유를 설명한다.
- [[개념-EXPLAIN ANALYZE]]에서 실제 page 접근 비용을 읽게 한다.

```text
Buffers: shared hit=120 read=30

shared hit  -> memory buffer에서 page 찾음
shared read -> disk에서 page 읽음
```

## 치르는 비용

- `shared hit`도 공짜는 아니다. memory page 접근과 tuple 평가 비용은 남는다.
- OS page cache와 PostgreSQL shared buffer가 함께 작동하므로 물리 디스크 읽기와 1:1 대응은 아닐 수 있다.
- 한 번 실행한 쿼리는 다음 실행에서 buffer hit가 늘어날 수 있다.

## 동작 원리

```text
Executor asks page
  |
  v
Shared Buffer lookup
  |\
  | hit  -> shared hit 증가
  |
  miss -> disk/OS cache에서 read -> shared read 증가
```

`shared read`가 크면 page를 buffer에 새로 올리는 비용이 있었다는 뜻이다. `shared hit`가 커도 row를 많이 훑는 query라면 CPU와 predicate 평가 비용이 클 수 있다.

## 관련 본질

- [[개념-EXPLAIN ANALYZE]]
- [[개념-SQL 물리 실행 흐름]]
- [[개념-DBMS의 역할과 저장소 관리자 (Storage Manager)]]

## 참고

> "EXPLAIN actually executes the query, and then displays the true row counts and true run time accumulated within each plan node." — [PostgreSQL Documentation, Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html)
