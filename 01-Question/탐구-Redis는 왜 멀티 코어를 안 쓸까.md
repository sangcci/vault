---
aliases: [Redis Multi-core, Redis Threading]
tags: [탐구, 작성중]
difficulty: Medium
type: Question
---
## 핵심 질문 (Core Question)
> (CPU가 남아도는 시대에 왜 굳이 하나만 쓸까?)

---

## 가설 및 추론 (Hypothesis)
- Redis는 메모리 기반이라 CPU보다 **메모리 속도**가 더 중요할 것이다.
- 멀티 스레드로 얻는 이득보다 **락(Lock) 관리 비용**이 더 클 것이다.

---

## 검증 및 팩트 (Verification)
- **CPU는 병목이 아니다**: Redis는 초당 100만 요청도 처리 가능하며, 병목은 주로 **네트워크 대역폭**이나 **메모리**다.
- **복잡성 제거**: 멀티 스레드는 교착 상태(Deadlock)와 레이스 컨디션(Race Condition)을 유발하며, 이를 막기 위한 동기화 비용이 컨텍스트 스위칭보다 비싸다.
- **파이프라이닝**: 멀티 코어 대신 파이프라이닝을 통해 처리량을 늘리는 게 더 효율적이다.

---

## 결론 (Conclusion)
- Redis에게 **단일 스레드는 제약이 아니라 '최적화'된 선택**이다.
- 다만, 최근 Redis 6.0부터는 **네트워크 I/O 처리**에 한해 멀티 스레드를 도입했다. (코어 로직은 여전히 싱글)

---

## 연결된 개념 (Links)
- [[본질-단일 스레드 모델]]
- [[개념-문맥 교환 (Context Switch)]]
