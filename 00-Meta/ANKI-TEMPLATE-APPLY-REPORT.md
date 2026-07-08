# Anki Template Apply Report

## 처리 일시

2026-07-08

## 적용 대상

`.anki/`에 저장된 화이트톤 미니멀 템플릿/CSS를 실제 Anki 모델에 반영했다.

```text
🧑🏻‍💻 Problem Solving v1
🧑🏻‍💻 Interview v2
```

## 적용 전 백업

Anki 반영 전 두 덱을 `.anki/exports/`에 apkg로 백업했다.

```text
.anki/exports/problem-solving-before-template-apply-20260708-155600.apkg
.anki/exports/keyword-before-template-apply-20260708-155600.apkg
```

`exports/`는 gitignore 대상이므로 백업 파일은 git에 커밋하지 않는다.

## 적용한 파일

Problem Solving:

```text
.anki/css/problem-solving-v1.css
.anki/templates/problem-solving-v1/problem-card.front.html
.anki/templates/problem-solving-v1/problem-card.back.html
```

Keyword:

```text
.anki/css/keyword-current.css
.anki/templates/keyword-current/card-1.front.html
.anki/templates/keyword-current/card-1.back.html
```

## 적용 방식

AnkiConnect를 통해 다음 작업을 수행했다.

```text
updateModelTemplates
updateModelStyling
```

## 검증 결과

Anki에서 다시 읽은 모델 설정이 `.anki/` 파일과 일치하는지 비교했다.

```text
🧑🏻‍💻 Problem Solving v1 css_ok True
  Problem Card front_ok True back_ok True

🧑🏻‍💻 Interview v2 css_ok True
  Card 1 front_ok True back_ok True

verify_all OK
```

## 결론

- 실제 Anki 앱에 화이트톤 미니멀 템플릿/CSS 반영 완료.
- `.anki/`의 설정 파일과 Anki 앱의 모델 설정이 일치한다.
- 카드 데이터와 리뷰 기록은 변경하지 않았다.
