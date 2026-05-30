---
aliases: [Static Binding, Dynamic Binding, 정적 바인딩, 동적 바인딩, Method Dispatch]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 메서드·필드 호출을 실제 구현에 연결하는 시점이 컴파일 타임이면 정적, 런타임이면 동적 바인딩이다.
> (이해용) 공연 티켓에 좌석 번호를 인쇄하는 시점이 출력 시(컴파일)냐, 입장 시(런타임)냐의 차이.

---

## 해결하는 문제

- 다형성(Polymorphism) 구현 — 부모 타입 참조로 자식 메서드를 실행
- 필드는 성능·단순성을 위해 컴파일 타임에 고정

---

## 치르는 비용

- 동적 바인딩: VTable 탐색 오버헤드 (단, 현대 JIT로 대부분 인라인 최적화)
- 정적 바인딩(필드): 다형성 불가 — 참조 타입 기준으로 필드 고정

---

## 동작 원리

```
[ 컴파일 타임 — 정적 바인딩 ]
  B a = new D();
  └─ 컴파일러는 참조 타입 B만 본다
     → a.x  : B.x 오프셋으로 바이트코드 확정
     → a.getX() : "B에 getX() 있는지" 시그니처 확인만

[ 런타임 — 동적 바인딩 (VTable) ]
  Heap에서 실제 객체 D를 찾는다
        │
        ▼
  D의 VTable 탐색
  ┌────────────────────┐
  │ D.VTable           │
  │  getX() → D.getX  │  ← Override 확인 → D 메서드 실행
  └────────────────────┘

[ 검증 코드 ]
B a = new D();   // D: x=7, getX(){ return x*3; }
                 //  B: x=3, getX(){ return x*2; }
a.getX()  → 21  // 동적: D.getX() 실행, D.x=7 참조
a.x       → 3   // 정적: 참조 타입 B의 x
```

### static 메서드는 정적 바인딩
```java
Parent ref = new Child();
ref.staticMethod(); // → Parent.staticMethod() 실행
                    // static은 VTable 없음, 참조 타입 기준 컴파일 확정
```

---

## 관련 본질

- [[본질-상속 (Inheritance)]]
- [[본질-캡슐화 (Encapsulation)]]
- [[본질-추상화 (Abstraction)]]
