# Note Templates

현재 노트 구조는 3-layer입니다.

## Problem — `01-Problem/NN-<Title>.md`

```markdown
---
aliases: [English_Name, Search_Keyword]
tags: [문제, 작성중]
difficulty: Medium
type: Problem
---

# Problem: NN-문제 제목

## 상황

어떤 서비스/업무/코드 흐름에서 문제가 발생했는가?

---

## 관찰된 증거

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

## 원인

왜 이 구조에서 문제가 발생하는가?

---

## 해결 방향

무엇을 확인하고 어떻게 완화/해결할 것인가?

---

## 연결되는 본질

- [[본질-...]]

---

## 참고

> "exact quote" — [Source](https://example.com)
```

## Principle — `02-Principle/본질-<Title>.md`

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

## 판단 기준

```text
상황 → 기준 → 선택
```

---

## 대표 문제

- [[관련 Problem]]

---

## 참고

> "exact quote" — [Source](https://example.com)
```

## Question — `03-Question/탐구-<Title>.md`

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

- [[관련 Problem]]
- [[관련 Principle]]
```

레거시 `Phenomenon`, `Concept`, `Case`, `Heuristic` 템플릿은 더 이상 사용하지 않습니다.
