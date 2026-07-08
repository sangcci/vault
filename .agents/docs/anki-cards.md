# Anki Card Rules

## 현재 상태

- 주 학습 덱은 `💻::Problem Solving`이다.
- 주 모델은 `🧑🏻‍💻 Problem Solving v1`이다.
- `💻::Keyword`는 유지 카드 53장 중심의 보조 덱으로 남긴다.
- 지식 노트 구조는 `Problem / Principle / Question`이다.
- 카드 데이터와 리뷰 기록은 git으로 관리하지 않는다.
- Anki 모델/CSS/템플릿/덱 옵션 설정은 `.anki/`에서 git으로 관리한다.

## Atomicity

One card = one recall target.

## Problem Solving Model

- **Model Name**: `🧑🏻‍💻 Problem Solving v1`
- **Deck**: `💻::Problem Solving`

## Fields

| Field | Rule |
|---|---|
| Question | 실무 상황, 판단 질문, 구현 과제 |
| Answer | 핵심 판단과 이유를 짧게 설명 |
| CardType | `Scenario`, `Code Review`, `Implementation` 중 하나 |
| Problem | 연결되는 `01-Problem/` 노트명 |
| Principles | 연결되는 `02-Principle/` 원리명 |

## CardType 기준

| CardType | 목적 |
|---|---|
| Scenario | 장애/설계 상황에서 원인과 해결 방향 회상 |
| Code Review | 코드/SQL/설정 조각을 보고 위험을 식별 |
| Implementation | 구현 선택지와 절차를 회상 |

## Prerequisite Before Card Creation

Before creating any card, verify:

1. 대응되는 Obsidian 노트가 `01-Problem/` 또는 `02-Principle/`에 존재하는가?
2. 없다면 노트를 먼저 구조화한다.
3. 카드 생성 전 preview를 보여주고 사용자 승인을 받는다.
4. 기존 Keyword와 중복되면 Problem 카드 생성 후 Keyword는 suspend/delete 후보로 처리한다.

## Keyword Deck

`💻::Keyword`는 legacy/보조 덱이다.

- 신규 Keyword 카드는 예외적으로만 만든다.
- `anki_add_keyword_card` tool은 이 legacy Keyword 카드 생성용이다.
- Problem 기반 회상은 `💻::Problem Solving`을 우선한다.

## Tool Usage

- 카드 생성/삭제/모델 변경 전 반드시 사용자에게 preview 또는 변경 요약을 보여주고 승인받는다.
- AnkiConnect를 사용할 때는 카드 데이터 전체를 git에 저장하지 않는다.
- 필요한 경우 결과 요약만 `00-Meta/` 리포트에 남긴다.
