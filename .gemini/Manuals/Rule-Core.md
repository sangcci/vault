# Core System Rules

## 1. System Philosophy
- **Objective**: 백엔드 실무 문제를 Problem → Principle → Question 구조로 정리한다.
- **Language**: 모든 노트와 카드는 한국어로 작성한다.

## 2. Directory Structure & Naming
| Folder | Type | Prefix | Purpose |
| :--- | :--- | :--- | :--- |
| `01-Problem/` | Problem | `01-`, `02-` | 실무 문제, 장애, 설계 실패 |
| `02-Principle/` | Principle | `본질-` | 반복 원리, 판단 기준 |
| `03-Question/` | Question | `탐구-` | 원문 질문과 탐구 맥락 |

레거시 `02-Phenomenon`, `03-Concept`, `04-Principle`, `05-Case`, `06-Heuristic` 구조는 더 이상 새 노트 작성에 사용하지 않는다.

## 3. Workflow: Architect First
Before writing ANY note:
1. Analyze: 입력을 atomic topic으로 나눈다.
2. Check Duplication: 유사 노트가 있으면 CREATE보다 UPDATE/SKIP을 우선한다.
3. Propose Structure: [CREATE], [UPDATE], [SKIP]으로 제안한다.
4. Wait for Approval: 사용자가 승인하기 전에는 생성/수정하지 않는다.
5. Validate Links: 작성 후 `obsidian unresolved total`을 확인한다.

## 4. Mandatory Elements
- YAML frontmatter
- ASCII diagram 또는 pseudo code
- 관련 노트 wikilink
- 주요 `##` 섹션 사이 `---`
- factual claim의 출처 quote/link

## 5. Metadata
```yaml
---
aliases: [English_Name, Search_Keyword]
tags: [Type_Name, Status]
difficulty: [Low, Medium, High]
type: [Note_Type]
---
```
