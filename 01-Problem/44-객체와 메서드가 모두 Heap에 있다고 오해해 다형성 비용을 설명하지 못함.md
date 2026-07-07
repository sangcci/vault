---
aliases: [JVM Object Metadata Misunderstanding, VTable Metaspace, Object Layout Dispatch]
tags: [문제, 작성중, JVM, Java, Dispatch]
difficulty: High
type: Problem
---

# Problem: 44-객체와 메서드가 모두 Heap에 있다고 오해해 다형성 비용을 설명하지 못함

## 상황

Java 객체를 설명할 때 “객체 안에 필드와 메서드가 같이 들어 있다”고 말한다. 그래서 객체 하나를 만들 때 메서드 코드도 복사되는지, override 호출이 어떻게 실제 구현을 찾는지, interface dispatch가 왜 다를 수 있는지 설명이 꼬인다.

```java
Animal a = new Dog();
a.speak();
```

---

## 관찰된 증거

- 객체마다 메서드 코드가 복사된다고 오해한다.
- field access와 method dispatch를 같은 방식으로 설명한다.
- class metadata, vtable, itable의 위치를 구분하지 못한다.
- stack에 객체가 있다고 말하거나, stack/heap/metaspace 생명주기를 혼동한다.
- 다형성 비용을 단순히 “상속이라 느리다”로만 설명한다.

---

## 의심 문제

가장 가능성 높은 문제는 **Heap 객체와 클래스 메타데이터를 구분하지 못한 것**이다.

Heap에는 객체 인스턴스와 배열이 저장된다. 메서드 코드, 필드 정보, 상수 풀, dispatch table 같은 클래스 단위 정보는 Method Area/Metaspace 쪽에 있고, 객체는 klass pointer 같은 간접 참조로 자신의 클래스 메타데이터를 가리킨다.

---

## 원인

```text
Heap object
  [object header | instance fields]
        │
        └─ klass pointer
              ↓
Method Area / Metaspace
  class metadata
  method bytecode / compiled entry
  field layout
  vtable / itable
```

메서드 호출은 단순히 객체 안의 함수를 꺼내는 것이 아니다.

```text
virtual call
  reference → heap object
  heap object → klass metadata
  metadata → vtable/itable lookup
  selected method entry 실행
```

반면 필드 접근은 컴파일 타임 타입과 필드 offset 기준으로 더 정적으로 결정된다.

---

## 확인 방법

- “객체마다 복사되는 것”과 “클래스마다 하나인 것”을 구분한다.
- field access, virtual method, interface method, static method의 dispatch 방식을 구분한다.
- 프로파일에서 virtual/interface call이 실제 병목인지 JIT inline 여부를 확인한다.
- 객체 수 증가가 heap 문제인지, class 수 증가가 metaspace 문제인지 분리한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 객체 레이아웃과 class metadata 분리 이해 | 메모리/dispatch 설명 명확 | JVM 구현 세부와 Spec 구분 필요 |
| method dispatch와 field access 구분 | 다형성 오해 감소 | bytecode/JIT 이해 필요 |
| interface dispatch hot path 측정 | 실제 병목 확인 | 대부분 JIT가 최적화 가능 |
| classloader/class count 모니터링 | metadata 문제 구분 | 운영 metric 필요 |

---

## 트레이드오프

JVM은 객체를 작게 유지하기 위해 객체별 데이터와 클래스별 메타데이터를 분리한다. 간접 참조는 다형성과 동적 로딩을 가능하게 하지만, dispatch와 metadata 생명주기를 이해해야 성능·메모리 문제를 올바르게 해석할 수 있다.

---

## 연결되는 본질

- [[본질-Heap 객체와 메타데이터 간접 참조]]
- [[본질-컴파일 타임 타입과 런타임 객체의 분리]]
- [[본질-추상 인터페이스와 구현 비용]]

---

## 참고

> "The Java Virtual Machine has a method area that is shared among all Java Virtual Machine threads." — [JVM Specification §2.5.4](https://docs.oracle.com/en/java/javase/26/docs/specs/jvms/jvms-2.html)

> "The Java Virtual Machine has a heap that is shared among all Java Virtual Machine threads." — [JVM Specification §2.5.3](https://docs.oracle.com/en/java/javase/26/docs/specs/jvms/jvms-2.html)
