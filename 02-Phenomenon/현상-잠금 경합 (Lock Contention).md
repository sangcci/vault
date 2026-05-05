---
aliases: [Lock Contention, 잠금 경합, 락 경합]
tags: [현상, 작성중]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의

> (사전적) 여러 스레드·프로세스가 동일한 잠금을 동시에 획득하려 할 때 대기가 쌓이며 처리량이 저하되는 현상.
> (이해용) "화장실 열쇠가 하나인데 줄이 길어지는 것 — 정확성을 위해 잠금을 걸수록 처리량을 잃는 구조적 딜레마."

## 발생 환경

- 대용량 테이블에 일반 `CREATE INDEX` / `ALTER TABLE` 실행 (DB DDL 잠금)
- 멀티스레드 환경에서 공유 자원(캐시, 카운터, 큐) 접근
- 고트래픽 테이블의 쓰기 집중 구간

## 관찰되는 증상

- 쿼리 응답 시간 급증 (Lock wait timeout)
- CPU 사용률은 낮은데 처리량도 낮은 상태 (스레드가 waiting 상태로 idle)
- DB: `SHOW PROCESSLIST`에서 "Waiting for table metadata lock" 등장
- APM: 요청 스택에서 lock acquire 대기 시간이 대부분을 차지

## 잠금의 본질 — 왜 공유락·배타락이 존재하는가

"락"은 자체적으로 특별한 동작을 수행하는 것이 아니다. 관리자가 모드 목록을 만들어두고, **충돌 매트릭스**를 통해 어떤 모드끼리 공존 불가능한지를 선언한 권한 시스템이다.

```
SharedLock (읽기락)   ↔  SharedLock       → 비충돌 (동시 읽기 허용)
SharedLock (읽기락)   ↔  ExclusiveLock    → 충돌   (읽기 중 쓰기 불가)
ExclusiveLock (쓰기락) ↔  ExclusiveLock   → 충돌   (동시 쓰기 불가)
```

PostgreSQL의 8가지 테이블 잠금 모드([[개념-PostgreSQL 테이블 잠금 모드 (Table Lock Modes)]])도 이 원리로 설계됨. 명령어들은 자동으로 적절한 모드를 획득하고, 충돌 여부는 매트릭스가 결정한다.

> "most PostgreSQL commands automatically acquire locks of appropriate modes to ensure that referenced tables are not dropped or modified in incompatible ways while the command executes."
> — [PostgreSQL 16 Docs: Explicit Locking](https://www.postgresql.org/docs/16/explicit-locking.html)

## 추측되는 원인

```
스레드 A가 잠금 보유
      ↓
스레드 B, C, D … 가 같은 잠금 요청
      ↓
대기 큐 누적 → 처리량 급감
      ↓
잠금 보유 시간이 길수록 경합 심화
```

- 근본 원인: 상호 배제(Mutual Exclusion)는 정확성을 보장하지만 직렬화를 강제한다
- [[본질-동시성 (Concurrency)]] — 공유 자원 접근 시 순서 충돌 필연적 발생
- [[본질-임계 구역 해결의 3대 조건]] — 상호 배제 조건이 경합의 원천

## 해결 전략

```
잠금 범위 축소      → 임계 구역을 최소화
잠금 시간 단축      → 잠금 보유 중 I/O·대기 제거
잠금 회피           → MVCC, [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]]
낙관적 잠금         → 충돌 시에만 재시도 (쓰기 충돌이 드문 경우)
샤딩·파티셔닝       → 자원을 쪼개 경합 분산
```

## 관련 사례

- [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] — DDL 잠금 경합을 CONCURRENTLY로 회피한 실무 패턴

## 참고

- [PostgreSQL 16 Docs: Explicit Locking](https://www.postgresql.org/docs/16/explicit-locking.html)
