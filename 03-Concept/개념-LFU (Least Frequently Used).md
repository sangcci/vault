---
aliases: [LFU, Least Frequently Used, 최소 사용 빈도]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 참조 횟수가 가장 적은 페이지를 교체하는 알고리즘. 빈도 기반으로 미래 참조를 예측한다.
> (이해용) 도서관에서 대출 횟수가 가장 적은 책을 폐기 처분.

## 해결하는 문제

- **빈도 지역성(Frequency Locality)** 활용 — 자주 쓰인 것은 앞으로도 쓸 가능성이 높음
- 초기 집중 참조 후 다시 참조되지 않는 "한번 인기" 페이지를 캐시에서 빠르게 제거

## 치르는 비용

- **캐시 오염(Cache Pollution)** — 오래된 인기 페이지가 계속 남음 (초기 다수 참조 후 방치)
- 참조 횟수 동률 시 추가 정책 필요 (보통 LRU로 타이브레이킹)
- LRU보다 구현이 복잡 (min-heap 또는 버킷 구조 필요)

## 동작 원리

```
참조열: A A A B B C D  (프레임 2개)

페이지  횟수
  A      3
  B      2
  C      1

D 참조 시 → 교체 대상: C (횟수 1로 최소)
→ [A(3), D(1)] 상태

[ 구현: 해시맵 + 정렬된 버킷 ]
freq=1: [C, D]
freq=2: [B]
freq=3: [A]
         ↑
  교체 시 freq=1 버킷 맨 앞에서 제거

[ LRU vs LFU 비교 ]
LRU: 최근성 기준 → 갑작스러운 burst에 강함
LFU: 빈도 기준 → 반복 참조 패턴에 강함
     단, 오래된 핫 페이지가 캐시 점령하는 오염 발생
```

## 실제 사용처

- **Redis** — `allkeys-lfu`, `volatile-lfu` eviction policy (Redis 4.0+)
- **Memcached** 일부 구현
- CDN 콘텐츠 캐시 (장기 인기 콘텐츠 유지)

## 관련 본질

- [[본질-트레이드오프 (Trade-off)]]
- [[개념-LRU (Least Recently Used)]]
- [[판단기준-페이지 교체 알고리즘 선택]]
