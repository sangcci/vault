---
aliases: [접근 제어 모델 선택, DAC RBAC ReBAC 비교, Authorization Model]
tags: [판단기준, 작성중, 보안, 인가]
type: Heuristic
difficulty: Medium
---

## 판단 기준

- 전사 수준에서 절대 금지 정책이 필요하다면 → **MAC (SCP)**
- 정적 역할(관리자/일반 사용자)만으로 권한 구분이 가능하다면 → **RBAC**
- "내가 만든 것만 수정 가능" 수준의 소유권 검증이라면 → **DAC**
- "내가 속한 관계에 따라 권한이 달라진다"면 → **ReBAC**

## 클라우드(AWS) 레이어 구조

```
MAC  → SCP        : 조직 전체 강제 (리전 제한, 서비스 차단)
RBAC → IAM Role   : 팀/직무 단위 권한 (EC2, S3 접근)
DAC  → Bucket ACL : 리소스 소유자 세밀 조정
```

- 상위 레이어가 Deny하면 하위는 무의미
- 세 레이어를 동시에 운영하는 것이 실무 표준 (**Defense in Depth**)

## 효과적인 상황

### DAC (Discretionary Access Control)

```text
검증: "이 예약은 요청한 사용자가 만든 예약인가?"
if (!reservation.getOwnerId().equals(currentUserId)) throw 403;
```

- 구현 단순: 별도 테이블/서비스 없이 엔티티의 소유자 컬럼 대조
- 소규모 서비스에 적합

### RBAC (Role-Based Access Control)

```text
URL 기반 제어:
/admin/** → ROLE_ADMIN만 허용
/api/**   → ROLE_USER 이상 허용
```

- Spring Security + `@PreAuthorize`로 쉽게 구현
- 정적 역할이 명확한 서비스(쇼핑몰, 사내 시스템)

### ReBAC

```text
"Alice가 Charter:101의 HOST인가?"
→ charter_role 테이블 조회 후 판단
```

- 참가자/주최자처럼 **관계가 동적으로 결정**되는 서비스
- 소셜, 협업, 예약 플랫폼

## 실패하는 상황

| 모델 | 실패 케이스 |
|------|------------|
| DAC | 권한 체계가 복잡해지면 if 지옥 |
| RBAC | 동적 관계 권한 표현 불가 |
| ReBAC | 소규모에서 오버엔지니어링, 쿼리 복잡도 증가 |

**DAC + RBAC 혼합**이 가장 현실적인 소규모 설계:
- RBAC: URL 단위 거친 필터 (Spring Security)
- DAC: 비즈니스 로직 단위 소유권 검증

## 실무 적용 패턴

```text
단건 처리 (Validation)    → DAC: 소유자 대조
목록 처리 (Filtering)     → 쿼리 파라미터에 userId 조건 포함
```

→ [[판단기준-REST API 파라미터 선택 (Path Variable vs Query Parameter)]]
→ [[개념-ReBAC (Relationship-Based Access Control)]]
→ [[개념-서버 접근 통제 기법 (DAC, MAC, RBAC)]]
→ [[판단기준-신규 입사 시 회사 보안 구조 파악 순서]]

## 출처

- 2026-04-06 일지 — 역할 권한 부여 고찰
