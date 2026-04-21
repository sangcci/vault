---
aliases: [Keep-Alive, HTTP Persistent Connection, HTTP 지속 연결]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) HTTP 요청마다 TCP 연결을 새로 맺지 않고 하나의 연결을 재사용하는 메커니즘.
> (이해용) 매번 악수하지 않고, 한 번 악수한 채로 여러 요청을 주고받는 것.

## 해결하는 문제

- HTTP/1.0에서 요청 1개마다 TCP 3-way handshake 반복 → RTT 낭비
- 페이지 1개 = HTML + CSS + JS + 이미지 수십 개 → 연결 수십 번 반복

## 치르는 비용

- 연결을 유지하는 동안 서버 소켓 리소스 점유
- timeout 설정 없으면 유휴 연결이 누적되어 연결 고갈 발생 가능

## 동작 원리

```
HTTP/1.0 (Keep-Alive 없음):
  [TCP SYN] → [SYN-ACK] → [ACK]
  → GET /index.html
  ← 200 OK
  → [FIN] [FIN-ACK]           ← 연결 종료
  [TCP SYN] → [SYN-ACK] → [ACK]  ← 또 handshake
  → GET /style.css
  ← 200 OK
  → [FIN] [FIN-ACK]

HTTP/1.1 (Keep-Alive 기본값):
  [TCP SYN] → [SYN-ACK] → [ACK]  ← 1번만
  → GET /index.html
  ← 200 OK
  → GET /style.css
  ← 200 OK
  → GET /app.js
  ← 200 OK
  → [FIN]                     ← idle timeout 후 종료
```

## HTTP 버전별 비교

| 버전 | Keep-Alive | 특징 |
|---|---|---|
| HTTP/1.0 | 없음 (기본) | `Connection: keep-alive` 헤더로 수동 요청 가능 |
| HTTP/1.1 | 기본값 | `Connection: close`로 명시적 종료 |
| HTTP/2 | 기본 + Multiplexing | 연결 1개에 스트림 다수 병렬 처리 |
| HTTP/3 | QUIC 기반 | TCP 대신 UDP, 0-RTT handshake |

## 관련 본질

- [[본질-계층 분리 (Layered Architecture)]]
