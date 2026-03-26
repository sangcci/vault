# Note Templates

### Question — `01-Question/탐구-<Title>.md`
```markdown
---
aliases: []
tags: [탐구, 작성중]
type: Question
difficulty: Medium
---

## 핵심 질문

> User's exact words. Do NOT fix grammar or logic errors. Do NOT rephrase.

## 파생 노트

- [[...]]
```
> WARNING: Derived notes must NOT be left empty. This note serves as the entry point to all linked notes.

### Phenomenon — `02-Phenomenon/현상-<Title>.md`
```markdown
---
aliases: []
tags: [현상, 작성중]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의

> (사전적) ...
> (이해용) ...

## 발생 환경

- When does this happen?

## 관찰되는 증상

- Latency spike? CPU saturation?

## 추측되는 원인

- [[개념-...]] or [[본질-...]]

## 관련 사례

- [[사례-...]]
```

### Concept — `03-Concept/개념-<Title>.md`
```markdown
---
aliases: []
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Accurate technical definition.
> (이해용) Intuitive analogy.

## 해결하는 문제

- What phenomenon does this solve?

## 치르는 비용

- What is the trade-off?

## 동작 원리

- How does it work?

## 관련 본질

- [[본질-...]]
```

### Principle — `04-Principle/본질-<Title>.md`
```markdown
---
aliases: []
tags: [본질, 작성중]
type: Principle
difficulty: High
---

**핵심 질문**: "<fundamental question this principle answers>"

## 한 문장 정의

> (사전적) ...
> (이해용) ...

## 사용 예시

1. ...
2. ...
3. ...

## 트레이드오프

- What do we gain and lose?

## 왜 사라지지 않는가

- Why does this persist regardless of tech changes?

## 다른 모습들

- How does this appear in OS? DB? Network?
```

### Case — `05-Case/사례-<Title>.md`
```markdown
---
aliases: []
tags: [사례, 작성중]
type: Case
difficulty: Low
# Input: A real event you experienced, observed, or a public incident report
# Trigger: "I did X and Y happened", "There was a problem with Z"
---

## 상황

- Environment, context

## 실제 발생한 일

- Facts only. No interpretation. When explaining another concept, stop and use [[link]] instead.

## 근본 원인

- [[본질-...]] or [[현상-...]]

## 교훈 및 조치

- What will you do differently next time?

## 파생 판단기준

- [[판단기준-...]]
```
> Omit 파생 판단기준 if no generalizable rule emerges from the lessons.

### Heuristic — `06-Heuristic/판단기준-<Title>.md`
```markdown
---
aliases: []
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
# Input: Recurring decision situations, A vs B trade-offs
# Trigger: "When should I use X?", "How do I choose between X and Y?"
# Origin: Derived from Case, or created independently
---

## 판단 기준

- If condition A → choose X
- If condition B → choose Y

## 효과적인 상황

- ...

## 실패하는 상황

- ...

## 출처

- [[사례-...]]
```
> Omit 출처 if not derived from a Case note.
