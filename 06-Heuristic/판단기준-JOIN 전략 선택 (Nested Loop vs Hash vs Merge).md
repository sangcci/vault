---
aliases: [JOIN 전략 선택, JOIN Strategy]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: High
---

## 판단 기준

- Inner에 인덱스 있고 Outer가 소량 → **Nested Loop**
- 인덱스 없고 대용량 조인 → **Hash Join**
- 양쪽 모두 인덱스(정렬) 있고 대용량 → **Merge Join**

```
상황                                  전략
────────────────────────────────────────────────────
Inner 인덱스 있음 + Outer 소량         Nested Loop
인덱스 없음 + 대용량                   Hash Join
양쪽 인덱스 있음 + 대용량 + 디스크 I/O Merge Join
```

## 효과적인 상황

**Nested Loop**
- OLTP 패턴: PK/FK로 소량 row 조인
- Inner 테이블이 버퍼 풀에 올라와 있을 때

**Hash Join**
- 인덱스 없는 대용량 테이블 간 조인
- Build 테이블이 메모리에 충분히 올라올 때 (`Batches: 1`)

**Merge Join**
- 양쪽 B-tree 인덱스 있어 정렬 비용 없음
- 데이터가 버퍼 풀에 없고 디스크 I/O가 불가피할 때
- 순차 접근으로 OS readahead 활용 가능

## 실패하는 상황

**Nested Loop**
- Inner 인덱스 없음 → O(N×M), 대용량에서 치명적

**Hash Join**
- Build 테이블이 메모리 초과 → 디스크 spill (`Batches > 1`) → 급격히 느려짐
- LEFT JOIN에서 오른쪽(Build)이 실제로 더 클 때 (옵티마이저 통계 오류)

**Merge Join**
- 인덱스 없어 Sort 노드 추가 시 대용량에서 정렬 비용 큼
- 인덱스가 있어도 heap이 non-clustered → heap 접근은 여전히 랜덤

## 비용 비교

```
전략           복잡도          메모리 사용
────────────────────────────────────────
Nested Loop    O(N × log M)    낮음
Hash Join      O(N + M)        Build 테이블 전체
Merge Join     O(N + M)        Mark 위치 정도
```

## 진단 방법

EXPLAIN ANALYZE에서:
- `Hash` 노드의 `Batches > 1` → Hash Join 메모리 부족
- `Sort` 노드 앞 Merge Join → 정렬 비용 발생 중
- `loops` × `actual time` 큰 Nested Loop → Inner 인덱스 확인
