---
aliases: [Coroutine, 코루틴, suspend, resume]
tags: [개념, 작성중]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) 실행을 임의 시점에 일시 중단(suspend)하고 재개(resume)할 수 있는 서브루틴의 일반화된 형태.
> (이해용) "함수가 중간에 멈추고 제어권을 넘겼다가, 나중에 멈춘 지점부터 정확히 다시 시작하는 구조."

## 해결하는 문제

- 스레드 생성 없이 동시성 달성 — I/O 대기 중 다른 작업 수행
- 콜백 지옥 없이 비동기 코드를 동기 코드처럼 작성

## 치르는 비용

- **협력적 멀티태스킹**: 코루틴이 직접 양보(yield)해야 다음 코루틴 실행 가능 — 한 코루틴이 CPU를 독점하면 나머지 전부 대기
- OS 선점 없음 → 애플리케이션 레벨에서 직접 스케줄링 관리

## 동작 원리

일반 함수(서브루틴)와의 차이:

```
서브루틴:  호출 → 실행 → 반환 (한 방향)

코루틴:    호출 → 실행 → suspend → (제어권 반환)
                        ↑              ↓
                       resume ←── 다른 작업
```

**언어별 구현:**

```
Kotlin:  suspend fun fetchData() { ... }
         → 컴파일러가 상태 머신으로 변환
         → suspend 지점마다 중단·재개 가능

Python:  async def fetch(): await asyncio.sleep(1)
         → await = suspend 지점

Go:      goroutine + channel
         → OS 스레드 위에서 런타임이 M:N으로 스케줄링
         → 선점 가능 (Go 1.14+) → 엄밀히는 코루틴과 다름
```

**싱글스레드 이벤트루프와의 관계:**

```
이벤트루프 (Node.js, nginx, Redis)
   ↓
콜백/Promise/async-await 모두 코루틴 메커니즘의 구현체
   ↓
I/O 대기 → suspend → 다음 태스크 실행 → resume
```

## 관련 본질

- [[본질-동시성 (Concurrency)]]
- [[본질-선점 (Preemption)]]

## 관련 개념

- [[개념-이벤트 루프]]
- [[탐구-nginx, redis 처럼 싱글스레드 기반 프로그램도 내부 과정이 Coroutine과 동일하다고 봐야 하는가, 동일한 동시성 문제를 공유하고 있는가]]
