---
aliases: [HashMap Collision Resize, HashMap O1 Misconception, Java HashMap Performance]
tags: [문제, 작성중, Java, Collection, HashMap]
difficulty: Medium
type: Problem
---

# Problem: 40-HashMap 조회가 항상 O1이라고 믿었는데 충돌과 리사이즈로 느려짐

## 상황

키 기반 조회가 필요해서 `HashMap`을 사용했다. 평균 O(1)이라고 생각했지만, 특정 데이터에서 조회가 느려지거나 대량 삽입 중 지연이 튄다.

```java
Map<Key, Value> map = new HashMap<>();
for (Key key : keys) {
    map.put(key, load(key));
}
```

---

## 관찰된 증거

- 특정 key 분포에서 bucket 하나에 원소가 몰린다.
- `hashCode()` 구현이 나쁘거나 `equals()`와 일관되지 않다.
- 대량 삽입 중 resize/rehash 시점에 latency가 튄다.
- iteration 성능이 예상보다 나쁘다.
- 초기 capacity를 너무 작게 잡아 resize가 반복된다.

---

## 의심 문제

가장 가능성 높은 문제는 **HashMap의 O(1)을 조건 없는 보장으로 이해한 것**이다.

HashMap의 평균 성능은 hash function이 key를 bucket에 잘 분산시킨다는 전제 위에 있다. 충돌이 많거나 resize가 반복되면 비용이 커진다.

---

## 원인

```text
put/get 흐름
  hashCode()
  → hash spread
  → index = hash & (capacity - 1)
  → bucket 탐색

좋은 경우
  bucket에 원소가 적음
  → 평균 O(1)

나쁜 경우
  hash collision 집중
  → bucket 내부 list/tree 탐색
  → O(n) 또는 O(log n)

resize
  size > capacity * loadFactor
  → table 확장
  → 기존 entry 재배치
```

HashMap은 “해시 함수와 용량 설정이 괜찮을 때 빠른 구조”다.

---

## 확인 방법

- key의 `equals()`/`hashCode()` 계약을 확인한다.
- key 분포와 충돌 여부를 테스트한다.
- 대량 삽입 전 예상 size로 초기 capacity를 잡는다.
- iteration이 중요하면 capacity를 과도하게 크게 잡지 않는다.
- 순서가 필요하면 LinkedHashMap/TreeMap을 검토한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| hashCode/equals 올바르게 구현 | 충돌 감소, 정확성 확보 | 불변 key 권장 |
| 예상 size 기반 initialCapacity 설정 | resize 감소 | 과도한 capacity는 iteration 비용 증가 |
| key 분포 개선 | bucket 편중 완화 | 도메인 key 재설계 필요 |
| TreeMap 사용 | O(log n) 안정성과 정렬 | 평균 조회는 HashMap보다 느림 |
| LinkedHashMap 사용 | 순서 보장 | 메모리 overhead |

---

## 트레이드오프

HashMap은 평균적으로 빠르지만, 그 평균은 좋은 hash 분포와 적절한 capacity에 의존한다. 시간복잡도 표는 자료구조의 계약이 아니라 조건부 성능 모델로 읽어야 한다.

---

## 연결되는 본질

- [[본질-해시 분산과 버킷 경계]]
- [[본질-추상 인터페이스와 구현 비용]]

---

## 참고

> "This implementation provides constant-time performance for the basic operations (get and put), assuming the hash function disperses the elements properly among the buckets." — [JDK API: HashMap](https://docs.oracle.com/en/java/javase/23/docs/api/java.base/java/util/HashMap.html)
