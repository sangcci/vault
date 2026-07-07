---
aliases: [JVM Runtime Data Areas and Lifecycle, JVM Memory Areas, Heap Metaspace Stack]
tags: [본질, 작성중, JVM, Memory]
difficulty: High
type: Principle
---

# Principle: JVM 런타임 영역과 생명주기

**핵심 질문**: JVM 메모리 영역은 무엇이 공유되고, 무엇이 스레드별로 생성되며, 언제 해제되는가?

## 한 문장 정의

JVM 런타임 영역과 생명주기는 JVM이 프로그램 실행 중 heap, method area/metaspace, stack, pc register 같은 영역을 역할과 생명주기에 따라 나누고, 일부는 JVM 전체가 공유하고 일부는 thread별로 생성·해제한다는 원리.

---

## 해결하는 문제

- JVM 메모리를 heap 하나로만 보는 문제
- heap 여유가 있는데 process memory/OOM 원인을 놓치는 문제
- stack, pc register, method area, metaspace의 생명주기를 혼동하는 문제
- thread 수 증가와 native memory 증가를 연결하지 못하는 문제

---

## 판단 기준

```text
JVM-wide 영역
  Heap
    - objects / arrays
    - GC 대상
    - 모든 JVM thread가 공유

  Method Area / Metaspace
    - class metadata
    - runtime constant pool, method/field metadata
    - classloader 생명주기와 연결

Thread별 영역
  JVM Stack
    - stack frame, local variables, operand stack

  PC Register
    - 현재 실행 중인 JVM instruction 위치

  Native Method Stack
    - native method 실행 context
```

---

## 진단 포인트

- heap metric과 process RSS를 분리해 본다.
- class count/metaspace usage/classloader 수를 본다.
- thread count와 stack memory를 함께 본다.
- native/direct memory 사용량을 별도로 본다.
- OOM 메시지가 heap인지 metaspace인지 direct buffer인지 구분한다.

---

## 트레이드오프

JVM은 영역을 분리해 실행 정보를 체계적으로 관리한다. 하지만 운영 관측에서 heap만 보면 JVM process 전체 메모리 문제를 놓칠 수 있다.

---

## 대표 문제

- [[43-Heap 사용량만 보고 JVM 메모리 부족 원인을 놓침]]

---

## 참고

> "The Java Virtual Machine defines various run-time data areas that are used during execution of a program." — [JVM Specification §2.5](https://docs.oracle.com/en/java/javase/26/docs/specs/jvms/jvms-2.html)

> "Each Java Virtual Machine thread has its own pc (program counter) register." — [JVM Specification §2.5.1](https://docs.oracle.com/en/java/javase/26/docs/specs/jvms/jvms-2.html)
