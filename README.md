# Backend Knowledge System

**"구조적 사고(Structural Thinking)"**
단순한 지식 나열이 아닌, **이해 -> 구조화 -> 암기**의 흐름.
## 6-Layer Thought Structure

백엔드 지식을 6가지 계층으로 분리하여 관리.

| Layer  | Type                 | Prefix  | Purpose                            | Metaphor  |
| :----- | :------------------- | :------ | :--------------------------------- | :-------- |
| **01** | **Question (탐구)**    | `탐구-`   | **"Why & How?"** (메커니즘, 내부 동작 원리)  | 엔진의 폭발 행정 |
| **02** | **Phenomenon (현상)**  | `현상-`   | **"Symptom"** (에러, 병목, 이상 현상)      | 감기 증상     |
| **03** | **Concept (개념)**     | `개념-`   | **"Solution / Tool"** (기술 용어, 해결책) | 처방전 (약)   |
| **04** | **Principle (본질)**   | `본질-`   | **"Invariant Law"** (불변의 물리 법칙)    | 에너지 보존 법칙 |
| **05** | **Case (사례)**        | `사례-`   | **"Experience"** (장애 로그, 트러블슈팅)    | 블랙박스 분석   |
| **06** | **Heuristic (판단기준)** | `판단기준-` | **"Strategy"** (의사결정 나침반)          | 안전 운전 수칙  |
## Claude Code Automation System

Claude Code를 Knowledge Architect로 사용. 단순 메모 도구가 아닌 **구조 설계자** 역할.

| 기능                  | 설명                                                 |
| :------------------ | :------------------------------------------------- |
| **Architect First** | 노트 작성 전 구조 분석 → 파일 목록 제안 → 승인 후 생성                 |
| **중복 감지**           | 기존 파일 탐색 후 CREATE / UPDATE / SKIP 자동 판단            |
| **Anki 카드 생성**      | AnkiConnect API를 통해 노트에서 카드 자동 생성                  |
| **Hook 검증**         | 노트 저장 시 템플릿 규칙 자동 검증 (`validate-note.js`)          |
|                     | Anki 카드 전송 전 필드 규칙 자동 검증 (`validate-anki-card.js`) |

## Requirements

### Tools
- [Claude Code](https://claude.ai/code) — Knowledge Architect AI
- [Anki](https://apps.ankiweb.net/) + [AnkiConnect](https://ankiweb.net/shared/info/2055492159) — 플래시카드 연동

### Obsidian Plugins
- **Dataview** — 노트 쿼리 및 Homepage 동적 표시
- **Homepage** — 앱 시작 시 지정 노트 자동 오픈

## How to start
```bash
# 1. Clone Repository
git clone <repo-url> obsidian-note

# 2. Open in Obsidian
# (Ensure Anki is running with AnkiConnect installed)

# 3. Start Claude Code
cd obsidian-note
claude
```
