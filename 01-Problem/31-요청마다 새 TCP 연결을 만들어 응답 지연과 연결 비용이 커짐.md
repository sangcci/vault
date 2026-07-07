---
aliases: [HTTP Keep Alive Disabled, Persistent Connection, TCP Handshake Overhead]
tags: [문제, 작성중, HTTP, Network]
difficulty: Medium
type: Problem
---

# Problem: 31-요청마다 새 TCP 연결을 만들어 응답 지연과 연결 비용이 커짐

## 상황

클라이언트가 같은 서버에 여러 HTTP 요청을 보내는데, 요청마다 TCP 연결을 새로 만든다. 페이지 하나를 로드할 때 HTML, CSS, JS, 이미지, API 요청마다 handshake가 반복된다.

```text
GET /index.html  → TCP 연결 생성 → 응답 → 연결 종료
GET /style.css   → TCP 연결 생성 → 응답 → 연결 종료
GET /app.js      → TCP 연결 생성 → 응답 → 연결 종료
```

로컬에서는 차이가 작지만, RTT가 큰 환경에서는 응답 지연이 눈에 띄게 증가한다.

---

## 관찰된 증거

- TCP 3-way handshake가 요청마다 반복된다.
- TLS까지 포함하면 handshake 비용이 더 커진다.
- 서버의 연결 생성/종료 수가 요청 수와 거의 같다.
- `Connection: close`가 응답에 포함되어 있다.
- Keep-Alive timeout이 너무 짧거나 proxy가 연결을 끊는다.

---

## 의심 문제

가장 가능성 높은 문제는 **연결 재사용 경계가 끊겨 HTTP 요청마다 전송 계층 setup 비용을 다시 지불하는 것**이다.

HTTP 요청은 애플리케이션 계층 메시지지만, 그 아래에는 TCP 연결 생성, 혼잡 윈도우 warm-up, TLS handshake 같은 비용이 있다.

---

## 원인

```text
비지속 연결
  request 1: TCP handshake + HTTP + close
  request 2: TCP handshake + HTTP + close
  request 3: TCP handshake + HTTP + close

지속 연결
  TCP handshake 1회
  request 1
  request 2
  request 3
  idle timeout 후 close
```

HTTP/1.1에서는 persistent connection이 기본이다. 그러나 서버/proxy/client 설정이 `Connection: close`를 쓰거나 idle timeout이 너무 짧으면 연결 재사용 효과가 사라진다.

---

## 확인 방법

- access log와 tcpdump로 연결 수와 요청 수 비율을 본다.
- 응답 헤더의 `Connection` 값을 확인한다.
- Nginx/ALB/서버 keepalive timeout, max keepalive requests를 확인한다.
- upstream connection pool이 있는지 확인한다.
- HTTP/2 multiplexing을 쓰는지, HTTP/1.1 단일 연결 병목인지 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| HTTP keep-alive 활성화 | handshake 비용 감소 | 유휴 연결 리소스 점유 |
| 적정 idle timeout 설정 | 재사용/리소스 균형 | 너무 길면 연결 고갈 |
| connection pool 사용 | upstream 연결 재사용 | pool 크기/timeout 관리 |
| HTTP/2 multiplexing | 연결 1개에 병렬 stream | HOL/프록시 지원 확인 |
| CDN/edge 활용 | RTT 단축 | 캐시/라우팅 정책 필요 |

---

## 트레이드오프

연결을 매번 닫으면 서버 리소스는 빨리 회수되지만 RTT 비용을 계속 낸다. 연결을 오래 유지하면 지연은 줄지만 socket, file descriptor, memory를 점유한다. 핵심은 요청 패턴과 리소스 한도에 맞는 재사용 경계를 정하는 것이다.

---

## 연결되는 본질

- [[본질-연결 재사용과 계층 비용]]
- [[본질-상황 제약 기반 기술 선택]]
- [[본질-연결 재사용과 계층 비용]]

---

## 참고

> "A client MUST send a Host header field ... in all HTTP/1.1 request messages." — [RFC 9112: HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9112.html)

> "A fundamental notion in the design is that every octet of data sent over a TCP connection has a sequence number." — [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html)
