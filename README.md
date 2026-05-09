# Backend Knowledge System

> 개념의 구조화 + 잘 기억해서 다른 곳에 써먹기

## 6-Layer Note Structure

| Layer | Type | Prefix | Purpose |
|---|---|---|---|
| 01 | Question (탐구) | `탐구-` | Why & How |
| 02 | Phenomenon (현상) | `현상-` | 증상, 에러, 병목 |
| 03 | Concept (개념) | `개념-` | 도구, 기술 용어 |
| 04 | Principle (본질) | `본질-` | 불변 법칙 |
| 05 | Case (사례) | `사례-` | 경험, 장애 로그 |
| 06 | Heuristic (판단기준) | `판단기준-` | 의사결정 전략 |

## 3-Tool System

| Tool | Role |
|---|---|
| **Obsidian** | 구조화 — 개념 간 관계, 비유, 링크 |
| **Anki** | 즉시 회상 — `💻::Keyword` 단일 덱 |
| **LLM** | 실행·검증 — 시나리오 연습, 판단기준 검증 |

도구별 역할 분리는 PACER 프레임워크와 `00-Meta/SYSTEM-WORKFLOW.md`를 따릅니다.

## 사용 환경

- 이 저장소는 ClaudeCode, Codex, OpenCode 등 모든 code agent와 함께 사용 가능합니다
- 단, 각 에이전트는 이 저장소의 `AGENTS.md`와 로컬 설정에 맞게 동작하도록 맞춰 써야 합니다
- 현재는 Codex에 맞춰서 작동하도록 설계되었습니다. 

## Requirements

- Obsidian
- Anki + AnkiConnect
- 필요 시 사용하는 code agent (Claude Code, Codex, pi 등)

## Quick Start

```bash
git clone <repo-url> obsidian-note
cd obsidian-note
```

이후에는 원하는 code agent로 저장소를 열어 작업 진행
