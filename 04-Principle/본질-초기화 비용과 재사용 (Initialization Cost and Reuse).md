---
aliases: [Initialization Cost and Reuse, Resource Reuse, Connection Reuse, 초기화 비용, 재사용]
tags: [본질, 작성중]
difficulty: Medium
type: Principle
---
# Principle: 초기화 비용과 재사용 (Initialization Cost and Reuse)

**핵심 질문**: "비싼 준비 과정을 왜 매번 반복하지 않고 재사용하려 하는가?"

## 한 문장 정의

> (사전적) 초기화 비용과 재사용은 자원을 새로 만들 때 드는 준비 비용을 줄이기 위해 이미 준비된 자원을 다시 쓰는 원리다.
> (이해용) 매번 새 식당을 짓지 않고 이미 차려진 식당의 빈자리를 다시 쓰는 방식이다.

> "Each HTTP request is completed on its own connection; this means a TCP handshake happens before each HTTP request, and these are serialized." — [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Connection_management_in_HTTP_1.x)

```text
매번 새로 만들기
request 1 → create/init → use → close
request 2 → create/init → use → close
request 3 → create/init → use → close

재사용하기
create/init once
  ↓
request 1 → use
request 2 → reuse
request 3 → reuse
```

---

## 사용 예시

1. [[개념-HTTP Keep-Alive]]는 요청마다 TCP handshake를 반복하지 않기 위해 기존 연결을 재사용한다.
2. [[개념-HikariCP]]는 DB connection 생성 비용을 줄이기 위해 connection pool을 둔다.
3. Thread pool은 thread 생성과 제거 비용을 줄이기 위해 이미 만든 thread를 다시 사용한다.

> "A persistent connection is one which remains open for a period of time, and can be reused for several requests, saving the need for a new TCP handshake, and utilizing TCP's performance enhancing capabilities." — [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Connection_management_in_HTTP_1.x)

---

## 핵심 구조

초기화 비용이 큰 자원은 매번 새로 만들수록 지연시간과 부하가 늘어난다. 재사용은 그 비용을 한 번만 내고 여러 요청에 나누어 쓰는 방식이다.

```text
총 비용 = 초기화 비용 + 사용 비용 + 정리 비용

초기화 비용이 작음
→ 새로 만들어도 부담 낮음

초기화 비용이 큼
→ 재사용 가치 증가
```

```text
TCP 연결
DNS/TCP/TLS 준비
  ↓
HTTP request 처리
  ↓
연결 유지
  ↓
다음 request에서 재사용
```

---

## 트레이드오프

- 초기화 비용은 줄지만, idle 자원을 유지하는 memory·file descriptor·connection slot 비용이 생긴다.
- 재사용 수명을 길게 잡으면 성능은 좋아질 수 있지만 오래된 상태, leak, 서버 자원 점유 위험이 커진다.
- 재사용 수명을 짧게 잡으면 안전하지만 handshake·생성 비용을 다시 자주 낸다.

> "Persistent connections also have drawbacks; even when idling they consume server resources, and under heavy load, DoS attacks can be conducted." — [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Connection_management_in_HTTP_1.x)

---

## 왜 사라지지 않는가

네트워크 연결, DB connection, thread처럼 실제 시스템 자원은 생성·초기화·정리 비용을 가진다. 처리할 요청이 많아질수록 매번 새로 만드는 방식은 같은 준비 비용을 반복해 [[본질-처리량과 지연시간 (Throughput and Latency)]]을 악화시킨다.

```text
요청 수 증가
  ↓
초기화 반복 횟수 증가
  ↓
CPU / network round trip / connection slot 비용 증가
  ↓
latency 증가 + throughput 저하
```

---

## 다른 모습들

- **Network**: HTTP Keep-Alive, TLS session resumption
- **DB**: connection pool
- **OS/Application**: thread pool, worker pool
- **Application**: object pool, cache

---

## 관련 노트

- [[본질-처리량과 지연시간 (Throughput and Latency)]]
- [[본질-자원 경합 (Resource Contention)]]
- [[개념-HikariCP]]
