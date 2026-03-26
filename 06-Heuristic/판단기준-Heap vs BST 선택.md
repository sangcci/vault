---
aliases: [Heap vs BST, Heap vs TreeMap]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: Medium
---

## 판단 기준

```
최솟값·최댓값을 반복해서 꺼내는 것이 전부인가?
   ↓ Yes                      ↓ No
  Heap                  정렬 순회 또는 범위 탐색이 필요한가?
                           ↓ Yes              ↓ No
                       BST (TreeMap)      둘 다 가능, Heap이 가벼움
```

- **"우선순위가 높은 것을 빠르게 꺼낸다"** → Heap
- **"정렬 순서를 유지하며 탐색·범위 조회가 필요하다"** → BST

## 효과적인 상황

| 자료구조 | 적합한 상황 | 대표 사례 |
|---------|-----------|---------|
| Heap | 최솟값·최댓값 반복 추출 | Dijkstra 우선순위 큐, 작업 스케줄러 |
| BST (TreeMap) | 범위 탐색, 정렬 순회 | floorKey·ceilingKey, 순위 계산, 범위 쿼리 |

## 실패하는 상황

- **Heap으로 임의 탐색**: 특정 값 탐색이 O(n) — 정렬 보장이 없어서 전체 순회 필요
- **BST를 Priority Queue로 사용**: 동작은 하지만 Heap보다 메모리·구현 비용이 높음
- **둘을 혼동**: Heap은 "가장 작은 것 꺼내기"에 특화, BST는 "순서 유지"에 특화 — 목적이 다름

## 관련 개념

- [[개념-힙 (Heap)]]
- [[개념-Red-Black Tree]]
- [[개념-이진 탐색 트리 (BST, Binary Search Tree)]]
