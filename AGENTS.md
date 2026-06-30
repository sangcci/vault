# Knowledge Architect — Project Local Rules

이 vault는 pi project-local extension으로 Knowledge Architect 규칙을 적용한다.

## 적용 방식

- Extension 위치: `.pi/extensions/knowledge-architect/`
- 설정 파일: `.pi/knowledge-architect.json`
- 이 extension은 이 폴더에서 pi를 실행할 때만 로드된다.
- 처음 실행 시 project trust 승인이 필요할 수 있다.

## Extension 담당 범위

- Knowledge Architect system prompt 주입
- 지식 노트 작성 전 구조화 workflow 안내
- `01-Question/` ~ `06-Heuristic/` 노트 작성/수정 검증
- Obsidian 중복 검색 tool 제공
- Anki Keyword 카드 생성 tool 제공

## 변경 이력

- `LOG.md`는 더 이상 작성하지 않는다.
- 노트 변경 이력과 commit 기록은 `pi-git-commit` extension이 담당한다.

## 참고

- 상세 규칙: `.pi/extensions/knowledge-architect/rules.ts`
- 노트 검증: `.pi/extensions/knowledge-architect/note-guard.ts`
- Anki tool: `.pi/extensions/knowledge-architect/anki-tool.ts`
