---
aliases: [DAC, MAC, RBAC, 접근 통제, Access Control, 서버 접근 통제]
tags: [개념, 작성중, 보안, 인가]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 서버·시스템 자원에 대한 접근을 허용·차단하는 정책 결정 주체와 방식에 따라 분류한 세 가지 통제 모델.
> (이해용) **"누가 권한을 주는가"** 에 따라 소유자(DAC), 시스템(MAC), 역할(RBAC)로 나뉜다.

## 해결하는 문제

- 모든 사용자에게 동일한 접근 권한을 주면 내부 유출·오용 발생
- 권한 관리 체계 없이 운영하면 퇴사자 계정, 과도한 권한 등 보안 구멍 발생

## 세 가지 모델 비교

```
권한 결정 주체
├── 소유자가 결정    → DAC (임의적 접근 통제)
├── 시스템이 강제    → MAC (강제적 접근 통제)
└── 역할이 결정      → RBAC (역할 기반 접근 통제)
```

### DAC (Discretionary Access Control, 임의적 접근 통제)

- 리소스 **소유자**가 직접 다른 주체에게 권한 부여
- 유연하지만 소유자 실수 시 보안 취약
- AWS 구현체: **S3 Bucket ACL, Bucket Policy**

```
버킷 소유자 A → B 계정에 읽기 권한 직접 부여
→ A가 틀리면 그대로 노출
```

### MAC (Mandatory Access Control, 강제적 접근 통제)

- **시스템(관리자)** 이 정책을 강제, 사용자·소유자도 변경 불가
- 최상위 통제 레이어
- AWS 구현체: **SCP (Service Control Policy)**

```
조직 관리자 → "서울 리전 외 전면 차단" SCP 설정
→ 루트 계정도 이 정책을 우회 불가
```

### RBAC (Role-Based Access Control, 역할 기반 접근 통제)

- **역할(Role)** 에 권한을 부여, 사람은 역할을 부여받아 권한 획득
- 관리 효율성 높음 (사람이 바뀌어도 역할만 교체)
- AWS 구현체: **IAM Role, IAM Group**

```
EC2 인스턴스 → S3ReadOnly Role Assume
→ 사람이 아닌 역할이 권한의 단위
```

## 권한 우선순위 (실무 핵심)

```
SCP (MAC)
  ↓ 허용 범위 안에서만
IAM Policy (RBAC)
  ↓ 허용 범위 안에서만
Resource Policy (DAC)

→ 상위 레이어가 Deny하면 하위는 의미 없음
```

## 치르는 비용

| 모델 | 장점 | 단점 |
|---|---|---|
| DAC | 구현 단순, 유연 | 소유자 실수 시 무방비 |
| MAC | 강력한 강제성 | 유연성 없음, 관리 복잡 |
| RBAC | 관리 효율 높음 | 동적 관계 표현 불가 |

## 동작 원리

실무에서는 세 모델을 **동시에 레이어로 쌓아** 사용:

```
[MAC]  SCP → 전사 금지 행위 강제 차단
[RBAC] IAM → 팀/직무 단위 권한 부여
[DAC]  ACL → 리소스 단위 세밀한 조정
```

→ 어느 한 레이어가 뚫려도 다음 레이어에서 방어 (**Defense in Depth**)

## 관련 본질

- [[본질-보안 (Security)]]

## 관련 개념

- [[개념-ReBAC (Relationship-Based Access Control)]]
- [[판단기준-접근 제어 모델 선택 (DAC vs RBAC vs ReBAC)]]
- [[판단기준-신규 입사 시 회사 보안 구조 파악 순서]]
