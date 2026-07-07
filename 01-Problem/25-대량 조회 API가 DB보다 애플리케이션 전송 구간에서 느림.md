---
aliases: [JDBC Fetch Size Slow Large Result, Cursor Fetch, ResultSet Memory]
tags: [문제, 작성중, JDBC, DB, Performance]
difficulty: Medium
type: Problem
---

# Problem: 25-대량 조회 API가 DB보다 애플리케이션 전송 구간에서 느림

## 상황

SQL 자체는 빠르게 시작되지만, 대량 결과를 애플리케이션으로 가져오는 구간에서 응답이 늦거나 메모리가 급증한다.

```java
PreparedStatement ps = conn.prepareStatement("select * from event_log");
ResultSet rs = ps.executeQuery();
while (rs.next()) {
    process(rs);
}
```

DB 실행계획만 보면 문제가 크지 않은데, 네트워크 왕복이나 ResultSet 버퍼링 때문에 전체 처리 시간이 길어진다.

---

## 관찰된 증거

```text
DB executor
  → row를 계속 생산
  → JDBC driver가 결과를 가져옴
  → application memory에 버퍼링
  → process loop 실행
```

증상은 다음과 같다.

- SQL 첫 row는 빨리 나오지만 전체 응답이 느리다.
- 대량 export/batch 조회에서 heap 사용량이 급증한다.
- fetch size를 조정하자 네트워크 왕복 또는 메모리 사용량이 달라진다.
- PostgreSQL에서 autocommit이 켜져 있으면 cursor fetch가 적용되지 않는다.

---

## 의심 문제

가장 가능성 높은 문제는 **DB 내부 실행 비용이 아니라 DB → 애플리케이션 전송 배치 크기와 ResultSet 버퍼링 비용**이다.

fetch size는 한 번에 몇 row씩 가져올지 정하는 배치 크기다. 너무 작으면 왕복이 많고, 너무 크면 메모리와 GC 압박이 커진다.

---

## 원인

```text
fetch size 작음
  → network round trip 증가
  → 전체 처리 시간 증가

fetch size 큼 / 전체 fetch
  → application memory 증가
  → GC 압박 / OOM 위험

적정 fetch size
  → 왕복과 메모리 사이 균형
```

PostgreSQL JDBC에서 cursor 기반 fetch는 조건이 있다.

```text
- autocommit=false
- forward-only ResultSet
- 단일 statement
- fetchSize > 0
```

조건이 맞지 않으면 driver가 전체 ResultSet을 한 번에 가져올 수 있다.

---

## 확인 방법

- SQL 실행 시간과 application 전체 처리 시간을 분리해서 측정한다.
- ResultSet 처리 중 heap 사용량과 GC 로그를 확인한다.
- `setFetchSize()` 적용 전후 네트워크/메모리/처리 시간을 비교한다.
- PostgreSQL JDBC에서 `conn.setAutoCommit(false)`가 되어 있는지 확인한다.
- 조회 목적이 API 응답인지, batch/export인지 구분한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 적정 `fetchSize` 설정 | 왕복/메모리 균형 | 드라이버별 조건 다름 |
| cursor/stream 처리 | 전체 메모리 적재 회피 | transaction을 오래 열 수 있음 |
| paging/keyset pagination | API 응답에 적합 | 전체 export와 목적 다름 |
| batch chunk 처리 | 실패 재시도 단위 명확 | 정렬/중복 방지 필요 |
| 필요한 컬럼만 조회 | 전송량 감소 | DTO/쿼리 분리 필요 |

---

## 트레이드오프

대량 조회 최적화는 DB plan만으로 끝나지 않는다. row를 얼마나 빨리 찾는가와 row를 어떤 크기로 애플리케이션까지 운반하는가는 다른 문제다. fetch size를 키우면 왕복은 줄지만 메모리와 트랜잭션 보유 시간이 늘 수 있다.

---

## 연결되는 본질

- [[본질-전송 배치 크기와 메모리 압력]]
- [[본질-상황 제약 기반 기술 선택]]
- [[본질-버전 가시성과 청소 비용]]

---

## 참고

> "Changing the code to use cursor mode is as simple as setting the fetch size of the Statement to the appropriate size." — [PostgreSQL JDBC Documentation: Query](https://jdbc.postgresql.org/documentation/query/)

> "Setting the fetch size back to 0 will cause all rows to be cached (the default behaviour)." — [PostgreSQL JDBC Documentation: Query](https://jdbc.postgresql.org/documentation/query/)

> "The Connection must not be in autocommit mode." — [PostgreSQL JDBC Documentation: Query](https://jdbc.postgresql.org/documentation/query/)
