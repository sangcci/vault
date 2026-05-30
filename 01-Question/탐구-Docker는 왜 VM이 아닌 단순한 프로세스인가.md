---
aliases: [Docker vs VM, Docker Process, 도커 실체]
tags: [탐구, OS, Docker, 인프라]
type: Question
difficulty: Medium
---

## 핵심 질문 (Core Question)

> "Docker는 가상 머신(VM)처럼 독립된 환경을 제공하는데, 왜 가상화 기술이 아닌 '단순한 프로세스'라고 불리는가? 그 기술적 실체는 무엇인가?"

---

## 가설 및 추론 (Hypothesis)

- VM은 하드웨어를 추상화하여 독자적인 커널을 띄우지만, Docker는 호스트 OS의 커널을 공유한다.
- 따라서 호스트 OS 입장에서 컨테이너는 격리된 환경을 가진 '특수한 프로세스'에 불과할 것이다.

---

## 검증 및 팩트 (Verification)

### 1. 실체적 증거: `ps aux`와 `/proc`
호스트 머신에서 프로세스 목록을 확인하면 컨테이너 내부의 프로세스가 그대로 노출됩니다.
```bash
# 컨테이너 실행 (호스트 OS)
$ docker run -d --name my-nginx nginx

# 호스트에서 프로세스 확인
$ ps aux | grep nginx
root      48372  0.0  0.1  ... nginx: master process
```
- **결과**: 컨테이너 내부에서 PID 1번인 프로세스가 호스트에서는 48372번과 같은 일반 PID로 보입니다. 즉, 하나의 프로세스가 보는 관점(View)만 다를 뿐 실체는 하나입니다.

### 2. 기술적 근거: Namespaces (격리의 안경)
리눅스 커널의 **Namespaces** 기능이 프로세스에게 '거짓말'을 합니다.
- `/proc/[PID]/ns` 디렉토리의 심볼릭 링크들이 격리의 실체입니다.
- `mnt`, `net`, `pid` 등의 파일이 가리키는 고유 ID가 같으면 같은 격리 환경에 있는 것입니다.

### 3. Docker Exec의 동작 원리: `setns` 시스템 콜
`docker exec`는 기존 상자(Container)로 들어가는 것이 아니라, 새로운 프로세스를 만들 때 기존 컨테이너의 네임스페이스 ID를 복사해서 사용하는 것입니다.
```c
// Pseudo-code: docker exec의 핵심 로직
int fd = open("/proc/[TARGET_PID]/ns/pid", O_RDONLY);
setns(fd, CLONE_NEWPID); // 기존 프로세스의 PID 네임스페이스로 '안경' 교체
execvp("/bin/sh", argv);  // 해당 환경에서 쉘 실행
```

---

## 결론 (Conclusion)

- **Docker는 가상화가 아니라 '격리'다.**
- 컨테이너는 커널이 **[[본질-간접 참조 (Indirection)]]** 원칙을 활용해 Namespaces(가시성 제어)와 Cgroups(자원 할당 제어)로 일반 프로세스를 속이고 있는 상태입니다.
- 프로세스는 커널이 제공하는 간접 층을 통해서만 세상을 보므로, 다른 컨테이너의 존재를 전혀 알 수 없는 **'상호 무지(Mutual Unawareness)'** 상태에 놓이게 됩니다.
- 이로 인해 VM보다 월등히 빠르지만(커널 부팅 불필요), 커널을 공유하므로 커널 취약점에 노출될 경우 격리가 깨질 수 있는 보안상 트레이드오프가 존재합니다.

---

## 연결된 개념 (Links)

- [[개념-Namespaces와 Cgroups]]
- [[본질-환경 격리 (Environment Isolation)]]
- [[본질-간접 참조 (Indirection)]]
- [[탐구-인프라의 핵심인 격리 관점에서 Docker와 VM을 어떻게 조화롭게 사용할까]]
