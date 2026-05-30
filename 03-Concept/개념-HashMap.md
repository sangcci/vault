---
aliases: [HashMap, 해시맵, Hash Table]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 키를 해시 함수로 변환한 인덱스에 값을 저장하는 Map 구현체.
> (이해용) 이름의 첫 글자로 서랍을 정해 물건을 넣는 캐비닛. 첫 글자만 알면 바로 찾지만, 같은 첫 글자가 몰리면 서랍 안을 뒤져야 한다.

---

## 해결하는 문제

- 키-값 쌍을 평균 O(1)로 저장·조회·삭제해야 할 때

---

## 치르는 비용

- 해시 충돌 시 성능 저하: 최악 O(n) → Java 8 이후 O(log n)으로 개선
- 순서 보장 없음 (삽입 순서 필요 시 LinkedHashMap 사용)
- load factor 초과 시 rehash 비용 (전체 재배치)

---

## 동작 원리

```
key.hashCode() → index = hash & (capacity - 1)

buckets[]:
  [0] → null
  [1] → Node{k,v} → Node{k,v}  ← 충돌 시 체이닝
  [2] → null
  ...

충돌 노드 수 ≥ 8 → LinkedList → TreeBin (Red-Black Tree)  → O(log n)
충돌 노드 수 ≤ 6 → TreeBin  → LinkedList (복원)
```

- 기본 capacity: 16, load factor: 0.75
- 저장 수 > capacity × 0.75 → capacity 2배 확장 후 rehash

---

## 관련 본질

- [[본질-해시 함수 (Hash Function)]]
