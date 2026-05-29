---
aliases: [Storage Manager, DB Engine Role]
tags: [개념, DB, 아키텍처]
created: 2026-02-14
updated: 2026-02-14
---
# 개념: DBMS의 역할과 저장소 관리자 (Storage Manager)

## 📝 정의
DBMS 내에서 물리적 저장소(Disk)와 휘발성 메모리(RAM) 사이의 데이터 이동을 책임지며, 상위 실행 엔진에게 데이터의 **영속성(Persistence)**과 **효율적인 접근**을 제공하는 핵심 모듈입니다.

## ⚙️ 핵심 역할

### 1. 물리적 복잡성 은폐 (Abstraction)
- 실행 엔진은 데이터가 어떤 파일의 몇 번째 바이트에 있는지 알 필요가 없습니다. 저장소 관리자가 제공하는 'Page ID'만으로 데이터를 요청합니다.

### 2. 데이터 물류 관리 (Data Logistics)
- **Buffer Pool**: 자주 쓰이는 페이지를 메모리에 캐싱하여 느린 디스크 접근을 최소화합니다.
- **Replacement Policy**: RAM이 가득 찼을 때 어떤 데이터를 내보낼지 결정합니다(LRU 등).

### 3. 영속성 및 복구 보장 (ACID)
- 시스템이 갑자기 꺼져도 데이터가 유실되지 않도록 로그(WAL)를 남기고, 정해진 규칙에 따라 데이터를 안전하게 디스크에 기록합니다.

## 💡 본질과의 연결
- **`[[본질-추상화 (Abstraction)]]`**: 저장소 관리자는 "느리고 복잡한 하드웨어"를 "빠르고 단순한 데이터 세트"로 변환하여 상위 레이어의 개발 생산성을 높입니다.
- **`[[본질-격리성 (Isolation)]]`**: 여러 사용자가 동시에 접근해도 데이터가 오염되지 않도록 페이지 단위의 잠금(Latch)을 관리합니다.

## SQL 실행과의 연결

`FROM table`이 실제 실행될 때 executor는 scan node를 통해 table page를 요구한다. 저장소 관리자는 필요한 disk page를 buffer pool/shared buffer에 올리고, executor는 memory 안 page에서 tuple을 읽어 `WHERE` predicate를 평가한다.

```text
Executor Scan Node
  |
  | request page
  v
Storage / Buffer Manager
  |
  | miss면 disk read
  v
Shared Buffer
  |
  v
Tuple visibility + WHERE filter
```

이 구조 때문에 SQL 성능은 “문법 순서”만으로 결정되지 않는다. 어떤 page를 얼마나 읽는지, 그 page가 buffer에 이미 있는지, index로 후보 tuple을 얼마나 줄였는지가 중요하다.

## 🔗 관련 개념
- [[개념-DB 페이지와 Slotted Page 구조]] — 저장소 관리자가 다루는 최소 단위
- [[개념-SQL 물리 실행 흐름]] — SQL이 scan node와 page 접근으로 내려가는 흐름
- [[개념-Seq Scan]] — heap page를 순차적으로 읽는 방식
- [[개념-Index Scan]] — index page로 TID를 찾고 heap page를 읽는 방식
- [[탐구-DBMS는 왜 OS의 가상 메모리를 믿지 않을까]] — 저장소 관리자가 OS 기능을 직접 구현하는 이유

## 참고

> "The executor takes the plan created by the planner/optimizer and recursively processes it to extract the required set of rows." — [PostgreSQL Documentation, Executor](https://www.postgresql.org/docs/16/executor.html)
