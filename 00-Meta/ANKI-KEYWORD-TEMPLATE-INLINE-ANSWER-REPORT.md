# Anki Keyword Inline Answer Template Report

## 처리 일시

2026-07-08

## 요청

Keyword 카드도 Problem Solving 카드처럼 question 영역 바로 아래로 answer가 이어지는 단일 흐름 디자인으로 변경한다.

## 변경 내용

대상 모델:

```text
🧑🏻‍💻 Interview v2
```

대상 파일:

```text
.anki/css/keyword-current.css
.anki/templates/keyword-current/card-1.back.html
.anki/models/keyword-current.json
```

변경 전:

```text
Question
---
Answer section box
Code section box
Related section box
```

변경 후:

```text
Category badge
Question
---
Answer
Code support block
Related support box
```

Answer는 별도 섹션 카드처럼 분리하지 않고, Problem Solving 카드와 같은 흐름으로 question 아래에 자연스럽게 이어지도록 했다.

## 적용 전 백업

```text
.anki/exports/keyword-before-inline-answer-template-20260708-161546.apkg
```

`exports/`는 gitignore 대상이므로 백업 파일은 커밋하지 않는다.

## Anki 적용/검증

AnkiConnect로 다음을 적용했다.

```text
updateModelTemplates
updateModelStyling
```

검증:

```text
applied keyword template/css
verify keyword OK
```

Anki에서 다시 읽은 `Front`, `Back`, `CSS`가 `.anki/` 파일과 일치함을 확인했다.
