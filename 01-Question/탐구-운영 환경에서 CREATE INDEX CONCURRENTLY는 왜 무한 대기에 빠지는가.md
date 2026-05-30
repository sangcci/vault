---
aliases: [CONCURRENTLY 무한 대기, Flyway CONCURRENTLY 교착]
tags: [탐구, 작성중]
type: Question
difficulty: High
---

## 핵심 질문

> 운영 환경에서의 왜 무한 대기가 발생하는가

---

## 파생 노트

- [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] — CONCURRENTLY 3단계: 진행 중인 트랜잭션 모두 종료 대기
- [[개념-Flyway]] — `flyway_schema_history` 잠금용 외부 트랜잭션이 `executeInTransaction=false` 이후에도 유지됨
- [[현상-잠금 경합 (Lock Contention)]] — CONCURRENTLY가 Flyway 자신을 기다리는 자기 참조 잠금 구조
