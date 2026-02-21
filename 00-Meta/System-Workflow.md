# Knowledge System Workflow: Redis Single-Thread Example

This document outlines the **End-to-End Sequence Flow** of the Gemini CLI system when processing a user query about "Redis Single-Threaded Model & Event Loop".

## 1. User Input (Trigger)
- **User**: "Redis의 싱글 스레드 모델과 이벤트 루프에 대해 설명해줘."
- **Intent**: Understanding a complex topic involving a Tool (Redis), a Principle (Single-Threaded), and a Mechanism (Event Loop).

## 2. Pre-Hook Activation (Auto-Inject Manual)
- **Event**: `BeforeAgent`
- **Script**: `.gemini/hooks/inject-manual.js`
- **Logic**:
    - Detect keywords: "설명", "모델", "루프" -> `Rule-Core.md` (Workflow: Architect First)
    - Detect potential Concept/Principle -> `Rule-Concept.md`, `Rule-Principle.md` (Preparation)
- **Output (Injected Prompt)**:
    > [SYSTEM NOTICE]
    > User input trigger detected. The following manuals are AUTO-INJECTED. You MUST follow these rules strictly.
    > --- [AUTO-INJECTED MANUAL: CORE] ---
    > (Rule-Core.md Content: Architect First Workflow, Auto-Classification Guide)

## 3. Agent Execution (Knowledge Architect)
- **Role**: `knowledge-architect` Skill Activated (Implicitly via Core Rule)
- **Process (Step 1: Analyze & Propose)**:
    1.  **Analyze Entities**:
        - "Redis" -> **Concept** (Tool)
        - "싱글 스레드 모델" -> **Principle** (Invariant Law: Simplicity vs Performance)
        - "이벤트 루프" -> **Concept** (Mechanism/Tool) or **Question** (How it works)
    2.  **Structure Proposal**:
        - `03-Concept/개념-이벤트 루프.md`: (Definition: Non-blocking I/O handler)
        - `04-Principle/본질-단일 스레드 모델.md`: (Law: Atomicity & Simplicity)
        - `01-Question/탐구-Redis는 왜 멀티 코어를 안 쓸까?.md`: (Reasoning: Context Switching Cost)
    3.  **Boundary Check**:
        - "Is 'Kafka' in input?" -> No. (Exclude)
        - "Is 'Thread Safety' implied?" -> Yes. (Include in Principle)
- **Output (Agent Response)**:
    > **[지식 구조 제안]**
    > 1. `03-Concept/개념-이벤트 루프.md`: 비동기 I/O 처리를 위한 핵심 메커니즘.
    > 2. `04-Principle/본질-단일 스레드 모델.md`: 복잡성을 제거하고 원자성을 보장하기 위한 선택.
    > 3. `01-Question/탐구-Redis는 왜 멀티 코어를 안 쓸까?.md`: 컨텍스트 스위칭 비용과 구현 복잡도 분석.
    >
    > **이 구조로 진행하시겠습니까?**

## 4. User Approval & Execution (Builder Phase)
- **User**: "좋아, 진행해."
- **Agent (Builder Mode)**:
    1.  **Action 1**: Call `write_file` for `03-Concept/개념-이벤트 루프.md`.
    2.  **Post-Hook 1 (`validate-note.js`)**:
        - Check: `tags: [개념]` exists? -> Yes.
        - Check: `## 한 문장 정의` exists? -> Yes.
        - Result: PASS.
    3.  **Action 2**: Call `write_file` for `04-Principle/본질-단일 스레드 모델.md`.
        - **Validation Failure (Hypothetical)**:
            - "잠깐! `**핵심 질문**` 필드가 누락되었습니다."
        - **Agent Correction**: Re-generate file with missing field.
    4.  **Action 3**: Call `write_file` for `01-Question/탐구-Redis는 왜 멀티 코어를 안 쓸까?.md`.

## 5. Anki Card Generation (Optional Extension)
- **User**: "이걸로 Anki 카드 만들어줘."
- **Pre-Hook (`inject-manual.js`)**:
    - Detect "Anki", "카드" -> Inject `Rule-Anki.md`.
- **Agent (Anki Expert)**:
    - **Drafting**:
        > **[Anki 카드 초안]**
        > 1. Q: Redis가 싱글 스레드임에도 빠른 이유는? / A: **I/O Multiplexing** (이벤트 루프)
        > 2. Q: 싱글 스레드 모델의 최대 단점은? / A: **O(N) 명령 수행 시 전체 블로킹**
        >
        > **생성할까요?**
- **User**: "OK."
- **Agent**: Call `batch_create_notes`.
