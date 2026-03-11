---
aliases: [fork, execve, exec, 프로세스 복제, 프로세스 교체, fork-exec]
tags: [개념, OS, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) `fork()`는 호출 프로세스를 복제해 자식 프로세스를 생성하는 시스템 콜이고, `execve()`는 현재 프로세스의 프로그램을 지정한 실행파일로 교체하는 시스템 콜이다.
> (이해용) fork는 "나를 찍어내라", execve는 "내 껍데기에 다른 프로그램을 집어넣어라".

## 해결하는 문제 (Problem Solved)

- 사용자 프로세스는 자신의 주소 공간 밖에 코드를 올릴 수 없음 → 커널에 위임 필요
- 부모의 환경(파일 디스크립터, 권한, 환경변수)을 이어받으면서 다른 프로그램을 실행하고 싶음

## 치르는 비용 (Cost/Trade-off)

- fork를 루프 안에서 잘못 쓰면 **포크 폭탄**: 3번 fork → 2³ = 8개 프로세스
- execve 성공 후 원래 코드로 돌아올 수 없음 (프로그램 자체가 교체됨)
- fork는 호출한 스레드 하나만 복제 → 멀티스레드 프로세스에서 fork 후 exec 전 구간은 위험

## 동작 원리 (Mechanism)

### fork()

```text
호출 전: [부모: PID=100, i=5, stack, heap, text, data]

fork() 호출 →

부모: PID=100, 반환값=101 (자식 PID)
자식: PID=101, 반환값=0
     ↑ 프로그램 카운터(PC)도 동일 → fork() 직후 라인부터 둘 다 실행
```

복제되는 것:
- 가상 주소 공간 (text, data, heap, stack) — COW로 지연 복사
- CPU 상태 (레지스터, 프로그램 카운터)
- 열린 파일 디스크립터, 환경변수, 시그널 핸들러

복제되지 않는 것:
- PID (반드시 고유 — 커널이 전역 관리)
- 실행 중인 스레드 (호출한 스레드 하나만 복제)

### execve()

```text
execve("/usr/bin/ls", args, env) 호출 →

기존 text, data, heap, stack → 전부 폐기
새 실행파일 로드 → PC를 새 프로그램의 첫 번째 명령어로 초기화
PID는 유지됨 (프로세스 교체, 생성 아님)
```

exec 성공 후에는 호출 이후 코드가 실행되지 않음 — 프로그램이 사라졌기 때문.

### fork-exec 패턴 (Unix 프로세스 생성의 표준)

```c
pid_t pid = fork();
if (pid == 0) {
    // 자식: 원하는 프로그램으로 교체
    execv("/bin/ls", args);
    // 여기까지 오면 exec 실패
    exit(1);
} else if (pid > 0) {
    // 부모: 자식 종료 대기
    wait(NULL);
} else {
    // fork 실패
}
```

### fork 반환값의 비대칭성

| 호출 주체 | 반환값 | 의미 |
|-----------|--------|------|
| 자식 | `0` | "나는 방금 태어났다" |
| 부모 | 자식의 PID | "내가 만든 자식의 ID" |

이 비대칭성 하나로 하나의 코드에서 부모/자식의 실행 경로를 완전히 분기.

## 관련 본질 (Related Principles)

- [[본질-쓰기 시 분리 (Copy-on-Write)]]
- [[본질-간접 참조 (Indirection)]]
- [[탐구-Unix에서 왜 새 프로세스를 fork+exec 패턴으로 생성하는가]]
