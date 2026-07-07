---
aliases: [Docker vs VM Isolation, Container Isolation Mismatch, Noisy Neighbor]
tags: [문제, 작성중, Infra, Docker, VM]
difficulty: High
type: Problem
---

# Problem: 13-Docker와 VM 격리 수준을 구분하지 못해 워크로드 배치가 불안정함

## 상황

서비스를 빠르게 배포하기 위해 모든 워크로드를 Docker 컨테이너로 올린다. Web, WAS, DB, 배치, 캐시를 같은 호스트나 같은 VM 안에서 컨테이너로만 분리한다.

```text
Host / VM
  ├─ web container
  ├─ was container
  ├─ db container
  ├─ batch container
  └─ cache container
```

처음에는 배포가 편하지만, 특정 컨테이너가 CPU, memory, disk I/O를 과도하게 쓰면 다른 컨테이너의 응답 시간까지 흔들린다. DB 같은 stateful workload는 컨테이너 재시작과 스토리지 계층에도 민감하다.

---

## 관찰된 증거

- 같은 API인데 p99 latency가 특정 시간대에 튄다.
- 애플리케이션 내부 로그에는 특별한 에러가 없지만 host CPU steal, disk I/O, memory pressure가 증가한다.
- 배치 컨테이너 실행 시간과 WAS 지연이 겹친다.
- DB 컨테이너가 OOM Kill 또는 강제 종료를 맞은 뒤 복구 시간이 길어진다.
- Docker는 독립 환경처럼 보이지만 host에서 `ps`로 보면 결국 host kernel 위의 프로세스다.

```text
Container A: batch CPU / I/O 폭증
        ↓ shared kernel / shared disk / shared NIC
Container B: WAS latency 증가
        ↓
사용자는 WAS 장애로 인식
```

---

## 의심 문제

가장 가능성 높은 문제는 **컨테이너 격리와 VM 격리의 강도를 같은 것으로 본 것**이다.

Docker는 애플리케이션 실행 환경을 빠르게 포장하고 격리하는 데 강하지만, 독립 커널을 가진 VM과 같은 장애·보안·자원 경계를 제공한다고 보면 안 된다.

---

## 원인

컨테이너는 별도 OS를 띄우는 것이 아니라 host kernel을 공유하는 격리된 프로세스다. Namespaces는 “무엇을 볼 수 있는가”를 분리하고, cgroups는 “얼마나 쓸 수 있는가”를 제한한다.

```text
Container
  ├─ namespaces: PID / NET / MNT view 분리
  └─ cgroups: CPU / memory / I/O 사용량 제한
       ↓
Shared Linux Kernel
       ↓
Host hardware
```

반면 VM은 hypervisor 위에서 guest OS와 kernel을 따로 가진다.

```text
VM A: guest kernel A
VM B: guest kernel B
       ↓
Hypervisor
       ↓
Hardware
```

그래서 VM은 비용이 더 들지만 커널 수준 장애와 보안 경계를 더 강하게 분리한다. 컨테이너는 빠르고 가볍지만, host kernel과 물리 자원을 공유하므로 Noisy Neighbor와 커널 취약점의 영향을 더 직접적으로 받을 수 있다.

---

## 확인 방법

- 워크로드를 stateless / stateful / 보안 민감 / I/O 민감 기준으로 분류한다.
- 컨테이너별 CPU, memory, disk I/O limit이 실제로 설정되어 있는지 확인한다.
- host 단위 metrics와 container metrics를 같은 시간축에서 비교한다.
- DB, queue, cache persistence 설정이 컨테이너 생명주기와 충돌하지 않는지 본다.
- 장애가 났을 때 blast radius가 host 전체인지, VM 단위인지, container 단위인지 그려본다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/위험 |
|---|---|---|
| VM으로 보안/장애 경계 설정 | 강한 격리, blast radius 축소 | 비용과 관리 포인트 증가 |
| VM 내부에서 Docker 운영 | 배포 편의와 격리 강도 균형 | 계층이 늘어 디버깅 복잡 |
| cgroup resource limit 설정 | Noisy Neighbor 완화 | limit 튜닝 필요, 과도하면 throttling |
| DB는 전용 VM/managed service 사용 | 영속성과 I/O 안정성 확보 | 비용 증가 |
| 신뢰 불가 코드에 MicroVM/gVisor 사용 | 컨테이너보다 강한 격리 | 운영 복잡도 증가 |

---

## 트레이드오프

격리를 강하게 할수록 안정성과 보안은 좋아지지만 비용과 운영 복잡도가 증가한다. 반대로 컨테이너만 쓰면 배포 효율은 좋지만, 커널과 자원 공유로 인한 장애 전파 가능성을 감수해야 한다.

실무에서는 VM으로 큰 장애 경계를 만들고, 그 안에서 Docker로 애플리케이션 배포 단위를 관리하는 하이브리드 구조가 자주 쓰인다.

---

## 연결되는 본질

- [[본질-격리 강도와 자원 경계]]
- [[본질-폭발 반경과 격벽]]
- [[본질-공유 자원 점유와 대기열]]

---

## 참고

> "A container is simply an isolated process with all of the files it needs to run." — [Docker Docs: What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)

> "If you run multiple containers, they all share the same kernel" — [Docker Docs: What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)

> "A namespace wraps a global system resource in an abstraction" — [Linux man-pages: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

> "cgroup is a mechanism to organize processes hierarchically and distribute system resources along the hierarchy in a controlled and configurable manner." — [Linux Kernel Docs: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)
