# Note Templates by Type

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
