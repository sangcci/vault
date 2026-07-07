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

- [[23-운영 중 인덱스 추가로 쓰기 요청이 막히거나 마이그레이션이 멈춤]] — CONCURRENTLY 3단계: 진행 중인 트랜잭션 모두 종료 대기
- [[본질-스키마 이력과 배포 순서]] — `flyway_schema_history` 잠금용 외부 트랜잭션이 `executeInTransaction=false` 이후에도 유지됨
- [[본질-임계 구역과 활동성]] — CONCURRENTLY가 Flyway 자신을 기다리는 자기 참조 잠금 구조
