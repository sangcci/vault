# Anki Card Generation Rules

## 1. Atomicity (원자성)
- **One Card = One Concept.**
- If a note contains 3 distinct points, generate 3 separate cards.
- Do NOT cram multiple facts into one card.

## 2. Model & Field Format (CRITICAL)
- **Model Name**: `🧑🏻‍💻 Interview v2`
- **Fields**:
  - **Question**: Clear, specific question.
  - **Answer**: HTML format required.
    ```html
    <b>[Core Conclusion - One Line Bold]</b><br>
    • 키워드: Keyword1, Keyword2<br>
    • [맥락/비유]: Context or Analogy
    ```
  - **Type**: Choose one from [`Concept`, `Principle`, `Question`, `Phenomenon`, `Case`, `Heuristic`].
  - **Category**: Top-level tech domain (e.g., `OS`, `Network`, `DB`, `Redis`, `Java`, `Spring`).
  - **Difficulty**: [`Low`, `Medium`, `High`].
  - **Code**: (Optional) Short code snippet if necessary.
  - **RelatedConcepts**: (Optional) Comma-separated related terms.
  - **Image**: (Optional) Leave empty unless an image file is explicitly provided.

## 3. Extraction Guide by Layers (어떤 질문을 만들까?)
- **Phenomenon**: Describe symptom/error. -> Answer: Suspected Cause + Mechanism.
- **Concept**: How does [Concept] solve [Phenomenon]? -> Answer: Mechanism + Trade-off.
- **Principle**: What fundamental law is violated? -> Answer: Atomic Principle.
- **Heuristic**: Scenario X. Choose A or B? -> Answer: Selection Criteria + Priority.

## 4. Tool Usage Constraint (CRITICAL)
- **DO NOT use `batch_create_notes`.** (It fails with custom note types).
- **MUST use `create_note` iteratively.**
  - Example: If you need to create 3 cards, call `create_note` 3 times in a loop or sequence.

## 5. Deck Assignment Rules
You MUST save the card to the specific Deck matching the Note Type:
- **Question** -> `💻::01-Question`
- **Phenomenon** -> `💻::02-Phenomenon`
- **Concept** -> `💻::03-Concept`
- **Principle** -> `💻::04-Principle`
- **Case** -> `💻::05-Case`
- **Heuristic** -> `💻::06-Heuristic`

## 6. Speaking-Oriented (말하기 중심)
- Do NOT write full sentences (e.g., "~입니다", "~합니다").
- Use keywords and short phrases.
- Aim for an answer that can be spoken in **30 seconds**.

## 7. User Confirmation (사용자 승인)
- **Before creating any cards, you MUST:**
  1. Show the generated card content (JSON or Markdown table) to the user.
  2. **Ask for explicit permission** to proceed.
  3. **WAIT** for the user's "Yes" or "Confirm".
- **NEVER** skip this step. Unauthorized card creation is a system violation.
