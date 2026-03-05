# 정리: DB 동시성 이상 현상 (Concurrency Anomalies) 정복

이 문서는 DB 트랜잭션 격리 수준에 따라 발생할 수 있는 이상 현상들을 실무 예시와 시퀀스 다이어그램으로 정리합니다.

---

## 1. Dirty Read (오염된 읽기)
- **상황**: 트랜잭션 A가 커밋하지 않은 데이터를 B가 읽음.
- **실무 예시**: 송금 처리 중 '일시적인 잔액 0원' 상태를 다른 트랜잭션이 조회하여 '대출 거절' 판정을 내리는 경우.

```mermaid
sequenceDiagram
    autonumber
    participant T1 as 트랜잭션 A (송금)
    participant DB as DB (잔액: 100)
    participant T2 as 트랜잭션 B (조회)

    T1->>DB: 잔액 100 -> 0 수정 (Update)
    Note right of DB: 아직 커밋 안 됨
    T2->>DB: 잔액 조회 (Select)
    DB-->>T2: 0 반환
    Note over T2: 0원을 기준으로 로직 수행
    T1->>DB: 오류 발생으로 롤백 (Rollback)
    Note right of DB: 잔액 다시 100원
```

### 🏢 실무 예시: 야간 정산 프로세스
- **제약 조건**: 총 매출 = 현금 매출 + 카드 매출이 항상 맞아야 함.
- **트랜잭션 A (정산)**: 현금 매출 100만 원을 카드 매출로 잘못 기록된 걸 바로잡는 중 (현금 -10, 카드 +10).
- **트랜잭션 B (조회)**: 경영진이 실시간 대시보드로 현재 총 매출을 조회.

```mermaid
sequenceDiagram
    autonumber
    participant T1 as 트랜잭션 A (정산)
    participant DB as DB (현금:50, 카드:50)
    participant T2 as 트랜잭션 B (대시보드)

    Note over T1, DB: 정산 시작 (총합 100)
    T1->>DB: 현금 매출 10만원 차감 (50 -> 40)
    Note right of DB: [Dirty State] 현금:40, 카드:50

    T2->>DB: 전체 매출 합계 조회 (Select Sum)
    DB-->>T2: 90만원 반환 (현금40 + 카드50)
    Note over T2: "매출 10만원 어디 갔어?"<br/>데이터 유실 경고 발생!

    T1->>DB: 카드 매출 10만원 추가 (50 -> 60)
    T1->>DB: 커밋 (Commit)
    Note right of DB: [Final State] 현금:40, 카드:60 (총합 100)

    Note over T2: T1은 정상적으로 끝났지만,<br/>T2는 90만원이라는 잘못된 중간 상태를 읽어버림.
```

---

## 2. Non-repeatable Read (반복 불가능한 읽기)
- **상황**: 한 트랜잭션 내에서 같은 조회를 두 번 했는데 결과가 다름 (수정 때문).
- **실무 예시**: 정산 보고서 작성 중, 다른 사용자가 회원 등급을 수정하여 보고서 상단과 하단의 회원 정보가 불일치하는 경우.

```mermaid
sequenceDiagram
    autonumber
    participant T1 as 트랜잭션 A (보고서)
    participant DB as DB (등급: GOLD)
    participant T2 as 트랜잭션 B (수정)

    T1->>DB: 회원 등급 조회 (Select)
    DB-->>T1: GOLD 반환
    T2->>DB: 회원 등급 GOLD -> VIP 수정 (Update)
    T2->>DB: 커밋 (Commit)
    T1->>DB: 회원 등급 재조회 (Select)
    DB-->>T1: VIP 반환 (결과가 달라짐!)
```

### 📊 MVCC 동작 예시 (Read Committed 환경)
```mermaid
sequenceDiagram
    autonumber
    participant T1 as TxA (수정자)
    participant DB as DB (Undo Log 존재)
    participant T2 as TxB (조회자)

    T1->>DB: 등급 GOLD -> VIP 수정 (Update)
    Note right of DB: [Undo Log에 GOLD 저장]

    T2->>DB: 1차 조회 (Select)
    Note over T2, DB: [스냅샷 1] 생성
    DB-->>T2: GOLD 반환 (Undo Log에서 읽음)
    Note right of T2: "아직 T1이 커밋 안 됐으니 GOLD구나!"

    T1->>DB: 커밋 (Commit)
    Note right of DB: [이제 VIP가 진짜 데이터가 됨]

    T2->>DB: 2차 조회 (Select)
    Note over T2, DB: [스냅샷 2] 새로 생성! (중요)
    DB-->>T2: VIP 반환 (최신 커밋된 데이터)

    Note over T2: "어? 아까는 GOLD였는데 왜 지금은 VIP야?"<br/>-> Non-repeatable Read 발생!
```

---

## 3. Phantom Read (유령 읽기)
- **상황**: 범위 조회를 두 번 했는데, 결과 집합에 없던 레코드가 나타남 (삽입 때문).
- **실무 예시**: 선착순 100명 쿠폰 발급 전 인원 체크를 했는데, 그 사이 다른 사람이 가입하여 실제로는 100명이 넘게 발급되는 경우.

```mermaid
sequenceDiagram
    autonumber
    participant T1 as 트랜잭션 A (발급)
    participant DB as DB (인원: 99)
    participant T2 as 트랜잭션 B (가입)

    T1->>DB: 인원 조회 (COUNT)
    DB-->>T1: 99명 반환
    T2->>DB: 새로운 회원 가입 (Insert)
    T2->>DB: 커밋 (Commit)
    T1->>DB: 인원 재조회 (COUNT)
    DB-->>T1: 100명 반환 (유령 레코드 등장!)
```

---

## 4. Lost Update (갱신 손실)
- **상황**: 두 트랜잭션이 동시에 수정할 때, 나중 커밋이 먼저 커밋을 덮어씀.
- **실무 예시**: 두 명의 운영자가 동시에 같은 상품의 재고를 수정(10->9)했는데, 결과적으로 8이 아닌 9가 되는 경우.

```mermaid
sequenceDiagram
    autonumber
    participant T1 as 트랜잭션 A
    participant DB as DB (재고: 10)
    participant T2 as 트랜잭션 B

    T1->>DB: 재고 조회 (Select: 10)
    T2->>DB: 재고 조회 (Select: 10)
    T1->>DB: 재고 9로 수정 (Update)
    T1->>DB: 커밋 (Commit)
    T2->>DB: 재고 9로 수정 (Update)
    T2->>DB: 커밋 (Commit)
    Note over DB: A의 수정 사항이 증발함!
```

---

## 5. Read Skew (읽기 왜곡)
- **상황**: 한 트랜잭션이 여러 데이터를 읽을 때, 그 사이 다른 트랜잭션이 데이터를 옮겨버려 합계가 안 맞음.
- **실무 예시**: 계좌 A(50만)에서 계좌 B(50만)로 10만을 이체하는 중, 총액(100만)을 조회했더니 90만이나 110만으로 조회되는 경우.

```mermaid
sequenceDiagram
    autonumber
    participant T1 as 트랜잭션 A (총액조회)
    participant DB as DB (A:50, B:50)
    participant T2 as 트랜잭션 B (이체)

    T1->>DB: 계좌 A 조회 (50만)
    T2->>DB: A에서 10만 출금 (Update)
    T2->>DB: B에 10만 입금 (Update)
    T2->>DB: 커밋 (Commit)
    T1->>DB: 계좌 B 조회 (60만)
    Note over T1: 합계: 110만 (불일치 발생!)
```

---

## 6. Write Skew (쓰기 왜곡)
- **상황**: 서로 다른 데이터를 수정했는데, 결과적으로 비즈니스 제약 조건이 깨짐.
- **실무 예시**: "최소 1명의 의사는 당직이어야 한다"는 규칙이 있는데, 두 의사가 동시에 서로가 있는 줄 알고 각자 퇴근을 승인해버려 당직이 0명이 되는 경우.

```mermaid
sequenceDiagram
    autonumber
    participant T1 as 의사 A (퇴근신청)
    participant DB as DB (의사A:당직, 의사B:당직)
    participant T2 as 의사 B (퇴근신청)

    T1->>DB: 현재 당직 의사 수 조회 (Select: 2)
    T2->>DB: 현재 당직 의사 수 조회 (Select: 2)
    T1->>DB: 의사 A 상태 -> 퇴근 수정 (Update)
    T2->>DB: 의사 B 상태 -> 퇴근 수정 (Update)
    T1->>DB: 커밋
    T2->>DB: 커밋
    Note over DB: 당직 의사가 0명이 됨 (제약 조건 위반!)
```

---

## 7. Deadlock (교착 상태)
- **상황**: 두 개 이상의 트랜잭션이 서로가 가진 락을 얻으려고 무한히 대기하는 상태.
- **실무 예시**: 사용자 A와 B가 서로에게 동시에 돈을 송금할 때, 각자의 계좌에 락을 건 뒤 상대방의 계좌 락을 요청하며 멈추는 경우.

```mermaid
sequenceDiagram
    autonumber
    participant T1 as 트랜잭션 1 (A -> B 송금)
    participant DB as DB (계좌A, 계좌B)
    participant T2 as 트랜잭션 2 (B -> A 송금)

    T1->>DB: 계좌 A 락 획득 (FOR UPDATE)
    Note right of DB: 🔐 계좌 A 잠금 (by T1)
    
    T2->>DB: 계좌 B 락 획득 (FOR UPDATE)
    Note right of DB: 🔐 계좌 B 잠금 (by T2)

    T1->>DB: 계좌 B 락 요청
    Note right of DB: ⏳ T2가 점유 중이므로 무한 대기
    
    T2->>DB: 계좌 A 락 요청
    Note right of DB: ⏳ T1이 점유 중이므로 무한 대기

    Note over T1, T2: [Deadlock 발생] DB 엔진이 감지 후 하나를 롤백함
```
