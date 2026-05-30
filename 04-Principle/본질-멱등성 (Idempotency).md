---
aliases: [Idempotency]
tags: [본질, 작성중]
created: 2026-02-03
updated: 2026-02-04
type: Principle
difficulty: Medium
---
# Principle: 멱등성 (Idempotency)
**핵심 질문**: "여러 번 수행해도 결과가 같은 성질은 왜 백엔드에서 필수적인가?"

## One-liner Definition
> (사전적) 연산을 여러 번 적용하더라도 결과가 달라지지 않는 성질.
> (이해용) **"실패했을 때 고민 없이 다시 시도해도 안전하게 만드는 백엔드의 약속"**.

---

## Usage Examples (문장 3개)
1. "결제 API 호출 시 **멱등성** 키를 헤더에 포함하여 중복 결제를 방지했다."
2. "인프라 구축 시 Terraform을 사용하면 몇 번을 실행해도 동일한 상태를 유지하는 **멱등성**이 보장된다."
3. "REST API 설계 지침에 따라 DELETE 메서드는 여러 번 호출해도 상태가 변하지 않는 **멱등성**을 가져야 한다."

---

## Recurring Core Problem
분산 시스템과 네트워크 통신은 언제나 실패할 수 있습니다. 요청을 보냈는데 응답을 받지 못한 경우(Timeout), 클라이언트는 작업이 성공했는지 실패했는지 알 수 없습니다. 이때 '안전하게 다시 보낼 수 있는 방법'이 없다면 데이터 중복이나 상태 오염이 발생합니다.

---

## Why It Doesn't Disappear
네트워크의 비결정론적 특성(Unreliability)은 물리적인 한계이기 때문입니다. '최소 한 번 전달(At-least-once)' 방식의 메시지 큐나 재시도 로직이 존재하는 한, 중복 요청은 필연적으로 발생하며 이를 처리할 멱등적 설계는 필수적입니다.

---

## Trade-offs
- **저장소 비용**: 중복 요청을 판별하기 위해 사용된 멱등성 키(Unique ID)를 일정 기간 캐시나 DB에 저장해야 합니다.
- **로직 복잡도**: 모든 상태 변경 연산에 대해 '이미 처리되었는지' 확인하는 체크 로직과 예외 처리가 추가되어야 합니다.

---

## Appears As
- **Idempotency Key**: 결제 및 주문 처리 시 유니크 키 활용
- **UPSERT**: DB의 `INSERT IGNORE` 또는 `ON DUPLICATE KEY UPDATE`
- **Standard HTTP Methods**: GET, PUT, DELETE (멱등성 보장 메서드)
- **Flyway 체크섬 검증**: 마이그레이션 파일이 이미 적용됐으면 재실행하지 않고, 파일이 변조됐으면 체크섬 불일치로 실행 거부 → 중복 적용과 변조를 동시에 차단

---

## Related Cases
- [[본질-원자성 (Atomicity)]]
- [[본질-회복탄력성 (Resilience)]]
- [[개념-불변 인프라 (Immutable Infrastructure)]]
