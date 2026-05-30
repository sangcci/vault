---
aliases: [Red-Black Tree, RB Tree, 레드블랙트리]
tags: [개념, 작성중]
type: Concept
difficulty: High
---

## 한 문장 정의

> (사전적) 각 노드에 Red/Black 색을 부여하고 5가지 색 규칙으로 트리 높이를 O(log n)으로 유지하는 자가 균형 BST.
> (이해용) "BST의 편향 문제를 색 규칙으로 해결한 구조 — Java TreeMap, C++ std::map의 내부 구현체."

---

## 해결하는 문제

- BST의 최악 O(n) 편향 문제 해결 → 삽입·삭제·탐색 모두 O(log n) 보장

---

## 치르는 비용

- 삽입·삭제 시 Recoloring + Rotation 연산 필요 → 구현 복잡
- 노드당 색 정보와 포인터 저장 → Heap 대비 메모리 사용량 증가

---

## 동작 원리

**5가지 색 규칙:**
```
1. 모든 노드는 Red 또는 Black
2. 루트는 항상 Black
3. 모든 리프(NIL)는 Black
4. Red 노드의 자식은 반드시 Black (연속 Red 금지)
5. 임의의 노드에서 모든 리프까지 경로의 Black 노드 수는 동일 (Black-height)
```

규칙 4·5가 핵심 — 이 두 조건이 트리 높이를 2·log(n+1) 이하로 강제한다.

```
        7(B)
       /    \
    3(R)    18(R)
    / \     /  \
  2(B) 4(B) 11(B) 19(B)
              \
              14(R)
```

**삽입 후 균형 복구:**
```
새 노드는 항상 Red로 삽입
→ 규칙 위반 발생 시:

Case 1. 삼촌이 Red  → Recoloring (부모·삼촌 Black, 조부모 Red)
Case 2. 삼촌이 Black, 꺾인 형태 → Rotation으로 Case 3으로 변환
Case 3. 삼촌이 Black, 직선 형태 → Rotation + Recoloring
```

**Java TreeMap과의 관계:**
```
TreeMap.put(key, value)
  → Red-Black Tree 삽입
  → 키 기준 정렬 순서 자동 유지
  → floorKey(), ceilingKey() O(log n) 제공
```

| 연산 | 시간복잡도 |
|------|----------|
| 탐색 | O(log n) |
| 삽입 | O(log n) |
| 삭제 | O(log n) |

---

## 관련 본질

- [[본질-트레이드오프 (Trade-off)]]

---

## 관련 개념

- [[개념-이진 탐색 트리 (BST, Binary Search Tree)]]
- [[개념-힙 (Heap)]]
- [[판단기준-Heap vs BST 선택]]
