---
aliases: [B-Tree vs LSM-Tree Storage, DB Storage Architecture, Page vs Segment]
tags: [탐구, 완료, DB, 아키텍처]
type: Question
difficulty: High
---

## 핵심 질문 (Core Question)

> "전통적인 RDB는 왜 고정 크기인 '페이지(Page)'를 주된 저장 단위로 쓰며, 카산드라나 락스DB 같은 NoSQL들은 왜 로그 구조인 '세그먼트(Segment)'를 저장 단위로 선택했는가?"

## 가설 및 추론 (Hypothesis)

- **가설 1**: RDB는 읽기 성능과 데이터 정합성이 중요하므로, 인덱스 검색이 빠른 B-Tree 구조를 유지하기 위해 페이지를 쓸 것이다.
- **가설 2**: NoSQL은 쓰기 처리량(Throughput)이 중요하므로, 디스크 순차 쓰기(Sequential Write)를 극대화하기 위해 세그먼트를 쓸 것이다.

## 검증 및 팩트 (Verification)

### 1. RDB (B-Tree 기반 Page)
- **방식**: Update-in-place (해당 위치 덮어쓰기)
- **단위**: 고정 크기 페이지 (8KB/16KB 등).
- **특징**: 무작위 쓰기(Random Write)가 발생하지만, B-Tree를 통해 어떤 데이터든 일정한 속도(O(log N))로 찾을 수 있음.
- **슬롯 페이지**: 페이지 내부에서 **[[본질-간접 참조 (Indirection)]]**를 활용해 가변 데이터를 관리.

### 2. NoSQL (LSM-Tree 기반 Segment)
- **방식**: Append-only (파일 끝에 계속 붙여쓰기)
- **단위**: 가변적/대용량 파일 뭉치인 세그먼트(SSTable).
- **특징**: 모든 쓰기가 순차 쓰기이므로 쓰기 속도가 압도적임. 하지만 읽기 시 여러 세그먼트를 뒤져야 하는 오버헤드가 있어 블룸 필터(Bloom Filter)나 컴팩션(Compaction)이 필수적임.

### 3. 비교 요약 (Table)
| 구분 | B-Tree (RDB) | LSM-Tree (NoSQL) |
| :--- | :--- | :--- |
| **저장 단위** | Page (고정 크기) | Segment / SSTable (로그 구조) |
| **주요 연산** | Update-in-place (덮어쓰기) | Append-only (추가만 수행) |
| **강점** | 읽기 성능, 낮은 지연 시간 | 쓰기 처리량, 대용량 수집 |
| **단점** | 쓰기 오버헤드 (B-Tree 밸런싱) | 읽기 오버헤드, 컴팩션 비용 |

## 결론 (Conclusion)

- **트레이드오프**: 무작위 I/O와 순차 I/O 중 어디에 가중치를 두느냐의 차이입니다.
- **RDB**는 트랜잭션의 정합성과 정교한 검색(읽기)을 위해 페이지 구조를 택했고, **NoSQL**은 쏟아지는 대량의 데이터(쓰기)를 빠르게 저장하기 위해 세그먼트 구조를 택했습니다.
- 현대의 DB들은 워크로드에 따라 이 구조를 선택하며, 같은 NoSQL이라도 읽기 위주면 B-Tree를(예: MongoDB), 쓰기 위주면 LSM-Tree를(예: Cassandra) 사용합니다.

## 연결된 개념 (Links)

- [[개념-DB 페이지와 Slotted Page 구조]]
- [[개념-B-Tree]]
- [[본질-트레이드오프 (Trade-off)]]
- [[본질-간접 참조 (Indirection)]]
