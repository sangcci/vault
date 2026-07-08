# Anki Problem Batch 007 Report

## 처리 일시

2026-07-08

## 추가한 Problem 카드

```text
Deck:  💻::Problem Solving
Model: 🧑🏻‍💻 Problem Solving v1
Batch: ka_problem_batch_007
```

카드 수:

| CardType | Count |
|---|---:|
| Scenario | 16 |
| Code Review | 0 |
| Implementation | 0 |
| Total | 16 |

대상 Problem:

```text
12-운영 모니터링 스택을 골랐지만 로그 검색과 메트릭 요구가 맞지 않음
13-Docker와 VM 격리 수준을 구분하지 못해 워크로드 배치가 불안정함
14-DNAT 설정 후에도 VM 서비스에 외부 접속이 되지 않음
15-Cloudflare Tunnel 환경에서 fail2ban으로 공격자 IP를 차단하지 못함
46-가중치가 다른 경로 문제에 BFS를 써서 최단 거리를 틀림
47-그리디로 풀었는데 반례에서 최적해를 놓침
59-VPN을 켰는데도 접근 권한과 노출 범위를 구분하지 못함
60-홈서버를 ONT에 직접 연결해 모든 포트가 인터넷에 노출됨
61-RAG를 붙였는데 관련 없는 문서가 들어가 답변 품질이 나빠짐
64-패턴 이름에 맞추려다 단순한 코드가 과하게 복잡해짐
65-멀티모듈로 나눴지만 변경 경계가 아니라 폴더만 늘어남
66-컨테이너 PID 1이 자식 프로세스를 수거하지 않아 좀비가 쌓임
67-화면 요구사항만 보고 API를 만들었다가 숨은 정책이 뒤늦게 드러남
68-프로젝트를 기능 나열로만 설명해 기술 선택의 깊이가 드러나지 않음
69-API와 DTO 이름을 기술 기준으로 정해 도메인 의미가 흐려짐
70-자원 종료와 의존성 버전 관리를 미뤄 운영 장애가 발생함
```

## 같이 suspend한 Keyword convert 후보

태그 추가:

```text
ka_keyword_converted_batch_007
```

Suspend 대상 12장:

```text
BFS (너비 우선 탐색)
BFS
DNAT과 SNAT
Cloudflare Tunnel IP 마스킹
Cloudflare Tunnel 환경에서 IP 기반 공격 차단
Context Window
RAG (Retrieval-Augmented Generation)
Vector DB
변경 경계
Process Scheduler
DBMS Storage Manager
프로세스 (Process)
```

유지한 active convert 후보 5장:

```text
장애 (Failure)
Access Token 수명
Tomcat 요청 처리
Blocking I/O
Hash 충돌 저항 (Collision Resistance)
```

이 5장은 너무 넓거나, 현재 Problem 카드와 직접 전환 관계가 약해 suspend하지 않았다. 이후 별도 Problem 노트가 생기면 전환하거나, Keyword 유지 후보로 재분류한다.

## 검증 결과

```text
problem_total                  76
problem_batch_007              16
scenario                       67
code_review                     4
implementation                  5
keyword_converted_batch_007    12
keyword_delete_suspended      113
active_keyword                 53
active_convert                  5
```

Problem note coverage:

```text
problem_notes                  71
unique_problem_covered         71
missing_problem_notes           0
```

## 최종 상태

- 01-Problem 71개는 모두 최소 1개 이상의 Problem Solving 카드로 커버됐다.
- Problem Solving 덱은 총 76장이다.
- 기존 Keyword convert 후보는 직접 대응 가능한 항목을 대부분 Problem 카드로 전환 후 suspend했다.
- 남은 active Keyword 53장은 keep 48장 + 보류 convert 5장 구조다.
