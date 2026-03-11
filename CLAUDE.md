# Knowledge Architect — System Rules

## 1. System Philosophy
- **Objective**: Structural thinking for backend interviews.
- **Language**: Korean (한국어) is mandatory for all notes and cards.

## 2. Directory Structure & Naming
| Folder | Type | Prefix | Purpose |
| :--- | :--- | :--- | :--- |
| `01-Question/` | Question | `탐구-` | Mechanism & Why |
| `02-Phenomenon/` | Phenomenon | `현상-` | Symptoms & Errors |
| `03-Concept/` | Concept | `개념-` | Tools & Solutions |
| `04-Principle/` | Principle | `본질-` | Invariant Laws |
| `05-Case/` | Case | `사례-` | Incidents & Logs |
| `06-Heuristic/` | Heuristic | `판단기준-` | Decision Strategy |

## 3. Workflow: Architect First
Before writing ANY note, analyze the user input and propose a structural plan.

1. **Analyze**: Break down the input into atomic topics.
2. **Check Duplication**: Before proposing a new file, check if a similar file already exists. If it does, propose UPDATE or SKIP instead of CREATE.
3. **Propose Structure**: List files to create/update. Mark as `[CREATE]`, `[UPDATE]`, or `[SKIP]`. Briefly explain why each file is needed.
4. **Wait for Approval**: Do NOT create files until the user says "Go".

### Required Elements
Every knowledge note MUST include:
- **Visual/Logic Evidence**: ASCII diagram or pseudo code is mandatory.
- **Reference**: Link to related notes using `[[link]]` syntax.

### Boundary Rules
- **Explicit Only**: Extract only topics explicitly stated or directly implied by the input.
- **No Hallucination**: Never invent related topics just to fill a list.
- **Atomicity**: One note = one topic. Split complex ideas into separate notes.

## 4. Auto-Classification Guide
- **Question (탐구)**: "Why does it work this way?" → Internal mechanism, curiosity
- **Phenomenon (현상)**: "What is this problem/symptom?" → Deadlock, Latency, Error
- **Concept (개념)**: "What tool/term solves this?" → Docker, Mutex, Index
- **Principle (본질)**: "What is the unchanging law?" → Atomicity, Consistency
- **Case (사례)**: "What actually happened?" → Incident log, Experience
- **Heuristic (판단기준)**: "How should I decide?" → Strategy, Checklist

## 5. Metadata (YAML)
Every note must start with:
```yaml
---
aliases: [English_Name, Search_Keyword]
tags: [Type_Name, Status]  # Status: 작성중, 검증됨, 완료
difficulty: [Low, Medium, High]
type: [Note_Type]
---
```

## 6. Note Templates
@.claude/rules/note-templates.md

## 7. Anki Card Rules
@.claude/rules/anki-cards.md
