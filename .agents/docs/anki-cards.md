# Anki Card Rules

## 현재 상태

- 현재 도구와 Anki 모델은 기존 `💻::Keyword` / `🧑🏻‍💻 Interview v2`를 유지한다.
- 지식 노트 구조는 `Problem / Principle / Question`으로 바뀌었다.
- 이후 Anki는 Keyword 중심에서 Scenario / Code Review / Implementation 중심으로 개편 예정.

## Atomicity

One card = one recall target.

## Model

- **Model Name**: `🧑🏻‍💻 Interview v2`
- **Deck**: `💻::Keyword` only, until schema migration.

## Prerequisite Before Card Creation

Before creating any card, verify:
1. 대응되는 Obsidian 노트가 `01-Problem/` 또는 `02-Principle/`에 존재하는가?
2. 없다면 노트를 먼저 구조화한다.
3. 카드 생성 전 preview를 보여주고 사용자 승인을 받는다.

## Fields

| Field | Rule |
|---|---|
| Question | 용어명 또는 회상 cue |
| Answer | HTML 한 줄 한국어 명사구 |
| Type | 기존 모델 제약상 `Concept`, `Principle`, `Phenomenon`, `Evidence` 중 선택 |
| Category | `DB`, `Java`, `Spring`, `Network`, `OS`, `Security`, `Architecture` 등 |
| Difficulty | `Low`, `Medium`, `High` |
| Code | 필수. 한국어 ASCII diagram 또는 pseudocode |
| RelatedConcepts | 한국어 원리명 1~3개 |

## Answer Format

```html
<b>한 줄 명사구</b>
```

- `~입니다`, `~합니다`, `~한다`, `~이다` 지양.
- 예시와 메커니즘은 Code 필드로 보낸다.

## Tool Usage

- raw curl보다 `anki_add_keyword_card` tool을 우선 사용한다.
- 카드 생성 전 반드시 사용자에게 preview를 보여주고 승인받는다.

## Future Direction

- Problem 기반 Scenario 카드
- Code Review 판단 카드
- Implementation 선택 카드

이 개편 전까지 기존 Keyword 규칙을 유지한다.
