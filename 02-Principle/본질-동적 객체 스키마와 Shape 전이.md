---
aliases: [Dynamic Object Schema, Hidden Class, Shape Transition]
tags: [본질, 작성중, JavaScript, V8]
difficulty: High
type: Principle
---

# Principle: 동적 객체 스키마와 Shape 전이

**핵심 질문**: JavaScript 객체는 런타임에 프로퍼티를 더하고 지울 수 있는데, V8은 왜 매번 느린 키 탐색만 하지 않는가?

## 한 문장 정의

JavaScript 객체는 런타임에 프로퍼티 집합 자체를 바꿀 수 있다. V8은 같은 프로퍼티를 같은 순서로 가진 객체를 같은 `Map(HiddenClass)`으로 묶고, 프로퍼티 이름을 슬롯 위치에 빠르게 연결한다.

---

## 객체가 열려 있다는 뜻

일반 객체에서 `user`에 `age`가 없고 확장 가능하며 prototype에 해당 setter가 없다면, `user.age = 20`은 `age` own property를 추가한다. `delete user.age`는 configurable own property를 제거한다. `Object.preventExtensions`, `Object.seal`, `Object.freeze`로 객체를 닫을 수도 있다.

```text
JavaScript 객체
  프로퍼티 키 → descriptor → 값

user.age = 20
  → "age" 프로퍼티 추가 가능

Java 객체
  class가 정한 필드 슬롯 집합

payment.amount = 20
  → 선언된 amount 값 변경 가능
payment.currency = "KRW"
  → Payment class에 필드가 없으므로 불가
```

Java도 객체의 필드 값은 런타임에 바꿀 수 있다. 차이는 객체마다 필드 목록을 늘리거나 줄이는 언어 연산이 없다는 점이다. 동적인 키가 필요하면 class 안에 `Map<String, Object>` 같은 별도 자료구조를 둔다.

---

## V8이 동적 객체를 빠르게 다루는 방법

JavaScript 객체가 동적이어도 V8이 매번 일반 딕셔너리만 탐색하는 것은 아니다. V8의 `Map`은 hidden class이고, `DescriptorArray`는 프로퍼티 목록과 위치 정보를 가진다. 프로퍼티를 같은 순서로 추가한 객체는 같은 `Map`을 공유할 수 있다.

```text
const user = {};

user.name = "sang"       user.age = 20
      │                        │
      ▼                        ▼
Map#0 ── name 추가 ──► Map#1 ── age 추가 ──► Map#2
                          │                    │
                    name → slot 0       name → slot 0
                                         age  → slot 1

객체: [Map#2 참조 | 슬롯 0: "sang" | 슬롯 1: 20]
```

같은 shape를 계속 유지하면 JIT와 inline cache가 `age`를 찾을 때 “이 Map이면 슬롯 1”이라는 가정을 쓸 수 있다. 반대로 객체마다 프로퍼티를 다른 순서로 넣거나 추가·삭제를 반복하면 shape가 갈라진다. V8은 상황에 따라 딕셔너리 표현으로 전환할 수 있고, 빠른 슬롯 접근의 이점도 줄어든다.

> "Objects with the same structure (same properties in the same order) have the same HiddenClass" — [V8: Fast properties](https://v8.dev/blog/fast-properties)

> "By default every new named property added causes a new HiddenClass to be created." — [V8: Fast properties](https://v8.dev/blog/fast-properties)

---

## 판단 기준

- 객체의 속성 형태가 예상 가능하면 생성 시점에 같은 순서로 초기화한다.
- 비즈니스 데이터의 키가 사용자 입력처럼 진짜 동적이면 객체 필드를 흉내 내기보다 `Map` 또는 명시적 딕셔너리 모델을 쓴다.
- Java에서 `Map<String, Object>`를 쓰는 이유와 JavaScript 객체가 동적인 이유를 섞지 않는다. 전자는 고정 class 안의 가변 자료구조이고, 후자는 객체 프로퍼티 모델 자체가 가변이다.
- V8 `Map`은 JavaScript의 `Map` 객체가 아니다. V8 내부 hidden class를 가리킨다.
- 성능 설명에서 “JavaScript는 한 줄씩 해석해서 느리다”라고 단정하지 않는다. V8도 bytecode 실행과 JIT 최적화를 사용한다.

---

## 대표 문제

- API 응답처럼 shape가 들쭉날쭉한 객체를 성능 핵심 경로에서 대량 생성해 프로퍼티 접근 최적화가 깨지는 문제
- Java에서 확장 가능한 속성이 필요하다는 이유로 class field를 런타임에 추가하려는 설계
- [[탐구-JavaScript 객체는 왜 런타임에 property를 추가할 수 있나]]

---

## 참고

> "The HiddenClass stores information about the shape of an object, and among other things, a mapping from property names to indices into the properties." — [V8: Fast properties](https://v8.dev/blog/fast-properties)

> "Map: the hidden class itself." — [V8: Maps (Hidden Classes) in V8](https://v8.dev/docs/hidden-classes)

- [JavaScript에서 객체 생성과 동적 프로퍼티 추가에 대한 비밀에 대해 알아보자](https://velog.io/@songs4805/JavaScript에서의-객체-생성-V8과-hidden-class#references)
- [[본질-선언 위치의 함수 변환]]
