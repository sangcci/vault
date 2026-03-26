---
aliases: [Namespaces, Cgroups, 리눅스 컨테이너 기술]
tags: [개념, 완료, 인프라, 커널]
type: Concept
difficulty: High
---

## 한 문장 정의 (Definition)

> (사전적) 리눅스 커널이 제공하는 자원 격리(Namespaces) 및 자원 제한(Cgroups) 기술로, 컨테이너가 호스트 OS 위에서 독립된 환경처럼 동작하게 만드는 핵심 토대.
> (이해용) **Namespaces**는 프로세스에게 "너는 이 세상에 너만 있어"라고 **착각**을 주는 울타리이고, **Cgroups**는 "너는 밥을 요만큼만 먹어"라고 **정량 배식**을 하는 통제 장치이다.

## 해결하는 문제 (Problem Solved)

- **자원 독점 방지**: 특정 프로세스가 CPU나 메모리를 과다 점유하여 시스템 전체를 마비시키는 [[현상-Noisy Neighbor]] 문제를 해결합니다.
- **환경 격리 불일치**: 동일한 호스트 내에서 서로 다른 라이브러리 버전이나 포트 충돌 없이 여러 앱을 실행할 수 있는 [[본질-환경 격리]]를 제공합니다.

## 치르는 비용 (Cost/Trade-off)

- **커널 오버헤드**: 하드웨어 가상화(VM)보다는 가볍지만, 커널 수준에서 자원을 추적하고 제한하는 데 따르는 미세한 CPU/메모리 오버헤드가 발생합니다.
- **디버깅 복잡도**: 프로세스가 실제 호스트와 다른 뷰(PID 등)를 가지므로, 컨테이너 외부에서의 모니터링 및 트러블슈팅이 까다로워질 수 있습니다.

## 동작 원리 (Mechanism)

### 1. 격리의 본질: 간접 참조 (Indirection)
Namespaces는 프로세스가 커널 자원에 접근할 때 직접 연결하지 않고, 커널이 중간에서 문맥에 따라 다른 값을 매핑해주는 **[[본질-간접 참조 (Indirection)]]** 층을 형성합니다. 이를 통해 각 프로세스는 "서로 내부를 모른다"는 상태가 됩니다.

### 2. ASCII Diagram: Container Isolation Logic
```text
[ Process in Container ]
      |
      | 1. Namespaces (Visibility Filter)
      V
+---------------------------+  <-- "무엇을 볼 수 있는가?"
| PID: 1 (Host PID: 4502)   |      (격리: NET, MNT, PID, UTS, IPC)
| Network: 172.17.0.2       |
+---------------------------+
      |
      | 2. Cgroups (Resource Gatekeeper)
      V
+---------------------------+  <-- "얼마나 쓸 수 있는가?"
| CPU Usage: Max 20%        |      (제한: CPU, Memory, I/O)
| Memory: Max 512MB         |
+---------------------------+
      |
      V [ Linux Kernel ]
```

### 핵심 구성 요소
1. **Namespaces (격리)**: `PID`(프로세스), `NET`(네트워크), `MNT`(파일시스템), `UTS`(호스트명), `IPC`(통신) 등을 분리하여 프로세스가 독립된 OS를 쓰는 것처럼 속입니다.
   - **실체 확인**: `/proc/[PID]/ns` 디렉토리 내의 파일들은 각 네임스페이스를 가리키는 고유 ID(심볼릭 링크)입니다.
   - **Docker 없이 격리하기**: `unshare` 명령어로 Docker 없이도 격리된 프로세스를 띄울 수 있습니다.
     ```bash
     # 새로운 PID 네임스페이스에서 쉘 실행 (호스트 프로세스 차단)
     $ unshare --fork --pid --mount-proc /bin/bash
     $ ps aux  # PID 1번으로 자신만 보임
     ```
2. **Cgroups (제한)**: 프로세스 그룹별로 자원 사용량을 계층적으로 관리합니다. 할당량을 초과하면 프로세스를 지연(Throttling)시키거나 강제 종료(OOM Kill)합니다.

## 관련 본질 (Related Principles)

- [[본질-환경 격리]]: 프로세스 간의 간섭을 최소화하는 하위 기술.
- [[본질-최소 단위의 불일치]]: 호스트 자원과 컨테이너 요구사항 간의 차이를 조율함.
- [[본질-간접 참조 (Indirection)]]: 네임스페이스 격리가 가능하게 하는 근본 원리.
