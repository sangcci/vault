---
aliases: [PriorityQueue vs TreeMap, Heap Range Query Misuse, Heap BST Choice]
tags: [문제, 작성중, DataStructure, Algorithm]
difficulty: Medium
type: Problem
---

# Problem: 45-PriorityQueue로 정렬 순회나 범위 조회를 하려다 성능이 나빠짐

## 상황

항상 가장 작은 값이 필요해서 `PriorityQueue`를 사용했다. 이후 “특정 값 찾기”, “정렬된 순서로 전체 순회”, “범위에 속한 값 조회”, “floor/ceiling 조회”가 필요해졌는데 성능과 코드가 복잡해졌다.

```java
PriorityQueue<Integer> pq = new PriorityQueue<>();

// 최솟값 반복 추출은 좋음
pq.poll();

// 특정 값 찾기 / 범위 조회는 전체 순회 필요
pq.contains(target); // O(n)
```

---

## 관찰된 증거

- `PriorityQueue`에서 임의 원소 탐색이 느리다.
- 전체를 정렬 순서로 보려면 계속 `poll()` 해야 해서 구조가 파괴된다.
- 범위 조회를 위해 queue를 list로 복사 후 sort한다.
- “heap은 정렬된 트리”라고 오해한다.
- `TreeMap`/`TreeSet`이 필요한 문제에 heap을 사용한다.

---

## 의심 문제

가장 가능성 높은 문제는 **heap과 search tree의 보장 범위를 혼동한 것**이다.

Heap은 루트에 최우선 원소가 있다는 부분 순서만 보장한다. 전체 정렬 순서나 임의 탐색, 범위 조회를 보장하지 않는다.

---

## 원인

```text
Heap / PriorityQueue
  보장: root가 최소/최대
  강점: poll min/max 반복 O(log n)
  약점: 임의 탐색 O(n), 정렬 순회 아님

BST / TreeMap / Red-Black Tree
  보장: key 전체 순서 유지
  강점: 탐색/삽입/삭제/범위 조회 O(log n)
  약점: heap보다 메모리/포인터 비용 큼
```

---

## 확인 방법

- 필요한 연산이 “최솟값 반복 추출”인지 “순서 유지 조회”인지 구분한다.
- `floorKey`, `ceilingKey`, range query가 필요한지 확인한다.
- queue를 매번 정렬하거나 복사하는 코드가 있는지 본다.
- 삭제/갱신할 원소를 임의로 찾아야 하는지 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 최솟값/최댓값 반복 추출만 필요하면 PriorityQueue | 단순하고 빠름 | 임의 탐색 약함 |
| 범위 조회/정렬 순회가 필요하면 TreeMap/TreeSet | 순서 연산 가능 | 메모리 비용, O(log n) |
| 빠른 membership도 필요하면 HashMap 병행 | 탐색 보완 | 동기화/일관성 관리 필요 |
| indexed heap 구현 | update/delete 보완 | 구현 복잡도 증가 |

---

## 트레이드오프

Heap은 “가장 우선순위 높은 하나”를 빠르게 찾기 위해 전체 순서 정보를 포기한다. BST는 전체 순서를 유지하기 위해 매 연산마다 균형 유지 비용을 지불한다.

---

## 연결되는 본질

- [[본질-부분 순서와 전체 순서의 차이]]
- [[본질-추상 인터페이스와 구현 비용]]

---

## 참고

> "An unbounded priority queue based on a priority heap." — [JDK API: PriorityQueue](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/PriorityQueue.html)

> "A Red-Black tree based NavigableMap implementation." — [JDK API: TreeMap](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/TreeMap.html)
