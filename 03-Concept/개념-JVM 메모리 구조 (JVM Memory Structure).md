---
aliases: [JVM Memory Structure, JVM Memory Model, Heap, Method Area, Metaspace, PC Register, vtable, itable]
tags: [개념, 작성중, JVM, Java]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) JVM이 프로그램 실행을 위해 OS로부터 할당받은 메모리를 역할에 따라 분리한 논리적 구조.
> (이해용) "코드가 실행되는 극장 — 배우(객체)는 무대(Heap), 대본(클래스 메타데이터)은 소품실(Method Area), 각 배우의 현재 대사 위치(PC)는 별도 메모로 관리."

---

## 해결하는 문제

- 플랫폼 독립적 실행 — OS/하드웨어 메모리 모델을 추상화하여 바이트코드로 어디서든 동일하게 동작
- 동적 클래스 로딩 — 필요한 시점에 클래스를 메모리에 올리는 lazy loading 지원

---

## 치르는 비용

- GC 오버헤드 — Heap 관리를 JVM이 대신하므로 Stop-the-World 발생 가능
- 메타데이터 메모리 누수 — Metaspace는 native memory라 OOM 방향이 다름 (`OutOfMemoryError: Metaspace`)

---

## 동작 원리

### 전체 구조

```
+----------------------------------------------------------+
|                        JVM Memory                        |
|                                                          |
|  +----------------------------------------------------+  |
|  |              Method Area (Metaspace)               |  |
|  |  +-----------------+   +----------------------+   |   |
|  |  |  Animal.class   |   |     Dog.class        |   |   |
|  |  | - constant pool |   | - constant pool      |   |   |
|  |  | - field data    |   | - field data         |   |   |
|  |  | - method data   |   | - method data        |   |   |
|  |  | - vtable        |   | - vtable             |   |   |
|  |  +--------^--------+   +----------^-----------+   |   |
|  +-----------|------------------------|--------------+   |
|              | klass ptr              | klass ptr        |
|  +-----------+------------------------+---------------+  |
|  |                      Heap                          |  |
|  |  [ Object Header | age(Animal) | breed(Dog) ]      |  |
|  |                   ^ parent fields first            |  |
|  +----------------------------------------------------+  |
|                                                          |
|  +-- Thread-1 ----------+  +-- Thread-2 ------------+    |
|  | Stack                |  | Stack                  |    |
|  | PC Register          |  | PC Register            |    |
|  | Native Method Stack  |  | Native Method Stack    |    |
|  +----------------------+  +------------------------+    |
+----------------------------------------------------------+
```

---

### Heap — 객체 실체가 사는 곳

- 모든 **객체 인스턴스와 배열**이 저장되는 공간. GC의 대상.
- 객체 구조: `[Object Header] [instance fields]`
  - Object Header: mark word(GC 정보, lock 상태) + klass pointer(Metaspace의 클래스 메타데이터 참조)
  - 메서드는 저장되지 않음 — klass pointer를 통해 Method Area의 메서드 데이터를 참조

**상속 관계의 메모리 레이아웃:**

```
class Animal { int age;   }
class Dog extends Animal  { int breed; }

Dog dog = new Dog();

Heap layout:
+----------------+------------+-------------+
| Object Header  | age (int)  | breed (int) |
|   (16 bytes)   | offset +0  | offset +4   |
+----------------+------------+-------------+
                 ^-- Animal fields first
                              ^-- Dog fields follow

dog.age   -> base_address + 0
dog.breed -> base_address + 4
```

- 부모 클래스 필드가 앞에, 자식 클래스 필드가 그 뒤에 연속 배치
- C/C++ 객체 레이아웃과 동일한 원리 — **고정 offset**으로 필드에 직접 접근 가능

---

### Method Area (Metaspace) — 클래스 설계도가 사는 곳

클래스 로더가 `.class` 파일을 읽어 적재하는 공간. **Java 8부터 PermGen 제거 → Metaspace(native memory)로 대체.**

**클래스 메타데이터 구성:**

```
Dog.class metadata (klass struct)
|
+-- constant pool
|     literals, symbolic refs to classes/methods/fields
|     (resolved to actual addresses at runtime -> Runtime Constant Pool)
|
+-- field data
|     field name, type, access flags, offset in Heap object
|
+-- method data
|     method name, signature, access flags, bytecode
|
+-- vtable (Virtual Method Table)
      index | method          | actual impl
      ------|-----------------|-------------------
        0   | speak()         | -> Dog::speak()    // overridden
        1   | breathe()       | -> Animal::breathe()
```

**vtable과 다형성 (상속 기반):**

```
Animal a = new Dog();
a.speak();

1. a -> Heap object (Dog instance)
2. Heap object -> klass pointer -> Dog.klass (Metaspace)
3. Dog.klass -> vtable[index] -> Dog::speak()   // O(1), index-based

// vtable works because single inheritance guarantees
// the same method always sits at the same index across the hierarchy
//   Dog.vtable[0]  -> speak()
//   Cat.vtable[0]  -> speak()  <- same index, different impl
```

**itable과 다형성 (인터페이스 기반):**

인터페이스는 다중 구현이 가능하여 vtable index 단일화가 불가능 → **itable(interface table)** 을 별도로 사용.

```
// MyRunnable implements Runnable, Comparable
Runnable r = new MyRunnable();
r.run();

1. r -> Heap object (MyRunnable instance)   // interface is just a reference type
2. Heap object -> klass pointer -> MyRunnable.klass (Metaspace)
3. MyRunnable.klass -> itable
     entry: Runnable   -> [ run() -> MyRunnable::run ]
     entry: Comparable -> [ compareTo() -> MyRunnable::compareTo ]
4. scan for Runnable entry -> run()          // O(n), n = # of implemented interfaces

// Interface's own klass in Metaspace:
//   - method signatures only (no bytecode)
//   - cannot be instantiated
//   - no itable (it IS the interface, not an implementor)
```

**vtable vs itable 비교:**

```
                  vtable                    itable
---------------------------------------------------------
dispatch basis  | class hierarchy          | interface contract
lookup          | O(1) by fixed index      | O(n) scan by interface
multiple impl   | single inheritance only  | multiple interfaces OK
stored in       | implementing class.klass | implementing class.klass
index stability | guaranteed across hier.  | not guaranteed -> can't use index
```

> 실제 Heap 객체는 항상 구체 클래스의 인스턴스.
> `Runnable r = new MyRunnable()`에서 Heap엔 MyRunnable 객체만 존재.
> `Runnable`은 reference 타입일 뿐 — 별도 객체가 생기지 않는다.

**C/C++ Code 영역과의 차이 — 동적 로딩:**

```
C/C++ Code Segment                  Java Method Area (Metaspace)
----------------------------        ----------------------------
loaded all at startup               loaded on demand by ClassLoader
compiled to machine code            stores bytecode + metadata
no runtime class addition           supports runtime class loading
                                    (reflection, plugin systems)
```

→ Java가 플러그인 아키텍처, 리플렉션, 핫스왑을 지원할 수 있는 근거

---

### Stack — 스레드별 실행 컨텍스트

- 각 스레드마다 독립적으로 존재. GC 대상 아님.
- 메서드 호출마다 **Stack Frame** 하나가 쌓임

```
+-----------------------------+
| Stack Frame: main()         |
|   local vars: dog (ref)  ---+---> Heap (Dog instance)
|   operand stack             |
|   method reference          |
+-----------------------------+
| Stack Frame: bark()         |
|   local vars: volume (int)  |  // primitive stored directly
|   operand stack             |
+-----------------------------+
```

- Stack에 저장되는 것: 참조값(주소), 기본 타입 값, 메서드 실행 컨텍스트
- 객체 자체는 절대 Stack에 없음 — Heap에 있고 Stack은 참조만 보유

---

### PC Register — 바이트코드 실행 위치 추상화

```
Hardware PC (managed by OS)
  -> tracks current machine instruction of JVM interpreter itself

JVM PC Register (managed by JVM, per thread)
  -> tracks current bytecode instruction index

// Two layers of abstraction:
OS thread PC:  [interpreter machine code position]
JVM PC:        [bytecode array index]  <-- what JVM PC Register stores
```

- JVM은 OS 위에서 동작하는 가상 머신 → **하드웨어 PC와 별개로 자신만의 PC 필요**
- 각 스레드마다 독립적으로 존재 — 멀티스레드 환경에서 각자의 실행 위치 유지
- **Native Method 실행 중엔 undefined** — 바이트코드가 없으므로 추적 불필요

---

## 관련 본질

- [[본질-추상화 (Abstraction)]] — PC Register는 하드웨어 PC 위의 추상화 계층. Method Area는 OS의 Code 영역 위의 추상화.
- [[본질-동시성 (Concurrency)]] — Stack과 PC Register가 스레드별로 독립 존재하는 이유.
- [[본질-간접 참조 (Indirection)]] — klass pointer를 통한 메서드/vtable 참조 구조.

---

## 관련 개념

- [[개념-Java 정적·동적 바인딩 (Static·Dynamic Binding)]] — vtable이 동적 바인딩의 구현 수단
