---
aliases: [Cache Eviction Policy, 캐시 교체 정책, 캐시 교체 알고리즘, Eviction, W-TinyLFU, approximate LRU]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 캐시가 꽉 찼을 때 어떤 엔트리를 제거할지 결정하는 알고리즘.
> (이해용) OS 페이지 교체와 같은 알고리즘 계열이지만, 적용 레이어가 다르다. OS는 물리 메모리 ↔ 디스크, 캐시는 캐시 스토어 ↔ DB/원본.

---

## 해결하는 문제

- 유한한 메모리 공간에서 적중률(Hit Rate)을 최대화
- 불필요한 엔트리가 메모리를 점유하지 않도록 관리

---

## 알고리즘 비교

```text
알고리즘        제거 기준             특징
────────────────────────────────────────────────────────
LRU             가장 오래 사용 안 된 것  범용적, 최근성 기반
LFU             사용 빈도가 가장 낮은 것  장기 인기 콘텐츠에 유리
                                        초기 웜업 불리 (새 키가 오래된 인기 키를 못 이김)
W-TinyLFU       빈도 + 최근성 결합       Caffeine 사용, LRU·LFU 단점 모두 보완
approximate LRU 샘플링 기반 LRU 근사     Redis 사용, 진짜 LRU보다 메모리 효율적
```

---

## 동작 원리

### 진짜 LRU vs Redis approximate LRU
```text
진짜 LRU
  이중 연결 리스트 + 해시맵 유지
  → 모든 키의 접근 순서 정확히 추적
  → 메모리 오버헤드 큼

Redis approximate LRU (기본 샘플 5개)
  eviction 필요 시 → 랜덤으로 N개 키 샘플링
                   → 그 중 가장 오래된 것 제거
  → 완전한 LRU보다 정확도 약간 낮음
  → 메모리 오버헤드 없음
  → 샘플 수(maxmemory-samples) 늘리면 정확도 향상
```

### W-TinyLFU (Caffeine)
```text
┌─────────────────────────────────────────────────┐
│  Window Cache (1%)     Main Cache (99%)          │
│  새 진입 키 수용        ┌──────────┬───────────┐ │
│  최근성 보장            │Protected │Probationary│ │
│                        │(80%)     │(20%)       │ │
│                        │자주 쓰인  │검증 중      │ │
│                        └──────────┴───────────┘ │
└─────────────────────────────────────────────────┘
  Count-Min Sketch로 빈도 근사 계산 → 메모리 효율적
  Window → Probationary 진입 시 빈도 경쟁으로 Protected 승격
  → 최근 유입 키도 기회 보장 + 장기 인기 키도 보호
```

### Redis maxmemory-policy 옵션
```text
noeviction      메모리 꽉 차면 에러 반환 (기본값)
allkeys-lru     전체 키 중 LRU
volatile-lru    TTL 설정된 키 중 LRU        ← 일반적으로 권장
allkeys-lfu     전체 키 중 LFU (Redis 4.0+)
volatile-lfu    TTL 설정된 키 중 LFU
allkeys-random  전체 키 중 랜덤
volatile-ttl    만료 임박한 키부터 제거
```

---

## 치르는 비용

- LRU: 순차 스캔(Sequential Flood) 시 최신 페이지가 전부 교체 → [[판단기준-페이지 교체 알고리즘 선택]]
- LFU: 새 키가 장기 인기 키를 이길 수 없어 캐시 오염 지속
- W-TinyLFU: 구현 복잡도 높음 (Caffeine이 대신 처리해줌)
- approximate LRU: 샘플 수 적으면 핫 키 보호 실패 가능

---

## 관련 본질

- [[본질-참조 지역성 (Locality of Reference)]]
- [[판단기준-페이지 교체 알고리즘 선택]]
- [[개념-로컬 캐시 (Local Cache)]]
- [[개념-Redis (Remote Dictionary Server)]]
