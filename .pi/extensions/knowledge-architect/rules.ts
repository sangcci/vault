export const KNOWLEDGE_ARCHITECT_RULES = `
# Knowledge Architect — Project-local Extension Rules

## 1. System Philosophy
- Objective: 모든 지식은 실무 문제 해결 흐름으로 구조화한다.
- Language: 모든 노트와 카드는 한국어로 작성한다.
- 3-Tool System: Obsidian은 구조화, Anki는 회상, LLM은 실행·검증을 담당한다.
- Primary Flow: Problem → Principle → Question.
  - Problem: 실무에서 터지는 증상, 장애, 설계 실패, 디버깅 상황.
  - Principle: 여러 Problem을 관통하는 반복 원리와 판단 기준.
  - Question: 원문 질문과 탐구 맥락. 삭제하지 않고 보존한다.

## 2. Directory Structure & Naming
| Folder | Type | Prefix | Purpose |
| :--- | :--- | :--- | :--- |
| \`01-Problem/\` | Problem | \`01-\`, \`02-\` | 실무 문제, 장애, 설계 실패 |
| \`02-Principle/\` | Principle | \`본질-\` | 반복 원리, 판단 기준 |
| \`03-Question/\` | Question | \`탐구-\` | 원문 질문, 탐구 맥락 |

- Problem 파일명은 \`문제-\`가 아니라 숫자 prefix를 사용한다. 예: \`72-운영 배포 후 설정이 다르게 적용됨.md\`.
- Principle은 구현체 이름보다 반복 원리를 드러낸다.
- Question은 사용자 원문 질문을 가능한 유지한다.

## 3. Workflow: Architect First
Before writing ANY knowledge note:
1. Analyze: 입력을 atomic topic으로 분해한다.
2. Check Duplication: 새 파일 제안 전 반드시 중복 검색을 수행한다.
   - Preferred tool: \`obsidian_search_notes\`
   - CLI fallback: \`obsidian search query="<핵심 키워드>" format=json\`
   - 문맥 확인: \`obsidian_search_context\` 또는 \`obsidian search:context query="<키워드>" format=json\`
3. Propose Structure: 만들거나 갱신할 파일을 [CREATE], [UPDATE], [SKIP]으로 제안한다.
4. Wait for Approval: 사용자가 "Go", "ㄱㄱ", "진행"처럼 명시적으로 승인하기 전에는 지식 노트를 생성/수정하지 않는다.
5. Post-write link check: 지식 노트 생성/수정 후 \`obsidian unresolved total\`을 실행한다. 증가했다면 verbose 결과를 보고 새 broken link를 고친다.

## 4. Required Elements
Every knowledge note must include:
- YAML frontmatter
- Visual/Logic Evidence: ASCII diagram 또는 pseudo code
- Reference: 관련 노트 \`[[link]]\`
- Slide Separator: 주요 \`##\` 섹션 사이에 \`---\` 삽입. YAML frontmatter는 건드리지 않는다.
- Citation: factual claim에는 출처를 붙인다.
  - Priority: official docs → reputable tech blogs → reputable communities
  - Format: \`> "exact verbatim quote" — [Source Name](URL)\`

## 5. Canonical Note Shape
템플릿 파일을 복사하지 않는다. AI가 아래 최소 구조를 직접 생성한다.

### Problem
Required sections:
- \`## 상황\`
- \`## 관찰된 증거\`
- \`## 원인\`
- \`## 해결 방향\`
- \`## 연결되는 본질\`
- \`## 참고\`

Optional but useful sections:
- \`## 의심 문제\`
- \`## 확인 방법\`
- \`## 해결책 후보\`
- \`## 트레이드오프\`

### Principle
Required sections:
- \`**핵심 질문**:\`
- \`## 한 문장 정의\`
- \`## 판단 기준\`
- \`## 대표 문제\`
- \`## 참고\`

### Question
Required sections:
- \`## 핵심 질문\`
- \`## 파생 노트\`

## 6. Boundary Rules
- Explicit Only: 입력에 명시되었거나 직접 함의된 주제만 다룬다.
- No Hallucination: 목록을 채우려고 관련 주제를 지어내지 않는다.
- Atomicity: 노트 하나는 주제 하나만 다룬다.
- Practicality: CS 지식만을 위한 노트보다 백엔드 실무 문제로 연결되는 노트를 우선한다.
- DRY: 다른 노트의 내용을 현재 노트에서 길게 설명하지 않는다. 설명이 시작되면 별도 노트로 분리하고 \`[[link]]\`로 연결한다.

## 7. Auto-Classification Guide
- Problem: 장애, 성능 저하, 운영 사고, 설계 실패, 디버깅 상황. Anki Scenario/Code Review/Implementation 후보.
- Principle: Problem을 반복적으로 설명하는 원리와 판단 기준. Anki 후보.
- Question: 사용자 원문 질문. 재작성 최소화. Anki 대상 아님.

## 8. Metadata
Every note must start with:
\`\`\`yaml
---
aliases: [English_Name, Search_Keyword]
tags: [Type_Name, Status]
difficulty: [Low, Medium, High]
type: [Note_Type]
---
\`\`\`
Status: 작성중, 검증됨, 완료

## 9. Anki Rules
- Primary recall deck: \`💻::Problem Solving\`.
- Primary model: \`🧑🏻‍💻 Problem Solving v1\`.
- Problem 카드 필드: \`Question\`, \`Answer\`, \`CardType\`, \`Problem\`, \`Principles\`.
- \`CardType\`은 \`Scenario\`, \`Code Review\`, \`Implementation\` 중 하나를 사용한다.
- 카드 생성/삭제/모델 변경 전에는 사용자에게 preview 또는 변경 요약을 보여주고 명시 승인을 받아야 한다.
- \`💻::Keyword\`는 유지 카드 53장 중심의 보조 덱이다. 신규 Keyword 카드는 예외적으로만 만든다.
- \`anki_add_keyword_card\` tool은 legacy Keyword 카드 생성용이다. Problem Solving 카드는 현재 명시 승인 후 AnkiConnect로 처리한다.
- Anki 모델/CSS/템플릿/덱 옵션 설정은 \`.anki/\`에 export해 git으로 관리한다. 카드 데이터와 리뷰 기록은 git으로 관리하지 않는다.

## 10. Change History
- LOG.md 작성은 더 이상 필요 없다.
- 노트 변경 이력은 pi-git-commit extension이 담당한다.
`;
