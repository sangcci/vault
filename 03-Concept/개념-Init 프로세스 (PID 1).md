---
aliases: [Init, PID 1, systemd, init process, 첫 번째 프로세스]
tags: [개념, OS, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) 커널이 부팅 완료 후 직접 실행하는 최초의 사용자 공간 프로세스로, 항상 PID 1을 가지며 모든 사용자 프로세스의 조상이 된다.
> (이해용) OS라는 도시에서 커널이 임명하는 "첫 번째 시장". 이후 모든 서비스(프로세스)는 이 시장이 직접 또는 간접적으로 만들어낸다.

---

## 해결하는 문제 (Problem Solved)

- 커널은 하드웨어 관리에만 집중하고, 사용자 공간 서비스 인프라 구축은 외부에 위임 필요
- 부모 없이 남겨진 고아 프로세스를 누가 수거할 것인가

---

## 치르는 비용 (Cost/Trade-off)

- Init이 죽으면 커널 패닉 발생 (커널은 init 생존을 전제로 설계됨)
- Init 구현체(systemd vs sysvinit vs runit vs openrc)에 따라 배포판의 성격이 완전히 달라짐
- systemd처럼 역할이 비대해지면 "단일 책임 원칙" 위반 논란 발생

---

## 동작 원리 (Mechanism)

### 생성 과정

```text
[커널 부팅 완료]
        ↓
kernel_init() 함수 실행 (커널 코드)
        ↓
run_init_process() → kernel_execve() 직접 호출
(일반 시스템 콜 불필요 — 이미 커널 모드)
        ↓
탐색 순서: /sbin/init → /etc/init → /bin/init → /bin/sh
        ↓
발견 → PID 1로 실행 / 미발견 → 커널 패닉
```

### 세 가지 특수 속성

| 속성 | 내용 |
|------|------|
| **항상 PID 1 보장** | 최초 생성 프로세스이므로 보장, task manager에서 식별 용이 |
| **SIGKILL 무시** | 커널이 시그널 전달 자체를 거부 |
| **고아 프로세스 입양** | 부모 종료 시 커널이 자동으로 init을 새 부모로 지정 |

### init → systemd 간접 참조

```text
커널이 탐색하는 경로: /sbin/init
                          ↓ (symbolic link)
실제 실행 파일:       /lib/systemd/systemd
```

커널은 "init이라는 이름의 프로그램"만 찾음. 실제로 무엇이 실행되는지는 관심 없음 → [[본질-간접 참조 (Indirection)]]의 완벽한 OS 레벨 사례.

### 프로세스 트리 소환

```text
init (PID 1)
├── networkd          ← 네트워크 관리
├── journald          ← 로깅
├── sshd              ← 원격 접속
├── display server (Wayland)
│   └── desktop env (GNOME/KDE)
│       └── terminal
│           └── shell
│               └── 사용자 앱
└── ...
```

init 하나에서 OS의 사용자 공간 전체가 파생됨.

---

## 관련 본질 (Related Principles)

- [[본질-간접 참조 (Indirection)]]
- [[현상-고아 프로세스 (Orphan Process)]]
- [[탐구-커널과 운영체제의 경계는 어디인가]]
- [[탐구-Unix에서 왜 새 프로세스를 fork+exec 패턴으로 생성하는가]]
