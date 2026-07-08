# .anki

이 폴더는 Anki 앱의 실제 데이터 폴더가 아니다.

Obsidian vault 안에서 **Anki 설정만 git으로 관리하기 위한 export 폴더**다. 카드 데이터, 리뷰 기록, 스케줄 정보는 git으로 관리하지 않는다.

## 관리 대상

Git으로 관리한다.

```text
models/      카드 모델 필드, 템플릿, CSS를 합친 JSON
css/         모델별 CSS 단독 파일
templates/   모델별 Front/Back 템플릿 단독 파일
decks/       덱 옵션 JSON
README.md    운영 규칙
```

## 관리하지 않는 대상

Git으로 관리하지 않는다.

```text
카드 데이터 전체
리뷰 기록
스케줄 정보
collection.anki2
collection.media/
*.apkg
.anki/exports/*
```

카드 데이터와 리뷰 상태는 Anki 자체 데이터베이스와 iCloud/로컬 백업으로 관리한다.

## 현재 export된 설정

```text
models/problem-solving-v1.json
models/keyword-current.json

decks/problem-solving.json
decks/keyword.json

css/problem-solving-v1.css
css/keyword-current.css

templates/problem-solving-v1/problem-card.front.html
templates/problem-solving-v1/problem-card.back.html
templates/keyword-current/card-1.front.html
templates/keyword-current/card-1.back.html
```

## 반영 정책

이 폴더의 파일은 Anki가 자동으로 인식하지 않는다.

반영은 수동 또는 AI/pi를 통해 AnkiConnect로 수행한다. 이 저장소에는 의도적으로 apply script를 두지 않는다.

```text
.anki 설정 파일
  -> 사람 또는 pi가 검토
  -> AnkiConnect/API로 Anki 모델에 반영
```

## 카드 데이터 보관 정책

카드 데이터는 기본적으로 git에 넣지 않는다.

필요한 경우에만 다음 방식으로 보관한다.

```text
1. Anki .apkg 백업
   - 복구 목적
   - git 제외
   - iCloud/로컬 백업에 보관

2. CSV/JSON snapshot
   - 특정 배치 설계/리포트 목적
   - 00-Meta/Anki-Problem-Batch-*.csv처럼 사람이 검토 가능한 작은 단위만 커밋

3. AnkiConnect 실시간 조회
   - 현재 Anki 상태 검증용
   - 결과는 리포트에 요약만 기록
```

## 운영 원칙

- `.anki`는 설정의 source of truth다.
- Anki 앱은 실행 환경이다.
- 카드 본문, 리뷰 이력, 스케줄은 Anki/iCloud 쪽에서 관리한다.
- 모델/CSS/템플릿/덱 옵션을 바꾸면 `.anki`를 다시 export하고 커밋한다.
