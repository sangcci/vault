# Anki Card Rules

### Atomicity
One card = one concept. 3 points → 3 cards.

### Model
- **Model Name**: `🧑🏻‍💻 Interview v2`

### Decks
- **`💻::Keyword`**: The only deck. C-type one-line definition / R-type values & thresholds / E-type evidence with context — recall in 5s
- ~~`💻::Q&A`~~: **Abolished**. Question / Case / Heuristic types are replaced by LLM practice.

### Prerequisite Before Card Creation — MANDATORY
Before creating any card, verify:
1. Does an Obsidian note for this concept exist in `03-Concept/` or `04-Principle/`?
2. If not → **write the note first**. Card creation is blocked until the note exists.
3. Card creation is only allowed after structuring (links, ASCII diagram) is complete.

### Fields
| Field | Values |
|-------|--------|
| Question | Term name only (C/R-type). For E-type: "In what context is this evidence used?" |
| Answer | HTML. One-line Korean definition only. See format below. |
| Type | `Concept` `Principle` `Phenomenon` `Evidence` |
| Category | Domain label (e.g. `Git`, `Spring`, `JPA`, `DB`, `OS`, `Network`, `Java`, `Security`, `Infra`) |
| Difficulty | `Low` `Medium` `High` |
| Code | **Always required**. Korean ASCII diagram or pseudocode that shows the mechanism/example. |
| RelatedConcepts | Comma-separated Korean principle names only. No `본질-` prefix, no English aliases, no implementation/tool names. |
| Image | Optional, leave empty unless file provided. |

**Category rules:**
- Use a short domain label that best describes where this concept belongs.
- Common values: `Git`, `Spring`, `JPA`, `DB`, `OS`, `Network`, `Java`, `Security`, `Infra`, `Architecture`
- If a concept spans multiple domains, pick the most specific one.
- 본질 links go in **RelatedConcepts**, not Category.

### Answer Format
```html
<!-- C-type / R-type (Keyword) -->
<b>definition as a noun phrase</b>

<!-- E-type (Evidence with context) -->
<b>finding or statistic in one line</b><br>
• source: institution / study name<br>
• context: what argument does this evidence support
```
- Answer MUST be one Korean line for C/R-type cards.
- Answer MUST NOT repeat the Question term at the beginning.
  - Bad: `<b>Index Scan은 index에서 찾은 row 위치를 따라가 heap page의 실제 row를 읽는 방식</b>`
  - Good: `<b>index에서 찾은 row 위치를 따라가 heap page의 실제 row를 읽는 방식</b>`
- Answer SHOULD end as a noun phrase such as `방식`, `구조`, `성질`, `원리`, `현상`, `기준`, not a full explanatory sentence.
- NEVER use `~입니다`, `~합니다`, `~한다`, `~이다` for C/R-type cards when a noun phrase can express the meaning.
- Avoid `<br>` bullets in C/R-type Answer. Put examples, mechanism, and consequences in Code instead.
- E-type cards MUST include context (what claim this evidence supports)

### Anki Target Summary
| PACER Type | Anki? | Alternative |
|---|---|---|
| P (Procedural) | ❌ | LLM scenario practice |
| A (Analogous) | ❌ | Obsidian link & critique |
| C (Conceptual) | ✅ Keyword | One-line definition only |
| E (Evidence) | ✅ Keyword | Must include context |
| R (Reference) | ✅ Keyword | Values & thresholds |
| Question / Case / Heuristic | ❌ | LLM practice |

### Depth → Card Count Rule
The Anki deck is the single source of truth for study depth. No `scope` field in note YAML.

| Depth | 기준 | 생성 카드 |
|---|---|---|
| concept | 개념 정의만 알면 됨 | 정의 카드 1장 |
| taxonomy | 종류를 열거·구분할 수 있어야 함 | 정의 카드 1장 + 종류별 카드 각 1장 |
| mechanism | 내부 동작 원리까지 설명 가능해야 함 | taxonomy 카드 전부 + Code 필드 상세 기입 |

Note: Code 필드는 depth 불문 항상 필수. mechanism depth는 Code 필드의 충실도로 구분.

### Code Field Rules
- Use Korean ASCII diagrams, short pseudocode, or compact examples.
- Use Code to show mechanism, contrast, failure mode, or concrete example.
- Keep Code focused on the card's single concept. Do not dump unrelated comparisons.
- If Answer becomes long, move the extra details into Code.
- Prefer arrows and state transitions.

Good examples:
```text
lock
  ↓
critical section
  ↓
unlock
```

```text
매번 새로 만들기
request 1 → create/init → use → close
request 2 → create/init → use → close

재사용하기
create/init once
  ↓
request 1 → use
request 2 → reuse
```

### RelatedConcepts Rules
- RelatedConcepts should contain true principles only, in Korean only.
- Remove `본질-` prefix and English aliases.
- Do not put implementation names, tools, libraries, frameworks, algorithms, or sibling concept cards here.
  - Bad: `Seq Scan, Bitmap Index Scan, Heap Page 구조, 본질-간접 참조 (Indirection)`
  - Good: `간접 참조`
- Use at most 1–3 items. If unsure, use the single strongest principle.
- Examples:
  - `간접 참조`
  - `처리량과 지연시간`
  - `자원 경합`
  - `참조 지역성, 자원 경합`
  - `상호 배제, 가시성, 자원 경합`

### Tool Usage — CRITICAL
Anki MCP removed. Use AnkiConnect HTTP API via curl only.

**Step 1:** Write card JSON to `/tmp/anki-card.json` (Write tool):
```json
{
  "action": "addNote",
  "version": 6,
  "params": {
    "note": {
      "deckName": "💻::Keyword",
      "modelName": "🧑🏻‍💻 Interview v2",
      "fields": {
        "Question": "term name",
        "Answer": "<b>Korean noun-phrase definition</b>",
        "Type": "Concept",
        "Category": "DB",
        "Difficulty": "Medium",
        "Code": "<!-- Korean ASCII diagram or pseudocode from source note -->",
        "RelatedConcepts": "Korean principle names only",
        "Image": ""
      },
      "options": { "allowDuplicate": false }
    }
  }
}
```

**Step 2:** Send via curl (hook auto-validates):
```bash
curl -s -X POST http://localhost:8765 \
  -H "Content-Type: application/json" \
  -d @/tmp/anki-card.json
```

Other useful actions: `findNotes`, `notesInfo`, `deleteNotes`, `deckNames`, `modelNames`

### User Confirmation — MANDATORY
Before creating any card:
1. Show card preview (table or JSON) to user
2. Ask for explicit approval
3. Wait for "Yes" or "확인"

Skipping this step is a system violation.
