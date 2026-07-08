# Pi Command 반영 구상

현재 `.anki` 폴더에는 설정 데이터만 저장하고, Anki에 자동 반영하는 스크립트는 두지 않는다.

다만 이후 pi project-local extension으로 다음 명령을 추가할 수 있다.

## 후보 명령

### `/anki-export-config`

현재 Anki 앱에서 모델/CSS/템플릿/덱 옵션을 읽어 `.anki/`에 다시 저장한다.

범위:

```text
🧑🏻‍💻 Problem Solving v1
🧑🏻‍💻 Interview v2
💻::Problem Solving
💻::Keyword
```

동작:

```text
AnkiConnect 조회
  -> .anki/models/*.json 갱신
  -> .anki/css/*.css 갱신
  -> .anki/templates/* 갱신
  -> .anki/decks/*.json 갱신
```

주의:

```text
카드 데이터는 export하지 않는다.
```

### `/anki-diff-config`

Anki 앱의 현재 설정과 `.anki/`의 설정을 비교한다.

목적:

```text
Anki에서 수동 수정한 내용이 git 설정과 달라졌는지 확인
```

출력 예:

```text
Problem Solving v1 CSS changed
Problem Card Front template changed
Deck option unchanged
```

### `/anki-backup-keyword`

`💻::Keyword` 덱을 apkg로 백업한다.

기본 저장 위치:

```text
.anki/exports/Keyword-YYYYMMDD.apkg
```

주의:

```text
.anki/exports/* 는 gitignore 대상이다.
```

### `/anki-apply-config` — 보류

`.anki/` 설정을 Anki 앱에 반영하는 명령이다.

현재 정책:

```text
자동 반영 명령은 만들지 않는다.
필요할 때 사용자가 명시적으로 요청하면 pi/AI가 검토 후 AnkiConnect로 반영한다.
```

이 명령을 만든다면 반드시 확인 절차가 필요하다.

```text
1. 변경 diff 표시
2. 사용자 승인
3. Anki 백업
4. 반영
5. 재조회 검증
```

## 구현 위치 후보

프로젝트 로컬 extension으로 둔다.

```text
.pi/extensions/anki-config-command/index.ts
```

장점:

```text
- 이 vault에서만 명령 활성화
- 기존 knowledge-architect extension과 분리 가능
- /reload로 갱신 가능
```

## 현재 결론

지금은 `.anki`를 설정 데이터 저장소로만 사용한다.

pi command는 다음 단계에서 필요성이 커질 때 `/anki-export-config`와 `/anki-diff-config`부터 추가하는 것이 안전하다.
