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
| Answer | HTML. One-line definition + keywords in context. See format below. |
| Type | `Concept` `Principle` `Phenomenon` `Evidence` |
| Category | Domain label (e.g. `Git`, `Spring`, `JPA`, `DB`, `OS`, `Network`, `Java`, `Security`, `Infra`) |
| Difficulty | `Low` `Medium` `High` |
| Code | Required for Concept/Principle. Copy the ASCII diagram or pseudocode directly from the source note. |
| RelatedConcepts | Comma-separated. Include linked 본질 note names and related concept names here. |
| Image | Optional, leave empty unless file provided. |

**Category rules:**
- Use a short domain label that best describes where this concept belongs.
- Common values: `Git`, `Spring`, `JPA`, `DB`, `OS`, `Network`, `Java`, `Security`, `Infra`, `Architecture`
- If a concept spans multiple domains, pick the most specific one.
- 본질 links go in **RelatedConcepts**, not Category.

### Answer Format
```html
<!-- C-type / R-type (Keyword) -->
<b>one-line definition</b><br>
• keyword used in context, not listed<br>
• consequence if violated

<!-- E-type (Evidence with context) -->
<b>finding or statistic in one line</b><br>
• source: institution / study name<br>
• context: what argument does this evidence support
```
- NEVER use `~입니다`, `~합니다`
- NEVER list keywords without a context sentence
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
        "Answer": "<b>definition</b><br>• keyword in context",
        "Type": "Concept",
        "Category": "DB",
        "Difficulty": "Medium",
        "Code": "<!-- ASCII diagram or pseudocode from source note -->",
        "RelatedConcepts": "",
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
