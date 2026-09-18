---
aliases: [JavaScript Dynamic Properties, V8 Hidden Class Question]
tags: [탐구, 작성중, JavaScript, V8]
difficulty: High
type: Question
---

# Question: JavaScript 객체는 왜 런타임에 프로퍼티를 추가할 수 있나

## 핵심 질문

JavaScript 객체는 런타임에 프로퍼티를 추가·삭제·재정의할 수 있다. Java 객체의 필드 구조와 무엇이 다르며, V8은 이런 동적 객체를 어떻게 빠르게 처리하는가?

처음에는 JavaScript가 한 줄씩 해석되기 때문에 가능한 구조라고 생각했다. 하지만 핵심은 실행 방식이 아니라 언어가 약속한 객체 모델이다.

```text
JavaScript
객체 → 런타임에 바뀔 수 있는 own property 집합

Java
객체 → class가 먼저 정한 field slot 집합

공통점
V8, JVM → 실행 중 JIT 최적화 가능
```

V8은 JavaScript 객체의 가변 프로퍼티 집합을 hidden class와 슬롯 정보로 최적화한다. Java는 클래스 구조를 고정하고, 동적 키가 필요할 때 별도 `Map`을 둔다.

---

## 파생 노트

- [[본질-동적 객체 스키마와 Shape 전이]]
- [[본질-선언 위치의 함수 변환]]
- [[본질-프록시 기반 실행 경계]]

---

## 참고

- [JavaScript에서 객체 생성과 동적 프로퍼티 추가에 대한 비밀에 대해 알아보자](https://velog.io/@songs4805/JavaScript에서의-객체-생성-V8과-hidden-class#references)
- [V8: Fast properties](https://v8.dev/blog/fast-properties)
