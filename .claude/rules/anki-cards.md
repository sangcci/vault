# Anki Card Rules (카드 생성 시 적용)

### Atomicity
- One Card = One Concept. 3가지 포인트 → 3장의 카드.

### Model & Field Format
- **Model Name**: `🧑🏻‍💻 Interview v2`
- **Fields**:
  - **Question**:
    - **Keyword 덱**: 용어명만 (예: `임계 구역 (Critical Section)`)
    - **Q&A 덱**: 면접 질문 형태 (예: `Redis는 왜 싱글 스레드인가?`)
  - **Answer**: HTML format.
    - **Keyword 덱**: 한 줄 핵심 정의 + 키워드가 문맥에 녹아든 짧은 설명문
    - **Q&A 덱**: 결론 먼저 → 근거 → 키워드
    - **IMPORTANT**: 키워드를 단순 나열하지 말 것. 모르는 용어가 갑자기 등장하면 안 됨. 키워드는 반드시 이해 가능한 문장 속에 포함되어야 함.
    ```html
    <!-- Keyword 덱 예시 -->
    <b>한 번에 1스레드만 진입을 허용하는 코드 블록</b><br>
    • 공유 데이터를 보호하기 위해 상호 배제(Mutual Exclusion) 적용<br>
    • 이걸 안 지키면 → 경쟁 조건(Race Condition) 발생

    <!-- Q&A 덱 예시 -->
    <b>[핵심 결론 한 줄]</b><br>
    • 근거 1<br>
    • 근거 2<br>
    • 키워드: ..., ...
    ```
  - **Type**: `Concept` / `Principle` / `Question` / `Phenomenon` / `Case` / `Heuristic`
  - **Category**: `04-Principle/` 에 존재하는 본질 노트명 그대로 사용 (예: `본질-원자성 (Atomicity)`)
    - 매칭되는 본질 노트가 없으면 카드 생성 중단 → 본질 노트 먼저 생성
    - 후보가 여러 개일 경우 카드 생성 중단 → 사용자에게 목록 보여주고 1개 선택
  - **Difficulty**: `Low` / `Medium` / `High`
  - **Code**: (Optional)
  - **RelatedConcepts**: (Optional, comma-separated)
  - **Image**: (Optional, leave empty unless file explicitly provided)

### Tool Usage — CRITICAL (AnkiConnect API 직접 호출)
- **Anki MCP 제거됨** — 반드시 AnkiConnect HTTP API를 Bash(curl)로 직접 호출
- **Endpoint**: `http://localhost:8765` (POST, JSON body)
- **카드 1장씩 개별 호출** — 배치 생성 금지 (커스텀 노트 타입 실패)
- **MUST use temp file approach** — JSON을 먼저 `/tmp/anki-card.json`에 쓴 후 curl로 전송

**카드 추가 순서**:
```bash
# Step 1: JSON을 임시 파일에 저장 (Write tool 사용)
# /tmp/anki-card.json 에 아래 형식으로 작성

{
  "action": "addNote",
  "version": 6,
  "params": {
    "note": {
      "deckName": "💻::Keyword",
      "modelName": "🧑🏻‍💻 Interview v2",
      "fields": {
        "Question": "용어명",
        "Answer": "<b>정의</b><br>• 설명",
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

# Step 2: curl로 전송 (hook이 자동으로 validate-anki-card.js 실행)
curl -s -X POST http://localhost:8765 \
  -H "Content-Type: application/json" \
  -d @/tmp/anki-card.json
```

**기타 유용한 actions**: `findNotes`, `notesInfo`, `deleteNotes`, `deckNames`, `modelNames`

### Deck Assignment (2-Deck System)
- **`💻::Keyword`**: Concept, Principle, Phenomenon 타입 → 즉시 연상 (5초 내)
- **`💻::Q&A`**: Question, Case, Heuristic 타입 → 면접 답변 연습 (30초 내)

### Code Field — ASCII Diagram 적극 활용
- Code 필드에 ASCII 다이어그램 또는 Pseudo Code를 적극 포함
- 시각적 회상 단서로 활용

### Speaking-Oriented
- Full sentences (`~입니다`, `~합니다`) 사용 금지
- **Keyword 덱**: 키워드 3~5개 + 한 줄 정의. 5초 내 연상.
- **Q&A 덱**: 결론 먼저 → 근거 → 키워드. 30초 내 말할 수 있는 답변.

### User Confirmation — MANDATORY
카드 생성 전 반드시:
1. 생성할 카드 내용 (표 또는 JSON) 사용자에게 먼저 보여주기
2. 명시적 승인 요청
3. 사용자의 "Yes" 또는 "확인" 대기
- 이 단계를 건너뛰는 것은 시스템 위반
