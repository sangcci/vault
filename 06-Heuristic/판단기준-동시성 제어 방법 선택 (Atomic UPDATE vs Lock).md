---
aliases: [동시성 제어 방법 선택, Atomic UPDATE vs Lock, 동시성 락 선택]
tags: [판단기준, 완료]
type: Heuristic
difficulty: High
---

## 판단 기준

```
읽은 값에 의존해서 다른 무언가를 결정하는가?
    │
    ├── NO  → Atomic UPDATE (단순 카운터 증감)
    │
    └── YES → 복잡도에 따라:
                │
                ├── 충돌 빈도 낮음, 재시도 허용 → Optimistic Lock (version 컬럼)
                │
                └── 충돌 빈도 높음, 재시도 불가 → Pessimistic Lock (SELECT FOR UPDATE)
```

---

## 효과적인 상황

**Atomic UPDATE:**
- 단순 카운터 증감 (`count = count + 1 WHERE count < max`)
- 읽은 값이 아닌 DB 내 연산만으로 결정 가능한 경우
- 성능 우선, 락 경합 없이 처리

**Optimistic Lock:**
- 읽은 값에 의존하나 충돌이 드문 경우 (조회 빈도 > 수정 빈도)
- 재시도 로직 구현 가능한 경우
- 예: 게시글 동시 수정, 주문 상태 전이

**Pessimistic Lock:**
- 읽은 값에 의존하면서 충돌이 잦고 재시도 비용이 큰 경우
- 예: 등급별 차등 가격 계산, 좌석 번호 배정, 동반자 묶음 예약

---

## 실패하는 상황

**Atomic UPDATE가 부족한 경우** (→ Lock 필요):
- 현재 count를 읽어 가격을 결정하고 결제까지 묶어야 할 때
- 남은 좌석 목록을 조회 후 특정 좌석 배정할 때
- 여러 테이블을 읽고 원자적으로 업데이트해야 할 때

**Pessimistic Lock 남용 시:**
- DB Connection 점유 시간 증가 → 커넥션 풀 고갈 위험
- 응답 지연 증가

---

## 출처

- [[사례-Allreva 차량 대절 동시성 문제 해결]]
