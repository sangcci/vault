---
aliases: [Scan 방식 선택, Scan Strategy, 스캔 전략]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준

- 매칭 row가 전체의 대다수 or 인덱스 없음 → **Seq Scan**
- 매칭 row가 극소수 + 버퍼 풀에 있음 → **Index Scan**
- 매칭 row가 중간 규모 + 디스크 I/O 가능성 → **Bitmap Index Scan**

```
매칭 row 비율
0%                    50%                  100%
│──────────────────────┼─────────────────────│
Index Scan ←──────────┤
                       ├──Bitmap Scan──┤
                                       ├──── Seq Scan ──────→
```

---

## 효과적인 상황

**Seq Scan**
- 전체 row의 10% 이상 읽어야 할 때
- 인덱스 없을 때 (항상 가능한 유일한 수단)
- 테이블이 작아서 전체 읽기가 빠를 때

**Index Scan**
- 극소수 row 조회 (PK lookup, unique 조건)
- 데이터가 버퍼 풀에 올라와 있어 랜덤 I/O 비용 없을 때
- random_page_cost를 낮게 설정한 SSD 환경

**Bitmap Index Scan**
- 중간 규모 매칭 (수천~수만 row)
- 디스크 I/O 발생 가능성이 있을 때
- 복수 인덱스 조건 AND/OR 결합 시 (`BitmapAnd`, `BitmapOr`)

---

## 실패하는 상황

**Seq Scan**
- 테이블이 매우 크고 소량 row만 필요할 때 → 인덱스 추가 필요

**Index Scan**
- non-clustered 환경에서 매칭 row 많을 때 → heap 랜덤 I/O 폭발
- 동일 heap 페이지에 여러 매칭 row → 중복 페이지 접근 비용

**Bitmap Index Scan**
- 매칭 row가 매우 많을 때 → Seq Scan이 더 단순하고 빠를 수 있음

---

## 관련 설정값

```sql
-- 옵티마이저 비용 파라미터
seq_page_cost    = 1.0   -- 기본값
random_page_cost = 4.0   -- 기본값 (랜덤이 4배 비쌈)

-- SSD 환경 튜닝
SET random_page_cost = 1.1;

-- Seq Scan 강제 비활성화 (테스트용)
SET enable_seqscan = off;
```

---

## 진단 방법

EXPLAIN ANALYZE에서:
- `Rows Removed by Filter` 큰 Seq Scan → 인덱스 추가 검토
- `Index Scan` + `actual rows` 많음 → Bitmap으로 전환 가능성
- `Bitmap Heap Scan` + `Recheck Cond` → 정상 동작
