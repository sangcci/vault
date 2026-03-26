# Obsidian & Anki 백엔드 지식 시스템 가이드

> 이 문서는 **사용자(인간)를 위한 시스템 정의서**입니다.
> AI를 위한 동작 규칙은 `@obsidian-note/CLAUDE.md`에 정의되어 있습니다.

## 1. 시스템 철학 (Core Philosophy)

- **목적**: 단순 지식 저장이 아닌, **면접에서 "말이 나오는" 구조적 사고 훈련**.
- **구조**: `Obsidian`(깊은 이해) + `Anki`(반사적 인출/말하기).
- **언어**: 모든 노트와 카드는 **한국어** 작성을 원칙으로 한다.

## 2. 폴더 및 노트 타입 (Directory Structure)

| 폴더 | 노트 타입 | 목적 | 비유 |
| :--- | :--- | :--- | :--- |
| `01-Question/` | **Question** | 기술의 **내부 원리**와 메커니즘 탐구 | 엔진의 폭발 행정 이해 |
| `02-Phenomenon/` | **Phenomenon** | 관찰되는 문제, 부작용, 에러 상태, 이상 현상 | 증상 (Symptom) |
| `03-Concept/` | **Concept** | 현상을 해결/제어하기 위한 **기술적 도구/용어** | 처방전 (Cure) |
| `04-Principle/` | **Principle** | 변하지 않는 **물리 법칙**과 본질 | 에너지 보존 법칙 |
| `05-Case/` | **Case** | 실제 장애/운영 사례와 **전쟁터의 기록** | 사고 블랙박스 분석 |
| `06-Heuristic/` | **Heuristic** | 엔지니어를 위한 **전략적 나침반/판단 기준** | 안전 운전 수칙 |

### ⚖️ Question vs Heuristic 구분 가이드
- **Question (무엇이 왜?)**: "Docker의 격리 원리는?" 등 기술의 속살을 파헤치는 공부의 흔적입니다.
- **Heuristic (무엇을 어떻게?)**: "보안이 중요한 자원은 무조건 VM으로 격리하라" 등 복잡한 상황에서 내리는 **의사결정의 원칙**입니다.
- **문서의 이동**: 공부(Question)를 통해 얻은 결론이 명확한 전략이 된다면, 판단 기준만 **Heuristic**으로 옮겨 한 줄 요약하고 해당 Question을 링크로 연결합니다.

## 3. 작성 규칙 (Writing Rules)

### 3.1 Obsidian 노트

- **메타데이터 (YAML Front Matter)**: 모든 노트 최상단에 속성(Properties)을 정의하여 데이터로서 관리합니다.
  - `aliases`: [영문명, 별칭] - 검색 편의성 증대.
  - `tags`: [분류, 상태] - 시스템 내 위치 및 작업 진행률 파악.
  - `difficulty`: [Low, Medium, High] - 면접 대비 난이도.
  - `type`: [Question, Phenomenon, Concept, Principle, Case, Heuristic] - 노트 유형.
- **핵심 질문 (Required)**: 모든 Principle 노트는 YAML 블록 직후에 본문의 인트로로서 **핵심 질문**을 명시합니다.
- **한 문장 정의 (필수)**: 
  1. **사전적 정의**: 정확하고 기술적인 정의.
  2. **이해용 정의**: 직관적이고 쉬운 풀이 (보호막, 약속 등 비유 허용).
- **시각화 (Ink Plugin)**: 
  - 복잡한 개념은 `Ink` 플러그인을 사용해 직접 그려서 설명합니다.
  - 저장 경로: `Ink/Drawing/` (파일명은 자동 생성됨, 예: `2026.2.6 - 17.14pm.svg`).
  - 삽입 방식: 노트 내에 `![InkDrawing](<Ink/Drawing/...svg>)` 형태로 링크.
- **Principle 노트**: 실무에서 이 용어가 어떻게 쓰이는지 **사용 예시 문장 3개** 포함.
- **링크**: 연결의 **이유**를 명시 (예: `[[원자성]] - 일관성을 위해 포기한 것`).

### 3.2 Anki 카드 (면접 훈련용)

- **원자화 원칙 (Atomicity)**: 하나의 카드는 **단 하나의 질문**만 다룹니다. 복잡한 개념은 여러 개의 '꼬리 질문' 카드로 쪼개어 생성합니다.
- **필드 구조**: `Question`, `Answer`, `Type`, `Category`, `Difficulty`, `Code`, `RelatedConcepts`, `Image`
- **답변 표준 포맷 (Standardized Format)**:
  - **<b>[핵심 결론]</b>**: 가장 중요한 한 줄 답변 (Bold 태그 사용).
  - **• 키워드**: 답변을 뒷받침하는 핵심 단어 2~3개.
  - **• [맥락/비유]**: 실무 사례(예: Redis, Kafka) 또는 직관적 비유.
- **스타일**: **완전한 문장 금지**. 키워드와 구(Phrase) 위주로 작성하여 **30초 내 말하기**가 가능하도록 합니다.
- **캐싱(Caching)**: 자주 찾는 명령어, 단축키, 핵심 API 등은 이해보다 '반사적 인출'을 위해 별도로 카드로 관리합니다.

## 4. 노트 템플릿 (Reference)

### Phenomenon (현상)
```markdown
---
aliases: [<English>]
tags: [현상, 작성중]
type: Phenomenon
---
# Phenomenon: <이름>
## 한 문장 정의
> (사전적) ...
> (이해용) ...
## 발생 환경 (Context)
## 관찰되는 증상
## 추측되는 원인 (Links to Concept/Principle)
## 관련 사례
```

### Concept (개념)
```markdown
---
aliases: [<English>]
tags: [개념, 작성중]
type: Concept
---
# Concept: <이름>
## 한 문장 정의
> (사전적) ...
> (이해용) ...
## 해결하는 문제
## 치르는 비용
## 열린 질문
## 관련 본질 / 사례
```

### Principle (본질)
```markdown
---
aliases: [<English>]
tags: [본질, 작성중]
type: Principle
---
# Principle: <이름>
**핵심 질문**: "..."
## 한 문장 정의
> (사전적) ...
> (이해용) ...
## 사용 예시 (문장 3개)
## 반복되는 핵심 문제
## 왜 사라지지 않는가
## 트레이드오프
## 다른 모습들 (Appears As)
## 관련 사례
```

### Case (사례)
```markdown
# Case: <Incident Summary>
## Situation
## What Actually Happened (Misunderstandings)
## Root Cause (Connected Principle)
## Lessons & Fixes
```

### Heuristic (판단 기준)
```markdown
# Heuristic: <One-sentence Rule>
## Criteria
## Effective When
## Fails When
```