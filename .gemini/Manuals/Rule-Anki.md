# Anki Card Generation Rules

## Current State

- Primary deck: `💻::Problem Solving`
- Primary model: `🧑🏻‍💻 Problem Solving v1`
- Legacy/support deck: `💻::Keyword`
- Vault note structure: `01-Problem`, `02-Principle`, `03-Question`
- Anki model/CSS/template/deck-option settings are exported under `.anki/`.
- Card data, review history, and scheduling data are not stored in git.

## Prerequisite

Before creating any card:

1. Check that a related note exists in `01-Problem/` or `02-Principle/`.
2. Show a preview to the user.
3. Wait for explicit approval.
4. If the card replaces a Keyword card, suspend/delete the old Keyword only after the Problem card exists.

## Problem Solving Field Rules

| Field | Rule |
|---|---|
| Question | Scenario, code review prompt, or implementation prompt |
| Answer | Short Korean explanation of the key judgment |
| CardType | `Scenario`, `Code Review`, or `Implementation` |
| Problem | Related `01-Problem/` note name |
| Principles | Related `02-Principle/` names |

## Keyword Deck

`💻::Keyword` is now a support deck for retained keyword cards.

- Do not create old per-layer decks such as `💻::01-Question` or `💻::03-Concept`.
- New recall cards should usually go to `💻::Problem Solving`.
- Keyword cards are exceptional and should use the legacy Keyword model only with explicit approval.

## Important

Do not export full card data or review history into git. Store only model fields, CSS, templates, and deck options under `.anki/`.
