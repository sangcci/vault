---
aliases: [LinkedList, 연결 리스트, Doubly Linked List]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 각 노드가 데이터와 인접 노드의 주소를 저장하는 이중 연결 리스트 구현체.
> (이해용) 각 사람이 앞뒤 사람의 이름만 아는 인간 체인. 끊고 연결은 쉽지만, n번째 사람을 찾으려면 처음부터 세야 한다.

## 해결하는 문제

- 빈번한 중간 삽입·삭제가 필요하고 임의 접근이 불필요한 경우

## 치르는 비용

- 임의 접근: O(n) — 처음 또는 끝에서부터 순회
- 노드마다 prev/next 포인터 2개 추가 메모리 (객체 오버헤드 포함 ~24bytes/node)
- 참조 지역성 없음 → CPU 캐시 미스 빈번

## 동작 원리

```
[prev|data|next] ↔ [prev|data|next] ↔ [prev|data|next]
  0x100              0x580              0x2A0
  (불연속 주소 → 캐시 미스 → DRAM 왕복 반복)
```

- `add(index, e)`: index까지 순회 후 포인터 교체 → O(n) 순회 + O(1) 연결
- `removeFirst()` / `removeLast()`: O(1) — head/tail 포인터만 교체

## 관련 본질

- [[본질-참조 지역성 (Locality of Reference)]]
