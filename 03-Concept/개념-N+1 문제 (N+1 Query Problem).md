---
aliases: [N+1 Problem, N+1 Query, N+1 쿼리]
tags: [개념, 작성중, DB, ORM]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 1건의 목록 조회 쿼리 이후, 조회된 N건 각각에 대해 연관 데이터를 개별 쿼리로 가져오면서 총 N+1회의 쿼리가 발생하는 현상.
> (이해용) 반 학생 30명의 성적표를 뽑는데, 명단 1번 조회한 뒤 학생마다 1번씩 성적을 조회해서 총 31번 DB에 다녀오는 것.

## 해결하는 문제

- 이 개념 자체가 **문제**이며, 해결 대상이다.
- ORM이 편의를 위해 연관 엔티티를 Lazy Loading으로 설정했을 때, 목록 순회 시점에 개별 SELECT가 발생하는 구조적 원인을 설명한다.

## 치르는 비용

- 쿼리 수가 데이터 건수에 비례하여 증가 → 네트워크 I/O 폭증.
- DB 커넥션 풀 고갈, 응답 지연의 직접 원인.

## 동작 원리

### 카테시안 곱과의 비교

```text
카테시안 곱 (Cartesian Product)
──────────────────────────────
SELECT * FROM Author, Book    ← 조건 없이 모든 조합 생성
→ Author 3건 × Book 5건 = 15건 반환
→ 쿼리 1회, 데이터 과다

N+1 문제
──────────────────────────────
SELECT * FROM Author           ← 1회 (목록 조회)
SELECT * FROM Book WHERE author_id = 1  ← +1회
SELECT * FROM Book WHERE author_id = 2  ← +1회
SELECT * FROM Book WHERE author_id = 3  ← +1회
→ 쿼리 4회 (1 + N), 데이터는 정확하지만 I/O 낭비
```

카테시안 곱은 **데이터 조합 수의 폭발**, N+1은 **쿼리 횟수의 폭발**이라는 점에서 본질이 다르다. 두 문제 모두 JOIN 조건을 올바르게 설정하면 해결된다.

### 발생 메커니즘 (ORM 기준)

```text
[Application]                    [Database]
     |                                |
     |-- SELECT * FROM Author ------->|  ← 1회
     |<-- Author(1), Author(2), ... --|
     |                                |
     |-- for each author:             |
     |   author.getBooks() ---------->|  ← Lazy Proxy 초기화
     |<-- SELECT * FROM Book ---------|  ← N회 반복
     |   WHERE author_id = ?          |
```

1. ORM은 연관 엔티티를 **프록시 객체**로 감싼다 ([[개념-지연 로딩 (Lazy Loading)]]).
2. 컬렉션 순회 시점에 프록시가 초기화되며 **개별 SELECT**가 발생한다.
3. ORM 사용자는 코드상 `author.getBooks()`만 호출하므로 쿼리 발생을 인지하기 어렵다.

### 해결 전략

| 전략 | 방식 | 트레이드오프 |
| :--- | :--- | :--- |
| Fetch Join | `JOIN FETCH`로 한 번에 조회 | 카테시안 곱 위험, 페이징 불가 |
| Batch Size | `@BatchSize(size=N)`으로 IN절 묶음 조회 | 적정 크기 튜닝 필요 |
| EntityGraph | `@EntityGraph`로 선언적 Eager 지정 | 쿼리 복잡도 증가 |
| DTO 직접 조회 | QueryDSL/JPQL로 필요한 것만 Projection | ORM 영속성 컨텍스트 미활용 |

## 관련 본질

- [[본질-처리량과 지연시간 (Throughput and Latency)]] — 쿼리 횟수 증가는 지연시간에 직결된다.
- [[본질-추상화 (Abstraction)]] — ORM의 추상화가 숨긴 비용.
