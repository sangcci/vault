---
tags: [요약, AI, 시스템]
created: 2026-02-21
source: https://www.youtube.com/watch?v=7vihh_G_434
channel: 메이커 에반
---

# 요약: 개발자가 AI 길들이는 데 6개월 걸린 이유

> **핵심 메시지**: "AI는 그냥 쓰면 50점짜리 도구지만, 시스템을 만들어주면 95점짜리 파트너가 된다."

## 1. 문제 정의 (The Problem)
8년 차 개발자가 6개월간 레거시 코드를 재작성하며 겪은 AI의 한계:
1.  **기억 상실 (Goldfish Memory)**: 대화가 길어지면 30분 전의 지시사항을 잊어버림.
2.  **매뉴얼 무시 (Ignoring Instructions)**: 아무리 상세한 컨벤션 문서를 줘도 읽지 않거나, 편한 대로 작성함.
3.  **환각 및 실수 (Hallucination & Errors)**: "다 했습니다"라고 보고하지만, 실제로는 에러가 있거나 누락된 부분이 많음.

## 2. 해결책: 4가지 시스템 (The 4 Systems)

이 영상에서 제안한 4가지 시스템을 우리 프로젝트(`Obsidian-Note`)에 어떻게 적용했는지 매핑했습니다.

### System 1: 자동 매뉴얼 (Auto-Manual)
- **개념**: AI가 매뉴얼을 읽지 않으니, 특정 상황(키워드, 파일 위치)에서 **강제로 매뉴얼을 주입**하는 시스템.
- **구현 (Gemini CLI)**:
    - `.gemini/hooks/inject-manual.js`
    - 사용자가 "개념", "Anki" 등을 언급하면 `Rule-Concept.md`, `Rule-Anki.md`를 프롬프트 최상단에 자동 주입.

### System 2: 작업 기억 (Working Memory)
- **개념**: AI의 기억력에 의존하지 않고, **외부 문서(계획서, 체크리스트)**를 통해 맥락을 유지함.
- **구현 (Gemini CLI)**:
    - `knowledge-architect` Skill
    - "선 제안, 후 실행" 프로세스. 작업을 시작하기 전에 **지식 구조(설계도)**를 먼저 작성하고 승인받게 함으로써, 이것이 작업 기억 역할을 수행.

### System 3: 자동 품질 검사 (Auto-Quality Check)
- **개념**: AI가 결과물을 내놓는 순간, **자동으로 검사**하여 불량품이 메인 코드베이스에 들어가는 것을 차단.
- **구현 (Gemini CLI)**:
    - `.gemini/hooks/validate-note.js`
    - `write_file` 도구가 호출될 때, 파일 경로에 맞는 필수 섹션(`## 핵심 질문` 등)이나 YAML 태그가 있는지 검사하고, 없으면 저장을 거부하고 수정을 요청.

### System 4: 전문 에이전트 (Specialist Agents)
- **개념**: 하나의 AI에게 모든 걸 시키지 않고, **역할별로 특화된 페르소나**를 부여.
- **구현 (Gemini CLI)**:
    - `.gemini/skills/`
    - `knowledge-architect`: 전체 구조 설계 및 노트 작성 전문가.
    - `anki-expert`: 면접용 카드 생성 및 30초 말하기 훈련 조교.

## 3. 적용 결과 (Outcome)
- **매뉴얼 분자화**: 거대한 `Obsidian Knowledge System Convention.md`를 8개의 작은 규칙 파일(`Rule-*.md`)로 쪼개어 효율성 증대.
- **Hook 시스템**: 사용자가 일일이 규칙을 상기시킬 필요 없이, 시스템이 알아서 규칙을 집행(Enforce).
- **End-to-End 자동화**: "질문 -> 구조 설계 -> 노트 작성 -> Anki 카드 생성"까지 끊김 없는 파이프라인 구축.

## 4. 인사이트
- 도구 탓을 하기 전에 **시스템(환경)**을 구축해야 한다.
- AI에게 "알아서 해줘"는 최악의 지시이며, **"이 규칙대로, 이 계획을, 검증 후에 실행해"**가 정답이다.
