---
aliases: [ReBAC, Relationship-Based Access Control, 관계 기반 접근 제어]
tags: [개념, 작성중, 보안, 인가]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 주체(User)와 객체(Resource) 사이의 **관계(Relation)**를 기반으로 접근 권한을 결정하는 인가 모델.
> (이해용) "이 사용자가 이 데이터의 주최자인가?"처럼, 데이터를 읽어야만 알 수 있는 동적 관계로 권한을 판단하는 것.

## 해결하는 문제

- RBAC의 정적 역할(User/Admin)만으로는 표현할 수 없는 **동적 관계 권한** 문제
  - "내가 등록한 예약만 수정 가능", "내가 주최한 모임의 참가자 목록만 열람 가능"

## 치르는 비용

- 관계 데이터를 DB에서 직접 조회해야 하므로 **추가 쿼리 발생**
- 관계가 복잡해질수록 권한 판단 로직이 복잡해짐
- 소규모 서비스에서는 오버엔지니어링 가능성 (→ [[판단기준-접근 제어 모델 선택 (DAC vs RBAC vs ReBAC)]])

## 동작 원리

```text
[관계 그래프]

User:Alice ──(is_host_of)──▶ Charter:101
User:Bob   ──(is_guest_of)─▶ Charter:101
User:Alice ──(is_host_of)──▶ Charter:102

권한 판단:
Q. Alice가 Charter:101을 수정할 수 있는가?
A. User:Alice --(is_host_of)--> Charter:101 관계 존재 → 허용

Q. Bob이 Charter:101을 수정할 수 있는가?
A. User:Bob --(is_guest_of)--> Charter:101 → host 아님 → 거부
```

### 구현 방식

```text
방식 1. 관계 테이블 직접 운영
┌─────────────────────────────────────┐
│ charter_role                        │
│ user_id | charter_id | role         │
│ alice   | 101        | HOST         │
│ bob     | 101        | GUEST        │
└─────────────────────────────────────┘
→ 권한 판단 시 이 테이블 조회

방식 2. AuthService 분리
→ 별도 서비스로 권한 관계를 중앙 관리
→ Google Zanzibar 방식
```

## 관련 본질

- [[본질-연관 (Association)]] — 관계 자체가 권한의 기반
- [[본질-격리성 (Isolation)]] — 타인의 데이터 접근 차단
