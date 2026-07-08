이 vault는 pi project-local extension으로 Knowledge Architect 규칙을 적용한 **개인 wiki**입니다.

## 적용 방식
pi, obsidian, anki가 필요합니다.

- Extension 위치: `.pi/extensions/knowledge-architect/`
- 설정 파일: `.pi/knowledge-architect.json`

## Extension 담당 범위

- Knowledge Architect system prompt 주입
- 지식 노트 작성 전 구조화 workflow 안내
- `01-Problem/`, `02-Principle/`, `03-Question/` 노트 작성/수정 검증
- Obsidian 중복 검색 tool 제공
- Anki 운영 규칙 안내 및 legacy Keyword 카드 생성 tool 제공

## 현재 노트 구조

| Folder          | Type      | Purpose          |
| --------------- | --------- | ---------------- |
| `01-Problem/`   | Problem   | 실무 문제, 장애, 설계 실패 |
| `02-Principle/` | Principle | 반복 원리, 판단 기준     |
| `03-Question/`  | Question  | 질문과 탐구           |
이후 Anki를 통해 Principle과 Problem을 반복 학습합니다.