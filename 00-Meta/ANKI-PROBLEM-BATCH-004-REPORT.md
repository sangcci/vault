# Anki Problem Batch 004 Report

## 처리 일시

2026-07-08

## 추가한 Problem 카드

```text
Deck:  💻::Problem Solving
Model: 🧑🏻‍💻 Problem Solving v1
Batch: ka_problem_batch_004
```

카드 수:

| CardType | Count |
|---|---:|
| Scenario | 10 |
| Code Review | 0 |
| Implementation | 0 |
| Total | 10 |

대상 Problem:

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

## 같이 suspend한 Keyword convert 후보

태그 추가:

```text
ka_keyword_converted_batch_004
```

Suspend 대상 10장:

```text
문맥 교환 (Context Switch)
유닉스 파이프의 메모리 안전성
파이프 버퍼 Writer Blocking
이벤트 루프 (Event Loop)
epoll
OS Thread와 User Thread의 차이
Netfilter와 iptables
fail2ban
Cloudflare WAF
PKI
```

제외한 후보:

```text
프로세스 (Process)
```

이 카드는 너무 넓은 개념이라 특정 Batch 004 Problem으로 전환했다고 보기 어려워 suspend하지 않았다.

## 검증 결과

```text
problem_total                  40
problem_batch_004              10
scenario                       32
code_review                     4
implementation                  4
keyword_converted_batch_004    10
keyword_delete_suspended      113
active_keyword                 76
```

## 다음 배치 후보

다음 배치는 DB 모델링/배포/테스트/이력/아키텍처 쪽 P1/P2를 우선한다.

추천 후보:

```text
51-한 테이블에 여러 사실을 넣어 수정할 때마다 데이터가 불일치함
52-복합키를 기본키로 썼다가 FK 전파와 인덱스 순서 때문에 변경이 어려워짐
53-ctid나 물리 위치를 안정적인 row 식별자로 사용하려다 깨짐
54-설정 파일을 고쳤는데 운영에서 다른 값이 적용됨
56-reset과 force push로 공유 브랜치 이력이 꼬임
57-JPQL 벌크 업데이트 후 같은 트랜잭션에서 오래된 값을 읽음
58-테스트가 실제 외부 API를 호출해 느리고 불안정해짐
62-현재 상태만 저장해 누가 언제 왜 변경했는지 추적하지 못함
63-쓰기 모델로 화면 조회까지 처리하려다 도메인과 SQL이 모두 복잡해짐
71-운영 SQL 로그에 파라미터를 남겨 개인정보와 시크릿이 노출됨
```
