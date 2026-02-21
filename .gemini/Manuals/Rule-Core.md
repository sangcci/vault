# Core System Rules

## 1. System Philosophy
- **Objective**: Structural thinking for backend interviews.
- **Language**: Korean (한국어) is mandatory for all notes and cards.

## 2. Directory Structure & Naming
| Folder | Type | Prefix | Purpose | Metaphor |
| :--- | :--- | :--- | :--- | :--- |
| `01-Question/` | Question | `탐구-` | Mechanism & Why | Engine Explosion Cycle |
| `02-Phenomenon/` | Phenomenon | `현상-` | Symptoms & Errors | Symptom (Cold) |
| `03-Concept/` | Concept | `개념-` | Tools & Solutions | Prescription (Medicine) |
| `04-Principle/` | Principle | `본질-` | Invariant Laws | Energy Conservation Law |
| `05-Case/` | Case | `사례-` | Incidents & Logs | Blackbox Analysis |
| `06-Heuristic/` | Heuristic | `판단기준-` | Decision Strategy | Safe Driving Rules |

## 3. Workflow: Architect First (설계 우선)
Before writing ANY note, you must **analyze the user input** and **propose a structural plan**.

1.  **Analyze**: Break down the input into atomic topics (Phenomenon, Concept, Question, etc.).
2.  **Check Duplication**:
    - Before proposing a new file, check if a similar file already exists in the vault.
    - If it exists, propose to **UPDATE** or **SKIP** instead of CREATE.
3.  **Propose Structure**:
    - List the files you intend to create/update.
    - **Reasoning**: Briefly explain *why* this file is needed.
    - **Action**: Mark as `[CREATE]`, `[UPDATE]`, or `[SKIP]`.
4.  **Wait for Approval**: Do not create files until the user says "Go".

### ⛔ Boundary Rules (파생 제한)
- **Explicit Only**: Only extract topics **explicitly mentioned** or **directly implied** in the input.
- **No Hallucination**: Do not invent related topics just to fill the list.
- **Atomicity**: One note, one topic. Split complex ideas.

## 4. Auto-Classification Guide (Decision Logic)
- **Question (탐구)**: "Why does it work this way?" (Internal mechanism, curiosity)
- **Phenomenon (현상)**: "What is this problem/symptom?" (Deadlock, Latency, Error state)
- **Concept (개념)**: "What tool/term solves this?" (Docker, Mutex, Index) -> **The Cure**
- **Principle (본질)**: "What is the unchanging law?" (Atomicity, Consistency) -> **The Law**
- **Case (사례)**: "What actually happened?" (Incident log, Experience) -> **The History**
- **Heuristic (판단기준)**: "How should I decide?" (Strategy, Checklist) -> **The Compass**

## 5. Metadata (YAML)
All notes MUST start with:
```yaml
---
aliases: [English_Name, Search_Keyword]
tags: [Type_Name, Status]  # Status: 작성중, 검증됨, 완료
difficulty: [Low, Medium, High]
type: [Note_Type]
---
```
