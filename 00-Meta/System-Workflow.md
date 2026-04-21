# System Workflow
## Overview
학습은 두 단계다. **소비**와 **소화**. 대부분의 시간을 소비에 쓰지만, 기억에 남는 건 소화에서 결정된다.

```
입력 (책, 강의, 경험)
  └─ 소비: Color Bath → Curiosity → Capture
       └─ 소화: PACER 유형 분류 → 도구 배정
```
## PACER: 정보 유형 → 도구 배정

| Type | 설명 | 도구 |
|---|---|---|
| P (절차형) | 코딩 패턴, 설정법 | LLM 시나리오 연습 |
| A (비유형) | 비유, 유사성 | Obsidian 링크 + 비판 |
| C (개념형) | 이론, 원리 | Obsidian → Anki 한 줄 |
| E (근거형) | 통계, 연구 수치 | Obsidian → Anki 맥락 포함 |
| R (참고형) | 기준값, 수치 | Anki 간격 반복 |
## 3-Tool 역할
### Obsidian — 구조화
- 새 정보가 들어오면 PACER 유형을 먼저 판단한다
- C/A-type은 노트로 구조화 (링크, ASCII 다이어그램 필수)
- Anki 카드의 원천 노트. 노트 없이 카드 먼저 만들지 않는다
### Anki — 즉시 회상
- `💻::Keyword` 단일 덱만 운영
- C-type 한 줄 정의 / R-type 수치 / E-type 근거(맥락 포함)
- 5초 안에 답이 나와야 하는 것만 넣는다
- Q&A 형식의 긴 답변 카드는 만들지 않는다
### LLM — 실행·검증
- P-type: 시나리오 주고 직접 작성, 피드백 받기
- 판단기준·탐구 질문: 내가 먼저 답하고 검증받기
- 정보를 얻기 위해 묻는 건 소비. 내가 먼저 설명하는 게 소화
## 하루 흐름
```
학습 중
  Capture → Obsidian Inbox에 즉시 수집

학습 후
  C/A-type → Obsidian 노트 구조화
  C/E/R-type → Anki 카드 생성 (노트 완성 후)
  P-type → LLM 시나리오 연습

별도 30분
  Anki 복습
```
## 노트 작성 순서 (Architect First)
1. 입력을 PACER 유형으로 분해
2. 기존 노트 중복 확인 (`obsidian search`)
3. CREATE / UPDATE / SKIP 목록 제안
4. 승인 후 작성
5. 작성 후 unresolved link 확인
