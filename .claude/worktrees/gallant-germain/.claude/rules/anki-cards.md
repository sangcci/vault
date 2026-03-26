# Anki Card Rules

### Atomicity
One card = one concept. 3 points → 3 cards.

### Model
- **Model Name**: `🧑🏻‍💻 Interview v2`

### Decks
- **`💻::Keyword`**: Type = Concept / Principle / Phenomenon — recall in 5s
- **`💻::Q&A`**: Type = Question / Case / Heuristic — answer in 30s

### Fields
| Field | Values |
|-------|--------|
| Question | Keyword: term name only. Q&A: interview question form. |
| Answer | HTML. Keyword: one-line def + keywords in context. Q&A: conclusion → evidence → keywords. |
| Type | `Concept` `Principle` `Question` `Phenomenon` `Case` `Heuristic` |
| Category | Exact 본질 note name from `04-Principle/` (e.g. `본질-원자성 (Atomicity)`) |
| Difficulty | `Low` `Medium` `High` |
| Code | Optional. Use ASCII diagrams actively. |
| RelatedConcepts | Optional, comma-separated. |
| Image | Optional, leave empty unless file provided. |

**Category rules:**
- No matching 본질 note → stop, create 본질 note first
- Multiple candidates → stop, show list, user picks one

### Answer Format
```html
<!-- Keyword -->
<b>one-line definition</b><br>
• keyword used in context, not listed<br>
• consequence if violated

<!-- Q&A -->
<b>conclusion in one line</b><br>
• evidence 1<br>
• evidence 2<br>
• keywords: ..., ...
```
- NEVER use `~입니다`, `~합니다`
- NEVER list keywords without context sentence

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
        "Answer": "<b>definition</b><br>• explanation",
        "Type": "Concept",
        "Category": "본질-원자성 (Atomicity)",
        "Difficulty": "Medium",
        "Code": "",
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
