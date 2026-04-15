---
aliases: [Critical_Section, CS]
tags: [개념, 완료]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 공유 자원에 접근하며, 실행 순서에 따라 결과가 달라질 수 있어 한 번에 하나의 스레드만 진입이 허용되는 코드 영역.
> (이해용) 공용 화장실 내부 — 들어가는 순간 문을 잠가야 하고, 나오기 전까지 아무도 들어올 수 없는 공간.

## 해결하는 문제

- **[[현상-경쟁 조건]]**: 두 스레드가 동시에 공유 변수를 수정하여 데이터가 오염되는 문제.

## 치르는 비용

- **처리량 감소**: 한 번에 하나의 스레드만 진입 가능하므로 병렬 처리 효율이 떨어짐.
- **[[현상-교착 상태]] 위험**: 임계 구역 보호 로직이 잘못되면 스레드 전체가 멈출 수 있음.

## 동작 원리

임계 구역은 **Entry Section → Critical Section → Exit Section → Remainder Section** 4단계로 구성됩니다.

```text
Thread A                           Thread B
   |                                   |
[Entry Section]                   [Entry Section]
  락 획득 시도 ────────────────── 락 획득 실패 → 대기
   |                                   |
[Critical Section]                  (Spinning or Sleeping)
  공유 자원 접근                        |
   |                                   |
[Exit Section]                         |
  락 해제 ──────────────────────── 락 획득 성공
   |                              [Critical Section]
[Remainder Section]                공유 자원 접근
```

동기화 메커니즘이 반드시 충족해야 하는 3대 조건은 [[본질-임계 구역 해결의 3대 조건]]을 참조.

## 관련 본질

- [[본질-임계 구역 해결의 3대 조건]]
- [[본질-원자성 (Atomicity)]]
