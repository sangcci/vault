---
aliases: [Audit Log, 감사로그, Audit Trail]
tags: [개념, 작성중]
difficulty: Medium
type: Concept
---

## 한 문장 정의

> (사전적) 감사 로그는 중요한 사건이 발생했을 때 무엇이 언제 일어났는지 추적할 수 있게 남기는 기록이다.
> (이해용) 일반 로그가 “시스템이 왜 아팠는가”를 보는 기록이라면, 감사 로그는 “누가 무엇을 바꿨는가”를 증명하는 기록이다.

---

## 해결하는 문제

- 상태가 왜 바뀌었는지 설명한다.
- 누가, 언제, 무엇을, 어떤 이유로 바꿨는지 추적한다.
- CS, 분쟁, 장애 복구, 보안 감사 질문에 답한다.
- 단순 현재 상태 테이블만으로 알 수 없는 과거 흐름을 보존한다.

```text
현재 상태만 저장
Rent.status = CANCELED
        |
        v
질문: 누가? 언제? 왜? 이전 상태는?
        |
        v
감사 로그 필요
```

---

## 치르는 비용

- 저장량이 늘어난다.
- 보존 기간과 개인정보 처리 기준이 필요하다.
- 업무 트랜잭션과 함께 기록하지 않으면 정합성 문제가 생길 수 있다.
- 일반 애플리케이션 로그와 섞이면 검색과 해석이 어려워진다.

---

## 동작 원리

감사 로그는 보통 append-only 형태로 쌓는다. 과거 기록을 수정하기보다 새 기록을 추가한다.

```text
rent_status_history
- rent_id
- actor_id
- previous_status
- next_status
- reason
- occurred_at
```

상태 변경 usecase에서는 현재 상태 변경과 감사 기록 생성을 같은 트랜잭션 안에 넣어야 한다.

```pseudo
transaction {
  rent.cancel(actor, reason)
  rentRepository.save(rent)
  auditLogRepository.append(statusChangedEvent)
}
```

---

## 일반 로그와 차이

| 구분 | 일반 로그 | 감사 로그 |
|---|---|---|
| 목적 | 장애 분석, 성능 분석, 흐름 추적 | 행위 증명, 변경 이력, 책임 추적 |
| 질문 | 어디서 느려졌나? 에러가 났나? | 누가 바꿨나? 이전 값은 무엇인가? |
| 스키마 | 자유로운 메시지 중심 | 업무 식별자와 행위자 중심 |
| 보존 | 운영 정책에 따라 짧을 수 있음 | 법적/업무상 보존 요구 가능 |

---

## 관련 본질

- 이벤트의 불변성
- [[본질-정합성과 무결성의 차이]]
- Append-only 이벤트 이력
- [[개념-구조화된 로그 (Structured Logging)]]

---

## 참고

> "An audit log is the simplest, yet also one of the most effective forms of tracking temporal information." — [Martin Fowler, Audit Log](https://martinfowler.com/eaaDev/AuditLog.html)

> "The idea is that any time something significant happens you write some record indicating what happened and when it happened." — [Martin Fowler, Audit Log](https://martinfowler.com/eaaDev/AuditLog.html)
