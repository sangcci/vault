# 비관적 락 vs 원자적 UPDATE — 별점 집계 동시성 분석

## 사례: ConcertHall 별점 업데이트

### 현재 구현 (Read-Modify-Write + 비관적 락)

```java
// HallService
ConcertHall hall = concertHallRepository.findByIdWithLock(hallId); // SELECT FOR UPDATE
hall.updateStar(starDelta, countDelta);  // Java 계산
concertHallRepository.save(hall);        // UPDATE

// ConcertHall.updateStar()
this.totalStars += starDelta;
this.reviewCount += countDelta;
this.star = (double) totalStars / reviewCount;  // ← reviewCount=0이면 NaN
```

---

## 비관적 락이 Lost Update를 막는가?

**막는다.** 흐름:
```
트랜잭션 A:  SELECT FOR UPDATE → (대기 없음) → Java 계산 → UPDATE → COMMIT
트랜잭션 B:  SELECT FOR UPDATE → [A 커밋까지 대기]  → Java 계산 → UPDATE → COMMIT
```
B는 A가 커밋한 최신값을 읽으므로 Lost Update 없음.

---

## 문제점

### 1. NaN 버그
`마지막 리뷰 삭제` 시나리오:
```java
updateStar(-5, -1)
→ totalStars = 0
→ reviewCount = 0
→ star = (double) 0 / 0  →  NaN
```

Java에서 `double` 0/0은 예외 없이 **NaN**을 반환한다.

### 2. 성능
- SELECT + UPDATE 두 번의 DB 왕복
- 락 잡는 동안 모든 경쟁 트랜잭션 직렬화

---

## 원자적 UPDATE 방식 (개선 방향)

```sql
UPDATE concert_hall
SET total_stars  = total_stars + :starDelta,
    review_count = review_count + :countDelta,
    star = CASE WHEN review_count + :countDelta = 0 THEN 0.0
                ELSE (total_stars + :starDelta)::float / (review_count + :countDelta)
           END
WHERE id = :hallId
```

장점:
- DB 레벨 원자성 → 락 불필요
- NaN을 CASE로 DB에서 차단
- 왕복 1회

---

## totalStars 필드를 따로 두는 이유

별점 수정/삭제 시 이전 값 없이 델타만으로 처리하기 위해:
```
삭제: totalStars += (-3), reviewCount += (-1)
수정: totalStars += (+2), reviewCount += (0)   ← 이전 별점 몰라도 됨
```

`totalStars` 없이 `star * reviewCount`로 역산하면 **double 부동소수점 오차 누적** 발생.

---

## 요약

| 방식 | Lost Update | NaN 버그 | 성능 |
|------|-------------|----------|------|
| SELECT FOR UPDATE + Java 계산 | 방지 | 발생 가능 | 낮음 (직렬화) |
| 원자적 SQL UPDATE | 방지 | DB에서 차단 | 높음 |

---

## 관련 개념

- `PESSIMISTIC_WRITE` = `SELECT ... FOR UPDATE` (배타적 잠금)
- Java `double` / 0 = `NaN` (ArithmeticException 발생 안 함, 조용한 버그)
- DB 원자적 UPDATE: `SET x = x + delta` 는 DB가 단일 연산으로 처리