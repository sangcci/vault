# Knowledge Architect Extension

이 extension은 현재 Obsidian vault 폴더에서만 동작하는 project-local pi extension이다.

## 제공 기능

- Knowledge Architect 규칙을 system prompt에 주입
- `write`/`edit` 시 지식 노트 구조 검증
- `obsidian_search_notes`, `obsidian_search_context` custom tool 제공
- legacy `anki_add_keyword_card` custom tool 제공
- Anki 설정은 `.anki/` export 파일을 source of truth로 관리

## 제외된 기능

- `LOG.md` 자동 작성은 하지 않는다.
- Anki 카드 데이터/리뷰 기록은 git으로 관리하지 않는다.
- Anki 설정 자동 반영 apply command는 제공하지 않는다.
- 변경 이력은 `pi-git-commit` extension이 담당한다.

## 설정

설정 파일: `.pi/knowledge-architect.json`

## 명령

```text
/knowledge-architect-status
```

현재 로드된 설정을 확인한다.
