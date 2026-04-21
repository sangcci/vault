# Backend Knowledge System

> 정보를 기억하는 게 아니라, 문제를 논리적으로 푸는 것.

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

도구 간 역할 분담은 PACER 프레임워크 기준. → `00-Meta/SYSTEM-WORKFLOW.md`
## Requirements

- [Claude Code](https://claude.ai/code) — Knowledge Architect
- [Anki](https://apps.ankiweb.net/) + [AnkiConnect](https://ankiweb.net/shared/info/2055492159)
- Obsidian plugins: **Dataview**, **Homepage**

## Quick Start

```bash
git clone <repo-url> obsidian-note
cd obsidian-note
claude
```
