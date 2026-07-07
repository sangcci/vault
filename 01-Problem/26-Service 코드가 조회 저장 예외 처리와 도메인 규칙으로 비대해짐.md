---
aliases: [Fat Service Layer, Application Domain Boundary, Transaction Script Smell]
tags: [문제, 작성중, Architecture, DDD]
difficulty: High
type: Problem
---

# Problem: 26-Service 코드가 조회 저장 예외 처리와 도메인 규칙으로 비대해짐

## 상황

Application Service 하나에 조회, not found 처리, 권한 검증, 도메인 규칙, 저장, 이벤트 발행, 외부 API 호출이 모두 들어간다.

```java
@Transactional
public Long join(RentJoinCommand command, Long memberId) {
    Rent rent = rentRepository.findById(command.rentId())
        .orElseThrow(...);

    if (!rent.isOpen()) throw ...;
    if (rent.remainingSeats() < command.count()) throw ...;

    Member member = memberRepository.findById(memberId)
        .orElseThrow(...);

    RentParticipant participant = new RentParticipant(...);
    rentParticipantRepository.save(participant);
    eventPublisher.publishEvent(...);
    return participant.getId();
}
```

처음엔 흐름이 한눈에 보이지만, usecase가 늘수록 service가 모든 것을 아는 절차 덩어리가 된다.

---

## 관찰된 증거

- Service 메서드가 길고 테스트 setup이 무겁다.
- 같은 조회/not found/저장 코드가 여러 usecase에 반복된다.
- 도메인 규칙 변경과 저장 방식 변경이 같은 service 파일을 건드린다.
- Entity는 getter/setter 위주 데이터 박스가 되고, 규칙은 service 조건문으로 흩어진다.
- 트랜잭션 경계와 업무 규칙, 기술 실패 처리가 한 메서드에 섞인다.

---

## 의심 문제

가장 가능성 높은 문제는 **usecase 조립 책임과 도메인 판단 책임, 인프라 접근 책임이 같은 변경 단위에 섞인 것**이다.

Service가 나쁘다는 뜻이 아니다. 문제는 service가 “요청 하나의 흐름”을 보여주는 수준을 넘어 모든 세부 판단과 기술 절차를 직접 떠안는 것이다.

---

## 원인

```text
Application Service
  책임: usecase 순서, transaction boundary, event ordering

Domain / Policy
  책임: 업무 규칙, 불변식, 상태 변경의 정당성

Implementation Actor
  책임: repository 조회, not found 처리, 저장 위임, 외부 port 호출 준비

Repository / Adapter
  책임: 저장소/외부 기술 접근
```

이 경계가 없으면 다음처럼 된다.

```text
service method
  ├─ SQL/Repository 호출
  ├─ not found 처리
  ├─ 권한/정책 판단
  ├─ 상태 변경
  ├─ event 발행
  └─ 외부 API 호출

변경 이유가 다른 코드가 한 파일에 누적
```

---

## 확인 방법

- service 메서드에서 “업무 흐름”과 “세부 준비 작업”을 분리해 읽어본다.
- 조건문이 도메인 상태의 옳고 그름을 판단하는지, 조회 실패를 처리하는지 구분한다.
- 같은 조회/not found/저장 패턴이 여러 usecase에 반복되는지 확인한다.
- Entity/Aggregate가 스스로 지켜야 할 불변식이 service에 있는지 확인한다.
- 외부 API/DB/Redis/FCM 같은 기술 이름이 core usecase에 새는지 본다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| Application Service는 흐름만 남김 | usecase 가독성 증가 | 행위자 클래스 증가 |
| Reader/Writer/Joiner 같은 implementation actor 분리 | 반복 준비 작업 제거 | 단순 CRUD엔 과할 수 있음 |
| Domain method/Policy로 규칙 이동 | 규칙 응집도 증가 | 과분리 시 위치 탐색 어려움 |
| Repository/Port로 기술 의존 격리 | 테스트와 교체 용이 | 추상화 이름 설계 필요 |
| Transaction Script 유지 | 단순 기능에 빠름 | 복잡도 증가 시 service 비대화 |

---

## 트레이드오프

절차가 단순하면 transaction script가 가장 빠르고 읽기 쉽다. 하지만 도메인 규칙과 변경 이유가 늘어나면 service 하나에 모든 변경이 몰린다. 이때 계층 분리는 “멋진 구조”가 아니라 변경 이유를 나누는 비용 지불이다.

---

## 연결되는 본질

- [[본질-유스케이스 흐름과 도메인 책임 분리]]
- [[본질-유스케이스 조립과 트랜잭션 경계]]
- [[본질-변경 이유와 경계]]

---

## 참고

> "A Transaction Script organizes all this logic primarily as a single procedure" — [Martin Fowler: Transaction Script](https://martinfowler.com/eaaCatalog/transactionScript.html)

> "The domain layer should not talk to external systems - the service layer should do that." — [Martin Fowler: Layering Principles](https://martinfowler.com/bliki/LayeringPrinciples.html)
