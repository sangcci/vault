# Anki Problem Batch 005 Report

## 처리 일시

2026-07-08

## 추가한 Problem 카드

```text
Deck:  💻::Problem Solving
Model: 🧑🏻‍💻 Problem Solving v1
Batch: ka_problem_batch_005
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

## 같이 suspend한 Keyword convert 후보

태그 추가:

```text
ka_keyword_converted_batch_005
```

Suspend 대상 8장:

```text
함수적 종속성 (Functional Dependency)
Slotted Page — RID 불변성
외부 설정 관리 (Externalized Configuration)
WireMock 스터빙 (Stubbing)
설정 섀도잉 (Configuration Shadowing)
복합키 (Composite Key)
Heap Page 구조
JPQL 벌크 연산의 1차 캐시 문제
```

## 검증 결과

```text
problem_total                  50
problem_batch_001              10
problem_batch_002              10
problem_batch_003              10
problem_batch_004              10
problem_batch_005              10
scenario                       41
code_review                     4
implementation                  5
keyword_converted_batch_005     8
keyword_delete_suspended      113
active_keyword                 68
```

## 다음 배치 후보

다음 배치는 남은 Problem 중 실제 백엔드 설계/운영 판단으로 이어지는 항목을 우선한다.

추천 후보:

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
