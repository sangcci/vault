---
aliases: [ArrayList vs LinkedList Performance, Sequential Access Locality, Java List Choice]
tags: [문제, 작성중, Java, Collection, Performance]
difficulty: Medium
type: Problem
---

# Problem: 39-List를 LinkedList로 바꿨는데 순차 조회가 더 느려짐

## 상황

중간 삽입·삭제가 있을 수 있다는 이유로 `ArrayList` 대신 `LinkedList`를 선택했다. 하지만 실제 서비스에서는 대부분 순차 조회와 인덱스 접근이고, 데이터가 많아질수록 `LinkedList`가 더 느리다.

```java
List<Order> orders = new LinkedList<>();
for (int i = 0; i < orders.size(); i++) {
    process(orders.get(i)); // LinkedList에서는 매번 순회
}
```

---

## 관찰된 증거

- 순차 조회인데도 CPU 시간이 높다.
- `get(i)`가 많은 코드에서 성능이 급격히 나빠진다.
- 객체 할당 수와 GC 압력이 늘어난다.
- CPU cache miss가 증가한다.
- 단순히 “삽입/삭제가 O(1)”이라는 표만 보고 선택했다.

---

## 의심 문제

가장 가능성 높은 문제는 **컬렉션 선택 기준을 Big-O 표만 보고 실제 접근 패턴과 메모리 지역성을 보지 않은 것**이다.

`LinkedList`는 노드 연결 자체는 O(1)이지만, 원하는 위치까지 이동하는 비용은 O(n)이다. 또한 노드가 메모리에 흩어져 있어 CPU cache locality가 나쁘다.

---

## 원인

```text
ArrayList
  - 내부 Object[]
  - 연속 배열
  - get(i) O(1)
  - 순차 접근 시 cache locality 좋음
  - 중간 삽입/삭제는 shift O(n)

LinkedList
  - node 객체들의 연결
  - get(i)는 head/tail에서 순회 O(n)
  - 노드마다 객체/포인터 overhead
  - 메모리 불연속 → cache miss 증가
```

“중간 삽입이 있다”만으로 `LinkedList`가 유리해지지 않는다. 그 위치를 찾는 비용과 메모리 접근 비용까지 포함해야 한다.

---

## 확인 방법

- 실제 연산 비율이 조회/순회/삽입/삭제 중 어디에 몰리는지 확인한다.
- `get(i)` 반복이 있는지 찾는다.
- 삽입/삭제 위치를 이미 알고 있는지, 매번 탐색해야 하는지 확인한다.
- JMH 등으로 실제 workload에 맞춰 측정한다.
- GC allocation, cache miss, CPU profile을 함께 본다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 대부분의 일반 List는 ArrayList 사용 | 조회/순회 빠름, 메모리 효율 좋음 | 중간 대량 삽입/삭제 비용 |
| Queue/Deque 용도는 ArrayDeque 검토 | 양끝 삽입/삭제 빠름 | null 미허용 등 API 차이 |
| LinkedList는 노드 참조를 이미 들고 있을 때만 제한 검토 | 연결 변경 O(1) 활용 | 일반 Java List 사용에서는 드묾 |
| 자료구조보다 알고리즘 변경 | 근본 개선 | 설계 변경 필요 |

---

## 트레이드오프

자료구조 선택은 추상 인터페이스가 아니라 실제 접근 패턴과 메모리 배치의 문제다. `List`라는 같은 인터페이스 뒤에서도 배열 기반과 노드 기반은 CPU가 전혀 다르게 접근한다.

---

## 연결되는 본질

- [[본질-접근 패턴과 메모리 지역성]]
- [[본질-추상 인터페이스와 구현 비용]]

---

## 참고

> "Resizable-array implementation of the List interface." — [JDK API: ArrayList](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/ArrayList.html)

> "Operations that index into the list will traverse the list from the beginning or the end, whichever is closer to the specified index." — [JDK API: LinkedList](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedList.html)
