---
aliases: [SQL Physical Execution, SQL 실행 흐름]
tags: [탐구, 작성중]
type: Question
difficulty: High
---

## 핵심 질문

> rdb에서 from과 where 동작 원리를 이해했음. 기존에는 그냥 from이 먼저 실행하고 where이 동작하는 정도였는데, from테이블이 저장된 disk page를 불러들여 memory buffer 영역에 적재한 후에 where 스캔을 한개씩 실행하는 것(인덱스 유무에 따라 다르겠지만)으로 이해했음. 이런식으로 sql 동작을 전체를 이해하고 싶음.

---

## 파생 노트

- [[개념-SQL 물리 실행 흐름]]
- [[개념-Seq Scan]]
- [[개념-Index Scan]]
- [[개념-Bitmap Index Scan]]
- [[개념-EXPLAIN ANALYZE]]
- [[개념-DBMS의 역할과 저장소 관리자 (Storage Manager)]]
