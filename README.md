# Backend Knowledge System

> 실무 문제를 구조화하고, 원리로 압축해서 다시 써먹기

## 3-Layer Note Structure

| Layer | Type | Prefix | Purpose |
|---|---|---|---|
| 01 | Problem (문제) | `01-`, `02-` | 장애, 성능 저하, 설계 실패, 디버깅 상황 |
| 02 | Principle (본질) | `본질-` | 반복 원리, 판단 기준, 트레이드오프 |
| 03 | Question (탐구) | `탐구-` | 원문 질문과 탐구 맥락 보존 |

## 3-Tool System

| Tool | Role |
|---|---|
| **Obsidian** | 구조화 — Problem과 Principle의 관계, 링크 |
| **Anki** | 회상 — 현재는 `💻::Keyword`, 이후 Scenario/Code Review/Implementation 중심 개편 예정 |
| **LLM** | 실행·검증 — 시나리오 연습, 판단기준 검증, 마이그레이션 보조 |

## 작성 원칙

- 새 지식은 가능하면 `Problem → Principle` 흐름으로 정리합니다.
- CS 지식만을 위한 노트보다 백엔드 실무 문제로 이어지는 노트를 우선합니다.
- Question은 삭제하지 않고 `03-Question/`에 보존합니다.
- 노트 작성/수정 후 `obsidian unresolved total`로 broken link를 확인합니다.

## 사용 환경

- 이 저장소는 ClaudeCode, Codex, OpenCode, pi 등 code agent와 함께 사용 가능합니다.
- 각 에이전트는 이 저장소의 `AGENTS.md`와 로컬 설정에 맞게 동작해야 합니다.

## Requirements

- Obsidian
- Anki + AnkiConnect
- 필요 시 사용하는 code agent

## Quick Start

```bash
git clone <repo-url> obsidian-note
cd obsidian-note
```

이후 원하는 code agent로 저장소를 열어 작업을 진행합니다.
