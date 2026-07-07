# Anki Card Generation Rules

## Current State

- Current deck: `💻::Keyword`
- Current model: `🧑🏻‍💻 Interview v2`
- Vault note structure: `01-Problem`, `02-Principle`, `03-Question`
- Future direction: Scenario / Code Review / Implementation cards based on Problem notes.

## Prerequisite

Before creating any card:
1. Check that a related note exists in `01-Problem/` or `02-Principle/`.
2. Show a preview to the user.
3. Wait for explicit approval.

## Field Rules

| Field | Rule |
|---|---|
| Question | Term name or recall cue |
| Answer | HTML Korean noun phrase |
| Type | Existing model values: `Concept`, `Principle`, `Phenomenon`, `Evidence` |
| Category | Short domain label |
| Difficulty | `Low`, `Medium`, `High` |
| Code | Required ASCII diagram or pseudocode |
| RelatedConcepts | Korean principle names only |

## Important

Do not create old per-layer decks such as `💻::01-Question` or `💻::03-Concept`. The active deck is `💻::Keyword` until Anki schema migration.
