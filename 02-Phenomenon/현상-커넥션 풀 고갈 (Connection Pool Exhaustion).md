---
aliases: [Connection Pool Exhaustion, 커넥션 고갈, 커넥션 풀 부족]
tags: [현상, 작성중]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의

> (사전적) 커넥션 풀에 할당된 모든 커넥션이 점유된 상태에서 새 요청이 대기하거나 실패하는 현상.
> (이해용) DB 연결이라는 공유 자원이 바닥나서 후속 요청이 줄을 서다가 타임아웃으로 터지는 상황.

## 발생 환경

- HikariCP 등 커넥션 풀 사용 환경 (Spring Boot 기본)
- 동시 요청이 많은 서비스
- 커넥션 점유 시간이 길어지는 모든 상황

## 관찰되는 증상

- `Connection is not available, request timed out after Xms` 에러
- DB 응답은 정상이나 애플리케이션 레이어에서 타임아웃
- 스레드 덤프에서 `HikariPool connection adder` 대기 다수
- APM에서 DB 커넥션 획득 대기 시간 급증

## 추측되는 원인

두 가지 경로로 동일한 결과에 도달:

```
[경로 A: Lock 경합]                [경로 B: 트랜잭션 범위 과대]
WHERE 없는 UPDATE 등                @Transactional + 느린 외부 호출
  → 쓰기 blocking 시간 증가           → 커넥션 idle 점유 지속
  → 커넥션 대기 시간 증가              → 동시 점유 커넥션 수 증가
          └──────────────────────────────────┘
                         ↓
                  커넥션 풀 고갈
                         ↓
                  스레드 고갈 → 서비스 장애
```

- [[개념-Lock 범위 (Row Lock vs Table Lock)]]
- [[개념-Spring 트랜잭션 관리 (Transaction Management)]]

## 관련 사례

- [[사례-WHERE절 없는 UPDATE로 게임 서버 전체 접속 끊김]]
- [[사례-@Transactional 안에 외부 API 호출로 커넥션 풀 고갈]]
