# Knowledge Architect Extension

이 extension은 현재 Obsidian vault 폴더에서만 동작하는 project-local pi extension이다.

## 제공 기능

- Knowledge Architect 규칙을 system prompt에 주입
- `write`/`edit` 시 지식 노트 구조 검증
- `obsidian_search_notes`, `obsidian_search_context` custom tool 제공
- `anki_add_keyword_card` custom tool 제공

## 제외된 기능

- `LOG.md` 자동 작성은 하지 않는다.
- 변경 이력은 `pi-git-commit` extension이 담당한다.

## 설정

설정 파일: `.pi/knowledge-architect.json`

## 명령

```text
/knowledge-architect-status
```

현재 로드된 설정을 확인한다.
