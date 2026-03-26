---
aliases: [Fetch Size, JDBC Fetch Size, ResultSet Fetch Size]
tags: [개념, 작성중, DB, JDBC]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) JDBC의 `ResultSet`이 데이터베이스로부터 한 번의 네트워크 라운드트립에 가져오는 행(row)의 개수를 지정하는 설정값.
> (이해용) 창고(DB)에서 물건을 나를 때, 한 번에 몇 박스씩 실어올지 정하는 트럭의 적재량.

## 해결하는 문제

- 대량 데이터 조회 시 **행 단위 fetch**(기본값)로 인한 네트워크 라운드트립 과다 문제.
- DB → Application 구간의 I/O 병목 완화.

## 치르는 비용

- fetch size가 클수록 **Application 메모리 사용량 증가** (한 번에 많은 행을 버퍼에 적재).
- 너무 크면 네트워크 패킷 단편화, GC 압박 발생 가능.

## 동작 원리

### 네트워크 라운드트립 비교

```text
fetch size = 1 (행 단위)
───────────────────────────
App ──> DB : "다음 1행 줘"     ← 1000행이면 1000번 왕복
App <── DB : row 1
App ──> DB : "다음 1행 줘"
App <── DB : row 2
...

fetch size = 100
───────────────────────────
App ──> DB : "다음 100행 줘"   ← 1000행이면 10번 왕복
App <── DB : row 1~100
App ──> DB : "다음 100행 줘"
App <── DB : row 101~200
...
```

### 설정 방법

```java
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setFetchSize(256);  // 한 번에 256행씩 가져옴
ResultSet rs = stmt.executeQuery();
```

### 드라이버별 기본값

| JDBC Driver | 기본 Fetch Size | 비고 |
| :--- | :--- | :--- |
| MySQL Connector/J | **전체 ResultSet을 한 번에 fetch** | `Integer.MIN_VALUE` 설정 시 스트리밍 모드 |
| PostgreSQL | 0 (전체 fetch) | `autoCommit=false`일 때만 커서 기반 동작 |
| Oracle | 10 | 튜닝 여지가 가장 큼 |

### 실무 권장 범위

StackOverflow 및 실무 경험 기반 권장값: **128 ~ 2048**

```text
        메모리 사용량
        ▲
        │        ╱────── 메모리 한계
        │       ╱
        │      ╱
        │     ╱
        │    ╱
        │   ╱
        │──╱─────────── 적정 구간 (128~2048)
        │ ╱
        └──────────────────────> fetch size

        네트워크 왕복 횟수
        ▲
        │╲
        │ ╲
        │  ╲
        │   ╲
        │    ╲──────── 적정 구간 이후 감소폭 미미
        │     ╲________
        └──────────────────────> fetch size
```

- fetch size를 일정 수준 이상 올리면 네트워크 왕복 감소 효과는 수확 체감.
- 반면 메모리 사용량은 선형 증가 → **트레이드오프 지점**이 존재한다.

### 효과가 미미한 경우

- **로컬 DB 테스트**: 네트워크 지연이 거의 0이라 차이가 나지 않음.
- **인덱스 기반 소량 조회**: 이미 빠르게 반환되므로 fetch size 의미 없음.
- **MySQL/PostgreSQL 기본 모드**: 전체를 한 번에 가져오는 드라이버라면 이미 1회 왕복.

## 관련 본질

- [[본질-처리량과 지연시간 (Throughput and Latency)]] — fetch size는 배치 크기를 조절하여 처리량을 높이는 전형적 튜닝.
- [[본질-트레이드오프 (Trade-off)]] — 메모리 vs 네트워크 I/O의 자원 교환.
