# Anki Problem Batch 006 Report

## 처리 일시

2026-07-08

## 추가한 Problem 카드

```text
Deck:  💻::Problem Solving
Model: 🧑🏻‍💻 Problem Solving v1
Batch: ka_problem_batch_006
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
26-Service 코드가 조회 저장 예외 처리와 도메인 규칙으로 비대해짐
27-도메인 코드에 DB Redis FCM 같은 기술 이름이 새어 나옴
28-같은 데이터를 다룬다는 이유로 고객 API와 관리자 API를 합쳐 변경이 꼬임
39-List를 LinkedList로 바꿨는데 순차 조회가 더 느려짐
40-HashMap 조회가 항상 O1이라고 믿었는데 충돌과 리사이즈로 느려짐
41-제네릭 타입과 오버로딩을 믿었는데 런타임 타입이 사라져 다르게 동작함
42-Checked Exception을 그대로 전파해 서비스 인터페이스가 예외에 오염됨
43-Heap 사용량만 보고 JVM 메모리 부족 원인을 놓침
44-객체와 메서드가 모두 Heap에 있다고 오해해 다형성 비용을 설명하지 못함
45-PriorityQueue로 정렬 순회나 범위 조회를 하려다 성능이 나빠짐
```

## 같이 suspend한 Keyword convert 후보

태그 추가:

```text
ka_keyword_converted_batch_006
```

Suspend 대상 3장:

```text
제네릭 타입 소거 (Type Erasure)
Checked Exception
JVM 메모리 영역
```

제외한 후보:

```text
Hash 충돌 저항 (Collision Resistance)
UI 조회 API 분리 기준
```

`Hash 충돌 저항`은 암호학적 해시 성질에 가까워 `HashMap`의 bucket 분산 문제와 직접 전환 관계가 약했다. `UI 조회 API 분리 기준`은 이전 배치에서 이미 처리된 카드라 제외했다.

## 검증 결과

```text
problem_total                  60
problem_batch_001              10
problem_batch_002              10
problem_batch_003              10
problem_batch_004              10
problem_batch_005              10
problem_batch_006              10
scenario                       51
code_review                     4
implementation                  5
keyword_converted_batch_006     3
keyword_delete_suspended      113
active_keyword                 65
```

## 다음 배치 후보

다음 배치는 남은 Problem 중 알고리즘/보안/네트워크/운영 판단으로 이어지는 항목을 우선한다.

추천 후보:

```text
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
```
