# Backend Knowledge System (Obsidian & Anki)

**"구조적 사고(Structural Thinking)"를 위한 백엔드 엔지니어링 지식 저장소입니다.**

단순한 지식 나열이 아닌, **이해 -> 구조화 -> 인출**의 흐름을 통해 면접과 실무에서 즉각적으로 활용할 수 있는 "살아있는 지식 체계"를 구축하는 것이 목표입니다.

---

## 6-Layer Thought Structure

이 저장소는 백엔드 지식을 6가지 계층으로 분리하여 관리합니다.

| Layer | Type | Prefix | Purpose | Metaphor |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Question (탐구)** | `탐구-` | **"Why & How?"** (메커니즘, 내부 동작 원리) | 엔진의 폭발 행정 |
| **02** | **Phenomenon (현상)** | `현상-` | **"Symptom"** (에러, 병목, 이상 현상) | 감기 증상 |
| **03** | **Concept (개념)** | `개념-` | **"Solution / Tool"** (기술 용어, 해결책) | 처방전 (약) |
| **04** | **Principle (본질)** | `본질-` | **"Invariant Law"** (불변의 물리 법칙) | 에너지 보존 법칙 |
| **05** | **Case (사례)** | `사례-` | **"Experience"** (장애 로그, 트러블슈팅) | 블랙박스 분석 |
| **06** | **Heuristic (판단기준)** | `판단기준-` | **"Strategy"** (의사결정 나침반) | 안전 운전 수칙 |

---

## Gemini CLI Automation System

이 프로젝트는 **Gemini CLI**와 커스텀 **Hook 시스템**을 활용하여 지식 관리 프로세스를 자동화했습니다.

### 1. 주요 기능 (Key Features)
-   **Knowledge Architect**: 복잡한 주제(예: "Redis 싱글 스레드")를 입력하면, 자동으로 6-Layer 구조에 맞춰 필요한 노트들을 설계하고 제안합니다. ("선 제안, 후 실행")
-   **Auto-Manual Injection (Hook)**: 사용자가 매뉴얼을 찾지 않아도, 상황에 맞는 규칙(`Rule-*.md`)을 AI 프롬프트에 자동으로 주입하여 컨벤션을 강제합니다.
-   **Anki Card Generation**: 작성된 노트를 바탕으로 면접용 Anki 카드를 생성합니다. (생성 전 사용자 컨펌 필수)

### 2. 사용법 (How to Use)
1.  **질문하기**: `Gemini CLI`에서 "가상 메모리 개념 정리해줘"라고 입력.
2.  **설계 승인**: AI가 제안하는 지식 구조(Concept, Principle 등)를 확인하고 승인.
3.  **카드 생성**: "이 내용으로 Anki 카드 만들어줘"라고 입력하여 Anki로 내보내기.

---

## Requirements & Setup

### 1. Obsidian Configuration
-   **Theme**: `Minimal Theme`
-   **Font**:
    -   **Code**: `SFMono`
    -   **UI/Text**: `Pretendard`
-   **Essential Plugins**:
    -   **`Ink`**: 손글씨/그림 (복잡한 개념 시각화)
    -   **`Anki Connect`**: Obsidian -> Anki 카드 생성 연동

### 2. Gemini CLI Setup
시스템의 핵심 설정은 `.gemini/` 폴더에 격리되어 있습니다.

-   **Config**: `.gemini/config.json` (Hook 등록)
-   **Manuals**: `.gemini/Manuals/` (AI 행동 지침서 - SSOT)
-   **Hooks**: `.gemini/hooks/` (자동화 스크립트)
-   **MCPs**: `Anki Mcp`, `Context7(Optional)` (MCP)

> **Note**: 이 시스템의 모든 규칙은 `.gemini/Manuals/`에 정의되어 있으며, 루트의 `GEMINI.md`는 단순 진입점 역할만 합니다.

---

## 🚀 Getting Started

```bash
# 1. Clone Repository
git clone <repo-url> obsidian-note

# 2. Open in Obsidian
# (Ensure Anki is running with AnkiConnect installed)

# 3. Start Gemini CLI
cd obsidian-note
gemini
```
