# Anki Problem Batch 001 Report

## 처리 일시

2026-07-08

## 추가한 Problem 카드

```text
Deck:  💻::Problem Solving
Model: 🧑🏻‍💻 Problem Solving v1
Batch: ka_problem_batch_001
```

카드 수:

| CardType | Count |
|---|---:|
| Scenario | 5 |
| Code Review | 3 |
| Implementation | 2 |
| Total | 10 |

대상 Problem:

```text
01-외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈됨
02-재시도와 동시 요청으로 주문이 중복 생성됨
03-동시 요청으로 재고나 예약 수량 갱신이 소실됨
04-목록 조회 API에서 연관 데이터 접근으로 SQL이 폭증함
07-DB 업데이트 후 캐시에 오래된 값이 다시 저장됨
```

## 같이 suspend한 Keyword convert 후보

태그 추가:

```text
ka_keyword_converted_batch_001
```

Suspend 대상 6장:

```text
Race Condition
N+1 문제 (N+1 Query Problem)
Lost Update
Atomic UPDATE
커넥션 풀 고갈 (Connection Pool Exhaustion)
UI 조회 API 분리 기준
```

## 검증 결과

```text
problem_total                         10
problem_batch_001                     10
scenario                               5
code_review                            3
implementation                         2
keyword_convert_total                 69
keyword_converted_batch_001            6
keyword_converted_batch_001_suspended  6
active_keyword                       111
```

## 다음 배치 후보

다음 배치는 같은 방식으로 P1 Problem 중 아직 카드화하지 않은 운영 장애형 주제를 우선한다.

추천 후보:

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
