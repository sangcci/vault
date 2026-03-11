# Knowledge Architect — System Rules

## 1. System Philosophy
- **Objective**: Structural thinking for backend interviews.
- **Language**: Korean (한국어) is mandatory for all notes and cards.

## 2. Directory Structure & Naming
| Folder | Type | Prefix | Purpose |
| :--- | :--- | :--- | :--- |
| `01-Question/` | Question | `탐구-` | Mechanism & Why |
| `02-Phenomenon/` | Phenomenon | `현상-` | Symptoms & Errors |
| `03-Concept/` | Concept | `개념-` | Tools & Solutions |
| `04-Principle/` | Principle | `본질-` | Invariant Laws |
| `05-Case/` | Case | `사례-` | Incidents & Logs |
| `06-Heuristic/` | Heuristic | `판단기준-` | Decision Strategy |

## 3. Workflow: Architect First (설계 우선)
Before writing ANY note, you must analyze the user input and propose a structural plan.

1. **Analyze**: Break down the input into atomic topics.
2. **Check Duplication**: Before proposing a new file, check if a similar file already exists. If it exists, propose UPDATE or SKIP instead of CREATE.
3. **Propose Structure**: List files to create/update. Mark as `[CREATE]`, `[UPDATE]`, or `[SKIP]`. Briefly explain why each file is needed.
4. **Wait for Approval**: Do NOT create files until the user says "Go".

### 필수 구성 요소
모든 지식 노트는 다음을 반드시 포함:
- **Visual/Logic Evidence**: ASCII Diagram 또는 Pseudo Code 필수 포함
- **Reference**: 관련 노트와의 연결 (`[[링크]]`) 적극 활용

### Boundary Rules
- **Explicit Only**: 입력에서 명시되거나 직접 암시된 주제만 추출
- **No Hallucination**: 목록 채우기용 관련 주제 발명 금지
- **Atomicity**: 노트 하나에 주제 하나. 복잡한 아이디어는 분리

## 4. Auto-Classification Guide
- **Question (탐구)**: "Why does it work this way?" → 내부 메커니즘, 호기심
- **Phenomenon (현상)**: "What is this problem/symptom?" → Deadlock, Latency, Error
- **Concept (개념)**: "What tool/term solves this?" → Docker, Mutex, Index
- **Principle (본질)**: "What is the unchanging law?" → Atomicity, Consistency
- **Case (사례)**: "What actually happened?" → Incident log, Experience
- **Heuristic (판단기준)**: "How should I decide?" → Strategy, Checklist

## 5. Metadata (YAML)
모든 노트는 다음으로 시작해야 함:
```yaml
---
aliases: [English_Name, Search_Keyword]
tags: [Type_Name, Status]  # Status: 작성중, 검증됨, 완료
difficulty: [Low, Medium, High]
type: [Note_Type]
---
```

---

## 6. Note Templates by Type

### Question (탐구) — `01-Question/탐구-<Title>.md`
```markdown
---
aliases: []
tags: [탐구, 작성중]
type: Question
difficulty: Medium
---

## 핵심 질문 (Core Question)

> (What specifically are we trying to solve?)

## 가설 및 추론 (Hypothesis)

- ...

## 검증 및 팩트 (Verification)

- ...

## 결론 (Conclusion)

- ...

## 연결된 개념 (Links)

- [[개념-...]]
```

### Phenomenon (현상) — `02-Phenomenon/현상-<Title>.md`
```markdown
---
aliases: []
tags: [현상, 작성중]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) ...
> (이해용) ...

## 발생 환경 (Context)

- When does this happen?

## 관찰되는 증상 (Symptoms)

- Latency spike? CPU saturation?

## 추측되는 원인 (Root Cause)

- Link to [[개념-...]] or [[본질-...]]

## 관련 사례 (Related Cases)

- [[사례-...]]
```

### Concept (개념) — `03-Concept/개념-<Title>.md`
```markdown
---
aliases: []
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) Accurate technical definition.
> (이해용) Intuitive analogy or simple explanation.

## 해결하는 문제 (Problem Solved)

- What phenomenon does this solve?

## 치르는 비용 (Cost/Trade-off)

- Nothing is free. What is the cost?

## 동작 원리 (Mechanism)

- How does it work?

## 관련 본질 (Related Principles)

- [[본질-...]]
```

### Principle (본질) — `04-Principle/본질-<Title>.md`
```markdown
---
aliases: []
tags: [본질, 작성중]
type: Principle
difficulty: High
---

**핵심 질문**: "<This principle answers this fundamental question>"

## 한 문장 정의 (Definition)

> (사전적) ...
> (이해용) ...

## 사용 예시 (Examples)

1. (Real-world usage 1)
2. (Real-world usage 2)
3. (Real-world usage 3)

## 트레이드오프 (Trade-off)

- What do we gain and what do we lose?

## 왜 사라지지 않는가 (Persistence)

- Why is this important regardless of technology changes?

## 다른 모습들 (Polymorphism)

- How does this appear in OS? In DB? In Network?
```

### Case (사례) — `05-Case/사례-<Title>.md`
```markdown
---
aliases: []
tags: [사례, 작성중]
type: Case
difficulty: Low
---

## 상황 (Situation)

- What was the environment?

## 실제 발생한 일 (What Happened)

- The raw facts.

## 근본 원인 (Root Cause)

- Connected to [[본질-...]] or [[현상-...]]

## 교훈 및 조치 (Lessons & Fixes)

- Action items.
```

### Heuristic (판단기준) — `06-Heuristic/판단기준-<Title>.md`
```markdown
---
aliases: []
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준 (Criteria)

- When to choose A vs B?

## 효과적인 상황 (Effective When)

- ...

## 실패하는 상황 (Fails When)

- ...
```

---

## 7. Anki Card Rules (카드 생성 시 적용)

### Atomicity
- One Card = One Concept. 3가지 포인트 → 3장의 카드.

### Model & Field Format
- **Model Name**: `🧑🏻‍💻 Interview v2`
- **Fields**:
  - **Question**:
    - **Keyword 덱**: 용어명만 (예: `임계 구역 (Critical Section)`)
    - **Q&A 덱**: 면접 질문 형태 (예: `Redis는 왜 싱글 스레드인가?`)
  - **Answer**: HTML format.
    - **Keyword 덱**: 한 줄 핵심 정의 + 키워드가 문맥에 녹아든 짧은 설명문
    - **Q&A 덱**: 결론 먼저 → 근거 → 키워드
    - **IMPORTANT**: 키워드를 단순 나열하지 말 것. 모르는 용어가 갑자기 등장하면 안 됨. 키워드는 반드시 이해 가능한 문장 속에 포함되어야 함.
    ```html
    <!-- Keyword 덱 예시 -->
    <b>한 번에 1스레드만 진입을 허용하는 코드 블록</b><br>
    • 공유 데이터를 보호하기 위해 상호 배제(Mutual Exclusion) 적용<br>
    • 이걸 안 지키면 → 경쟁 조건(Race Condition) 발생

    <!-- Q&A 덱 예시 -->
    <b>[핵심 결론 한 줄]</b><br>
    • 근거 1<br>
    • 근거 2<br>
    • 키워드: ..., ...
    ```
  - **Type**: `Concept` / `Principle` / `Question` / `Phenomenon` / `Case` / `Heuristic`
  - **Category**: `OS` / `Network` / `DB` / `Redis` / `Java` / `Spring`
  - **Difficulty**: `Low` / `Medium` / `High`
  - **Code**: (Optional)
  - **RelatedConcepts**: (Optional, comma-separated)
  - **Image**: (Optional, leave empty unless file explicitly provided)

### Tool Usage — CRITICAL
- **DO NOT use `batch_create_notes`** (fails with custom note types)
- **MUST use `create_note` iteratively**, one call per card

### Deck Assignment (2-Deck System)
- **`💻::Keyword`**: Concept, Principle, Phenomenon 타입 → 즉시 연상 (5초 내)
- **`💻::Q&A`**: Question, Case, Heuristic 타입 → 면접 답변 연습 (30초 내)

### Code Field — ASCII Diagram 적극 활용
- Code 필드에 ASCII 다이어그램 또는 Pseudo Code를 적극 포함
- 시각적 회상 단서로 활용

### Speaking-Oriented
- Full sentences (`~입니다`, `~합니다`) 사용 금지
- **Keyword 덱**: 키워드 3~5개 + 한 줄 정의. 5초 내 연상.
- **Q&A 덱**: 결론 먼저 → 근거 → 키워드. 30초 내 말할 수 있는 답변.

### User Confirmation — MANDATORY
카드 생성 전 반드시:
1. 생성할 카드 내용 (표 또는 JSON) 사용자에게 먼저 보여주기
2. 명시적 승인 요청
3. 사용자의 "Yes" 또는 "확인" 대기
- 이 단계를 건너뛰는 것은 시스템 위반
