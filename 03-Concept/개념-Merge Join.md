---
aliases: [Merge Join, Sort Merge Join, 병합 조인]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) JOIN 키 기준으로 정렬된 두 테이블을 Two Pointer로 한 번씩만 순회해 조인하는 전략.
> (이해용) 두 정렬된 명단을 손가락 하나씩 짚어가며 매칭하는 방식. 앞으로만 이동.

## 해결하는 문제

- 양쪽 모두 인덱스(정렬 상태)가 있는 대용량 조인
- 디스크 I/O가 불가피한 환경에서 순차 접근 보장

## 치르는 비용

- 정렬되지 않은 경우 Sort 노드 추가 비용
- 중복 값이 많으면 Mark/Restore(되감기) 비용 발생

## 동작 원리

```
[전제: 양쪽 모두 JOIN 키 기준 정렬]

L 포인터 (rbs)    R 포인터 (rp)    동작
2025-01-01        2025-01-01       L==R → 매칭, 결과 emit
2025-03-01        2025-01-01       L>R  → R만 전진
2025-03-01        2025-03-01       L==R → 매칭, 결과 emit
2025-09-11        2025-09-11       L==R → 매칭, R 중복 체크
                  2025-09-11            → R 전진, 또 매칭
                  2025-09-11            → R 전진, 또 매칭
                  2025-11-20            → 끝, L 전진
```

**중복 처리 (Mark/Restore)**

```
L=2025-09-11 → Mark 저장
R=2025-09-11 → 매칭
R=2025-09-11 → 매칭
R=2025-11-20 → 끝

L 전진 → 다음 L도 2025-09-11이면 R을 Mark로 되감아 재탐색
```

**EXPLAIN 출력**

```
[인덱스 있음 — 정렬 공짜]
Merge Join
  →  Index Scan on rent_boarding_slot  ← 이미 정렬됨
  →  Index Scan on rent_participants   ← 이미 정렬됨

[인덱스 없음 — Sort 비용 추가]
Merge Join
  →  Sort
       →  Seq Scan on rent_boarding_slot
  →  Sort
       →  Seq Scan on rent_participants
```

**순차 탐색이 유리한 이유**

```
Seq Scan / Index Scan → 파일 순서대로 읽음 → OS readahead 작동
Index Scan의 heap 접근 → 물리적 랜덤 I/O (non-clustered 시)

PostgreSQL: random_page_cost = 4.0 (순차 대비 4배 비쌈)
            SET random_page_cost = 1.1  -- SSD 환경 튜닝
```

## 관련 본질

- [[본질-처리량과 지연시간 (Throughput and Latency)]]
