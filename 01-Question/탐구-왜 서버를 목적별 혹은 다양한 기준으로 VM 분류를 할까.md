---
aliases: [VM Classification Criteria, Infrastructure Isolation Patterns, Blast Radius, Bulkhead Architecture]
tags: [질문, 본질, 인프라, 아키텍처]
created: 2026-02-06
updated: 2026-02-06
type: Question
difficulty: Medium
---
# Question: 왜 서버를 '목적별' 혹은 '다양한 기준'으로 VM 분류를 할까?

## 🧐 질문의 배경
단순히 Web/WAS/DB로 나누는 것을 넘어, 실무에서는 왜 더 복잡한 기준으로 VM을 그룹화하고 관리하는지, 그 이면에 숨겨진 인프라 설계의 전략적 의도를 파악하고자 합니다.

---

## 💡 핵심 통찰 (Insight)

### 1. 인프라 분류의 대원칙: "폭발 반경(Blast Radius)의 제어"
모든 인프라 분류의 본질은 **"장애가 발생했을 때 어디까지 죽게 내버려 둘 것인가?"**를 결정하는 것입니다. 이를 위해 물리적/논리적 성벽(VM)을 쌓습니다.

### 2. 다차원적 분류 체계 (Classification Dimensions)

| 분류 차원 | 방식 (Examples) | 핵심 가치 (Value) |
| :--- | :--- | :--- |
| **수평적 (계층)** | Web, WAS, DB | **기술적 격리**: 보안 그룹 설정 및 망 분리 용이성. |
| **수직적 (도메인)** | 결제, 주문, 회원 (MSA) | **비즈니스 격리**: 결제 서버가 터져도 검색은 가능하게 함. |
| **생애주기 (환경)** | Dev, Staging, Prod | **안정성 격리**: 개발자의 실수가 실제 서비스에 영향 주지 않음. |
| **신뢰도 (보안)** | DMZ, Internal, Secure | **침투 격리**: 해커의 내부망 이동(Lateral Movement) 차단. |
| **자원 성격 (성능)** | Compute, Memory, IO Optimized | **비용/성능 최적화**: 용도에 맞는 하드웨어 배분으로 가성비 극대화. |

### 3. 고도화된 전략: 격벽(Bulkhead)과 셀(Cell)
- **비유**: 타이타닉호가 침몰한 이유는 격벽이 끝까지 막혀있지 않았기 때문입니다.
- **실무 적용**: 전체 사용자를 A그룹, B그룹으로 나누어 인프라 세트(Cell)를 따로 할당합니다. 특정 셀의 DB가 깨져도 다른 셀의 사용자는 아무런 영향을 받지 않는 **극단의 격리성**을 추구합니다.

---

## 🚀 심화 탐구
- **관리 복잡도 vs 안정성**: 분류가 세밀해질수록 안정성은 높아지지만, 관리 포인트(Provisioning, Monitoring)가 기하급수적으로 늘어나는 트레이드오프가 발생합니다.
- **IaC(Infrastructure as Code)**: 이렇게 복잡해진 분류 체계를 사람이 일일이 관리할 수 없기에, Terraform이나 Ansible 같은 코드로 인프라를 관리하는 기술이 필수적으로 동반됩니다.

---

## 🔗 관련 본질
- [[본질-격리성 (Isolation)]] — 인프라 설계의 알파이자 오메가.
- [[본질-확장성 (Scalability)]] — 목적별 분리가 되어야 필요한 부분만 늘릴 수 있음.
- [[본질-트레이드오프 (Trade-off)]] — 격리의 수준과 운영 비용 사이의 줄다리기.
