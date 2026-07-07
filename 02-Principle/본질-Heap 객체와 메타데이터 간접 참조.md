---
aliases: [Heap Object and Metadata Indirection, Klass Pointer, JVM Object Layout]
tags: [본질, 작성중, JVM, Java]
difficulty: High
type: Principle
---

# Principle: Heap 객체와 메타데이터 간접 참조

**핵심 질문**: Java 객체는 자신의 클래스 정보와 메서드 구현을 어떻게 찾는가?

## 한 문장 정의

Heap 객체와 메타데이터 간접 참조는 Heap의 객체 인스턴스가 필드 값과 object header를 가지고, 클래스 단위 metadata와 method dispatch 정보는 Method Area/Metaspace에 두고 간접 참조로 연결한다는 원리.

---

## 해결하는 문제

- 객체 안에 메서드 코드가 복사된다고 오해하는 문제
- 객체 수 증가와 클래스 메타데이터 증가를 구분하지 못하는 문제
- vtable/itable 기반 method dispatch를 설명하지 못하는 문제
- 동적 로딩과 다형성이 메모리 구조와 어떻게 연결되는지 놓치는 문제

---

## 판단 기준

```text
Heap object
  - object header
  - instance fields
  - klass pointer / metadata reference

Metaspace / Method Area
  - class metadata
  - field layout
  - method metadata / bytecode / compiled entry
  - vtable / itable

method call
  object → class metadata → dispatch table → method entry
```

---

## 진단 포인트

- 문제 원인이 객체 수 증가인지 class metadata 증가인지 구분한다.
- field access와 virtual/interface method dispatch를 구분한다.
- classloader가 해제되지 않아 metadata가 남는지 확인한다.
- 다형성 호출이 실제 병목인지 JIT inline 여부를 측정한다.

---

## 트레이드오프

객체와 클래스 메타데이터를 분리하면 객체마다 메서드 정보를 복사하지 않아도 된다. 대신 실제 구현 선택은 간접 참조와 dispatch table을 통해 일어나며, classloader 생명주기 문제가 metadata memory 문제로 드러날 수 있다.

---

## 대표 문제

- [[44-객체와 메서드가 모두 Heap에 있다고 오해해 다형성 비용을 설명하지 못함]]

---

## 참고

> "The Java Virtual Machine has a method area that is shared among all Java Virtual Machine threads." — [JVM Specification §2.5.4](https://docs.oracle.com/en/java/javase/26/docs/specs/jvms/jvms-2.html)

> "The Java Virtual Machine has a heap that is shared among all Java Virtual Machine threads." — [JVM Specification §2.5.3](https://docs.oracle.com/en/java/javase/26/docs/specs/jvms/jvms-2.html)
