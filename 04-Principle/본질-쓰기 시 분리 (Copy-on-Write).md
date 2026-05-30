---
aliases: [Copy-on-Write, COW, 지연 복사, Lazy Separation, 쓰기 시 복사]
tags: [본질, OS, DB, 작성중]
type: Principle
difficulty: High
---

**핵심 질문**: "분리(복사)가 필요한 순간은 언제인가? — 수정이 일어나는 그 순간이다"

## 한 문장 정의 (Definition)

> (사전적) 여러 주체가 동일한 자원을 공유하다가, 어느 한 쪽에서 수정이 발생하는 순간에만 독립적인 복사본을 만드는 원리.
> (이해용) 쌍둥이가 같은 방을 쓰다가, 한 명이 방을 꾸미려는 순간 비로소 방을 나누는 것. 꾸밀 생각이 없으면 방을 나눌 이유가 없다.

---

## 사용 예시 (Examples)

1. **OS (fork)**: 자식 프로세스 생성 시 부모 메모리 페이지를 공유 → 쓰기 발생 시 해당 페이지만 복사
2. **DB (MVCC)**: 트랜잭션이 레코드 수정 시 원본 건드리지 않고 새 버전 생성, 다른 트랜잭션은 원본 계속 읽음
3. **Git**: 파일 수정 시 새 블롭 오브젝트 생성, 미수정 파일은 기존 오브젝트 공유
4. **Redis (RDB 스냅샷)**: `BGSAVE` 시 fork → COW로 부모는 계속 쓰기, 자식은 fork 시점 스냅샷을 디스크에 씀
5. **Container Layer (OverlayFS)**: 이미지 레이어 공유 → 컨테이너가 파일 수정 시에만 상위 레이어에 복사본 생성

---

## 트레이드오프 (Trade-off)

- **장점**: 복사 비용을 실제 필요한 순간까지 완전히 제거. fork 후 exec를 바로 호출하면 복사가 아예 일어나지 않음
- **단점**: 쓰기 발생 시 "페이지 복사 + 페이지 테이블 업데이트"라는 숨겨진 비용 발생 → 쓰기가 빈번한 워크로드에서는 오히려 불리

```text
[COW 동작]
공유 상태:  Parent ──→ [Page A][Page B][Page C]
                                ↑ 동일 물리 메모리 (읽기 전용 표시)
            Child  ──→ [Page A][Page B][Page C]

Child가 Page B 수정:
page fault 발생 → 커널이 Page B 복사 → 페이지 테이블 업데이트

            Parent ──→ [Page A][Page B ][Page C]  ← 원본
            Child  ──→ [Page A][Page B'](Page C)  ← Page B만 새로 할당
```

---

## 왜 사라지지 않는가 (Persistence)

"쓰기가 없으면 분리가 필요 없다"는 관찰은 하드웨어, 언어, DB 기술이 바뀌어도 변하지 않는다. 불필요한 복사는 항상 낭비이고, **수정이 분리의 유일한 근거**라는 원리는 어떤 시스템에서도 유효하다.

---

## 다른 모습들 (Polymorphism)

- **OS**: 페이지 테이블에 write-protect 비트 설정 → page fault 시 커널이 복사
- **DB**: Undo log / MVCC 버전 체인으로 이전 버전 보존
- **Git**: Content-addressable storage (SHA1 기반 불변 오브젝트)
- **함수형 프로그래밍**: Persistent Data Structure (수정 시 변경된 경로만 복사하는 트리)

---

## JPA 지연 로딩과의 차이

| | JPA Lazy Loading | COW |
|-|-----------------|-----|
| **트리거** | 읽기 (접근) | 쓰기 (수정) |
| **미루는 것** | 데이터 조회 쿼리 | 복사/분리 비용 |
| **원리 계열** | 지연 실행 (Lazy Evaluation) | 조건부 분리 |

공통 조상: "비용을 필요할 때만 지불한다" — 그러나 트리거와 목적이 달라 같은 본질로 묶으면 혼란스러움.
