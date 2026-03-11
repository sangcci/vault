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

> (What are we trying to solve?)

## 가설 및 추론

- ...

## 검증 및 팩트

- ...

## 결론

- ...

## 연결된 개념

- [[개념-...]]
```

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
---

## 상황

- Environment?

## 실제 발생한 일

- Raw facts.

## 근본 원인

- [[본질-...]] or [[현상-...]]

## 교훈 및 조치

- Action items.
```

### Heuristic — `06-Heuristic/판단기준-<Title>.md`
```markdown
---
aliases: []
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준

- When to choose A vs B?

## 효과적인 상황

- ...

## 실패하는 상황

- ...
```
