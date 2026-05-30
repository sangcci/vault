---
aliases: [Persistence, Durability]
tags: [본질, 작성중]
created: 2026-02-05
updated: 2026-02-05
type: Principle
difficulty: Medium
---
# Principle: 영속성 (Persistence)
**핵심 질문**: "전원이 꺼져도 데이터가 사라지지 않게 하려면 어떤 비용을 치러야 하는가?"

## One-liner Definition
> (사전적) 프로세스가 생성했지만, 별도의 기억 장치에 보존되어 프로세스가 종료된 후에도 남아 있는 데이터의 특성.
> (이해용) **"기억을 잉크로 종이에 적어두는 것 (뇌가 멈춰도 기록은 남는다)."**

---

## Usage Examples (문장 3개)
1. "애플리케이션의 메모리 객체를 데이터베이스에 **영속성** 있게 저장하기 위해 ORM 기술을 사용했다."
2. "시스템 장애 시에도 트랜잭션의 **영속성**을 보장하기 위해 WAL(Write Ahead Log) 기법을 적용했다."
3. "세션 정보를 Redis에 보관하여 서버 재시작 시에도 로그인 상태가 유지되는 **영속성**을 확보했다."

---

## Recurring Core Problem
컴퓨터의 연산 장치와 메모리는 전기가 끊기면 데이터를 잃어버리는 휘발성(Volatile)을 갖습니다. 시스템의 '상태'를 영구적인 저장소(Disk)로 옮기는 과정에서 발생하는 물리적 속도의 차이와, 메모리 객체와 DB 테이블 사이의 구조적 차이(Paradigm Mismatch)가 핵심 문제입니다.

---

## Why It Doesn't Disappear
사용자의 소중한 자산인 데이터를 보호하고 비즈니스 연속성을 보장하기 위해서는 영속성이 절대적이기 때문입니다. 연산은 멈출 수 있어도, 그 결과물인 데이터는 영원히 살아남아야 한다는 가치가 소프트웨어의 존재 이유이기도 합니다.

---

## Trade-offs
- **안전성 vs 성능**: 데이터를 디스크에 물리적으로 기록하고 확인(Sync)하는 과정이 늘어날수록 시스템의 응답 속도(Latency)는 급격히 떨어집니다.
- **객체 지향 vs 데이터 정합성**: 코드를 객체답게 짜려 할수록 DB 저장 구조와 멀어지며, 이를 맞추기 위한 추상화 계층(JPA 등)의 학습 곡선과 오버헤드가 발생합니다.

---

## Appears As
- **Durability (ACID)**: 트랜잭션 성공 후의 영구 보장
- **Write Ahead Log (WAL)**: 성능을 챙기면서 영속성을 보장하는 기록 방식
- **Persistence Context (JPA)**: 메모리와 DB 사이의 영속성 관리 계층

---

## Related Cases
- [[본질-원자성 (Atomicity)]] — 영속성의 전제 조건
- [[본질-가용성 (Availability)]]
- [[본질-트레이드오프 (Trade-off)]] — 속도(In-Memory)와 안정성(Persistence)의 균형
