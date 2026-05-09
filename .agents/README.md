# .agents

이 폴더는 `.claude/`에서 옮긴 에이전트용 지침 모음이다.

## 구조
- `skills/`: 반복 실행 가능한 작업 절차
- `docs/`: 템플릿/규칙/참고 문서
- `hooks/`: 기존 검증 로직
- `settings.json`: 훅 연결 정보

## 현재 들어 있는 내용
- `docs/note-templates.md`
- `docs/anki-cards.md`
- `hooks/*.js`
- `settings*.json`

## 사용 원칙
- 상시 규칙은 `AGENTS.md`를 우선
- 작업 절차는 `skills/`에서 확인
- 템플릿과 카드 규칙은 `docs/`에서 확인