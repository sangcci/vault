---
aliases: [Nginx Redis Coroutine Concurrency]
tags: [탐구, 작성중]
type: Question
difficulty: High
created: 2026-03-17
---

## 핵심 질문

> nginx, redis 처럼 싱글스레드 기반 프로그램도 내부 과정이 Coroutine과 동일하다고 봐야 하는가? 동일한 동시성 문제를 공유하고 있는가?

---

## 파생 노트

- [[본질-IO 준비 통지와 실행 책임 분리]]
- [[본질-실행 단위와 스케줄링 경계]]
- [[본질-단일 실행 흐름과 직렬화 비용]]
