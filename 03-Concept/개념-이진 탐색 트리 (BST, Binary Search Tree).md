---
aliases: [BST, Binary Search Tree, 이진 탐색 트리]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 모든 노드에서 왼쪽 서브트리 < 현재 노드 < 오른쪽 서브트리 속성을 재귀적으로 만족하는 이진 트리.
> (이해용) "전화번호부를 반씩 나눠 찾듯, 비교할 때마다 탐색 범위를 절반으로 줄이는 트리 구조."

---

## 해결하는 문제

- 정렬된 데이터에서 O(log n) 탐색·삽입·삭제

---

## 치르는 비용

- **편향(Skew)**: 정렬된 순서로 삽입하면 linked list처럼 퇴화 → 최악 O(n)
- 균형을 스스로 보장하지 않음 → Red-Black Tree, AVL Tree 같은 균형 BST 필요

---

## 동작 원리

```
BST 속성:
      8
     / \
    3   10
   / \    \
  1   6    14
     / \   /
    4   7  13

모든 노드에서: left subtree < node < right subtree
```

**탐색 — O(log n) 평균:**
```
찾는 값 6:
root(8) → 6 < 8 → left(3) → 6 > 3 → right(6) → 찾음
```

**편향 발생 시:**
```
삽입 순서: 1, 2, 3, 4, 5

1
 \
  2
   \
    3      → linked list와 동일, 탐색 O(n)
     \
      4
       \
        5
```

---

## 관련 본질

- [[본질-트레이드오프 (Trade-off)]]

---

## 관련 개념

- [[개념-Red-Black Tree]]
- [[개념-힙 (Heap)]]
- [[판단기준-Heap vs BST 선택]]
