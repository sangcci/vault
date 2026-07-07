# Obsidian Note Renewal Plan

> 목표: 노트 분류 체계를 줄이고, 실무 문제를 보고 진단·해결·트레이드오프까지 말할 수 있는 구조로 바꾼다.

## 1. 현재 노트 분포

현재 vault의 6-layer 노트 수는 다음과 같다.

| 기존 폴더 | 역할 | 노트 수 | 리뉴얼 방향 |
|---|---:|---:|---|
| `01-Question` | 탐구 질문 | 53 | `03-Question`으로 이동/정리 |
| `02-Phenomenon` | 증상/문제 현상 | 16 | `01-Problem`으로 병합 |
| `03-Concept` | 도구/기술 개념 | 162 | `02-Principle`로 흡수하거나 삭제 |
| `04-Principle` | 본질/원리 | 54 | `02-Principle`로 유지/정제 |
| `05-Case` | 실제 사례 | 17 | `01-Problem`으로 병합 |
| `06-Heuristic` | 판단 기준 | 61 | 대부분 `01-Problem` 또는 `02-Principle`로 흡수 |

총 리뉴얼 대상은 약 `363개`다.

---

## 2. 새 폴더 구조

최종 구조는 다음 3개 축으로 단순화한다.

```text
01-Problem/
  문제-*.md

02-Principle/
  본질-*.md

03-Question/
  탐구-*.md
```

각 폴더의 책임은 다음과 같다.

```text
Problem
  실무 문제, 코드 냄새, 로그, 메트릭, 장애 상황, 해결 판단을 한 노트에 모은다.

Principle
  여러 Problem에서 반복되는 본질, 원리, 판단 기준, 트레이드오프를 정리한다.

Question
  아직 답을 모르는 탐구 질문이나 추가 연구가 필요한 질문만 둔다.
```

---

## 3. 기존 6-layer → 새 3-layer 매핑 기준

### 3.1 Question → Question

```text
01-Question/탐구-* → 03-Question/탐구-*
```

단, 이미 답이 충분히 정리되어 있는 질문은 다음 중 하나로 처리한다.

```text
- 실무 문제 중심이면 Problem으로 변환
- 반복 원리 중심이면 Principle로 변환
- 더 이상 필요 없으면 삭제 후보
```

### 3.2 Phenomenon + Case + Heuristic → Problem

```text
02-Phenomenon/현상-*
05-Case/사례-*
06-Heuristic/판단기준-*
        ↓
01-Problem/문제-*
```

다음 조건을 만족하면 Problem으로 만든다.

```text
- 실제 증상, 장애, 로그, 코드 냄새, 메트릭 이상이 있다.
- 문제 원인을 설명할 수 있다.
- 해결책 후보와 트레이드오프를 비교할 수 있다.
- 면접 질문으로 바꿔도 자연스럽다.
```

### 3.3 Concept + Principle → Principle

```text
03-Concept/개념-*
04-Principle/본질-*
        ↓
02-Principle/본질-*
```

다음 조건을 만족하면 Principle로 남긴다.

```text
- 여러 문제에서 반복해서 등장한다.
- 특정 기술 구현체보다 더 넓은 원리다.
- 문제 해결 판단 기준으로 쓸 수 있다.
- 트레이드오프를 설명할 수 있다.
```

다음에 해당하면 독립 노트로 유지하지 않는다.

```text
- 단순 기능 설명
- 특정 옵션/라이브러리 사용법
- 다른 Principle의 하위 사례
- 면접/실무 문제 해결과 직접 연결되지 않는 암기성 항목
```

---

## 4. 새 노트 템플릿 초안

### 4.1 Problem 노트 템플릿

```markdown
---
aliases: [English_Name, Search_Keyword]
tags: [문제, 작성중]
difficulty: Medium
type: Problem
---

# Problem: 문제 제목

## 상황

어떤 서비스/업무/코드 흐름에서 문제가 발생했는가?

---

## 관찰된 증거

- 코드
- 로그
- 메트릭
- SQL
- 에러 메시지

```text
request → service → db
              ↓
          bottleneck
```

---

## 의심 문제

가장 가능성 높은 문제 유형은 무엇인가?

---

## 원인

왜 이 구조에서 문제가 발생하는가?

---

## 확인 방법

무엇을 보면 이 판단을 검증할 수 있는가?

---

## 해결책 후보

| 해결책 | 장점 | 비용/위험 |
|---|---|---|
| 빠른 완화책 | | |
| 근본 해결책 | | |
| 재발 방지책 | | |

---

## 트레이드오프

성능, 일관성, 복잡도, 운영 비용 중 무엇을 얻고 잃는가?

---

## 연결되는 본질

- `본질-...`

---

## 참고

> "exact quote" — Source URL
```

### 4.2 Principle 노트 템플릿

```markdown
---
aliases: [English_Name, Search_Keyword]
tags: [본질, 작성중]
difficulty: Medium
type: Principle
---

# Principle: 본질 제목

**핵심 질문**: 이 본질은 어떤 반복 문제를 해결하는가?

## 한 문장 정의

문제 해결 관점의 한 문장 정의.

---

## 해결하는 문제

어떤 Problem에서 반복적으로 등장하는가?

---

## 깨지는 상황

이 원리를 놓치면 어떤 장애/버그/성능 문제가 생기는가?

```text
잘못된 구조 → 증상 → 장애/비용
```

---

## 판단 기준

언제 이 원리를 적용하고, 언제 적용하지 않는가?

---

## 트레이드오프

무엇을 얻고 무엇을 잃는가?

---

## 대표 문제

- `문제-...`

---

## 참고

> "exact quote" — Source URL
```

### 4.3 Question 노트 템플릿

```markdown
---
aliases: [Search_Keyword]
tags: [탐구, 작성중]
difficulty: Medium
type: Question
---

# Question: 원문 질문

## 핵심 질문

사용자 원문 질문을 유지한다.

---

## 왜 중요한가

이 질문이 어떤 Problem 또는 Principle과 연결되는가?

---

## 파생 노트

- `문제-...`
- `본질-...`
```

---

## 5. Concept/Principle 1차 감사 기준

### 5.1 Principle로 승격/유지할 후보

현재 이름 그대로 두기보다 문제 해결 표현으로 재명명한다.

| 후보 | 처리 방향 |
|---|---|
| `본질-멱등성` | 유지. 중복 요청/재시도 Problem의 핵심 Principle |
| `본질-원자성` | 유지. 동시성/트랜잭션/부분 실패 문제와 연결 |
| `본질-격리성` | 유지. 트랜잭션/인프라/환경 격리 문제와 연결 |
| `본질-자원 경합` | 유지. 락, 커넥션 풀, CPU, 스레드 문제의 상위 원리 |
| `본질-처리량과 지연시간` | 유지. 성능 문제의 공통 언어 |
| `본질-회복탄력성` | 유지. 장애 전파/재시도/보상 처리와 연결 |
| `본질-옵저버빌리티` | 유지. 로그/메트릭/트레이싱 Problem과 연결 |
| `본질-참조 지역성` | 유지. 캐시, 인덱스, 페이지 구조와 연결 |
| `본질-트레이드오프` | 유지하되 너무 일반적이면 여러 Principle의 작성 기준으로 흡수 |

### 5.2 Concept에서 Principle로 흡수할 후보

| 기존 Concept | 흡수될 Principle 후보 |
|---|---|
| `개념-N+1 문제` + `개념-지연 로딩` | `본질-지연 로딩과 조회 폭발` |
| `개념-HikariCP` + `현상-커넥션 풀 고갈` | `본질-공유 자원 점유와 대기열` 또는 `본질-자원 경합` |
| `개념-Spring 트랜잭션 관리` + `개념-PlatformTransactionManager` | `본질-트랜잭션 경계` |
| `개념-Atomic UPDATE` + `개념-원자적 명령어` | `본질-원자적 상태 전이` |
| `개념-MVCC` + `현상-갱신 손실` | `본질-동시성 제어와 격리` |
| `개념-B-Tree` + `개념-Index Scan` + `개념-Bitmap Index Scan` + `개념-Seq Scan` | `본질-인덱스 선택도와 접근 경로` |
| `개념-Cache Stampede` + `개념-캐시 Evict Race Condition` | `본질-캐시 일관성과 경합` |
| `개념-구조화된 로그` + `개념-MDC` + `개념-분산 추적` | `본질-요청 흐름 추적 가능성` |
| `개념-Namespaces와 Cgroups` + `개념-하이퍼바이저` | `본질-환경 격리` |

### 5.3 삭제/Archive 후보

바로 삭제하지 말고 `98-Temp/renewal-archive-candidates.md` 같은 목록에 먼저 모은다.

```text
- 단축키/개인 환경 설정성 Case
- 특정 도구 사용법만 있는 Concept
- 알고리즘 기본 정의만 있고 실무 Problem과 연결이 약한 노트
- 이미 Principle의 한 문단으로 충분한 세부 옵션 노트
```

예상 후보:

```text
사례-IntelliJ 기본 단축키 정리
사례-IntelliJ 프로젝트 탐색기 줄간격 수정 방법
사례-macOS Caps Lock 한영 전환 지연 해결 및 입력 환경 최적화
사례-독거미(AULA) F65 macOS Tahoe 최적화 가이드
사례-맥북 M4 Pro 외장 모니터 인식 불량 해결
개념-버블 정렬
개념-삽입 정렬
개념-선택 정렬
```

단, 알고리즘 노트는 과제 테스트 대비 가치가 있으면 Problem/Implementation 카드용으로 재구성한다.

---

## 6. Phenomenon/Case/Heuristic 1차 Problem 병합 후보

### 6.1 트랜잭션/커넥션 풀 문제 묶음

파일럿 1순위 후보.

```text
현상-커넥션 풀 고갈
01-외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈됨
본질-트랜잭션 경계
판단기준-트랜잭션 범위 설계
개념-Spring 트랜잭션 관리
개념-HikariCP
```

생성할 Problem 후보:

```text
01-Problem/01-외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈됨.md
```

연결할 Principle 후보:

```text
02-Principle/본질-트랜잭션 경계.md
02-Principle/본질-공유 자원 점유와 대기열.md
```

### 6.2 동시성/중복 저장 문제 묶음

```text
현상-경쟁 조건
현상-갱신 손실
현상-ABA 문제
현상-잠금 경합
현상-교착 상태
사례-Allreva 차량 대절 동시성 문제 해결
사례-JPA Unique Key 중복 저장 방지
판단기준-동시성 제어 방법 선택 (Atomic UPDATE vs Lock)
본질-요청 멱등성과 중복 방어
```

생성할 Problem 후보:

```text
문제-동시 요청으로 동일 자원이 중복 생성됨
문제-동시 갱신으로 마지막 요청이 이전 변경을 덮어씀
문제-락 대기로 요청 지연 시간이 증가함
```

연결할 Principle 후보:

```text
본질-원자적 상태 전이
본질-동시성 제어와 격리
본질-자원 경합
본질-멱등성
```

### 6.3 JPA 조회/연관관계 문제 묶음

```text
개념-N+1 문제
개념-지연 로딩
현상-JPA 순환 참조
판단기준-JPA 연관관계 방향 선택
판단기준-SELECT 쿼리 설계
```

생성할 Problem 후보:

```text
문제-목록 조회 API에서 연관 데이터 접근으로 SQL이 폭증함
문제-양방향 연관관계 직렬화로 순환 참조가 발생함
```

연결할 Principle 후보:

```text
본질-지연 로딩과 조회 폭발
본질-연관 방향과 변경 경계
```

### 6.4 운영/관측 문제 묶음

```text
현상-멀티스레드 로그 혼재
개념-MDC
개념-구조화된 로그
개념-분산 추적
판단기준-GC Metric을 어떻게 해석할 것인가
판단기준-운영 환경 로그 레벨 및 보안 관리 전략
```

생성할 Problem 후보:

```text
문제-동시 요청 로그가 섞여 장애 원인을 추적하기 어려움
문제-GC 지표가 튀지만 실제 장애 원인을 판단하기 어려움
```

연결할 Principle 후보:

```text
본질-요청 흐름 추적 가능성
본질-옵저버빌리티
```

---

## 7. Knowledge Architect 변경 범위

현재 extension은 6-layer 구조를 강하게 가정한다.
리뉴얼 후 다음 파일을 수정해야 한다.

```text
.pi/knowledge-architect.json
.pi/extensions/knowledge-architect/rules.ts
.pi/extensions/knowledge-architect/note-guard.ts
.pi/extensions/knowledge-architect/types.ts
.pi/extensions/knowledge-architect/anki-tool.ts
README.md
AGENTS.md 또는 project-local rule 설명
```

변경 방향:

```text
NoteType:
  기존: Question | Phenomenon | Concept | Principle | Case | Heuristic
  변경: Problem | Principle | Question

Folder:
  01-Problem
  02-Principle
  03-Question

Prefix:
  Problem   → 문제-
  Principle → 본질-
  Question  → 탐구-

Anki:
  Keyword 카드는 Principle 기반으로 축소
  Scenario/CodeReview/Implementation 카드 타입 추가 검토
```

주의:

```text
- extension을 먼저 바꾸면 기존 노트 edit/write가 막힐 수 있다.
- 따라서 마이그레이션 기간에는 기존 6-layer와 새 3-layer를 동시에 허용하는 전환 모드가 필요하다.
```

---

## 8. 실행 순서

### Phase 0. 준비

```text
1. Git 상태 확인 및 백업 branch 생성
2. 새 폴더 01-Problem, 02-Principle, 03-Question 생성 여부 결정
3. 기존 폴더를 바로 rename할지, 새 폴더로 복사/이동할지 결정
4. extension 전환 모드 설계
```

권장: 처음에는 기존 폴더를 보존하고 새 폴더에 파일럿 노트를 만든다.

### Phase 1. 파일럿 묶음 1개 선정

1순위 파일럿:

```text
외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈되는 문제
```

이유:

```text
- Phenomenon, Case, Heuristic, Concept가 이미 모두 존재한다.
- 면접에서 자주 묻는 문제다.
- Problem/Principle 분리 효과가 명확하다.
- Anki Scenario 카드로 만들기 좋다.
```

파일럿 대상 파일:

```text
02-Phenomenon/현상-커넥션 풀 고갈 (Connection Pool Exhaustion).md
01-Problem/01-외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈됨.md
02-Principle/본질-트랜잭션 경계.md
06-Heuristic/판단기준-트랜잭션 범위 설계.md
03-Concept/개념-Spring 트랜잭션 관리 (Transaction Management).md
03-Concept/개념-HikariCP.md
04-Principle/본질-자원 경합 (Resource Contention).md
04-Principle/본질-처리량과 지연시간 (Throughput and Latency).md
```

생성 결과물:

```text
01-Problem/01-외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈됨.md
02-Principle/본질-트랜잭션 경계.md
02-Principle/본질-공유 자원 점유와 대기열.md
```

### Phase 2. 파일럿 검토

```text
1. 새 Problem 노트를 면접 질문처럼 읽어본다.
2. 기존 노트보다 더 빨리 답변 구조가 나오는지 확인한다.
3. Principle 노트가 너무 추상적이지 않은지 확인한다.
4. Anki Scenario 카드로 바로 변환 가능한지 확인한다.
```

### Phase 3. 배치 마이그레이션

파일럿이 만족스러우면 주제별로 묶어서 이동한다.

```text
Batch A: 트랜잭션/커넥션/외부 I/O
Batch B: 동시성/락/중복 저장
Batch C: JPA 조회/N+1/연관관계
Batch D: 인덱스/쿼리 실행 계획
Batch E: 캐시/정합성/경합
Batch F: 로그/메트릭/옵저버빌리티
Batch G: 인프라/격리/네트워크
```

---

## 9. 다음 액션

바로 실행할 다음 작업은 다음 중 하나다.

```text
A. 이 계획을 기준으로 새 폴더와 템플릿만 먼저 만든다.
B. 파일럿 대상 묶음으로 실제 Problem/Principle 노트 3개를 만든다.
C. extension을 먼저 전환 모드로 고쳐 새 3-layer를 허용한다.
```

권장 순서:

```text
1. A: 새 폴더와 템플릿 생성
2. B: 파일럿 노트 생성
3. 사용감 확인
4. C: extension rules/note-guard 전환 모드 적용
5. Batch 마이그레이션
```

---

## 10. 마이그레이션 진행 기록

### Batch 1. 트랜잭션/커넥션/외부 I/O

생성/정리 결과:

```text
CREATE 01-Problem/01-외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈됨.md
CREATE 02-Principle/본질-트랜잭션 경계.md
CREATE 02-Principle/본질-공유 자원 점유와 대기열.md
DELETE 05-Case/사례-@Transactional 안에 외부 API 호출로 커넥션 풀 고갈.md
DELETE 06-Heuristic/판단기준-트랜잭션 경계를 어디에 둘 것인가.md
```

핵심 판단:

```text
트랜잭션 안의 외부 I/O 문제는 개별 Concept보다 Problem 중심으로 정리하는 편이 면접 답변 구조가 빠르다.
```

### Batch 2. 중복 요청/멱등성

생성/정리 결과:

```text
CREATE 01-Problem/02-재시도와 동시 요청으로 주문이 중복 생성됨.md
CREATE 02-Principle/본질-요청 멱등성과 중복 방어.md
DELETE 06-Heuristic/판단기준-중복 저장 방지 방법 선택 (Unique Key vs Lock).md
```

핵심 판단:

```text
중복 생성 문제는 Unique Key, Idempotency Key, Lock을 따로 외우는 것보다 같은 요청의 동일성을 어떻게 판정할지로 묶는 편이 낫다.
```

### Batch 3. 동시 카운터 갱신/Lost Update

생성/이동/정리 결과:

```text
CREATE 01-Problem/03-동시 요청으로 재고나 예약 수량 갱신이 소실됨.md
CREATE 02-Principle/본질-원자적 상태 전이.md
CREATE 02-Principle/본질-동시성 제어와 격리.md
MOVE   01-Question/탐구-화면에서 보여준 인원 수와 실제 신청 시점의 불일치는 어떻게 처리해야 할까.md
    -> 03-Question/탐구-화면에서 보여준 인원 수와 실제 신청 시점의 불일치는 어떻게 처리해야 할까.md
DELETE 05-Case/사례-Allreva 차량 대절 동시성 문제 해결.md
DELETE 02-Phenomenon/현상-갱신 손실 (Lost Update).md
DELETE 03-Concept/개념-Atomic UPDATE.md
DELETE 06-Heuristic/판단기준-동시성 제어 방법 선택 (Atomic UPDATE vs Lock).md
```

핵심 판단:

```text
Allreva의 passenger_count 문제는 Lost Update 현상, Atomic UPDATE 개념, Atomic UPDATE vs Lock 판단기준을 따로 유지하기보다 하나의 Problem에서 재현 증거와 해결 판단을 보여주는 편이 좋다.
단순 카운터 증감은 원자적 상태 전이 Principle로, Atomic UPDATE/Optimistic Lock/Pessimistic Lock 선택은 동시성 제어와 격리 Principle로 분리했다.
```

### Batch 4. JPA 조회/N+1/연관관계

생성/정리 결과:

```text
CREATE 01-Problem/04-목록 조회 API에서 연관 데이터 접근으로 SQL이 폭증함.md
CREATE 01-Problem/05-양방향 연관관계 직렬화로 순환 참조가 발생함.md
CREATE 02-Principle/본질-지연 로딩과 조회 폭발.md
CREATE 02-Principle/본질-연관 방향과 변경 경계.md
DELETE 03-Concept/개념-N+1 문제 (N+1 Query Problem).md
DELETE 03-Concept/개념-지연 로딩 (Lazy Loading).md
DELETE 02-Phenomenon/현상-JPA 순환 참조 (Circular Reference).md
DELETE 06-Heuristic/판단기준-JPA 연관관계 방향 선택 (단방향 vs 양방향).md
DELETE 06-Heuristic/판단기준-SELECT 쿼리 설계.md
```

핵심 판단:

```text
JPA 조회 성능 문제는 Lazy Loading, N+1, Fetch Join 옵션을 따로 외우기보다 목록 조회 API에서 SQL 왕복이 왜 데이터 수만큼 늘어나는지 Problem으로 정리하는 편이 좋다.
양방향 연관관계 문제는 연관 탐색 편의와 외부 API 응답 경계를 분리하지 못해서 생기는 문제로 보고, DTO 경계와 연관 방향 판단을 Principle로 분리했다.
```

### Batch 5. 인덱스/쿼리 실행 계획

생성/정리 결과:

```text
CREATE 01-Problem/06-인덱스를 추가했는데도 조회 쿼리가 느림.md
CREATE 02-Principle/본질-인덱스 선택도와 접근 경로.md
CREATE 02-Principle/본질-논리 순서와 물리 접근 비용.md
DELETE 03-Concept/개념-B-Tree.md
DELETE 03-Concept/개념-Index Scan.md
DELETE 03-Concept/개념-Bitmap Index Scan.md
DELETE 03-Concept/개념-Seq Scan.md
DELETE 03-Concept/개념-EXPLAIN ANALYZE.md
DELETE 03-Concept/개념-Filter와 Index Cond.md
DELETE 03-Concept/개념-Buffers shared hit와 shared read.md
DELETE 06-Heuristic/판단기준-Scan 방식 선택 (Seq vs Index vs Bitmap).md
DELETE 04-Principle/본질-논리 순서와 물리 순서는 다르다.md
```

핵심 판단:

```text
인덱스 성능 문제는 B-Tree, Seq Scan, Index Scan, Bitmap Scan을 각각 외우기보다 인덱스를 추가했는데도 왜 느린지라는 Problem으로 묶는 편이 실무 진단에 가깝다.
핵심 Principle은 인덱스 존재 여부가 아니라 선택도와 접근 경로이며, SQL의 논리 조건과 DB의 물리 page 접근 비용을 분리해서 읽어야 한다.
```

### Batch 6. 캐시/정합성/경합

생성/정리 결과:

```text
CREATE 01-Problem/07-DB 업데이트 후 캐시에 오래된 값이 다시 저장됨.md
CREATE 01-Problem/08-캐시 만료 순간 같은 DB 조회가 동시에 몰림.md
CREATE 01-Problem/09-동적 검색 조건을 캐시해도 적중률이 오르지 않음.md
CREATE 02-Principle/본질-캐시 일관성과 경합.md
CREATE 02-Principle/본질-캐시 키 공간과 참조 지역성.md
DELETE 03-Concept/개념-Cache Stampede.md
DELETE 03-Concept/개념-캐시 Evict Race Condition.md
DELETE 03-Concept/개념-로컬 캐시 (Local Cache).md
DELETE 03-Concept/개념-TransactionAwareCacheManagerProxy.md
DELETE 02-Phenomenon/현상-캐시 키 공간 폭발 (Cache Key Space Explosion).md
DELETE 06-Heuristic/판단기준-캐시 가능 쿼리 유형 선별.md
DELETE 06-Heuristic/판단기준-캐시 적용 레이어 선택.md
DELETE 06-Heuristic/판단기준-캐시 쓰기 전략 선택.md
```

핵심 판단:

```text
캐시는 단순한 성능 최적화가 아니라 DB commit 타이밍, cache miss 동시성, key 공간의 반복 접근성까지 함께 설계해야 하는 읽기 복제본이다.
이번 배치에서는 Redis 자체, 캐시 교체 정책, Rate Limiting은 남기고, 캐시 무효화/동시 miss/키 공간 폭발 문제만 Problem 중심으로 흡수했다.
```

### Batch 7. 로그/메트릭/옵저버빌리티

생성/정리 결과:

```text
CREATE 01-Problem/10-동시 요청 로그가 섞여 장애 원인을 추적하기 어려움.md
CREATE 01-Problem/11-대시보드 알람은 울렸지만 실제 병목 지점을 찾기 어려움.md
CREATE 02-Principle/본질-요청 흐름 추적 가능성.md
CREATE 02-Principle/본질-관측 신호의 상관관계.md
DELETE 02-Phenomenon/현상-멀티스레드 로그 혼재 (Log Interleaving).md
DELETE 03-Concept/개념-MDC (Mapped Diagnostic Context).md
DELETE 03-Concept/개념-구조화된 로그 (Structured Logging).md
DELETE 03-Concept/개념-분산 추적 (Distributed Tracing).md
DELETE 03-Concept/개념-JVM Heap Metric.md
DELETE 03-Concept/개념-G1 Evacuation Pause.md
DELETE 06-Heuristic/판단기준-GC Metric을 어떻게 해석할 것인가.md
DELETE 06-Heuristic/판단기준-운영 환경 로그 레벨 및 보안 관리 전략.md
DELETE 04-Principle/본질-옵저버빌리티 (Observability).md
```

핵심 판단:

```text
운영 장애 분석은 MDC, 구조화 로그, 분산 추적, 메트릭 도구를 따로 외우는 것보다 요청 흐름을 재구성할 수 있는가와 관측 신호를 같은 시간축/서비스/traceId로 연결할 수 있는가로 묶는 편이 좋다.
이번 배치에서는 Prometheus, Loki, Grafana 제품 비교 세부 노트는 남기고, 요청 추적과 관측 신호 상관관계만 Problem/Principle로 흡수했다.
```

### Batch 8. 운영 모니터링 스택 선택

생성/이동/정리 결과:

```text
CREATE 01-Problem/12-운영 모니터링 스택을 골랐지만 로그 검색과 메트릭 요구가 맞지 않음.md
CREATE 02-Principle/본질-관측 데이터 모델과 저장 비용.md
MOVE   01-Question/탐구-grafana, prometheus, loki를 왜 선택하는가.md
    -> 03-Question/탐구-grafana, prometheus, loki를 왜 선택하는가.md
DELETE 03-Concept/개념-Prometheus.md
DELETE 03-Concept/개념-Grafana.md
DELETE 03-Concept/개념-Loki.md
DELETE 03-Concept/개념-Loki의 저장 구조.md
DELETE 03-Concept/개념-label 기반 로그 검색.md
DELETE 03-Concept/개념-로그 시스템 선택의 트레이드오프.md
DELETE 03-Concept/개념-metrics 시스템 선택의 트레이드오프.md
DELETE 03-Concept/개념-시계열 메트릭 저장소 (TSDB).md
DELETE 03-Concept/개념-pull 모델과 push 모델.md
DELETE 03-Concept/개념-ELK 스택 (Elasticsearch, Logstash, Kibana).md
DELETE 06-Heuristic/판단기준-Prometheus + Grafana + Loki와 ELK 중 무엇을 선택할 것인가.md
DELETE 06-Heuristic/판단기준-Prometheus 대신 다른 metrics 시스템을 고려해야 하는 경우.md
```

핵심 판단:

```text
Prometheus, Loki, Grafana, ELK는 도구 이름으로 외우기보다 metrics/logs/view가 어떤 데이터 모델과 저장 비용을 갖는지로 판단하는 편이 낫다.
운영 스택 선택은 제품 비교가 아니라 장애 대응에서 자주 던지는 질문이 수치 알람인지, 로그 전문 검색인지, 장기 보관/전역 집계인지 구분하는 문제다.
```

### Batch 9. Docker/VM 격리와 자원 경계

생성/이동/정리 결과:

```text
CREATE 01-Problem/13-Docker와 VM 격리 수준을 구분하지 못해 워크로드 배치가 불안정함.md
CREATE 02-Principle/본질-격리 강도와 자원 경계.md
CREATE 02-Principle/본질-폭발 반경과 격벽.md
MOVE   01-Question/탐구-Docker는 왜 VM이 아닌 단순한 프로세스인가.md
    -> 03-Question/탐구-Docker는 왜 VM이 아닌 단순한 프로세스인가.md
MOVE   01-Question/탐구-인프라의 핵심인 격리 관점에서 Docker와 VM을 어떻게 조화롭게 사용할까.md
    -> 03-Question/탐구-인프라의 핵심인 격리 관점에서 Docker와 VM을 어떻게 조화롭게 사용할까.md
MOVE   01-Question/탐구-왜 DB 단에는 Docker 컨테이너를 지양하는가.md
    -> 03-Question/탐구-왜 DB 단에는 Docker 컨테이너를 지양하는가.md
MOVE   01-Question/탐구-왜 서버를 목적별 혹은 다양한 기준으로 VM 분류를 할까.md
    -> 03-Question/탐구-왜 서버를 목적별 혹은 다양한 기준으로 VM 분류를 할까.md
DELETE 03-Concept/개념-Namespaces와 Cgroups.md
DELETE 03-Concept/개념-하이퍼바이저 (Hypervisor).md
DELETE 04-Principle/본질-환경 격리 (Environment Isolation).md
DELETE 02-Phenomenon/현상-Noisy Neighbor.md
```

핵심 판단:

```text
Docker와 VM은 같은 격리 도구가 아니라 격리 강도와 비용이 다른 계층이다.
컨테이너는 빠른 배포와 의존성 격리에 강하지만 kernel과 물리 자원을 공유하므로, DB·보안 민감 워크로드·자원 폭주 위험이 큰 작업은 VM/managed service 같은 더 강한 경계를 검토해야 한다.
이번 배치에서는 네트워크 격리(NAT, 브릿지, Cloudflare Tunnel)는 다음 배치로 남기고, Docker/VM/Noisy Neighbor만 흡수했다.
```

### Batch 10. 네트워크 격리/NAT/터널

생성/이동/정리 결과:

```text
CREATE 01-Problem/14-DNAT 설정 후에도 VM 서비스에 외부 접속이 되지 않음.md
CREATE 01-Problem/15-Cloudflare Tunnel 환경에서 fail2ban으로 공격자 IP를 차단하지 못함.md
CREATE 02-Principle/본질-주소 변환과 경로 결정의 분리.md
CREATE 02-Principle/본질-네트워크 경계와 노출면.md
MOVE   01-Question/탐구-Cloudflare Tunnel은 어떻게 포트 개방 없이 외부 접속을 가능하게 하는가.md
    -> 03-Question/탐구-Cloudflare Tunnel은 어떻게 포트 개방 없이 외부 접속을 가능하게 하는가.md
MOVE   01-Question/탐구-VPC 격리 환경에서 WAS는 어떻게 외부 API와 통신하는가.md
    -> 03-Question/탐구-VPC 격리 환경에서 WAS는 어떻게 외부 API와 통신하는가.md
MOVE   01-Question/탐구-NAT 테이블과 라우팅 테이블은 어떻게 다른가.md
    -> 03-Question/탐구-NAT 테이블과 라우팅 테이블은 어떻게 다른가.md
MOVE   01-Question/탐구-FORWARD chain과 INPUT chain은 왜 별도로 존재하는가.md
    -> 03-Question/탐구-FORWARD chain과 INPUT chain은 왜 별도로 존재하는가.md
DELETE 03-Concept/개념-DNAT과 SNAT.md
DELETE 03-Concept/개념-Netfilter와 iptables.md
DELETE 03-Concept/개념-라우팅 테이블 (Routing Table).md
DELETE 03-Concept/개념-NAT Gateway.md
DELETE 03-Concept/개념-리눅스 브릿지 (Linux Bridge).md
DELETE 03-Concept/개념-가상 네트워크 (Virtual Network).md
DELETE 03-Concept/개념-아웃바운드 터널링 (Outbound Tunneling).md
DELETE 02-Phenomenon/현상-Cloudflare Tunnel 환경에서 클라이언트 IP 마스킹.md
DELETE 05-Case/사례-DNAT 후 FORWARD chain에서 패킷 차단.md
DELETE 05-Case/사례-리눅스 브릿지 수동 설정 실패와 libvirt NAT 전환.md
DELETE 05-Case/사례-stag 서버 env 탈취 시도 및 Cloudflare WAF 적용.md
DELETE 06-Heuristic/판단기준-Cloudflare Tunnel 환경에서 IP 차단 방법 선택.md
```

핵심 판단:

```text
NAT, routing, FORWARD chain은 모두 같은 '네트워크 설정'처럼 보이지만 실제로는 주소 변환, 경로 결정, 통과 허용이라는 서로 다른 단계다.
Cloudflare Tunnel은 인바운드 포트를 열지 않는 대신 클라이언트 식별과 차단 위치가 Cloudflare/WAF/L7 계층으로 이동하므로, fail2ban+iptables 같은 L3/L4 차단 전략과 맞지 않는다.
```

### Batch 11. Spring 트랜잭션/AOP/Application Service

생성/이동/정리 결과:

```text
CREATE 01-Problem/16-같은 클래스 내부 호출로 트랜잭션이나 캐시가 적용되지 않음.md
CREATE 01-Problem/17-save 호출을 try-catch로 감쌌는데 DB 제약 예외를 잡지 못함.md
CREATE 02-Principle/본질-프록시 기반 실행 경계.md
CREATE 02-Principle/본질-스레드 바인딩 트랜잭션 문맥.md
CREATE 02-Principle/본질-유스케이스 조립과 트랜잭션 경계.md
MOVE   01-Question/탐구-Transactional은 왜 RuntimeException에만 롤백할까.md
    -> 03-Question/탐구-Transactional은 왜 RuntimeException에만 롤백할까.md
MOVE   01-Question/탐구-트랜잭션 범위가 길어지면 왜 서비스 장애로 이어지는가.md
    -> 03-Question/탐구-트랜잭션 범위가 길어지면 왜 서비스 장애로 이어지는가.md
DELETE 03-Concept/개념-Spring 트랜잭션 관리 (Transaction Management).md
DELETE 03-Concept/개념-PlatformTransactionManager.md
DELETE 03-Concept/개념-TransactionSynchronizationManager.md
DELETE 02-Phenomenon/현상-AOP Self-Invocation 문제.md
DELETE 03-Concept/개념-Application Service.md
DELETE 03-Concept/개념-EntityManager의 주입 방식과 AOP의 관계.md
DELETE 03-Concept/개념-JPA EntityManager.md
DELETE 03-Concept/개념-JPA Flush 타이밍.md
DELETE 06-Heuristic/판단기준-트랜잭션 범위 설계.md
```

흡수 범위:

```text
- Spring AOP proxy 기반 @Transactional/@Cacheable/@Async 적용 조건
- self-invocation으로 proxy advice가 적용되지 않는 문제
- PlatformTransactionManager의 transaction strategy 역할
- TransactionSynchronizationManager의 thread-bound resource 관리
- @PersistenceContext EntityManager shared proxy와 실제 EntityManager 위임 구조
- JPA flush/commit 시점 차이로 DB 제약 예외가 try-catch 밖에서 터지는 문제
- Application Service가 usecase 흐름과 transaction boundary를 조립하는 역할
```

공식 근거:

```text
Spring AOP is proxy-based.
self invocation ... will bypass the advice.
The key to the Spring transaction abstraction is the notion of a transaction strategy.
Central delegate that manages resources and transaction synchronizations per thread.
The injected JPA EntityManager ... delegates all calls to the current transactional EntityManager.
Checked exceptions ... do not result in a rollback in the default configuration.
```

핵심 판단:

```text
Spring 트랜잭션은 @Transactional이라는 어노테이션 자체보다 proxy를 통과하는 실행 경계와 현재 thread에 묶인 transaction resource 문맥으로 이해하는 편이 실무 장애 재현에 가깝다.
Application Service는 단순 service 클래스명이 아니라 요청 하나의 흐름, transaction boundary, flush/commit 예외 처리, event 발행 순서를 조립하는 계층으로 정리했다.
외부 I/O로 인한 connection pool 고갈 문제는 Batch 1에서 이미 처리했으므로, 이번 Batch 11에서는 self-invocation, thread-bound transaction context, JPA flush 예외 위치 문제만 별도 Problem으로 분리했다.
```

### Batch 12. Java 동시성 / 락 / 메모리 가시성

생성/이동/정리 결과:

```text
CREATE 01-Problem/18-ConcurrentHashMap을 써도 중복 생성이나 덮어쓰기가 발생함.md
CREATE 01-Problem/19-락을 걸었는데 처리량이 급락하거나 요청이 멈춤.md
CREATE 02-Principle/본질-공유 가변 상태와 원자 경계.md
CREATE 02-Principle/본질-가시성과 happens-before.md
CREATE 02-Principle/본질-임계 구역과 활동성.md
MOVE   01-Question/탐구-경쟁 상태 해결을 위한 3대 조건은 무엇인가.md
    -> 03-Question/탐구-경쟁 상태 해결을 위한 3대 조건은 무엇인가.md
MOVE   01-Question/탐구-뮤텍스 락의 내부 동작과 하드웨어 추상화.md
    -> 03-Question/탐구-뮤텍스 락의 내부 동작과 하드웨어 추상화.md
MOVE   01-Question/탐구-동시성 해결 패턴은 왜 계층을 초월하여 반복되는가.md
    -> 03-Question/탐구-동시성 해결 패턴은 왜 계층을 초월하여 반복되는가.md
MOVE   01-Question/탐구-동시성_경쟁조건_정합성의_차이와_상관관계는_무엇일까.md
    -> 03-Question/탐구-동시성_경쟁조건_정합성의_차이와_상관관계는_무엇일까.md
DELETE 02-Phenomenon/현상-경쟁 조건.md
DELETE 02-Phenomenon/현상-잠금 경합 (Lock Contention).md
DELETE 02-Phenomenon/현상-교착 상태.md
DELETE 02-Phenomenon/현상-ABA 문제 (ABA Problem).md
DELETE 02-Phenomenon/현상-명령어 재배치 (Instruction Reordering).md
DELETE 03-Concept/개념-임계 구역 (Critical Section).md
DELETE 03-Concept/개념-뮤텍스 (Mutex).md
DELETE 03-Concept/개념-세마포어 (Semaphore).md
DELETE 03-Concept/개념-원자적 명령어 (TAS, CAS).md
DELETE 03-Concept/개념-메모리 배리어 (Memory Barrier).md
DELETE 03-Concept/개념-스레드 안전성 (Thread Safety).md
DELETE 03-Concept/개념-Java 컬렉션의 스레드 안전성 보장 방식.md
DELETE 04-Principle/본질-임계 구역 해결의 3대 조건.md
DELETE 06-Heuristic/판단기준-동시성 이상 현상 분류 체계.md
```

흡수 범위:

```text
- 공유 가변 상태에서 Read-Modify-Write, Check-then-Act가 깨지는 구조
- ConcurrentHashMap 같은 thread-safe collection과 복합 비즈니스 원자성의 차이
- CAS/Atomic 연산의 의미와 ABA처럼 값의 이력을 놓치는 한계
- 명령어 재배치, 메모리 배리어, Java Memory Model의 happens-before 관계
- synchronized/ReentrantLock/Mutex/Semaphore/Critical Section의 공통 목적
- lock contention, deadlock, starvation 같은 liveness 문제
- 임계 구역 해결의 3대 조건: mutual exclusion, progress, bounded waiting
```

공식 근거:

```text
Threads communicate primarily by sharing access to fields and the objects reference fields refer to.
An unlock on a monitor happens-before every subsequent lock on that monitor.
Returns a synchronized (thread-safe) collection backed by the specified collection.
It is imperative that the user manually synchronize on the returned collection when traversing it.
A hash table supporting full concurrency of retrievals and high expected concurrency for updates.
The entire method invocation is performed atomically.
A reentrant mutual exclusion Lock with the same basic behavior and semantics as the implicit monitor lock.
```

핵심 판단:

```text
이번 배치는 동시성을 '도구 이름'이 아니라 문제 형태로 재구성했다.
ConcurrentHashMap, Atomic, CAS, synchronized 같은 개념은 각각 별도 암기 대상이 아니라 공유 가변 상태의 원자 경계를 어디에 둘 것인가라는 판단으로 흡수했다.
락은 safety를 해결하지만 liveness를 악화시킬 수 있으므로, 교착 상태와 잠금 경합은 별도 Problem으로 분리했다.
JVM/CPU 메모리 가시성 문제는 일반적인 값 최신성 문제가 아니라 happens-before 경계가 없는 관찰 순서 문제로 정리했다.
DB 동시성 문제는 기존 [[03-동시 요청으로 재고나 예약 수량 갱신이 소실됨]] 및 [[본질-동시성 제어와 격리]]와 연결하고, 이번 Batch 12는 application/runtime thread-level 동시성에 집중했다.
```

### Batch 13. SQL 실행계획 / JOIN / 서브쿼리 / GROUP BY

생성/정리 결과:

```text
CREATE 01-Problem/20-JOIN 쿼리가 데이터가 늘자 갑자기 느려짐.md
CREATE 01-Problem/21-상관 서브쿼리가 행마다 반복 실행되어 조회가 느림.md
CREATE 01-Problem/22-GROUP BY 후 비집계 컬럼을 조회하자 오류가 발생함.md
CREATE 02-Principle/본질-비용 기반 실행계획과 조인 전략.md
CREATE 02-Principle/본질-서브쿼리 변환과 반복 실행 경계.md
CREATE 02-Principle/본질-집계 단위와 함수 종속.md
DELETE 03-Concept/개념-Nested Loop Join.md
DELETE 03-Concept/개념-Hash Join.md
DELETE 03-Concept/개념-Merge Join.md
DELETE 06-Heuristic/판단기준-JOIN 전략 선택 (Nested Loop vs Hash vs Merge).md
DELETE 03-Concept/개념-Semi Join과 Anti Join.md
DELETE 03-Concept/개념-InitPlan과 SubPlan.md
DELETE 03-Concept/개념-서브쿼리 실행 계획.md
DELETE 03-Concept/개념-GROUP BY와 함수 종속.md
DELETE 03-Concept/개념-SQL 집계함수 (Aggregate Function).md
```

이번 배치에서 제외한 다음 후보:

```text
- 03-Concept/개념-MVCC (PostgreSQL).md
- 03-Concept/개념-PostgreSQL CREATE INDEX CONCURRENTLY.md
- 03-Concept/개념-JDBC Fetch Size.md
- 03-Concept/개념-PostgreSQL 테이블 잠금 모드 (Table Lock Modes).md
- 03-Concept/개념-Lock 범위 (Row Lock vs Table Lock).md
```

흡수 범위:

```text
- Nested Loop / Hash Join / Merge Join을 JOIN 종류가 아니라 물리 실행 전략으로 재구성
- JOIN 전략 선택 기준: outer cardinality, inner index, build memory, sort cost, LEFT JOIN 제약
- 서브쿼리 실행계획: InitPlan, SubPlan, Semi Join, Anti Join
- 상관 서브쿼리의 SubPlan loops 증가가 N+1과 비슷한 병목을 만드는 구조
- EXISTS/IN/NOT EXISTS가 존재성 검사 join으로 변환될 수 있다는 점
- GROUP BY 이후 비집계 컬럼의 결정성과 함수 종속
- PostgreSQL 42803 오류를 문법 문제가 아니라 집계 단위 불일치로 해석
```

공식 근거:

```text
A given SQL query ... can be actually executed in a wide variety of different ways.
ultimately selecting the execution plan that is expected to run the fastest.
Some query plans involve subplans, which arise from sub-SELECTs in the original query.
Such queries can sometimes be transformed into ordinary join plans.
The subquery is evaluated to determine whether it returns any rows.
When GROUP BY is present ... it is not valid for the SELECT list expressions to refer to ungrouped columns except within aggregate functions or when the ungrouped column is functionally dependent on the grouped columns.
A functional dependency exists if the grouped columns ... are the primary key of the table containing the ungrouped column.
```

핵심 판단:

```text
Batch 5에서 인덱스/Scan 방식은 '인덱스를 추가했는데도 느림' 문제로 흡수했다.
이번 Batch 13은 그 다음 단계인 JOIN과 subquery, aggregation 문제를 별도 실무 Problem으로 분리했다.
JOIN은 Nested Loop/Hash/Merge 이름을 외우는 것이 아니라 현재 입력 크기와 접근 경로에서 어떤 물리 전략이 싸게 먹히는가를 판단하는 문제로 정리했다.
서브쿼리는 SQL 괄호 순서가 아니라 planner가 InitPlan/SubPlan/Semi Join/Anti Join 중 어떤 실행 형태로 바꾸는지를 보는 문제로 정리했다.
GROUP BY는 '컬럼을 GROUP BY에 넣어라'가 아니라 결과 row의 집계 단위 안에서 값이 하나로 결정되는지를 검증하는 문제로 정리했다.
```

### Batch 14. PostgreSQL 운영 동시성 / MVCC / Online DDL / 대량 조회 전송

생성/이동/정리 결과:

```text
CREATE 01-Problem/23-운영 중 인덱스 추가로 쓰기 요청이 막히거나 마이그레이션이 멈춤.md
CREATE 01-Problem/24-장기 트랜잭션 때문에 테이블이 부풀고 VACUUM이 정리하지 못함.md
CREATE 01-Problem/25-대량 조회 API가 DB보다 애플리케이션 전송 구간에서 느림.md
CREATE 02-Principle/본질-잠금 모드와 충돌 매트릭스.md
CREATE 02-Principle/본질-버전 가시성과 청소 비용.md
CREATE 02-Principle/본질-전송 배치 크기와 메모리 압력.md
MOVE   01-Question/탐구-운영 환경에서 CREATE INDEX CONCURRENTLY는 왜 무한 대기에 빠지는가.md
    -> 03-Question/탐구-운영 환경에서 CREATE INDEX CONCURRENTLY는 왜 무한 대기에 빠지는가.md
DELETE 03-Concept/개념-MVCC (PostgreSQL).md
DELETE 03-Concept/개념-PostgreSQL CREATE INDEX CONCURRENTLY.md
DELETE 03-Concept/개념-JDBC Fetch Size.md
DELETE 03-Concept/개념-PostgreSQL 테이블 잠금 모드 (Table Lock Modes).md
DELETE 03-Concept/개념-Lock 범위 (Row Lock vs Table Lock).md
DELETE 05-Case/사례-WHERE절 없는 UPDATE로 게임 서버 전체 접속 끊김.md
```

흡수 범위:

```text
- PostgreSQL MVCC: row version, xmin/xmax, snapshot visibility, UPDATE가 old/new version을 만드는 구조
- 장기 트랜잭션이 old snapshot을 잡아 VACUUM cleanup을 막는 구조
- PostgreSQL lock mode와 conflict matrix: AccessShare, RowExclusive, ShareUpdateExclusive, AccessExclusive 등
- WHERE 없는 UPDATE가 row lock을 광범위하게 잡아 사실상 table-wide write contention을 만드는 장애 경로
- 일반 CREATE INDEX와 CREATE INDEX CONCURRENTLY의 운영 잠금 차이
- CONCURRENTLY의 two-pass build, 기존 트랜잭션 대기, INVALID index 정리 필요성
- Flyway 조합에서 executeInTransaction=false만으로 부족하고 transactional-lock=false가 필요한 상황
- JDBC fetch size: DB 실행과 DB→Application 전송 구간 분리, cursor fetch 조건, autocommit=false 조건
```

공식 근거:

```text
each SQL statement sees a snapshot of data (a database version) as it was some time ago.
The identity (transaction ID) of the inserting transaction for this row version.
The identity (transaction ID) of the deleting transaction, or zero for an undeleted row version.
most PostgreSQL commands automatically acquire locks of appropriate modes.
Only an ACCESS EXCLUSIVE lock blocks a SELECT.
an index build can lock out writers for periods that are unacceptably long for a production system.
since it allows normal operations to continue while the index is built.
Changing the code to use cursor mode is as simple as setting the fetch size of the Statement to the appropriate size.
Setting the fetch size back to 0 will cause all rows to be cached (the default behaviour).
The Connection must not be in autocommit mode.
```

핵심 판단:

```text
이번 Batch 14는 DB 내부 실행계획이 아니라 운영 중 DB 자원 경계 문제로 묶었다.
MVCC는 단순 격리 기술이 아니라 snapshot별 가시성을 보장하는 대신 old version cleanup 비용을 만드는 구조로 정리했다.
PostgreSQL lock은 Row/Table이라는 이름보다 lock mode와 conflict matrix 기준으로 판단해야 하므로 별도 Principle로 분리했다.
CREATE INDEX CONCURRENTLY는 '무중단 인덱스'가 아니라 writer block을 줄이는 대신 더 긴 시간, 두 번 스캔, 트랜잭션 대기, 실패 후 INVALID 정리 절차를 요구하는 운영 전략으로 정리했다.
JDBC Fetch Size는 SQL plan 문제가 아니라 DB가 찾은 row를 애플리케이션까지 어떤 배치 크기로 옮길지의 전송/메모리 트레이드오프 문제로 분리했다.
```

### Batch 15. 도메인 / 아키텍처 / API 변경 경계

생성/이동/정리 결과:

```text
CREATE 01-Problem/26-Service 코드가 조회 저장 예외 처리와 도메인 규칙으로 비대해짐.md
CREATE 01-Problem/27-도메인 코드에 DB Redis FCM 같은 기술 이름이 새어 나옴.md
CREATE 01-Problem/28-같은 데이터를 다룬다는 이유로 고객 API와 관리자 API를 합쳐 변경이 꼬임.md
CREATE 02-Principle/본질-유스케이스 흐름과 도메인 책임 분리.md
CREATE 02-Principle/본질-의존성 방향과 기술 격리.md
CREATE 02-Principle/본질-변경 이유와 경계.md
MOVE   01-Question/탐구-왜 Entity는 Repository를 의존하면 안 되는가.md
    -> 03-Question/탐구-왜 Entity는 Repository를 의존하면 안 되는가.md
DELETE 03-Concept/개념-Repository 패턴.md
DELETE 03-Concept/개념-Domain Service와 Policy.md
DELETE 03-Concept/개념-Implementation 계층.md
DELETE 03-Concept/개념-포트와 어댑터 (Port and Adapter).md
DELETE 06-Heuristic/판단기준-Application Domain Implementation 경계.md
DELETE 06-Heuristic/판단기준-기술 로직과 비즈니스 로직을 어떻게 구분할 것인가.md
DELETE 06-Heuristic/판단기준-API 경계는 데이터가 아니라 변경 이유로 나눈다.md
DELETE 06-Heuristic/판단기준-변경 경계는 데이터가 아니라 변경 이유로 나눈다.md
DELETE 06-Heuristic/판단기준-UI 조회 API는 변경 가능성 기준으로 분리한다.md
DELETE 06-Heuristic/판단기준-데이터 참조와 도메인 의존 구분.md
```

흡수 범위:

```text
- Application Service / Domain / Implementation Actor 책임 구분
- Repository 패턴과 Entity가 저장소를 직접 알면 안 되는 이유
- Domain Service/Policy가 여러 aggregate를 보는 순수 업무 규칙을 맡는 기준
- Port and Adapter로 외부 기술 의존을 core 밖으로 밀어내는 기준
- 기술 로직과 비즈니스 로직 구분: vendor/protocol/SDK 변경 vs 제품 정책 변경
- API 경계와 변경 경계: 같은 데이터가 아니라 같은 행위자·변경 이유 기준으로 분리
- UI 조회 API 분리 기준: 화면 모양보다 포함 개념의 변경 가능성과 client 결합도
- 데이터 참조와 도메인 의존 구분: id/type/enum 참조와 객체 정책 호출의 차이
```

공식/신뢰 근거:

```text
A Transaction Script organizes all this logic primarily as a single procedure.
The domain layer should not talk to external systems - the service layer should do that.
Business layer only uses abstractions of technological services.
Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.
The Single Responsibility Principle (SRP) states that each software module should have one and only one reason to change.
X is coupled to Y if a change to Y can potentially require a change in X.
```

핵심 판단:

```text
이번 Batch 15는 도구/패턴 이름을 외우는 방식이 아니라 Service가 비대해지는 실무 문제, core에 기술 이름이 새는 문제, API 경계를 데이터 기준으로 잘못 나누는 문제로 재구성했다.
Application Service는 usecase 흐름과 transaction/event 순서를 드러내고, Domain/Policy는 업무 규칙과 불변식을 담당하며, Implementation Actor는 조회·저장·not found 처리 같은 준비 행위를 맡는 것으로 정리했다.
Port/Adapter와 Repository는 추상화 자체가 목적이 아니라 기술 변경이 core 규칙으로 전파되지 않게 하는 의존성 방향 제어로 정리했다.
API/DTO/Service 경계는 같은 데이터를 다루는지가 아니라 같은 이유로 바뀌는지를 기준으로 나누는 원칙으로 흡수했다.
```

### Batch 16. Redis / 캐시 교체 정책 / Rate Limiting

생성/정리 결과:

```text
CREATE 01-Problem/29-Redis 메모리 한도에 도달하자 중요 키가 사라지거나 쓰기가 실패함.md
CREATE 01-Problem/30-API Rate Limit을 걸었는데 정상 사용자의 순간 요청까지 막힘.md
CREATE 02-Principle/본질-메모리 한계와 제거 정책.md
CREATE 02-Principle/본질-부하 평탄화와 버스트 허용.md
DELETE 03-Concept/개념-Redis (Remote Dictionary Server).md
DELETE 03-Concept/개념-캐시 교체 정책 (Cache Eviction Policy).md
DELETE 03-Concept/개념-LRU (Least Recently Used).md
DELETE 03-Concept/개념-LFU (Least Frequently Used).md
DELETE 03-Concept/개념-Clock (Second Chance).md
DELETE 03-Concept/개념-Token Bucket (토큰 버킷).md
DELETE 03-Concept/개념-Leaky Bucket (누수 버킷).md
DELETE 06-Heuristic/판단기준-Token Bucket vs Leaky Bucket 선택.md
```

이번 배치에서 제외한 다음 후보:

```text
- 03-Concept/개념-Sliding Window.md
  → TCP/QUIC 흐름 제어 및 네트워크 신뢰성 배치로 분리 예정
- 06-Heuristic/판단기준-페이지 교체 알고리즘 선택.md
  → OS/메모리 관리 배치에서 별도 처리 예정
```

흡수 범위:

```text
- Redis를 빠른 저장소 하나가 아니라 cache/session/lock/rate-limit counter 등 서로 다른 생존 조건을 가진 key space로 해석
- maxmemory 도달 시 noeviction/allkeys/volatile 정책 차이
- LRU/LFU/Clock/approximate LRU를 캐시 교체 알고리즘 이름이 아니라 메모리 한계에서 무엇을 버릴지의 기준으로 흡수
- Redis 중요 키와 캐시 키를 같은 eviction policy에 맡길 때 생기는 장애 반경
- Token Bucket과 Leaky Bucket을 평균 rate와 burst allowance, queueing/drop 정책의 차이로 정리
- Redis + INCR/EXPIRE/Lua 기반 분산 rate limiting의 필요성
```

공식/신뢰 근거:

```text
When the memory limit is reached Redis will try to remove keys according to the eviction policy selected.
Redis will start evicting keys according to the policy that is configured.
Building a rate limiter with Redis is easy because of two commands INCR and EXPIRE.
The following guides show how to build a token bucket rate limiter with Redis and Lua scripts.
The ngx_http_limit_req_module module ... is used to limit the request processing rate per a defined key.
```

핵심 판단:

```text
Batch 6에서 캐시 무효화, stampede, key space explosion은 이미 Problem 중심으로 흡수했다.
이번 Batch 16은 남아 있던 Redis 자체, eviction policy, rate limiting 알고리즘을 운영 문제 중심으로 정리했다.
Redis는 자료구조 서버이지만 실무 장애는 대개 자료구조 이름이 아니라 key 생존 조건, 메모리 한계, eviction 영향 범위에서 발생한다.
Rate Limit은 초당 요청 수 하나가 아니라 평균 처리율, burst 크기, 초과 요청 처리 방식, 분산 카운터 원자성의 조합으로 정리했다.
```

### Batch 17. 네트워크 신뢰성 / 흐름 제어 / HTTP 연결·라우팅 계층

생성/정리 결과:

```text
CREATE 01-Problem/31-요청마다 새 TCP 연결을 만들어 응답 지연과 연결 비용이 커짐.md
CREATE 01-Problem/32-같은 IP의 여러 도메인을 L4 설정만으로 분기하려다 실패함.md
CREATE 02-Principle/본질-연결 재사용과 계층 비용.md
CREATE 02-Principle/본질-계층별 관찰 가능 정보.md
DELETE 03-Concept/개념-ARQ (오류 제어).md
DELETE 03-Concept/개념-Sliding Window.md
DELETE 03-Concept/개념-HTTP Keep-Alive.md
DELETE 03-Concept/개념-HTTP Host 헤더.md
DELETE 06-Heuristic/판단기준-L3L4 vs L7 라우팅.md
```

이번 배치에서 제외한 다음 후보:

```text
- 03-Concept/개념-OSI Layer별 보안 공격과 방어.md
  → 보안/공격 방어 배치로 분리 예정
```

흡수 범위:

```text
- HTTP Keep-Alive를 요청별 TCP handshake 비용을 줄이는 연결 재사용 문제로 흡수
- ARQ, Sliding Window, SACK을 신뢰성/처리량을 위해 ACK 대기와 재전송 범위를 조절하는 전송 계층 원리로 흡수
- Host Header를 같은 IP:Port 위에서 도메인을 식별하는 L7 정보로 정리
- L3/L4 vs L7 라우팅을 IP:Port 기준과 Host/Path/Header 기준의 관찰 가능 정보 차이로 정리
```

공식 근거:

```text
A client MUST send a Host header field ... in all HTTP/1.1 request messages.
If the target URI includes an authority component, then a client MUST send a field value for Host that is identical to that authority component.
A fundamental notion in the design is that every octet of data sent over a TCP connection has a sequence number.
The acknowledgment mechanism employed is cumulative.
A Selective Acknowledgment (SACK) mechanism, combined with a selective repeat retransmission policy, can help to overcome these limitations.
```

핵심 판단:

```text
이번 Batch 17은 네트워크 용어를 계층별 비용과 관찰 가능 정보 문제로 재구성했다.
Keep-Alive, Sliding Window, ARQ는 모두 반복 전송에서 하위 계층 비용과 신뢰성 비용을 어떻게 줄일 것인가라는 문제로 묶었다.
Host Header와 L3/L4 vs L7 라우팅은 같은 네트워크 경로라도 어느 계층 정보를 볼 수 있는지에 따라 해결 도구가 달라지는 문제로 정리했다.
보안 공격/방어는 범위가 넓어 별도 배치로 남겼다.
```

### Batch 18. OS 실행 단위 / 스케줄링 / 문맥 교환

생성/이동/정리 결과:

```text
CREATE 01-Problem/33-스레드를 많이 만들었는데 처리량이 늘지 않고 문맥 교환만 증가함.md
CREATE 01-Problem/34-CPU 스케줄링 정책을 잘못 잡아 짧은 요청이 긴 작업 뒤에서 밀림.md
CREATE 02-Principle/본질-실행 단위와 스케줄링 경계.md
CREATE 02-Principle/본질-선점과 문맥 교환 비용.md
CREATE 02-Principle/본질-스케줄링 정책과 공정성.md
CREATE 02-Principle/본질-병렬성과 하드웨어 한계.md
MOVE   01-Question/탐구-CPU 코어의 스레드와 소프트웨어 스레드는 왜 단위가 다른가.md
    -> 03-Question/탐구-CPU 코어의 스레드와 소프트웨어 스레드는 왜 단위가 다른가.md
MOVE   01-Question/탐구-OS 스케줄러와 HW Thread 배치 사이에 어떤 계층은 없고 바로 전달하는가.md
    -> 03-Question/탐구-OS 스케줄러와 HW Thread 배치 사이에 어떤 계층은 없고 바로 전달하는가.md
MOVE   01-Question/탐구-이벤트 루프와 OS 스케줄링의 공존.md
    -> 03-Question/탐구-이벤트 루프와 OS 스케줄링의 공존.md
MOVE   01-Question/탐구-멀티스레드와 이벤트루프의 OS 활용 차이.md
    -> 03-Question/탐구-멀티스레드와 이벤트루프의 OS 활용 차이.md
MOVE   01-Question/탐구-스케줄링과 정합성의 충돌.md
    -> 03-Question/탐구-스케줄링과 정합성의 충돌.md
MOVE   01-Question/탐구-Redis는 왜 멀티 코어를 안 쓸까.md
    -> 03-Question/탐구-Redis는 왜 멀티 코어를 안 쓸까.md
DELETE 03-Concept/개념-프로세스 (Process).md
DELETE 03-Concept/개념-소프트웨어 스레드 (Software Thread).md
DELETE 03-Concept/개념-하드웨어 스레드 (Hardware Thread).md
DELETE 03-Concept/개념-문맥 교환 (Context Switch).md
DELETE 03-Concept/개념-PCB (Process Control Block).md
DELETE 03-Concept/개념-프로세스 스케줄러 (Process Scheduler).md
DELETE 04-Principle/본질-선점 (Preemption).md
DELETE 04-Principle/본질-병렬성 (Parallelism).md
DELETE 04-Principle/본질-동시성 (Concurrency).md
DELETE 06-Heuristic/판단기준-CPU 스케줄링 알고리즘 선택.md
DELETE 03-Concept/개념-FCFS (First Come First Served).md
DELETE 03-Concept/개념-SJF (Shortest Job First).md
DELETE 03-Concept/개념-SRT (Shortest Remaining Time).md
DELETE 03-Concept/개념-Round Robin (라운드 로빈).md
DELETE 03-Concept/개념-Priority Scheduling (우선순위 스케줄링).md
DELETE 03-Concept/개념-HRN (Highest Response Ratio Next).md
```

이번 배치에서 제외한 다음 후보:

```text
- 03-Concept/개념-이벤트 루프.md
- 03-Concept/개념-코루틴 (Coroutine).md
- 03-Concept/개념-차단 IO (Blocking IO).md
  → 비동기 I/O / 이벤트 루프 배치로 분리 예정
```

흡수 범위:

```text
- 프로그램/프로세스/PCB/소프트웨어 스레드/하드웨어 스레드의 실행 단위 차이
- 스레드 수를 늘려도 실제 병렬 실행은 hardware thread/logical processor 수에 제한되는 구조
- context switch의 직접 비용과 cache/TLB locality 손실
- 선점형 스케줄링이 공정성과 반응성을 얻는 대신 전환 비용을 만드는 구조
- FCFS/SJF/SRT/Round Robin/Priority/HRN을 스케줄링 정책과 공정성 trade-off로 흡수
- CFS의 vruntime을 덜 실행된 task를 우선하는 공정성 근사로 정리
```

공식/신뢰 근거:

```text
The scheduler is the kernel component that decides which runnable thread will be executed by the CPU next.
Number of voluntary and involuntary context switches.
The scheduler makes its decisions based on knowledge of the scheduling policy and static priority of all threads on the system.
In CFS the virtual runtime is expressed and tracked via the per-task p->se.vruntime.
On real hardware, we can run only a single task at once, so we have to introduce the concept of virtual runtime.
```

핵심 판단:

```text
이번 Batch 18은 OS 개념을 '프로세스란 무엇인가' 식 정의가 아니라, 스레드를 늘렸는데도 처리량이 늘지 않는 문제와 짧은 요청이 긴 작업 뒤에서 밀리는 문제로 재구성했다.
동시성/병렬성/선점/문맥 교환은 각각 별도 암기 대상이 아니라 실행 단위가 실제 hardware thread에 올라가기까지 어떤 경계와 비용을 거치는지로 정리했다.
스케줄링 알고리즘은 FCFS/SJF/RR 같은 이름보다 응답성, 평균 대기, starvation, context switch 비용 중 무엇을 우선하는지의 정책 문제로 흡수했다.
```

### Batch 19. 비동기 I/O / 이벤트 루프 / 코루틴 / 단일 실행 흐름

생성/이동/정리 결과:

```text
CREATE 01-Problem/35-이벤트 루프에 CPU 작업을 올려 모든 요청이 지연됨.md
CREATE 01-Problem/36-await으로 중간에 끊긴 로직 사이에 다른 요청이 끼어들어 상태가 꼬임.md
CREATE 02-Principle/본질-IO 준비 통지와 실행 책임 분리.md
CREATE 02-Principle/본질-협력형 스케줄링과 양보 지점.md
CREATE 02-Principle/본질-단일 실행 흐름과 직렬화 비용.md
MOVE   01-Question/탐구-Node.js 이벤트루프는 epoll을 통해 IO 대기를 어떻게 커널에 위임하는가.md
    -> 03-Question/탐구-Node.js 이벤트루프는 epoll을 통해 IO 대기를 어떻게 커널에 위임하는가.md
MOVE   01-Question/탐구-이벤트 루프에서의 동시성 사고.md
    -> 03-Question/탐구-이벤트 루프에서의 동시성 사고.md
MOVE   01-Question/탐구-Redis는 왜 락(Lock) 없이 원자성을 보장할까.md
    -> 03-Question/탐구-Redis는 왜 락(Lock) 없이 원자성을 보장할까.md
MOVE   01-Question/탐구-nginx, redis 처럼 싱글스레드 기반 프로그램도 내부 과정이 Coroutine과 동일하다고 봐야 하는가*.md
    -> 03-Question/...
DELETE 03-Concept/개념-이벤트 루프.md
DELETE 03-Concept/개념-코루틴 (Coroutine).md
DELETE 03-Concept/개념-차단 IO (Blocking IO).md
DELETE 04-Principle/본질-단일 스레드 모델.md
```

이번 배치에서 제외한 다음 후보:

```text
- 04-Principle/본질-이벤트 기반과 비동기의 독립성.md
  → Spring/Application Event, 메시지 큐, 비동기 실행 경계 배치에서 별도 처리 예정
- 03-Concept/개념-유닉스 파이프 (Unix Pipe).md
  → OS 파일 디스크립터/파이프/역압 배치 후보
```

흡수 범위:

```text
- Blocking I/O를 OS 관점의 sleep/wakeup과 user thread 점유 문제로 정리
- epoll/event loop를 커널의 I/O readiness notification과 애플리케이션 callback 실행 책임 분리로 흡수
- async/await/coroutine을 협력형 스케줄링과 suspend/yield 경계 문제로 정리
- 단일 스레드 모델을 lock 비용 감소와 긴 작업에 의한 직렬화 지연 trade-off로 재구성
- 싱글 스레드에서도 await 경계 사이에 논리적 race가 발생할 수 있음을 Problem으로 분리
```

공식/신뢰 근거:

```text
The epoll_wait() system call waits for events on the epoll(7) instance referred to by the file descriptor epfd.
The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that a single JavaScript thread is used by default.
Node.js runs JavaScript code in the Event Loop (initialization and callbacks), and offers a Worker Pool to handle expensive tasks like file I/O.
Tasks are used to schedule coroutines concurrently. Event loops use cooperative scheduling: an event loop runs one Task at a time.
Coroutines can suspend their execution instead of blocking a thread.
```

핵심 판단:

```text
이번 Batch 19는 비동기 I/O를 '빠른 문법'이 아니라 대기 감시 책임과 실행 책임을 분리하는 구조로 정리했다.
이벤트 루프는 I/O 대기에는 강하지만 callback 실행은 단일 흐름에 묶이므로 CPU-bound 작업 하나가 전체 latency를 망칠 수 있다.
코루틴과 async/await는 thread를 막지 않는 장점이 있지만, await/suspend는 비즈니스 원자성이 끊기는 경계이기도 하다.
따라서 싱글 스레드 모델은 메모리 경합을 줄일 뿐, 외부 상태의 read-modify-write 정합성을 자동으로 보장하지 않는다.
```

### Batch 20. Unix 프로세스 / 파일 I/O 경계 / 파이프 역압 / mmap

생성/이동/정리 결과:

```text
CREATE 01-Problem/37-파이프라인에서 소비자가 느려지자 생산자 프로세스가 멈춘 것처럼 보임.md
CREATE 01-Problem/38-mmap으로 큰 파일을 읽었는데 예측 못한 지연과 메모리 압력이 발생함.md
CREATE 02-Principle/본질-시스템 콜과 커널 경계.md
CREATE 02-Principle/본질-파일 디스크립터와 프로세스 상속.md
CREATE 02-Principle/본질-유한 버퍼와 역압.md
CREATE 02-Principle/본질-가상 주소와 지연 로딩.md
MOVE   01-Question/탐구-파이프는 어떻게 무한한 데이터를 유한한 메모리로 처리하는가.md
    -> 03-Question/탐구-파이프는 어떻게 무한한 데이터를 유한한 메모리로 처리하는가.md
MOVE   01-Question/탐구-커널과 운영체제의 경계는 어디인가.md
    -> 03-Question/탐구-커널과 운영체제의 경계는 어디인가.md
MOVE   01-Question/탐구-Unix에서 왜 새 프로세스를 fork+exec 패턴으로 생성하는가.md
    -> 03-Question/탐구-Unix에서 왜 새 프로세스를 fork+exec 패턴으로 생성하는가.md
MOVE   01-Question/탐구-DBMS는 왜 OS의 가상 메모리를 믿지 않을까.md
    -> 03-Question/탐구-DBMS는 왜 OS의 가상 메모리를 믿지 않을까.md
DELETE 03-Concept/개념-유닉스 파이프 (Unix Pipe).md
DELETE 03-Concept/개념-가상 메모리와 mmap의 관계.md
DELETE 03-Concept/개념-시스템 콜 (System Call).md
DELETE 03-Concept/개념-fork와 execve.md
DELETE 04-Principle/본질-역압 (Backpressure).md
```

흡수 범위:

```text
- 시스템 콜을 user space와 kernel space 사이의 권한 경계로 정리
- fork/exec를 파일 디스크립터와 실행 환경 상속 문제로 흡수
- Unix pipe를 제한된 커널 버퍼와 backpressure 문제로 재구성
- pipe full 시 write block/EAGAIN을 정상적인 흐름 제어로 정리
- mmap을 파일 전체 로드가 아니라 가상 주소 mapping과 page fault 기반 지연 로딩 문제로 정리
```

공식/신뢰 근거:

```text
The system call is the fundamental interface between an application and the Linux kernel.
fork() creates a new process by duplicating the calling process.
execve() executes the program referred to by path. This causes the program that is currently being run by the calling process to be replaced with a new program.
A pipe has a limited capacity. If the pipe is full, then a write(2) will block or fail, depending on whether the O_NONBLOCK flag is set.
mmap() creates a new mapping in the virtual address space of the calling process.
```

핵심 판단:

```text
이번 Batch 20은 Unix/OS 개념을 시스템 콜이라는 kernel boundary와 파일 디스크립터 상속이라는 실행 경계로 묶었다.
파이프는 편리한 쉘 문법이 아니라 제한된 커널 버퍼 위에서 생산자와 소비자의 속도를 맞추는 backpressure 장치로 정리했다.
mmap은 I/O 비용을 없애는 마법이 아니라 read 비용을 page fault와 kernel paging 정책으로 이동시키는 추상화로 정리했다.
```

### Batch 21. Java 컬렉션 / 제네릭 타입 소거 / 디스패치 / 예외 계약

생성/이동/정리 결과:

```text
CREATE 01-Problem/39-List를 LinkedList로 바꿨는데 순차 조회가 더 느려짐.md
CREATE 01-Problem/40-HashMap 조회가 항상 O1이라고 믿었는데 충돌과 리사이즈로 느려짐.md
CREATE 01-Problem/41-제네릭 타입과 오버로딩을 믿었는데 런타임 타입이 사라져 다르게 동작함.md
CREATE 01-Problem/42-Checked Exception을 그대로 전파해 서비스 인터페이스가 예외에 오염됨.md
CREATE 02-Principle/본질-접근 패턴과 메모리 지역성.md
CREATE 02-Principle/본질-해시 분산과 버킷 경계.md
CREATE 02-Principle/본질-컴파일 타임 타입과 런타임 객체의 분리.md
CREATE 02-Principle/본질-예외 계약과 복구 가능성.md
CREATE 02-Principle/본질-추상 인터페이스와 구현 비용.md
MOVE   01-Question/탐구-100만건 순차 읽기에서 ArrayList vs LinkedList 선택.md
    -> 03-Question/탐구-100만건 순차 읽기에서 ArrayList vs LinkedList 선택.md
MOVE   01-Question/탐구-HashMap 해시 충돌이 성능에 미치는 영향과 자바의 해결 방법.md
    -> 03-Question/탐구-HashMap 해시 충돌이 성능에 미치는 영향과 자바의 해결 방법.md
DELETE 03-Concept/개념-Java 제네릭 타입 소거 (Type Erasure).md
DELETE 03-Concept/개념-Java 정적·동적 바인딩 (Static·Dynamic Binding).md
DELETE 03-Concept/개념-Checked vs Unchecked Exception.md
DELETE 03-Concept/개념-ArrayList.md
DELETE 03-Concept/개념-LinkedList.md
DELETE 03-Concept/개념-HashMap.md
```

이번 배치에서 제외한 다음 후보:

```text
- 03-Concept/개념-JVM 메모리 구조 (JVM Memory Structure).md
  → JVM 메모리/GC/Metaspace/객체 레이아웃 배치에서 별도 처리 예정
- 03-Concept/개념-Red-Black Tree.md, 03-Concept/개념-힙 (Heap).md
  → 자료구조/알고리즘 배치에서 처리 예정
```

흡수 범위:

```text
- ArrayList/LinkedList를 접근 패턴과 메모리 지역성 문제로 흡수
- HashMap을 평균 O(1)이라는 암기가 아니라 hash 분산, bucket collision, resize 경계 문제로 정리
- Java generic type erasure와 static/dynamic binding을 컴파일 타임 타입과 런타임 객체 분리 원리로 흡수
- Checked/Unchecked Exception을 복구 가능성과 공개 예외 계약 문제로 정리
```

공식/신뢰 근거:

```text
Resizable-array implementation of the List interface.
Operations that index into the list will traverse the list from the beginning or the end, whichever is closer to the specified index.
This implementation provides constant-time performance for the basic operations (get and put), assuming the hash function disperses the elements properly among the buckets.
During the type erasure process, the Java compiler erases all type parameters and replaces each with its first bound if the type parameter is bounded, or Object if the type parameter is unbounded.
If a client can reasonably be expected to recover from an exception, make it a checked exception. If a client cannot do anything to recover from the exception, make it an unchecked exception.
```

핵심 판단:

```text
이번 Batch 21은 Java 기본기를 용어 암기에서 실무 오해 중심으로 재구성했다.
컬렉션 선택은 List/Map 인터페이스가 아니라 실제 접근 패턴, 메모리 배치, hash 분산, resize 비용을 기준으로 판단해야 한다.
제네릭과 메서드 선택은 컴파일 타임 타입과 런타임 객체가 분리되어 있다는 원리로 묶었다.
예외는 checked/unchecked 문법보다 호출자가 복구할 수 있는 실패를 공개 계약으로 드러낼 것인가의 문제로 정리했다.
```

### Batch 22. JVM 런타임 메모리 / Metaspace / 객체 메타데이터 / 참조 지역성

생성/정리 결과:

```text
CREATE 01-Problem/43-Heap 사용량만 보고 JVM 메모리 부족 원인을 놓침.md
CREATE 01-Problem/44-객체와 메서드가 모두 Heap에 있다고 오해해 다형성 비용을 설명하지 못함.md
CREATE 02-Principle/본질-JVM 런타임 영역과 생명주기.md
CREATE 02-Principle/본질-Heap 객체와 메타데이터 간접 참조.md
CREATE 02-Principle/본질-계층적 메모리와 참조 지역성.md
DELETE 03-Concept/개념-JVM 메모리 구조 (JVM Memory Structure).md
DELETE 04-Principle/본질-참조 지역성 (Locality of Reference).md
```

이번 배치에서 제외/이미 처리한 범위:

```text
- 03-Concept/개념-JVM Heap Metric.md
- 03-Concept/개념-G1 Evacuation Pause.md
- 06-Heuristic/판단기준-GC Metric을 어떻게 해석할 것인가.md
  → Batch 7 옵저버빌리티/관측 신호 배치에서 이미 흡수 완료
```

흡수 범위:

```text
- JVM runtime data areas를 heap 하나가 아니라 JVM-wide 영역과 thread-local 영역으로 분리
- Heap 객체와 Method Area/Metaspace metadata를 klass pointer 기반 간접 참조 구조로 정리
- Metaspace가 JDK 8 이후 native memory에 class metadata를 저장한다는 점을 운영 OOM 문제로 연결
- 참조 지역성을 계층적 메모리, CPU cache, 배열 순회, 캐시 키 공간 문제를 관통하는 원리로 재정리
```

공식/신뢰 근거:

```text
The Java Virtual Machine defines various run-time data areas that are used during execution of a program.
Each Java Virtual Machine thread has its own pc (program counter) register.
The Java Virtual Machine has a heap that is shared among all Java Virtual Machine threads.
The Java Virtual Machine has a method area that is shared among all Java Virtual Machine threads.
Starting with JDK 8, the permanent generation was removed and the class metadata is allocated in native memory.
Principle of Locality: Programs tend to use data and instructions with addresses near or equal to those they have used recently.
```

핵심 판단:

```text
이번 Batch 22는 JVM 메모리 구조를 영역 이름 암기가 아니라 운영 문제와 객체 모델 오해 중심으로 재구성했다.
Heap metric만으로 JVM process memory를 판단하면 Metaspace, thread stack, native/direct memory 문제를 놓칠 수 있다.
Java 객체는 메서드 코드를 객체 안에 들고 있는 것이 아니라 Heap object가 Metaspace class metadata를 간접 참조하는 구조로 이해해야 한다.
참조 지역성은 Java 컬렉션 성능뿐 아니라 CPU cache, OS page cache, DB buffer pool, application cache까지 반복되는 계층적 메모리 원리로 흡수했다.
```

### Batch 23. 자료구조 / 그래프 탐색 / 그리디 / 정렬 알고리즘 선택

생성/이동/정리 결과:

```text
CREATE 01-Problem/45-PriorityQueue로 정렬 순회나 범위 조회를 하려다 성능이 나빠짐.md
CREATE 01-Problem/46-가중치가 다른 경로 문제에 BFS를 써서 최단 거리를 틀림.md
CREATE 01-Problem/47-그리디로 풀었는데 반례에서 최적해를 놓침.md
CREATE 02-Principle/본질-부분 순서와 전체 순서의 차이.md
CREATE 02-Principle/본질-탐색 순서와 최단성 보장 조건.md
CREATE 02-Principle/본질-탐욕 선택의 안전성.md
CREATE 02-Principle/본질-정렬 알고리즘의 비용 모델.md
MOVE   01-Question/탐구-왜 그리디는 최단 경로에 실패하는가.md
    -> 03-Question/탐구-왜 그리디는 최단 경로에 실패하는가.md
DELETE 03-Concept/개념-Red-Black Tree.md
DELETE 03-Concept/개념-힙 (Heap).md
DELETE 03-Concept/개념-이진 탐색 트리 (BST, Binary Search Tree).md
DELETE 06-Heuristic/판단기준-Heap vs BST 선택.md
DELETE 03-Concept/개념-BFS (너비 우선 탐색).md
DELETE 06-Heuristic/판단기준-BFS vs Dijkstra 선택.md
DELETE 03-Concept/개념-그리디 알고리즘 (Greedy Algorithm).md
DELETE 06-Heuristic/판단기준-그리디 vs DP 선택.md
DELETE 03-Concept/개념-버블 정렬 (Bubble Sort).md
DELETE 03-Concept/개념-삽입 정렬 (Insertion Sort).md
DELETE 03-Concept/개념-선택 정렬 (Selection Sort).md
```

흡수 범위:

```text
- Heap/PriorityQueue와 BST/TreeMap을 부분 순서와 전체 순서의 차이로 정리
- Red-Black Tree를 TreeMap의 전체 순서 유지 비용으로 흡수
- BFS/Dijkstra 선택 기준을 간선 비용 모델과 탐색 순서 보장 조건으로 정리
- Greedy/DP 선택 기준을 탐욕 선택 속성과 exchange argument 가능성으로 정리
- Bubble/Insertion/Selection Sort를 단순 정렬의 비교·교환·이동 비용 모델로 흡수
- 기존 unresolved였던 판단기준-정렬 알고리즘 선택 링크를 본질-정렬 알고리즘의 비용 모델로 치환
```

공식/신뢰 근거:

```text
An unbounded priority queue based on a priority heap.
A Red-Black tree based NavigableMap implementation.
The path found by breadth first search to any node is the shortest path to that node, i.e the path that contains the smallest number of edges in unweighted graphs.
Greedy algorithms generally take the following form. Select a candidate greedily according to some heuristic, and add it to your current solution if doing so doesn’t corrupt feasibility.
```

핵심 판단:

```text
이번 Batch 23은 자료구조와 알고리즘을 이름 암기가 아니라 보장 조건과 비용 모델로 재구성했다.
Heap은 최우선 원소 하나를 빠르게 찾기 위해 전체 순서를 포기하고, BST/Red-Black Tree는 전체 순서를 유지하기 위해 균형 유지 비용을 지불한다.
BFS는 균등 가중치에서만 먼저 발견한 경로가 최단이고, 가중치가 달라지면 priority queue 기반 Dijkstra가 필요하다.
그리디는 빠른 추측이 아니라 현재 선택이 전역 최적해에 안전하게 포함됨을 증명할 수 있을 때만 정답이다.
```

### Batch 24. 보안 계층 / PKI / WAF / 접근 제어 모델

생성/정리 결과:

```text
CREATE 01-Problem/48-인증서는 있는데 이 공개키를 믿어도 되는지 검증하지 못함.md
CREATE 01-Problem/49-iptables나 fail2ban으로 막으려 했지만 공격자가 이미 프록시나 CDN 뒤에 있음.md
CREATE 01-Problem/50-역할만 확인해서 사용자가 남의 리소스를 수정할 수 있음.md
CREATE 02-Principle/본질-신뢰 체인과 키 소유권 증명.md
CREATE 02-Principle/본질-암호학적 무결성과 부인방지.md
CREATE 02-Principle/본질-보안 통제 지점과 방어 심층화.md
CREATE 02-Principle/본질-권한 모델과 리소스 관계.md
DELETE 03-Concept/개념-OSI Layer별 보안 공격과 방어.md
DELETE 03-Concept/개념-PKI (Public Key Infrastructure).md
DELETE 03-Concept/개념-전자서명 (Digital Signature).md
DELETE 03-Concept/개념-Cloudflare WAF.md
DELETE 03-Concept/개념-fail2ban.md
DELETE 03-Concept/개념-ufw.md
DELETE 03-Concept/개념-서버 접근 통제 기법 (DAC, MAC, RBAC).md
DELETE 03-Concept/개념-ReBAC (Relationship-Based Access Control).md
DELETE 06-Heuristic/판단기준-접근 제어 모델 선택 (DAC vs RBAC vs ReBAC).md
DELETE 06-Heuristic/판단기준-신규 입사 시 회사 보안 구조 파악 순서.md
```

흡수 범위:

```text
- PKI와 전자서명을 신뢰 체인, 공개키 소유권, 암호학적 무결성/부인방지 원리로 분리
- OSI 계층별 보안 공격 목록을 공격 정보가 보이는 계층과 차단 지점 문제로 흡수
- Cloudflare WAF, fail2ban, ufw를 L7/L3-L4 통제 지점 차이로 정리
- DAC/MAC/RBAC/ReBAC와 접근 제어 판단기준을 권한 모델과 리소스 관계 문제로 흡수
- 기존 OSI 보안 노트의 미생성 세부 링크(XSS, CSRF, Phishing 등)는 보안 통제 지점 원리로 통합
```

공식/신뢰 근거:

```text
An algorithm for X.509 certification path validation is described.
The result of a cryptographic transformation of data which, when properly implemented, provides the services of: origin authentication, data integrity, and signer non-repudiation.
The Cloudflare Web Application Firewall (Cloudflare WAF) checks incoming web and API requests and filters undesired traffic based on sets of rules called rulesets.
Fail2Ban scans log files like /var/log/auth.log and bans IP addresses conducting too many failed login attempts.
Even when no access control rules are explicitly matched, the application cannot remain neutral when an entity is requesting access to a particular resource.
A key feature of this model is that all access is through roles.
```

핵심 판단:

```text
이번 Batch 24는 보안 개념을 공격 이름 암기가 아니라 신뢰 검증, 통제 지점, 권한 관계라는 실무 문제로 재구성했다.
PKI는 암호화 자체가 아니라 공개키 소유권을 신뢰 체인으로 증명하는 구조이고, 전자서명은 무결성·인증·부인방지를 제공하는 메커니즘이다.
WAF, fail2ban, ufw는 좋은/나쁜 도구 구분이 아니라 어떤 계층 정보를 보고 차단할 수 있는지의 문제다.
인가 모델은 ROLE 확인만으로 끝나지 않고, 리소스 소유권·조직·멤버십 관계를 별도로 검증해야 한다.
```

### Batch 25. DB 모델링 / 정규화 / 키 설계 / 페이지 저장 구조

생성/이동/정리 결과:

```text
CREATE 01-Problem/51-한 테이블에 여러 사실을 넣어 수정할 때마다 데이터가 불일치함.md
CREATE 01-Problem/52-복합키를 기본키로 썼다가 FK 전파와 인덱스 순서 때문에 변경이 어려워짐.md
CREATE 01-Problem/53-ctid나 물리 위치를 안정적인 row 식별자로 사용하려다 깨짐.md
CREATE 02-Principle/본질-함수적 종속과 사실의 소유권.md
CREATE 02-Principle/본질-식별자 안정성과 도메인 유일성.md
CREATE 02-Principle/본질-물리 주소와 논리 식별자의 분리.md
CREATE 02-Principle/본질-페이지 단위 저장과 간접 참조.md
CREATE 02-Principle/본질-논리 모델과 조회 비용의 균형.md
MOVE   01-Question/탐구-surrogate key가 정규화에 반하는 이유는 무엇일까.md
    -> 03-Question/탐구-surrogate key가 정규화에 반하는 이유는 무엇일까.md
MOVE   01-Question/탐구-왜 RDB가 역사적 승자가 되었고 정규화가 필요했을까.md
    -> 03-Question/탐구-왜 RDB가 역사적 승자가 되었고 정규화가 필요했을까.md
MOVE   01-Question/탐구-postgresql에서 테이블 마다 heap page 일정 공간을 할당해주고 그 안에서 순차적으로 page가 insert.md
    -> 03-Question/...
MOVE   01-Question/탐구-SQL은 논리 구문에서 물리 실행까지 어떻게 동작하는가.md
    -> 03-Question/탐구-SQL은 논리 구문에서 물리 실행까지 어떻게 동작하는가.md
MOVE   01-Question/탐구-왜 RDB는 페이지를 쓰고 NoSQL은 세그먼트를 쓰는가.md
    -> 03-Question/탐구-왜 RDB는 페이지를 쓰고 NoSQL은 세그먼트를 쓰는가.md
DELETE 03-Concept/개념-DB 정규화 (Normalization).md
DELETE 03-Concept/개념-대리키 (Surrogate Key).md
DELETE 03-Concept/개념-복합키 (Composite Key).md
DELETE 03-Concept/개념-함수적 종속성 (Functional Dependency).md
DELETE 03-Concept/개념-DB 페이지와 Slotted Page 구조.md
DELETE 03-Concept/개념-Heap Page 구조.md
DELETE 03-Concept/개념-DBMS의 역할과 저장소 관리자 (Storage Manager).md
DELETE 03-Concept/개념-페이지와 인덱스의 추상화 관계.md
DELETE 02-Phenomenon/현상-DB 이상 현상.md
DELETE 06-Heuristic/판단기준-정규화 단계 선택.md
```

흡수 범위:

```text
- 정규화, 함수적 종속, DB 이상 현상을 '어떤 사실을 어느 테이블이 소유하는가' 문제로 재구성
- 대리키/복합키를 식별자 안정성과 도메인 유일성 분리 문제로 정리
- 정규화 단계 선택을 논리 모델과 조회 비용 균형 문제로 흡수
- DB page, heap page, slotted page, storage manager, index-page 관계를 페이지 단위 저장과 간접 참조 원리로 통합
- PostgreSQL ctid/TID를 물리 주소와 논리 식별자 분리 문제로 정리
```

공식/신뢰 근거:

```text
Normalization helps you avoid redundancies and inconsistencies in your data.
Functional Dependencies (FD): mathematical tool for database normalization.
Every table and index is stored as an array of pages of a fixed size (usually 8 kB, although a different page size can be selected when compiling the server).
Every pointer to an item (ItemPointer, also known as CTID) created by PostgreSQL consists of a page number and the index of an item identifier.
The physical location of the row version within its table.
Therefore ctid should not be used as a row identifier. A primary key should be used to identify logical rows.
```

핵심 판단:

```text
이번 Batch 25는 DB 설계를 정규형 이름 암기가 아니라 사실의 소유권, 식별자 안정성, 물리 주소와 논리 식별자의 분리 문제로 재구성했다.
정규화는 중복 제거 자체가 목적이 아니라 어떤 결정자가 어떤 속성을 책임지는지 분리해 삽입·갱신·삭제 이상을 막는 구조다.
대리키와 복합키는 어느 쪽이 더 이론적으로 옳은가보다 참조 안정성과 도메인 유일성 제약을 어떻게 나눌지의 문제다.
DB 저장 구조는 row가 아니라 page 단위로 읽히며, slotted page의 간접 참조 덕분에 tuple 이동과 외부 참조 안정성이 분리된다.
```

### Batch 26. 설정 오버라이드 / 외부 설정 / 스키마 마이그레이션

생성/이동/정리 결과:

```text
CREATE 01-Problem/54-설정 파일을 고쳤는데 운영에서 다른 값이 적용됨.md
CREATE 01-Problem/55-코드 배포와 DB 스키마 변경 순서가 맞지 않아 장애가 발생함.md
CREATE 02-Principle/본질-설정 우선순위와 출처 추적.md
CREATE 02-Principle/본질-스키마 이력과 배포 순서.md
MOVE   01-Question/탐구-설정 덮어쓰기는 왜 예측 불가능한 버그를 만드는가.md -> 03-Question/
MOVE   01-Question/탐구-왜 코드 배포와 스키마 변경은 함께 관리해야 하는가.md -> 03-Question/
DELETE 03-Concept/개념-외부 설정 관리 (Externalized Configuration).md
DELETE 02-Phenomenon/현상-설정 섀도잉 (Configuration Shadowing).md
DELETE 06-Heuristic/판단기준-안전한 설정 오버라이드 관리 전략.md
DELETE 05-Case/사례-Spring Boot 외부 설정 우선순위 메커니즘.md
DELETE 03-Concept/개념-Flyway.md
DELETE 03-Concept/개념-스키마 마이그레이션 (Schema Migration).md
```

핵심 판단:

```text
설정 문제는 외부 설정 개념보다 최종 값이 어디서 왔는지 추적 가능한가가 실무 핵심이다.
스키마 변경은 코드처럼 간단히 rollback되지 않으므로 Flyway 이력과 expand-contract 순서가 중요하다.
이번 배치부터 CS 단독 지식보다 백엔드 운영 사고로 이어지는 Problem 중심으로 간소화한다.
```

### Batch 27. Git 상태 영역 / 이력 재작성 / 작업 공간 분리

생성/정리 결과:

```text
CREATE 01-Problem/56-reset과 force push로 공유 브랜치 이력이 꼬임.md
CREATE 02-Principle/본질-Git 상태 영역과 이력 재작성 경계.md
CREATE 02-Principle/본질-작업 공간 격리와 컨텍스트 전환 비용.md
DELETE 03-Concept/개념-Git Reset 모드.md
DELETE 03-Concept/개념-Git Worktree.md
DELETE 03-Concept/개념-Git 파일 상태 (Staged, Unstaged, Untracked).md
```

핵심 판단:

```text
Git은 명령어 옵션 암기보다 working directory, staging area, repository history 중 무엇을 바꾸는지 구분하는 것이 실무 핵심이다.
공유 브랜치 이력은 협업자의 기준점이므로 reset/force push보다 revert가 안전하다.
worktree는 Git 개념 지식이 아니라 긴급 hotfix와 장기 작업을 분리해 컨텍스트 전환 비용을 줄이는 실무 도구로 정리했다.
새 Question은 만들지 않았다.
```

### Batch 28. Spring/JPA 잔여 / JPQL 벌크 / 외부 API 테스트 격리

생성/정리 결과:

```text
CREATE 01-Problem/57-JPQL 벌크 업데이트 후 같은 트랜잭션에서 오래된 값을 읽음.md
CREATE 01-Problem/58-테스트가 실제 외부 API를 호출해 느리고 불안정해짐.md
CREATE 02-Principle/본질-영속성 컨텍스트와 DB 상태 동기화.md
CREATE 02-Principle/본질-테스트 경계와 외부 의존성 격리.md
DELETE 03-Concept/개념-AOP (Aspect-Oriented Programming).md
DELETE 03-Concept/개념-의존성 주입 (Dependency Injection).md
DELETE 03-Concept/개념-Tomcat HTTP 요청 처리 흐름.md
DELETE 03-Concept/개념-JPQL 벌크 연산 (Bulk Operation).md
DELETE 03-Concept/개념-DataIntegrityViolationException.md
DELETE 03-Concept/개념-WireMock과 API 테스트 스터빙.md
DELETE 03-Concept/개념-HikariCP.md
DELETE 06-Heuristic/판단기준-테스트 환경 설정 격리 전략.md
DELETE 06-Heuristic/판단기준-예외 처리 레이어 설계.md
```

핵심 판단:

```text
AOP/DI/HikariCP/Tomcat은 별도 암기 노트보다 이미 존재하는 프록시 실행 경계, 의존성 방향, 공유 자원 점유, I/O 통지 원리로 흡수했다.
새로 남긴 실무 문제는 JPQL 벌크 연산 후 1차 캐시 불일치와 외부 API 테스트 격리 실패다.
백엔드 실무 Question을 늘리기보다 장애/디버깅 상황으로 바로 이어지는 Problem만 추가했다.
```

### Batch 29. VPN / 라우팅 프로토콜 / 홈서버 노출 경계

생성/정리 결과:

```text
CREATE 01-Problem/59-VPN을 켰는데도 접근 권한과 노출 범위를 구분하지 못함.md
CREATE 01-Problem/60-홈서버를 ONT에 직접 연결해 모든 포트가 인터넷에 노출됨.md
CREATE 02-Principle/본질-사설 접근 경로와 권한 판단의 분리.md
CREATE 02-Principle/본질-동적 경로 결정과 수렴 비용.md
DELETE 03-Concept/개념-VPN (Virtual Private Network).md
DELETE 03-Concept/개념-OSPF (Open Shortest Path First).md
DELETE 03-Concept/개념-RIP (Routing Information Protocol).md
DELETE 03-Concept/개념-ONT와 공유기의 구조적 차이.md
```

핵심 판단:

```text
VPN은 권한 모델이 아니라 사설 자원으로 가는 접근 경로다.
ONT/공유기 차이는 장비 암기가 아니라 홈서버의 인터넷 노출면이 어디서 생기는지의 문제로 정리했다.
OSPF/RIP는 백엔드 실무에서 직접 설정할 가능성이 낮으므로 동적 경로 결정과 수렴 비용 원리로 흡수했다.
새 Question은 만들지 않았다.
```

### Batch 30. LLM / RAG / Vector DB / Context Window

생성/정리 결과:

```text
CREATE 01-Problem/61-RAG를 붙였는데 관련 없는 문서가 들어가 답변 품질이 나빠짐.md
CREATE 02-Principle/본질-검색 품질과 생성 품질의 분리.md
CREATE 02-Principle/본질-컨텍스트 윈도우와 비용 경계.md
DELETE 03-Concept/개념-Vector DB.md
DELETE 03-Concept/개념-RAG (Retrieval-Augmented Generation).md
DELETE 03-Concept/개념-Context Window.md
```

핵심 판단:

```text
Vector DB/RAG/Context Window는 개념 암기보다 검색 품질, 생성 품질, 토큰 비용 경계를 분리해 관측하는 실무 문제로 정리했다.
RAG 장애는 LLM이 나쁜지 검색 결과가 나쁜지 먼저 분리해야 한다.
Context Window는 저장소가 아니라 비용이 드는 작업 메모리로 다룬다.
새 Question은 만들지 않았다.
```

### Batch 31. 이벤트 이력 / 감사 로그 / Command-Query 분리

생성/정리 결과:

```text
CREATE 01-Problem/62-현재 상태만 저장해 누가 언제 왜 변경했는지 추적하지 못함.md
CREATE 01-Problem/63-쓰기 모델로 화면 조회까지 처리하려다 도메인과 SQL이 모두 복잡해짐.md
CREATE 02-Principle/본질-변경 이력과 감사 가능성.md
CREATE 02-Principle/본질-이벤트 불변성과 보정 기록.md
CREATE 02-Principle/본질-명령 모델과 조회 모델의 변경 이유 분리.md
DELETE 03-Concept/개념-Append-only 이벤트 이력.md
DELETE 03-Concept/개념-감사 로그 (Audit Log).md
DELETE 03-Concept/개념-Command Query 분리.md
DELETE 04-Principle/본질-이벤트의 불변성.md
```

핵심 판단:

```text
이벤트/감사 로그는 이벤트 소싱 개념 암기보다 상태 변경 경로를 설명하고 복구할 수 있는가의 실무 문제로 정리했다.
현재 상태 테이블은 빠른 조회를 담당하고, 감사 이력은 누가 언제 왜 바꿨는지 설명하는 책임을 가진다.
Command-Query 분리는 모든 CRUD에 적용할 패턴이 아니라 쓰기 모델과 조회 모델의 변경 이유가 달라질 때 적용한다.
새 Question은 만들지 않았다.
```

### Batch 32. 디자인 패턴 / 요구사항 소통 / 추상화 / 모듈 경계

생성/이동/정리 결과:

```text
CREATE 01-Problem/64-패턴 이름에 맞추려다 단순한 코드가 과하게 복잡해짐.md
CREATE 01-Problem/65-멀티모듈로 나눴지만 변경 경계가 아니라 폴더만 늘어남.md
CREATE 02-Principle/본질-설계 패턴은 해결책이 아니라 설계 어휘.md
CREATE 02-Principle/본질-모듈 경계와 의존성 방향.md
CREATE 02-Principle/본질-추상화 비용과 변경 가능성.md
MOVE   01-Question/탐구-디자인 패턴을 생성 구조 행위 패턴으로 나눈 기준은 무엇일까.md -> 03-Question/
MOVE   01-Question/탐구-디자인 패턴은 OOP를 넘어 언어와 런타임마다 어떻게 표현되는가.md -> 03-Question/
MOVE   01-Question/탐구-실무 요구사항 분석과 UML은 어떻게 쓰일까.md -> 03-Question/
MOVE   01-Question/탐구-타입의 존재 이유와 덕 타이핑은 왜 나왔을까.md -> 03-Question/
DELETE 03-Concept/개념-컴포넌트와 모듈 (Component vs Module).md
DELETE 06-Heuristic/판단기준-패턴 사고 적용 기준.md
DELETE 04-Principle/본질-디자인 패턴의 본질 (Design Pattern).md
DELETE 06-Heuristic/판단기준-추상화 계층 추가 기준.md
DELETE 06-Heuristic/판단기준-멀티모듈 아키텍처를 언제 도입할 것인가.md
```

핵심 판단:

```text
디자인 패턴은 구현 목표가 아니라 설계 의도를 압축하는 어휘로 정리했다.
추상화는 숨길 복잡성이나 변경 가능성이 있을 때 가치가 있고, 그렇지 않으면 간접 참조 비용만 만든다.
멀티모듈은 폴더 정리가 아니라 변경 경계와 의존성 방향을 강제하기 위한 장치다.
기존 Question은 보존 이동했고 새 Question은 만들지 않았다.
```

### Batch 33. OS 잔여 / PID 1 / 페이지 교체 / C 기초

생성/정리 결과:

```text
CREATE 01-Problem/66-컨테이너 PID 1이 자식 프로세스를 수거하지 않아 좀비가 쌓임.md
CREATE 02-Principle/본질-PID 1과 자식 프로세스 수거 책임.md
DELETE 03-Concept/개념-Init 프로세스 (PID 1).md
DELETE 02-Phenomenon/현상-고아 프로세스 (Orphan Process).md
DELETE 03-Concept/개념-OPT (Optimal Page Replacement).md
DELETE 03-Concept/개념-FIFO (페이지 교체).md
DELETE 06-Heuristic/판단기준-페이지 교체 알고리즘 선택.md
DELETE 03-Concept/개념-C 암묵적 불리언 변환 (Implicit Boolean Conversion).md
DELETE 03-Concept/개념-C 연산자 우선순위 (Operator Precedence).md
```

핵심 판단:

```text
PID 1/init/고아 프로세스는 컨테이너 운영에서 signal 전달과 zombie reaping 문제로 재구성했다.
페이지 교체 알고리즘은 백엔드 실무 Question으로 남기지 않고 메모리 한계와 제거 정책 원리로 흡수했다.
C 암묵적 불리언/연산자 우선순위는 CS 문법 지식 성격이 강해 별도 Problem으로 만들지 않았다.
새 Question은 만들지 않았다.
```

### Batch 34. 실무 요구사항 / 상황 판단 / 문서화·면접 메타 노트 정리

생성/정리 결과:

```text
CREATE 01-Problem/67-화면 요구사항만 보고 API를 만들었다가 숨은 정책이 뒤늦게 드러남.md
CREATE 01-Problem/68-프로젝트를 기능 나열로만 설명해 기술 선택의 깊이가 드러나지 않음.md
CREATE 02-Principle/본질-요구사항 질문화와 숨은 정책 발견.md
CREATE 02-Principle/본질-상황 제약 기반 기술 선택.md
CREATE 02-Principle/본질-의사결정 증거로서의 문서화.md
DELETE 06-Heuristic/판단기준-개발 실무를 느끼는 4단계.md
DELETE 06-Heuristic/판단기준-기술적 사고력으로 실무 상황을 해석하는 법.md
DELETE 06-Heuristic/판단기준-서비스 상황 분석 척도.md
DELETE 06-Heuristic/판단기준-UI 요구사항을 질문으로 구체화하는 법.md
DELETE 06-Heuristic/판단기준-백엔드 신입을 위한 프로젝트 문서화 가이드.md
DELETE 06-Heuristic/판단기준-면접 답변의 기본 구조.md
DELETE 06-Heuristic/판단기준-백엔드 면접 및 이력서 전략.md
DELETE 06-Heuristic/판단기준-백엔드 면접 질문 모음.md
DELETE 06-Heuristic/판단기준-SI 채용공고 분석 및 지원 전략.md
DELETE 06-Heuristic/판단기준-SI 프로젝트의 이해와 문서화의 목적.md
DELETE 06-Heuristic/판단기준-성장 가능한 SI 회사 판별법.md
DELETE 06-Heuristic/판단기준-최신 백엔드 공고 분석 및 실무 트렌드.md
```

핵심 판단:

```text
면접/채용/SI 문서화 노트는 별도 기술 지식으로 유지하지 않고 실무 의사결정 증거와 상황 제약 기반 선택 원리로 흡수했다.
요구사항 분석은 UML/문서 형식보다 화면에 보이지 않는 정책을 질문으로 드러내는 능력으로 정리했다.
프로젝트 설명은 기능 나열이 아니라 상황, 기준, 선택, 트레이드오프, 결과 수치를 증명하는 방식으로 정리했다.
새 Question은 만들지 않았다.
```

### Batch 35. 소형 설계 판단 Heuristic 정리

생성/정리 결과:

```text
CREATE 01-Problem/69-API와 DTO 이름을 기술 기준으로 정해 도메인 의미가 흐려짐.md
CREATE 01-Problem/70-자원 종료와 의존성 버전 관리를 미뤄 운영 장애가 발생함.md
CREATE 02-Principle/본질-인터페이스 의미와 도메인 언어.md
CREATE 02-Principle/본질-자원 생명주기와 종료 신호.md
CREATE 02-Principle/본질-통제된 변경과 재현 가능한 빌드.md
DELETE 06-Heuristic/판단기준-REST API 파라미터 선택 (Path Variable vs Query Parameter).md
DELETE 06-Heuristic/판단기준-Formatter vs Converter vs Mapper 선택.md
DELETE 06-Heuristic/판단기준-Mapping Table 이름은 상위 개념 기준으로 정한다.md
DELETE 06-Heuristic/판단기준-자원 생명주기 관리와 명시적 종료 (Cleanup).md
DELETE 06-Heuristic/판단기준-패키지 버전 업데이트 전략.md
DELETE 06-Heuristic/판단기준-비기능 요구사항 수치 근거 및 출처.md
DELETE 06-Heuristic/판단기준-시스템 제어권 회수와 자원 독점.md
DELETE 06-Heuristic/판단기준-시스템 설계 체크리스트.md
DELETE 06-Heuristic/판단기준-그래프 순회 관점 선택 (정점 중심 vs 간선 중심).md
DELETE 06-Heuristic/판단기준-초보 운전자 기본기 체크리스트.md
```

핵심 판단:

```text
API 파라미터, DTO 변환, 매핑 테이블 이름은 개별 규칙보다 인터페이스 의미와 도메인 언어 문제로 통합했다.
자원 종료, 의존성 버전, 비기능 수치, 시스템 체크리스트는 운영 가능한 변경과 자원 생명주기 문제로 정리했다.
알고리즘/개인 체크리스트 성격이 강한 노트는 별도 Problem으로 만들지 않고 기존 원리에 흡수했다.
새 Question은 만들지 않았다.
```

### Batch 36. 남은 Question / Phenomenon / Concept 정리

생성/이동/정리 결과:

```text
CREATE 01-Problem/71-운영 SQL 로그에 파라미터를 남겨 개인정보와 시크릿이 노출됨.md
CREATE 02-Principle/본질-관측 데이터 최소화와 민감정보 경계.md
CREATE 02-Principle/본질-장애 전파와 복구 경계.md
CREATE 02-Principle/본질-계층별 책임 분리와 확장 경계.md
MOVE   01-Question/탐구-Spring을 사용하는 보이지 않는 이유.md -> 03-Question/
MOVE   01-Question/탐구-결함 오류 장애의 차이와 인과관계는 무엇일까.md -> 03-Question/
MOVE   01-Question/탐구-교착 상태는 원자적 단위에서 어떻게 발생하며 OS 커널은 이때 무엇을 할까.md -> 03-Question/
MOVE   01-Question/탐구-멀티스레드 환경에서 로그 맥락은 어떻게 추적하는가.md -> 03-Question/
MOVE   01-Question/탐구-뮤텍스와 스핀락 언제 무엇을 선택해야 할까.md -> 03-Question/
MOVE   01-Question/탐구-왜 SQL 로그에서 실 파라미터를 제외해야 하는가.md -> 03-Question/
MOVE   01-Question/탐구-왜 Web-WAS-DB 계층 구조를 사용하는가.md -> 03-Question/
DELETE 02-Phenomenon/현상-커넥션 풀 고갈 (Connection Pool Exhaustion).md
DELETE 03-Concept/개념-SQL 물리 실행 흐름.md
DELETE 03-Concept/개념-불변 인프라 (Immutable Infrastructure).md
DELETE 03-Concept/개념-유니온 파일 시스템 (UnionFS).md
```

핵심 판단:

```text
남은 Question은 삭제하지 않고 03-Question으로 이동 보존했다.
SQL 파라미터 로그는 운영 보안 사고로 이어지는 실무 Problem으로 승격했다.
커넥션 풀 고갈은 기존 트랜잭션 범위/공유 자원 점유 문제로 흡수했다.
SQL 물리 실행 흐름은 논리 순서와 물리 접근 비용, 페이지 단위 저장 원리로 흡수했다.
불변 인프라와 UnionFS는 통제된 변경, 재현 가능한 빌드, Copy-on-Write 원리로 흡수했다.
```

### Batch 37. 04-Principle 추상 원리 전체 흡수

생성/정리 결과:

```text
DELETE 04-Principle/*.md  # 42개 전체 삭제
```

대표 치환:

```text
본질-가시성 (Visibility) -> 본질-가시성과 happens-before
본질-가용성 (Availability) -> 본질-계층별 책임 분리와 확장 경계
본질-간접 참조 (Indirection) -> 본질-추상화 비용과 변경 가능성
본질-격리성 (Isolation) -> 본질-격리 강도와 자원 경계
본질-결함 (Fault) / 본질-장애 (Failure) / 본질-신뢰성 (Reliability) / 본질-회복탄력성 (Resilience) -> 본질-장애 전파와 복구 경계
본질-멱등성 (Idempotency) -> 본질-요청 멱등성과 중복 방어
본질-모듈성 (Modularity) -> 본질-모듈 경계와 의존성 방향
본질-보안 (Security) -> 본질-보안 통제 지점과 방어 심층화
본질-원자성 (Atomicity) -> 본질-원자적 상태 전이
본질-의존성 방향 (Dependency Direction) -> 본질-의존성 방향과 기술 격리
본질-처리량과 지연시간 (Throughput and Latency) / 본질-트레이드오프 (Trade-off) -> 본질-상황 제약 기반 기술 선택
본질-추상화 (Abstraction) -> 본질-추상화 비용과 변경 가능성
본질-캡슐화 (Encapsulation) -> 본질-인터페이스 의미와 도메인 언어
본질-코드와 상태의 비대칭성 (Code-State Asymmetry) -> 본질-스키마 이력과 배포 순서
본질-해시 함수 (Hash Function) -> 본질-해시 분산과 버킷 경계
```

핵심 판단:

```text
기존 04-Principle은 추상어 중심이라 새 3-layer 구조의 Problem 중심 탐색과 중복이 컸다.
각 추상 본질을 이미 생성된 실무형 02-Principle로 연결해 링크 의미를 유지했다.
이번 배치로 04-Principle 폴더의 지식 마이그레이션을 완료했다.
```

### Batch 38. 05-Case 전체 정리

생성/정리 결과:

```text
DELETE 05-Case/*.md  # 10개 전체 삭제
```

대표 흡수:

```text
사례-JPA Unique Key 중복 저장 방지 -> 17-save 호출을 try-catch로 감쌌는데 DB 제약 예외를 잡지 못함
사례-Hibernate Embedded 컬렉션의 JSON 매핑 실패와 한계 -> 본질-추상화 비용과 변경 가능성
사례-KVM VM 전체 구축 과정 (ISO → Cloudflare Tunnel) -> 60-홈서버를 ONT에 직접 연결해 모든 포트가 인터넷에 노출됨
사례-식사하는 철학자 문제 -> 본질-임계 구역과 활동성
macOS/IntelliJ/키보드/모니터 개인 환경 사례 -> 지식 시스템에서 제거
```

핵심 판단:

```text
Case 폴더는 실제 경험 로그 저장소였지만, 새 구조에서는 Problem과 Principle이 실무 문제와 판단 기준을 직접 담는다.
기술적으로 의미 있는 사례는 기존 Problem/Principle에 흡수했고, 개인 환경·도구 사용 메모는 백엔드 지식 시스템에서 제거했다.
이번 배치로 05-Case 폴더의 지식 마이그레이션을 완료했다.
```

### Batch 39. 레거시 폴더 잔여 정리 / unresolved placeholder 제거

정리 결과:

```text
01-Problem: 71개
02-Principle: 95개
03-Question: 53개

01-Question: 0개
02-Phenomenon: 0개
03-Concept: 0개
04-Principle: 0개
05-Case: 0개
06-Heuristic: 0개
```

추가 정리:

```text
OBSIDIAN-NOTE-RENEWAL-PLAN.md 안의 예시 링크 [Source](URL)를 일반 텍스트로 바꿔 unresolved placeholder 제거.
```

핵심 판단:

```text
이번 배치로 6-layer 레거시 폴더의 본문 파일 마이그레이션을 완료했다.
이제 지식 노트의 실제 운영 구조는 01-Problem, 02-Principle, 03-Question 중심이다.
다음 단계는 빈 레거시 폴더 처리 여부와 knowledge-architect extension/config를 3-layer 구조로 바꾸는 것이다.
```

### Batch 40. knowledge-architect extension/config 3-layer 전환

수정 결과:

```text
UPDATE .pi/knowledge-architect.json
UPDATE .pi/extensions/knowledge-architect/types.ts
UPDATE .pi/extensions/knowledge-architect/config.ts
UPDATE .pi/extensions/knowledge-architect/rules.ts
UPDATE .pi/extensions/knowledge-architect/note-guard.ts
UPDATE .pi/extensions/knowledge-architect/anki-tool.ts
UPDATE .pi/extensions/knowledge-architect/obsidian-tool.ts
UPDATE README.md
UPDATE AGENTS.md
UPDATE .agents/docs/note-templates.md
UPDATE .agents/docs/anki-cards.md
UPDATE .gemini/Manuals/*.md
```

핵심 변경:

```text
기존 NoteType:
Question | Phenomenon | Concept | Principle | Case | Heuristic

현재 NoteType:
Problem | Principle | Question

현재 폴더:
01-Problem   숫자 prefix: 01-, 02-, ...
02-Principle prefix: 본질-
03-Question  prefix: 탐구-
```

검증 규칙 변경:

```text
Problem required sections:
- ## 상황
- ## 관찰된 증거
- ## 원인
- ## 해결 방향
- ## 연결되는 본질
- ## 참고

Principle required sections:
- **핵심 질문**:
- ## 한 문장 정의
- ## 판단 기준
- ## 대표 문제
- ## 참고

Question required sections:
- ## 핵심 질문
- ## 파생 노트
```

Anki 관련:

```text
기존 Anki deck/model은 유지한다.
단, 대응 Obsidian 노트 검색 경로는 01-Problem / 02-Principle 중심으로 변경했다.
Scenario / Code Review / Implementation 중심 Anki 개편은 별도 후속 작업으로 남긴다.
```

검증:

```text
obsidian unresolved total = 0
legacy folder file count = 0
active structure = 01-Problem 71 / 02-Principle 95 / 03-Question 53
```

주의:

```text
프로젝트에 TypeScript package/tsconfig가 없어 extension TypeScript 컴파일 검증은 실행하지 못했다.
Obsidian link 검증과 구조 검증은 통과했다.
```

### Batch 41. 레거시 빈 폴더와 workspace stale path 정리

정리 결과:

```text
DELETE empty dir 01-Question/
DELETE empty dir 02-Phenomenon/
DELETE empty dir 03-Concept/
DELETE empty dir 04-Principle/
DELETE empty dir 05-Case/
DELETE empty dir 06-Heuristic/
```

Obsidian workspace 정리:

```text
UPDATE .obsidian/workspace.json
UPDATE .obsidian/workspace-mobile.json

- 삭제된 legacy folder를 가리키던 open file / lastOpenFiles 항목 제거
- workspace 내 legacy path 검색 결과 없음
```

최종 구조 검증:

```text
01-Problem   71
02-Principle 95
03-Question  53

legacy dirs deleted
obsidian unresolved total = 0
```

Git 상태 요약:

```text
D  363  legacy note deletion
M   20  docs/config/extension/workspace update
??   6  new 3-layer folders/templates/plans
```

후속 권장 작업:

```text
1. 변경량이 크므로 커밋은 최소 2개 이상으로 분리 권장
   - note migration: legacy 삭제 + 3-layer 노트 추가
   - system update: extension/config/docs/workspace 갱신
2. Anki Scenario / Code Review / Implementation 카드 체계는 별도 설계 작업으로 진행
```
