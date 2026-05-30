---
aliases: [Allreva Concurrency, 차량 대절 Lost Update 해결]
tags: [사례, 완료]
type: Case
difficulty: Medium
---

## 상황

- 사이드 프로젝트 Allreva — 차량 대절 예약 시스템
- `RentBoardingSlot`의 `passengerCount`를 여러 사용자가 동시에 증가시키는 로직
- JPA dirty checking 기반 Read-Modify-Write 방식으로 초기 구현

---

## 실제 발생한 일

k6로 100 VUs 동시 요청 테스트 실행:

```
# 문제 상황 — 모든 요청 200 OK, 하지만 DB는 손실
passenger_count: 16   (실제 신청자: 100명)
→ 84건의 갱신이 소멸 (Lost Update)

http_req_duration avg=784ms, p(95)=1.86s
```

로그에서 5개 스레드가 동시에 `passengerCount: 0`을 읽은 후 모두 `1`로 덮어씀:

```
[thread-1] current passengerCount: 0 → increment: 1
[thread-2] current passengerCount: 0 → increment: 1
[thread-3] current passengerCount: 0 → increment: 1
```

원인: JPA `findById()` → 애플리케이션 메모리에서 +1 → `save()` 패턴.
READ와 WRITE 사이 간격에서 다른 트랜잭션이 개입 → [[현상-갱신 손실 (Lost Update)]]

---

## 근본 원인

- [[본질-원자성 (Atomicity)]] 위배 — READ와 WRITE가 DB 입장에서 분리된 두 연산
- [[현상-갱신 손실 (Lost Update)]] — RMW 패턴의 전형적 발현

---

## 교훈 및 조치

**Atomic UPDATE 적용:**

```sql
UPDATE rent_boarding_slots
SET passenger_count = passenger_count + :delta
WHERE id = :id
  AND (passenger_count + :delta) <= recruitment_count
  AND deleted_at IS NULL
```

- UPDATE 반환값(rowCount)으로 성공/실패 판정 → 0이면 만석 예외 처리
- READ를 제거하고 DB가 단일 연산으로 갱신 → [[개념-Atomic UPDATE]] 참고

**적용 결과:**

```
# Atomic UPDATE 후 — 로컬 환경 100 VUs
passenger_count: 50   (정원 초과 50건은 409 반환, 정상)

http_req_duration avg=87ms, p(95)=187ms  ← 로컬 환경 수치
```

staging 환경 적용 후 p(95) = 1.04s — 정합성은 보장되었으나 응답속도는 별도 분석 필요.
(1차 k6 1.86s는 staging, 2차 187ms는 로컬 — 환경이 달라 직접 비교 불가)

추가로 `stale read` 허용: 화면에서 보이는 잔여 인원은 오래된 값일 수 있음.
대신 실제 신청 시점에 DB 기준으로 원자적 검증 → [[탐구-화면에서 보여준 인원 수와 실제 신청 시점의 불일치는 어떻게 처리해야 할까]]

---

## 파생 판단기준

- [[판단기준-동시성 제어 방법 선택 (Atomic UPDATE vs Lock)]]
