---
aliases: [중복 저장 방지, Duplicate Save Prevention Strategy, Unique Key vs Lock]
tags: [판단기준, 검증됨]
type: Heuristic
difficulty: Medium
---

## 판단 기준

```
동일 데이터가 2번 이상 INSERT되는 것을 막아야 한다

클라이언트가 동일 요청을 재시도(retry)하는가?
  ├── YES → 재시도 목적이 무엇인가?
  │          ├── "기 처리된 결과를 그대로 반환받아야 함"
  │          │    예: 결제 재시도 → 새 결제 아닌 기존 결제 ID 반환
  │          │    → 멱등성 키 (Idempotency Key) 필요
  │          │
  │          └── "단순 중복 저장만 막으면 됨"
  │               예: 동일 이름 Concert를 두 번 저장하면 안 됨
  │               → Unique Key 제약 + 예외 처리로 충분
  │                  (동시 재시도로 Race Condition 발생해도 UK가 최후 차단)
  │
  └── NO  → 아래 기준으로

동시에 여러 요청이 경쟁하는가? (Race Condition)
  ├── YES → Lock 계열
  │          ├── 단일 서버 → 비관적 락 (SELECT FOR UPDATE)
  │          └── 다중 서버 → Redis 분산 락
  └── NO  → Unique Key 제약 + flush + try-catch로 충분

공통: DB Unique Key는 항상 최후 보루로 유지
```

> 기존 [[판단기준-동시성 제어 방법 선택 (Atomic UPDATE vs Lock)]]은 "이미 있는 행을 동시에 UPDATE"할 때의 기준.
> 이 노트는 "없는 행을 동시에 INSERT"하는 중복 저장 문제를 다룸.

---

## 효과적인 상황

**Unique Key + flush + try-catch:**
- 단일 서버, 동시 요청 빈도 낮음
- 비즈니스 로직이 이미 중복을 어느 정도 막는 경우 (DB가 최후 보루)
- 구현 복잡도 최소화 우선

**비관적 락 (SELECT FOR UPDATE):**
- 동시 요청이 잦고, 중복 발생 시 재시도 비용이 큰 경우
- INSERT 전 SELECT FOR UPDATE로 존재 여부 확인 + 행 잠금

**멱등성 키:**
- API 재시도 방어 (결제, 주문 발행 등)
- 클라이언트가 요청마다 고유 키를 헤더에 포함
- 서버는 키 존재 여부로 중복 판별 → 기 처리 결과 반환

---

## 실패하는 상황

- **Unique Key만으로 동시성 해결 기대**: Race Condition 상황에서 두 요청이 동시에 INSERT 시도하면 한 쪽 예외 발생 → 예외 처리 로직 없으면 500 반환
- **Redis 락 단독 사용**: 락 만료 전 서버 재시작 등 예외 상황에서 DB 제약 없으면 중복 허용 가능

---

## 출처

- [[사례-JPA Unique Key 중복 저장 방지]]
