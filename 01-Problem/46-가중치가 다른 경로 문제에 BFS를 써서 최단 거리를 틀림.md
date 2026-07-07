---
aliases: [BFS Weighted Graph Wrong Shortest Path, BFS vs Dijkstra, Unweighted Shortest Path]
tags: [문제, 작성중, Algorithm, Graph]
difficulty: Medium
type: Problem
---

# Problem: 46-가중치가 다른 경로 문제에 BFS를 써서 최단 거리를 틀림

## 상황

최단 경로 문제라서 BFS를 사용했다. 하지만 간선마다 비용이 다르거나, 어떤 이동은 1초이고 어떤 이동은 5초라서 먼저 도착한 경로가 실제 최소 비용이 아니었다.

```text
A --1--> B --100--> D
A --5--> C --5----> D

BFS 기준:
  A → B → D  (간선 2개, 먼저 발견)

실제 비용:
  A-B-D = 101
  A-C-D = 10   ← 더 짧음
```

---

## 관찰된 증거

- 이동 횟수는 최소인데 비용 합은 최소가 아니다.
- 가중치가 모두 같지 않은데 FIFO queue를 쓴다.
- 나중에 발견된 노드가 더 작은 distance를 가질 수 있다.
- Dijkstra가 필요한데 “최단 경로 = BFS”로 암기했다.
- 우선순위 큐가 필요한 이유를 설명하지 못한다.

---

## 의심 문제

가장 가능성 높은 문제는 **최단 거리의 기준을 간선 개수와 비용 합으로 구분하지 않은 것**이다.

BFS는 모든 간선 비용이 동일할 때만 먼저 발견한 경로가 최단 경로가 된다. 비용이 다르면 현재까지 누적 비용이 가장 작은 노드를 먼저 처리해야 하므로 priority queue가 필요하다.

---

## 원인

```text
BFS
  전제: 모든 edge cost 동일
  queue: FIFO
  의미: depth가 곧 distance
  시간: O(V + E)

Dijkstra
  전제: edge cost가 다르지만 음수 없음
  queue: priority queue
  의미: 현재까지 distance 최소 노드부터 확정
  시간: O(E log V) 계열
```

---

## 확인 방법

- 간선 비용이 모두 같은지 확인한다.
- 문제의 “최단”이 이동 횟수인지 비용 합인지 확인한다.
- 0/1 가중치라면 0-1 BFS를 검토한다.
- 음수 가중치가 있으면 Dijkstra가 아닌 Bellman-Ford/DP 계열을 검토한다.
- priority queue가 필요한 이유가 “정렬”이 아니라 “현재 최소 distance 확정”인지 설명한다.

---

## 해결책 후보

| 조건 | 선택 |
|---|---|
| 모든 간선 비용 동일 | BFS |
| 간선 비용 0 또는 1 | 0-1 BFS |
| 양수/비음수 가중치 | Dijkstra |
| 음수 가중치 가능 | Bellman-Ford 또는 DP/그래프 특화 알고리즘 |
| DAG 최단 경로 | Topological order DP |

---

## 트레이드오프

BFS는 정렬을 하지 않아 빠르지만, 그 속도는 균등 가중치라는 강한 전제 덕분이다. Dijkstra는 더 일반적인 비용 모델을 다루기 위해 매번 현재 최솟값을 고르는 비용을 지불한다.

---

## 연결되는 본질

- [[본질-탐색 순서와 최단성 보장 조건]]
- [[본질-부분 순서와 전체 순서의 차이]]

---

## 참고

> "The path found by breadth first search to any node is the shortest path to that node, i.e the path that contains the smallest number of edges in unweighted graphs." — [CP-Algorithms: Breadth First Search](https://cp-algorithms.com/graph/breadth-first-search.html)
