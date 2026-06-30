export const KNOWLEDGE_ARCHITECT_RULES = `
# Knowledge Architect — Project-local Extension Rules

## 1. System Philosophy
- Objective: 모든 지식은 구조적으로 다룬다.
- Language: 모든 노트와 카드는 한국어로 작성한다.
- 3-Tool System: Obsidian은 구조화, Anki는 즉시 회상, LLM은 실행·검증을 담당한다.
- PACER Framework:
  | Type | 설명 | 담당 도구 |
  |---|---|---|
  | P (절차형) | How-to, 코딩 패턴 | LLM 시나리오 연습 |
  | A (비유형) | 유사성, 비유, 연결 | Obsidian 링크·비판 |
  | C (개념형) | 이론, 원리, 정의 | Obsidian 구조화 → Anki 한 줄 |
  | E (근거형) | 통계, 연구 수치 | Obsidian 수집 → Anki 맥락 포함 |
  | R (참고형) | 기준값, 날짜, 수치 | Anki 간격 반복 |

## 2. Directory Structure & Naming
| Folder | Type | Prefix | Purpose |
| :--- | :--- | :--- | :--- |
| \`01-Question/\` | Question | \`탐구-\` | Mechanism & Why |
| \`02-Phenomenon/\` | Phenomenon | \`현상-\` | Symptoms & Errors |
| \`03-Concept/\` | Concept | \`개념-\` | Tools & Solutions |
| \`04-Principle/\` | Principle | \`본질-\` | Invariant Laws |
| \`05-Case/\` | Case | \`사례-\` | Incidents & Logs |
| \`06-Heuristic/\` | Heuristic | \`판단기준-\` | Decision Strategy |

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

## 5. Boundary Rules
- Explicit Only: 입력에 명시되었거나 직접 함의된 주제만 다룬다.
- No Hallucination: 목록을 채우려고 관련 주제를 지어내지 않는다.
- Atomicity: 노트 하나는 주제 하나만 다룬다.
- DRY: 다른 노트의 내용을 현재 노트에서 길게 설명하지 않는다. 설명이 시작되면 별도 노트로 분리하고 \`[[link]]\`로 연결한다.

## 6. Auto-Classification Guide
- Question (탐구): 사용자 원문 질문. 재작성 금지. Anki 대상 아님.
- Phenomenon (현상): 문제/증상/에러/병목. C-type. Anki Keyword 후보.
- Concept (개념): 도구/기술 용어/해결책. C/A-type. Obsidian 구조화 후 Anki Keyword 후보.
- Principle (본질): 사라지지 않는 원리/법칙. C-type. Anki Keyword 후보이며 Anki RelatedConcepts 기준.
- Case (사례): 실제 경험/관찰/장애 로그. E-type. Anki 대상 아님.
- Heuristic (판단기준): 반복되는 A vs B 의사결정. Anki 대상 아님.

## 7. Metadata
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

## 8. Anki Rules
- AnkiConnect curl 직접 호출보다 \`anki_add_keyword_card\` tool을 우선 사용한다.
- 카드 생성 전 사용자에게 preview를 보여주고 명시 승인을 받아야 한다.
- Deck: \`💻::Keyword\` only.
- Model: \`🧑🏻‍💻 Interview v2\`.
- Question: 용어명만.
- Answer: HTML 한 줄 한국어 명사구. \`~입니다\`, \`~합니다\`, \`~한다\`, \`~이다\` 지양.
- Code: 항상 필수. 한국어 ASCII diagram 또는 pseudocode.
- RelatedConcepts: 구현체가 아니라 한국어 본질 이름만 1~3개.

## 9. Change History
- LOG.md 작성은 더 이상 필요 없다.
- 노트 변경 이력은 pi-git-commit extension이 담당한다.
`;
