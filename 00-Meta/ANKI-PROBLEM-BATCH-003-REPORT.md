# Anki Problem Batch 003 Report

## 처리 일시

2026-07-08

## 추가한 Problem 카드

```text
Deck:  💻::Problem Solving
Model: 🧑🏻‍💻 Problem Solving v1
Batch: ka_problem_batch_003
```

카드 수:

| CardType | Count |
|---|---:|
| Scenario | 9 |
| Code Review | 0 |
| Implementation | 1 |
| Total | 10 |

대상 Problem:

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

## 같이 suspend한 Keyword convert 후보

태그 추가:

```text
ka_keyword_converted_batch_003
```

Suspend 대상 14장:

```text
교착 상태
JDBC Fetch Size
Hash Join
Nested Loop Join
Merge Join
GROUP BY의 Functional Dependency
Lock 범위
Redis (Remote Dictionary Server)
AccessShareLock
AccessExclusiveLock
ShareUpdateExclusiveLock
Optimistic Lock
pg_advisory_xact_lock
pg_advisory_lock
```

제외한 후보:

```text
파이프 버퍼 Writer Blocking
Race Condition
Tomcat 요청 처리
Blocking I/O
flyway.postgresql.transactional-lock
```

이들은 이미 이전 배치에서 처리됐거나, Batch 003 Problem과 직접 전환 관계가 약해 제외했다.

## 검증 결과

```text
problem_total                  30
problem_batch_001              10
problem_batch_002              10
problem_batch_003              10
scenario                       22
code_review                     4
implementation                  4
keyword_converted_batch_003    14
keyword_delete_suspended      113
active_keyword                 86
```

## 다음 배치 후보

다음 배치는 네트워크/OS/보안/아키텍처 경계 중 운영 판단으로 바로 이어지는 P1/P2를 우선한다.

추천 후보:

```text
32-같은 IP의 여러 도메인을 L4 설정만으로 분기하려다 실패함
33-스레드를 많이 만들었는데 처리량이 늘지 않고 문맥 교환만 증가함
34-CPU 스케줄링 정책을 잘못 잡아 짧은 요청이 긴 작업 뒤에서 밀림
35-이벤트 루프에 CPU 작업을 올려 모든 요청이 지연됨
36-await으로 중간에 끊긴 로직 사이에 다른 요청이 끼어들어 상태가 꼬임
37-파이프라인에서 소비자가 느려지자 생산자 프로세스가 멈춘 것처럼 보임
38-mmap으로 큰 파일을 읽었는데 예측 못한 지연과 메모리 압력이 발생함
48-인증서는 있는데 이 공개키를 믿어도 되는지 검증하지 못함
49-iptables나 fail2ban으로 막으려 했지만 공격자가 이미 프록시나 CDN 뒤에 있음
50-역할만 확인해서 사용자가 남의 리소스를 수정할 수 있음
```
