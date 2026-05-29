---
aliases: [Append-only Event History, Event History, 이벤트 이력]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) Append-only 이벤트 이력은 상태 변경을 덮어쓰지 않고 발생한 사건을 시간순으로 계속 추가 저장하는 방식이다.
> (이해용) 현재 상태 표지판은 바뀌어도, 왜 그렇게 됐는지 적은 일지는 계속 뒤에 붙인다.

## 해결하는 문제

- 현재 상태만 보고는 왜 그 상태가 되었는지 모르는 문제.
- 운영, CS, 분쟁, 장애 복구에서 변경 경로를 추적하지 못하는 문제.
- 통계 분석에서 단계별 이탈이나 평균 처리 시간을 계산하기 어려운 문제.

```text
current table
rent_id=1 status=CANCELED

history table
REGISTERED -> APPROVED -> CANCELED
```

## 치르는 비용

- 저장량이 증가한다.
- event schema version 관리가 필요하다.
- 현재 상태와 이벤트 이력을 같은 transaction 안에서 맞춰야 한다.

## 동작 원리

```pseudo
transaction {
  rent.cancel()
  rentRepository.save(rent)
  rentEventRepository.append(RentCanceledEvent)
}
```

현재 상태 테이블은 빠른 조회를 담당하고, 이벤트 이력 테이블은 이유와 흐름을 담당한다.

## 관련 본질

- [[본질-이벤트의 불변성]]
- [[개념-감사 로그 (Audit Log)]]
- [[본질-정합성과 무결성의 차이]]

## 참고

> "Not just can we query these events, we can also use the event log to reconstruct past states" — [Martin Fowler, Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
