---
aliases: [Infra Isolation Strategy, Docker vs VM in Practice, Hybrid Infrastructure]
tags: [탐구, 완료, 인프라, 격리]
type: Question
difficulty: Medium
---

## 핵심 질문 (Core Question)

> "인프라의 핵심인 '격리(Isolation)' 관점에서 Docker와 VM은 각각 어떤 층위에서 동작하며, 실무에서 이 둘을 어떻게 조화롭게 운영해야 시스템의 안정성과 효율성을 동시에 확보할 수 있는가?"

## 가설 및 추론 (Hypothesis)

- **가설 1**: 가상 머신(VM)은 하드웨어 수준의 격리를 통해 '물리적 울타리'를 칠 것이며, Docker는 커널 공유를 통해 '논리적 울타리'를 칠 것이다.
- **가설 2**: 보안과 자원 간섭 차단이 최우선인 곳은 VM이, 애플리케이션의 기민한 배포와 환경 일치성이 중요한 곳은 Docker가 담당할 것이다.

## 검증 및 팩트 (Verification)

### 1. 격리 메커니즘의 시각적 비교 (ASCII Diagram)
```text
      [ Docker / Container ]                 [ Virtual Machine ]
+-------------------------------+     +-------------------------------+
| App A | App B | App C |       |     | App A |       | App B |       |
+-----------------------+       |     +-------+       +-------+       |
| Bin/Lib | Bin/Lib | Bin/Lib   |     | Guest OS |     | Guest OS |     |
+-------------------------------+     +----------+     +----------+     |
|    Container Runtime (Docker) |     |      Hypervisor (KVM/ESXi)    |
+-------------------------------+     +-------------------------------+
|      Host OS (Shared Kernel)  |     |          Physical HW          |
+-------------------------------+     +-------------------------------+
       (Fast, Shared Kernel)                 (Strong, Isolated Kernel)
```

### 2. 기술적 팩트 체크
- **보안성 (Security)**: 컨테이너는 호스트 커널을 공유하므로 커널 취약점(예: CVE-2019-5736) 발생 시 격리가 무너질 수 있습니다. 반면 VM은 독립된 커널을 가져 격리 강도가 훨씬 높습니다.
- **성능 (Performance)**: 리눅스 네이티브 Docker는 프로세스이므로 오버헤드가 0에 가깝지만, Mac/Windows 환경의 Docker는 내부적으로 경량 VM을 한 번 더 거치므로 IO 및 네트워크 오버헤드가 발생합니다.
- **차세대 대안**: AWS Firecracker(MicroVM)는 VM의 보안성과 컨테이너의 속도를 결합하여 Lambda 등의 서버리스 환경을 격리합니다.

## 결론 (Conclusion)

- **실무 표준 하이브리드 구조**: "목적에 따라 물리적/보안적 경계를 VM으로 설정하고, 그 내부에서 Docker를 통해 애플리케이션을 불변 인프라([[개념-불변 인프라 (Immutable Infrastructure)]]) 형태로 운영한다."
- **계층별 역할**:
    - **VM 층위**: Noisy Neighbor 방지, 보안 그룹 설정, 결제/개인정보 등 중요 데이터 격리.
    - **Docker 층위**: 애플리케이션 종속성 해결, 빠른 오토 스케일링, CI/CD 효율화.
- **예외**: 신뢰할 수 없는 다수의 사용자 코드를 실행해야 하는 경우(Multi-tenancy)에는 Docker 단독 사용보다 MicroVM이나 gVisor 같은 강력한 격리 기술을 추가 도입해야 합니다.

## 연결된 개념 (Links)

- [[본질-격리성 (Isolation)]]
- [[본질-신뢰성 (Reliability)]]
- [[개념-Namespaces와 Cgroups]]
- [[탐구-Docker는 왜 VM이 아닌 단순한 프로세스인가]]
- [[개념-불변 인프라 (Immutable Infrastructure)]]
