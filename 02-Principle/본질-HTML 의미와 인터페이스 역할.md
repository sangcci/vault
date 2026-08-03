---
aliases: [Semantic HTML as Interface Contract, HTML Meaning]
tags: [본질, HTML, Frontend, 접근성]
difficulty: Low
type: Principle
---

# Principle: HTML 의미와 인터페이스 역할

**핵심 질문**: 화면 모양이 같을 때, 왜 `div`로 흉내 내지 않고 요소의 본래 역할에 맞는 HTML 태그를 선택해야 하는가?

## 한 문장 정의

HTML 요소는 화면을 꾸미는 상자가 아니라 문서 구조와 상호작용 역할을 브라우저·키보드·보조기술에 전달하는 인터페이스 계약이다. 먼저 의도에 맞는 요소를 고르고, CSS class는 그 위에 스타일을 입히는 데 쓴다.

---

## 판단 기준

```text
의도 파악
  → 다른 URL·문서 위치로 이동하는가? → a
  → 현재 화면에서 명령을 실행하는가? → button
  → 독립적으로 성립하는 콘텐츠인가? → article
  → 문서 안의 주제 구역인가? → section
  → 의미 없이 배치·스타일만 묶는가? → div
```

- 제목은 글자 크기가 아니라 정보 계층이다. 페이지 주제는 `h1`, 그 아래 주제는 `h2`, 하위 주제는 `h3`처럼 구조를 표현하고, 크기는 CSS로 조절한다.
- `nav`는 페이지 안의 모든 링크를 묶는 태그가 아니라, 주요 탐색 경로를 나타내는 landmark다.
- 링크와 버튼이 모두 필요한 카드에서는 `a` 안에 `button`을 넣지 않는다. 이동과 명령을 형제 요소로 나누고 CSS로 하나의 카드처럼 보이게 한다.
- 적절한 의미 요소가 없을 때에만 `div`를 일반 컨테이너로 쓴다. class 이름으로 요소의 역할을 만들 수는 없다.
- HTML은 내용의 구조·역할·관계를 표현하고, CSS는 그것이 어떻게 보일지를 표현한다. 작은 제목을 만들려고 `h4`를 고르거나 버튼처럼 보이게 하려고 `div`를 고르지 않는다.

```text
의도와 정보 계층 → HTML 태그 선택
HTML 태그 + class → CSS 선택자
CSS → 색·간격·배치·애니메이션 표현
```

---

## `div`와 의미 요소의 차이

`div`도 표준 HTML 요소다. 다만 문서 내용에 고유한 역할을 붙이지 않는 일반 컨테이너다. `a`·`button`·`nav`·`main`·`h1`처럼 역할을 전달하는 요소를 의미 요소라고 한다.

| 판단 대상 | 의미 요소 | `div` |
| --- | --- | --- |
| 브라우저·보조기술에 전달하는 것 | 링크, 명령, 제목, 탐색, 주요 내용 같은 역할 | 일반적인 콘텐츠 묶음 |
| 기본 동작 | 요소에 따라 존재. 예: 링크 이동, 버튼 실행 | 없음 |
| 적절한 사용 | 실제 역할과 맞는 요소가 있을 때 | 적절한 의미 요소가 없고, 배치·스타일·코드 선택을 위해 묶을 때 |
| CSS class의 역할 | 표현을 더하는 이름표 | 표현을 더하는 이름표. 의미를 만들지는 못함 |

`div`는 CSS Grid/Flex 레이아웃 래퍼나 카드 안의 단순 간격 묶음에 유용하다. 텍스트 한 구절을 꾸밀 일반 컨테이너가 필요하면 inline 요소인 `span`을 쓴다.

### Best practice

1. 먼저 “이것은 무엇인가?”를 묻고 의미 요소 후보를 찾는다.
2. 맞는 의미 요소가 없을 때만 `div` 또는 `span`으로 묶는다.
3. `div`에 클릭 이벤트를 붙여 링크·버튼을 재구현하지 않는다. 기본 요소가 제공하는 키보드·접근성 동작을 그대로 사용한다.
4. 스타일을 위해 의미 요소를 억지로 늘리지 않는다. 단순한 Grid/Flex 래퍼에는 `div`가 더 정확하다.

---

## 대표 문제

- `div`에 클릭 이벤트를 붙여 버튼이나 링크처럼 만들면, 해당 요소가 원래 제공하던 역할과 키보드 동작을 직접 보완해야 한다.
- 카드 전체 이동과 북마크 동작을 하나의 링크 안에 넣으면 상호작용 요소가 중첩된다. 클릭·키보드 동작의 경계도 모호해진다.
- 제목의 모양만 보고 heading level을 건너뛰면 문서를 빠르게 훑는 사용자가 정보의 포함 관계를 파악하기 어렵다.
- CSS class 이름만으로 역할을 표현하면 화면은 버튼처럼 보여도 HTML의 의미와 기본 동작은 일반 컨테이너에 머문다.

---

## 연결 노트

- [[본질-인터페이스 의미와 도메인 언어]]
- [[프론트엔드 학습 계획]]

---

## 참고

- `a` 요소는 URL이 가리키는 대상으로의 하이퍼링크를 만들며, 링크에는 실제 URL 이동을 사용해야 한다. [MDN: `<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)
- `button` 요소는 사용자가 실행할 수 있는 동작을 나타낸다. [MDN: `<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button)
- heading 요소는 문서 구조를 표현하며, navigation 요소는 주요 탐색 링크를 나타낸다. [MDN: heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [MDN: `<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav)
- `div`는 적절한 의미 요소가 없을 때 사용하는 일반 컨테이너다. [MDN: `<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div)
