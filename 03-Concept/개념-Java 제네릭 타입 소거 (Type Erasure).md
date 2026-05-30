---
aliases: [Type Erasure, 타입 소거, Generic Type Erasure, 제네릭 타입 소거]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) Java 컴파일러가 제네릭 타입 파라미터를 바이트코드 생성 시 상한(bound) 또는 Object로 교체하고 제거하는 과정.
> (이해용) 설계도에 "아무 재료"라고 써도 공장(JVM)에선 항상 "철재"로 찍어낸다 — 런타임엔 타입 정보가 없다.

---

## 해결하는 문제

- JVM 하위 호환성 유지 — Java 5 이전 코드와 바이트코드 수준 호환
- 런타임에 별도 클래스 생성 없이 제네릭 구현 → 메모리 효율

---

## 치르는 비용

- 런타임 타입 정보 소실 → `instanceof T`, `new T()` 불가
- 오버로딩 해석이 예상과 다르게 동작할 수 있음 (아래 예시)

---

## 동작 원리

```
[ 컴파일 전 ]                  [ 바이트코드 (타입 소거 후) ]
class Collection<T> {          class Collection {
    T value;           →           Object value;
    void print() {                 void print() {
        printer.print(value);          printer.print(value); // Object로 전달
    }                              }
}                              }

[ 오버로딩 해석 예시 ]
void print(Integer a) { "A" }
void print(Object a)  { "B" }   ← T → Object이므로 이게 선택됨
void print(Number a)  { "C" }

new Collection<>(0).print();  → "B" 출력
   └─ T=Integer이지만 소거 후 Object
      → print(Object) 호출
```

### bounded type의 경우
```java
class Box<T extends Number> {
    T value;   // 소거 후 → Number value (상한으로 교체)
}
```

---

## 관련 본질

- [[본질-추상화 (Abstraction)]]
- [[본질-캡슐화 (Encapsulation)]]
- [[개념-Java 정적·동적 바인딩 (Static·Dynamic Binding)]]
