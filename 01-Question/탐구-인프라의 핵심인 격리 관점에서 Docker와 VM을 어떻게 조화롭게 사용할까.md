---
aliases: [Infra Isolation Strategy, Docker vs VM in Practice, Hybrid Infrastructure]
tags: [질문, 본질, 인프라]
created: 2026-02-06
updated: 2026-02-06
type: Question
difficulty: Medium
---
# Question: 인프라의 핵심인 '격리(Isolation)' 관점에서 Docker와 VM을 어떻게 조화롭게 사용할까?

## 🧐 질문의 배경
실무에서는 단순히 "Docker가 빠르니까 쓴다"는 논리를 넘어, 시스템의 안정성을 위해 어떤 층위에서 격리(Isolation)를 수행할지 결정해야 합니다. 가상 머신(VM)과 컨테이너(Docker)가 각각 담당하는 격리의 목적과 그 둘이 실무에서 어떻게 하이브리드로 운영되는지 이해하고자 합니다.

## 💡 핵심 통찰 (Insight)

### 1. 격리의 목적: "안정성 확보와 Noisy Neighbor 방지"
인프라 설계의 본질은 하나의 문제가 전체로 번지지 않게 울타리를 치는 것입니다.
- **VM (Virtual Machine)**: 하드웨어 수준의 격리. **Noisy Neighbor(시끄러운 이웃)** 현상을 방지합니다. 특정 서버가 자원을 독점해 옆 서버를 느려지게 하는 것을 커널 수준에서 차단하여 물리적 안정성을 보장합니다.
- **Docker (Container)**: 애플리케이션 수준의 격리. 프로세스와 실행 환경(라이브러리 등)을 격리하여 **환경의 일치성**을 보장합니다.

### 2. 내부 원리: 리눅스 커널의 역할
- **Namespaces**: PID, Network 등 프로세스의 '뷰'를 쪼개어 컨테이너가 독립된 공간처럼 느끼게 함.
- **Cgroups**: CPU, 메모리 등 자원 사용량의 상한선을 강제로 집행함.
- **UnionFS**: 레이어드 이미지 구조를 통해 변경된 부분만 전송하고 관리하는 효율성 제공.

### 3. 실무 하이브리드 구조 (Standard)
"목적에 따라 VM을 나누고, 그 안에서 Docker로 앱을 실행한다."
- **Web VM / WAS VM / DB VM**: 서비스 계층(Tier) 간의 물리적 경계를 VM으로 설정하여 보안과 자원 간섭을 최소화합니다.
- **VM 내부의 Docker**: 격리된 큰 방(VM) 안에서 민첩한 배포, 오토 스케일링, 불변 인프라(Immutable Infrastructure)를 실현합니다.

---

## 🚀 심화 탐구
- **모놀리식에서 Docker로의 전환**: 단순한 기술 교체가 아니라, '관리 불가능한 서버(Snowflake Server)'에서 '코드로 관리되는 불변 인프라'로의 철학적 전환입니다.
- **DB의 컨테이너화**: 왜 운영 환경의 DB는 여전히 VM이나 Bare Metal을 선호할까? (데이터 영속성 및 성능 격리의 중요성)

## 🔗 관련 본질/개념
- [[본질-격리성 (Isolation)]] — 안정성의 근간.
- [[본질-신뢰성 (Reliability)]] — Noisy Neighbor 방지를 통한 시스템 신뢰 확보.
- [[개념-불변 인프라 (Immutable Infrastructure)]] — Docker가 지향하는 운영 철학.

Principles (본질/원칙)
   * [[본질-격리성 (Isolation)]]: 시스템 안정성의 핵심. 하드웨어(VM)와 소프트웨어(Docker) 층위에서 각각 어떻게 격리를 실현하는지 다룸.
   * [[본질-신뢰성 (Reliability)]]: 자원 간섭(Noisy Neighbor)을 방지하여 예측 가능한 시스템 성능을 유지하는 원칙.
   * [[본질-트레이드오프 (Trade-off)]]:
       * CPU 자원을 쓸 것인가(Spinlock), 시간을 쓸 것인가(Mutex/Context Switch).
       * 배포 속도를 택할 것인가(Docker), 완전한 보안 격리를 택할 것인가(VM).
   * [[본질-동시성 (Concurrency)]]: 여러 스레드가 자원을 경쟁하는 환경에서 발생하는 부작용과 관리 메커니즘.


  Concepts (개념)
   * [[개념-Namespaces & Cgroups]]: Docker 프로세스 격리와 자원 제한의 기술적 토대.
   * [[개념-Noisy Neighbor]]: 클라우드/가상화 환경에서 자원을 과점하는 인접 인스턴스로 인해 성능이 저하되는 현상.
   * [[개념-불변 인프라 (Immutable Infrastructure)]]: 서버를 수정하지 않고 통째로 갈아끼우는 현대적 운영 철학.
   * [[개념-문맥 교환 (Context Switch)]]: 락 대기 시 OS가 프로세스 상태를 저장하고 전환하는 원자적 비용.