---
aliases: [Transactional External API Connection Pool Exhaustion, Connection Idle Holding, 결제 승인 커넥션 풀 고갈]
tags: [문제, 작성중, Spring, DB, Commerce]
difficulty: High
type: Problem
---

# Problem: 외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈됨

## 상황

커머스 주문 서비스에서 사용자가 결제 버튼을 누르면 다음 순서로 처리한다.

```java
@Transactional
public OrderResult placeOrder(PlaceOrderCommand command) {
    Order order = orderRepository.save(command.toOrder());
    stockService.reserve(command.items());

    PaymentResult payment = paymentClient.approve(command.paymentKey()); // 외부 PG API

    order.markPaid(payment.transactionId());
    shipmentService.createShipment(order);
    return OrderResult.from(order);
}
```

평소에는 문제가 없었지만, 프로모션 시간대에 결제 승인 API가 800ms~3s까지 느려지면서 주문 API가 연쇄적으로 느려졌다.

물류 도메인으로 바꿔도 같은 구조가 반복된다.

```text
배송 접수 트랜잭션 시작
  → 송장/출고 요청 DB 저장
  → 외부 택배사 API 호출 대기
  → 배송 상태 업데이트
  → commit
```

핵심은 **DB 변경 트랜잭션 안에 느리고 실패 가능한 외부 I/O가 들어간 구조**다.

---

## 관찰된 증거

애플리케이션 로그:

```text
2026-07-04 20:01:11.382 WARN  HikariPool-1 - Connection is not available, request timed out after 30000ms.
2026-07-04 20:01:11.383 ERROR o.s.web OrderController - POST /orders failed: SQLTransientConnectionException
```

메트릭:

```text
http.server.requests{uri="/orders", p95}          320ms → 7.8s
hikaricp.connections.active                       8 → 30(max)
hikaricp.connections.pending                      0 → 80+
hikaricp.connections.acquire{p95}                 5ms → 30s
payment.client.approve.latency{p95}               180ms → 2.4s
db.cpu.usage                                      35% 유지
```

스레드/흐름:

```text
요청 thread
  ↓
@Transactional 진입
  ↓
DB Connection 획득
  ↓
주문/재고 DB 작업
  ↓
외부 PG API 호출 대기 2.4s
  ↓
그동안 DB Connection idle 점유
  ↓
동시 요청 증가
  ↓
HikariCP active=max, pending 증가
  ↓
커넥션 획득 timeout
```

---

## 의심 문제

가장 먼저 의심할 문제는 [[01-외부 API 호출을 트랜잭션 안에 넣어 커넥션 풀이 고갈됨]]이다.

하지만 근본 원인은 단순히 pool size가 작은 것이 아니라, **트랜잭션 경계가 외부 I/O까지 확장되어 DB connection 점유 시간이 길어진 것**이다.

```text
문제 이름:
@Transactional 내부 외부 API 호출로 인한 connection idle holding

문제 유형:
트랜잭션 경계 과대 + 공유 자원 점유 시간 증가 + 외부 장애 전파
```

---

## 원인

`@Transactional`은 메서드 경계 안에서 DB connection, EntityManager 같은 트랜잭션 자원을 현재 thread에 묶어 관리한다. 이 상태에서 외부 PG API나 택배사 API 호출이 느려지면, 애플리케이션은 DB 작업을 하지 않는 시간에도 connection을 반납하지 못한다.

```text
커넥션 풀 고갈 압력
= 동시 요청 수 × 트랜잭션 지속 시간 / pool size

외부 API 지연 증가
  → 트랜잭션 지속 시간 증가
  → connection 점유 시간 증가
  → active connection 증가
  → pending request 증가
  → acquire timeout
```

즉 DB가 느린 것이 아니라, **DB connection이 외부 API 대기 시간에 묶여 공유 자원처럼 고갈**된다.

또 다른 위험은 정합성 불일치다.

```text
PG 결제 승인 성공
  ↓
DB 업데이트 중 예외 발생
  ↓
트랜잭션 rollback
  ↓
외부 PG는 결제 완료, 내부 주문은 결제 전 상태
```

외부 시스템 호출은 DB rollback으로 되돌릴 수 없기 때문에, 하나의 `@Transactional`로 DB와 외부 시스템을 함께 원자적으로 묶었다고 착각하면 안 된다.

---

## 확인 방법

먼저 DB 자체 병목인지, connection 점유 병목인지 분리한다.

```text
1. HikariCP active / idle / pending / acquire time 확인
2. transaction duration과 외부 API latency를 같은 시간축으로 비교
3. DB CPU, lock wait, slow query 여부 확인
4. APM trace에서 transaction 내부 external call 위치 확인
5. 결제 성공 로그와 주문 상태 불일치 케이스 확인
```

판단 기준:

```text
DB CPU 낮음 + slow query 없음 + Hikari pending 증가 + 외부 API latency 증가
  → DB 처리량 문제가 아니라 connection 점유 시간 문제 가능성 높음

결제 승인 성공 로그는 있는데 주문 상태가 PAID가 아님
  → 외부 시스템과 내부 DB의 원자성 착각 문제 가능성 높음
```

---

## 해결책 후보

| 해결책 | 장점 | 비용/위험 |
|---|---|---|
| pool size 증가 | 즉시 timeout 완화 가능 | 근본 해결 아님. DB connection 비용 증가. 외부 API가 더 느려지면 다시 고갈 |
| 외부 API timeout 단축 | connection 점유 최악 시간을 줄임 | 정상 요청도 실패 처리될 수 있음 |
| 외부 API 호출을 transaction 밖으로 분리 | DB connection 점유 시간 감소 | 상태 전이와 실패 보상 설계 필요 |
| 주문 상태를 `PAYMENT_REQUESTED`로 먼저 저장 후 비동기 결제 처리 | 장애 격리와 재시도 가능 | 최종 일관성 모델 필요. 사용자 응답 UX 설계 필요 |
| Transactional Outbox 사용 | DB 상태 변경과 이벤트 발행을 같은 transaction에 기록 가능 | outbox relay, 중복 발행, 멱등 처리 필요 |
| 결제 승인/취소 API에 idempotency key 사용 | 재시도와 중복 호출에 안전 | 키 저장소와 만료 정책 필요 |

권장 구조 예시:

```text
[짧은 DB transaction]
  주문 생성: PAYMENT_REQUESTED
  결제 요청 이벤트/outbox 저장
  commit
        ↓
[transaction 밖]
  PG 결제 승인 호출
        ↓
[짧은 DB transaction]
  성공: PAID
  실패: PAYMENT_FAILED
        ↓
[보상]
  DB 반영 실패 시 결제 취소/재시도
```

---

## 트레이드오프

이 문제의 핵심 트레이드오프는 **즉시 일관성처럼 보이는 단순 코드**와 **장애 격리·재시도 가능한 구조** 사이에 있다.

```text
@Transactional 하나로 묶기
  장점: 코드가 단순하고 성공 경로를 이해하기 쉽다.
  단점: 외부 지연이 DB connection 고갈로 전파되고, 외부 성공은 rollback되지 않는다.

상태 전이 + 비동기/보상 처리
  장점: DB transaction이 짧아지고 외부 장애를 격리할 수 있다.
  단점: 상태가 늘어나고, 최종 일관성/재시도/멱등성 설계가 필요하다.
```

면접 답변에서는 다음 순서로 말하는 것이 좋다.

```text
1. 이건 connection pool size 문제가 아니라 transaction 범위 문제일 가능성이 큽니다.
2. 외부 API latency 증가가 DB connection 점유 시간으로 전파됐는지 확인하겠습니다.
3. Hikari active/pending/acquire time, APM trace, 외부 API latency를 같이 보겠습니다.
4. 해결은 외부 I/O를 DB transaction 밖으로 빼고 transaction을 짧게 만듭니다.
5. 결제/배송처럼 외부 시스템과 정합성이 필요하면 상태 전이, outbox, 재시도, 보상, 멱등키를 함께 설계합니다.
```

---

## 연결되는 본질

- [[본질-트랜잭션 경계]]
- [[본질-공유 자원 점유와 대기열]]
- [[본질-공유 자원 점유와 대기열]]
- [[본질-상황 제약 기반 기술 선택]]
- [[본질-요청 멱등성과 중복 방어]]
- [[본질-장애 전파와 복구 경계]]

---

## 참고

> "The key to the Spring transaction abstraction is the notion of a transaction strategy." — [Spring Framework Reference, Transaction Abstraction](https://docs.spring.io/spring-framework/reference/data-access/transaction/strategies.html)

> "Declaring transaction semantics directly in the Java source code puts the declarations much closer to the affected code." — [Spring Framework Reference, Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)

> "HikariCP is a \"zero-overhead\" production ready JDBC connection pool." — [HikariCP README](https://github.com/brettwooldridge/HikariCP)

> "Latency increases are often a leading indicator of saturation." — [Google SRE Book, Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
