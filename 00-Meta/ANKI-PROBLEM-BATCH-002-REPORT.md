# Anki Problem Batch 002 Report

## 처리 일시

2026-07-08

## 추가한 Problem 카드

```text
Deck:  💻::Problem Solving
Model: 🧑🏻‍💻 Problem Solving v1
Batch: ka_problem_batch_002
```

카드 수:

| CardType | Count |
|---|---:|
| Scenario | 8 |
| Code Review | 1 |
| Implementation | 1 |
| Total | 10 |

대상 Problem:

```text
05-양방향 연관관계 직렬화로 순환 참조가 발생함
06-인덱스를 추가했는데도 조회 쿼리가 느림
08-캐시 만료 순간 같은 DB 조회가 동시에 몰림
09-동적 검색 조건을 캐시해도 적중률이 오르지 않음
10-동시 요청 로그가 섞여 장애 원인을 추적하기 어려움
11-대시보드 알람은 울렸지만 실제 병목 지점을 찾기 어려움
16-같은 클래스 내부 호출로 트랜잭션이나 캐시가 적용되지 않음
17-save 호출을 try-catch로 감쌌는데 DB 제약 예외를 잡지 못함
23-운영 중 인덱스 추가로 쓰기 요청이 막히거나 마이그레이션이 멈춤
55-코드 배포와 DB 스키마 변경 순서가 맞지 않아 장애가 발생함
```

## 같이 suspend한 Keyword convert 후보

태그 추가:

```text
ka_keyword_converted_batch_002
```

Suspend 대상 11장:

```text
B-Tree
연관 관계 (Association)
연관 관계의 순환 참조 위험
스키마 마이그레이션 (Schema Migration)
Expand-Contract 패턴
MDC (Mapped Diagnostic Context)
EXPLAIN ANALYZE
Seq Scan
Index Scan
JPA 순환 참조
flyway.postgresql.transactional-lock
```

제외한 후보:

```text
장애 (Failure)
```

이 카드는 너무 넓은 개념이라 특정 Batch 002 Problem으로 전환했다고 보기 어려워 suspend하지 않았다.

## 검증 결과

```text
problem_total                  20
problem_batch_001              10
problem_batch_002              10
scenario                       13
code_review                     4
implementation                  3
keyword_converted_batch_001     6
keyword_converted_batch_002    11
keyword_delete_suspended      113
active_keyword                100
```

## 다음 배치 후보

다음 배치는 운영 장애 영향이 큰 트랜잭션/JPA/DB/캐시 잔여 P1을 우선한다.

추천 후보:

```text
18-ConcurrentHashMap을 써도 중복 생성이나 덮어쓰기가 발생함
19-락을 걸었는데 처리량이 급락하거나 요청이 멈춤
20-JOIN 쿼리가 데이터가 늘자 갑자기 느려짐
21-상관 서브쿼리가 행마다 반복 실행되어 조회가 느림
22-GROUP BY 후 비집계 컬럼을 조회하자 오류가 발생함
24-장기 트랜잭션 때문에 테이블이 부풀고 VACUUM이 정리하지 못함
25-대량 조회 API가 DB보다 애플리케이션 전송 구간에서 느림
29-Redis 메모리 한도에 도달하자 중요 키가 사라지거나 쓰기가 실패함
30-API Rate Limit을 걸었는데 정상 사용자의 순간 요청까지 막힘
31-요청마다 새 TCP 연결을 만들어 응답 지연과 연결 비용이 커짐
```
