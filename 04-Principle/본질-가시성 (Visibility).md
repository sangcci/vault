---
aliases: [Visibility, Observability Boundary, 가시성]
tags: [본질, 작성중]
type: Principle
difficulty: High
---

**핵심 질문**: "존재하거나 변한 것이 왜 모든 관찰자에게 즉시, 똑같이 보이지 않는가?"

## 한 문장 정의

> (사전적) 가시성은 어떤 대상의 존재, 상태, 변화가 특정 관찰자에게 어떤 조건과 시점에 관찰 가능한지를 정하는 성질이다.
> (이해용) 세상은 하나여도 창문 위치, 권한, 시점, 동기화 경계가 다르면 각자가 보는 세계는 달라진다.

---

## 핵심 구조

```text
실제 대상 / 상태 변화
        │
        ▼
+-------------------------------+
| 가시성 경계                    |
| - 시간 경계: 언제 보이는가     |
| - 공간 경계: 어디까지 보이는가 |
| - 권한 경계: 누가 볼 수 있는가 |
| - 동기화 경계: 어떤 순서 뒤에 보이는가 |
+-------------------------------+
        │
        ▼
관찰자에게 보이는 세계
```

가시성의 핵심은 "존재"와 "관찰"을 분리하는 것이다. 어떤 값이 이미 쓰였고, row가 이미 만들어졌고, 프로세스가 이미 존재하고, 객체가 이미 참조를 갖고 있어도 그것이 모든 관찰자에게 즉시 보인다는 뜻은 아니다.

---

## 사용 예시

1. **Java Memory Model**: 한 thread가 값을 써도 다른 thread가 바로 볼 수 없다. `synchronized`, `volatile`, [[개념-메모리 배리어 (Memory Barrier)]] 같은 동기화 경계가 필요하다.

> "An unlock on a monitor happens-before every subsequent lock on that monitor." — [Java Language Specification §17.4.5](https://docs.oracle.com/javase/specs/jls/se22/html/jls-17.html#jls-17.4.5)

2. **Database MVCC**: row version이 존재해도 모든 transaction에 보이지 않는다. [[개념-MVCC (PostgreSQL)]]는 snapshot과 transaction id를 기준으로 어떤 version을 볼지 결정한다.

> "Each SQL statement sees a snapshot of data (a database version) as it was some time ago" — [PostgreSQL Docs: Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

3. **OS / Container**: 같은 host에 process가 있어도 namespace가 다르면 보이지 않는다. [[개념-Namespaces와 Cgroups]]는 process, network, mount 같은 자원 가시성을 격리한다.

> "Namespaces wrap a global system resource in an abstraction that makes it appear to the processes within the namespace that they have their own isolated instance of the global resource." — [Linux man-pages: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

4. **Object Design**: 객체가 다른 객체를 참조하지 못하면 그 객체는 협력 대상이 될 수 없다. [[본질-연관 (Association)]]은 객체 세계에서 가시성의 통로다.

5. **Encapsulation / Security**: 내부 상태가 존재해도 외부에 전부 노출하면 변경 파급과 보안 위험이 커진다. [[본질-캡슐화 (Encapsulation)]]는 필요한 것만 보이게 해서 변경 표면을 줄인다.

---

## 트레이드오프

- **가시성을 넓히면** 협력과 디버깅은 쉬워진다. 대신 결합도, 노출면, 경합, 보안 위험이 커진다.
- **가시성을 좁히면** 격리와 안전성은 좋아진다. 대신 전달, 동기화, 조회, 권한 위임 비용이 생긴다.
- **즉시 보이게 하면** 직관성은 좋아진다. 대신 캐시, 배치, snapshot, 지연 전파 같은 최적화 여지가 줄어든다.
- **늦게 보이게 하면** 성능과 격리는 좋아진다. 대신 stale read, 동시성 버그, 원인 추적 난이도가 증가한다.

```text
넓은 가시성 ───────────── 좁은 가시성
협력 쉬움                  격리 강함
디버깅 쉬움                변경 파급 작음
결합/노출 큼               전달 비용 큼
```

---

## 왜 사라지지 않는가

가시성 문제는 저장소나 언어의 우연한 구현 디테일이 아니다. 모든 시스템에는 관찰자가 여러 명이고, 관찰자마다 시간·위치·권한·동기화 상태가 다르다.

```text
관찰자 A ── 같은 대상 ── 관찰자 B
   │                       │
다른 시점                 다른 권한
다른 캐시                 다른 snapshot
다른 namespace            다른 참조 경로
```

따라서 시스템 설계는 항상 "무엇을 숨길 것인가"와 "언제 보이게 할 것인가"를 결정해야 한다. 가시성은 동시성, 일관성, 보안, 모듈성, 디버깅을 동시에 관통하는 본질이다.

---

## 다른 모습들

- **동시성**: write가 다른 thread에 언제 보이는가.
- **일관성 모델**: 연산 순서와 관찰 결과가 어떤 규칙을 따르는가. → [[본질-일관성의 종류 (Consistency Types)]]
- **트랜잭션**: 어떤 row version이 내 transaction snapshot에 보이는가.
- **컨테이너**: 어떤 process/network/mount가 namespace 안에서 보이는가.
- **객체 설계**: 어떤 객체가 어떤 객체를 알고 호출할 수 있는가.
- **보안**: 어떤 주체가 어떤 정보를 볼 권한이 있는가.
- **UI/관측성**: 내부 상태를 사용자나 운영자에게 얼마나 드러낼 것인가.

---

## 관련 본질

- [[본질-일관성의 종류 (Consistency Types)]]
- [[본질-연관 (Association)]]
- [[본질-캡슐화 (Encapsulation)]]
- [[본질-추상화 (Abstraction)]]
- [[본질-격리성 (Isolation)]]

---

## 관련 개념

- [[개념-메모리 배리어 (Memory Barrier)]]
- [[개념-MVCC (PostgreSQL)]]
- [[개념-Namespaces와 Cgroups]]
- [[개념-뮤텍스 (Mutex)]]
- [[개념-스레드 안전성 (Thread Safety)]]
