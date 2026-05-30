---
aliases: [fork exec 패턴, 프로세스 생성 방식, Unix Process Creation]
tags: [탐구, OS, 작성중]
type: Question
difficulty: Medium
---

## 핵심 질문 (Core Question)

> Windows는 `CreateProcess()` 하나로 새 프로세스를 만드는데, 왜 Unix/Linux는 굳이 "복제(fork) 후 교체(exec)"라는 두 단계를 거치는가?

---

## 가설 및 추론 (Hypothesis)

- 새로 할당하는 것보다 복제가 더 빠를 수 있다
- 부모의 환경(파일, 권한, 환경변수)을 그대로 이어받을 수 있다

---

## 검증 및 팩트 (Verification)

### 1. 사용자 프로세스는 스스로 새 프로세스를 만들 수 없다

각 프로세스는 OS가 할당한 **자신의 주소 공간**에만 접근 가능. P1이 P2의 코드를 메모리에 올리려 해도 자신의 주소 공간 밖에 쓸 방법이 없음 → 반드시 커널에 위임해야 함.

### 2. Windows vs Unix 철학 비교

```text
[Windows: CreateProcess]
P1 ──→ OS: "이 실행파일로 새 프로세스 만들어줘"
              ↓
        새 프로세스 P2 (처음부터 생성)

[Unix: fork + exec]
P1 ──fork()──→ OS: "나를 복제해줘"
                     ↓
               P1' (P1의 완전한 복사본, COW 적용)
                     ↓
              exec() → OS: "내 프로그램을 이 실행파일로 교체해줘"
                     ↓
               P2 (원하는 프로그램으로 변신)
```

### 3. fork를 쓰는 이유: 환경 상속

부모가 공들여 설정한 환경 변수, 열린 파일 디스크립터, 권한 설정을 자식이 그대로 이어받음. CreateProcess 방식이면 이 모든 것을 매개변수로 일일이 전달해야 함.

### 4. COW(Copy-on-Write)로 성능 문제 해결

fork 시 전체 메모리를 즉시 복사하지 않고 페이지를 공유 상태로 유지. 수정이 발생하는 순간에만 해당 페이지를 복사 → 생성 비용이 거의 없음. exec를 바로 호출하면 복사 자체가 아예 일어나지 않음.

```text
fork 직후 (공유):
Parent ──→ [Page A | Page B | Page C]  ← 동일 물리 메모리
Child  ──→          ↑

Child가 Page B 수정 시:
Child  ──→ [Page A | Page B'| Page C]  ← Page B만 새로 복사
Parent ──→ [Page A | Page B | Page C]  ← 원본 유지
```

### 5. fork의 반환값으로 부모/자식 구분

- **자식**: `fork()` 반환값 = `0`
- **부모**: `fork()` 반환값 = 자식의 PID

컴파일 타임에 PID를 알 수 없지만, 0인지 아닌지로 실행 흐름을 분기.

```c
pid_t pid = fork();
if (pid == 0) {
    execv("/bin/ls", args);  // 자식만 프로그램 교체
} else {
    wait(NULL);              // 부모는 계속 실행
}
```

### 6. posix_spawn(): fork+exec의 현대적 통합

내부적으로 fork+exec를 수행하지만 단일 함수로 래핑. Python, Node.js 등 런타임 내부에서 주로 사용. `vfork()`는 극단적 최적화(자식이 부모 메모리를 잠시 빌려 씀)이지만 위험성으로 인해 직접 호출 지양.

---

## 결론 (Conclusion)

- Unix fork+exec는 **"환경 상속"** + **"COW 성능"** 두 가지를 동시에 얻기 위한 설계
- Windows의 직접 생성과 철학적으로 다름: **"모든 프로세스는 기존 프로세스에서 파생된다"**
- 이 원칙이 프로세스 트리를 형성하고, 결국 init(PID 1)이 모든 사용자 프로세스의 조상이 되는 구조로 이어짐

---

## 연결된 개념 (Links)

- [[개념-fork와 execve]]
- [[본질-쓰기 시 분리 (Copy-on-Write)]]
- [[개념-Init 프로세스 (PID 1)]]
- [[탐구-커널과 운영체제의 경계는 어디인가]]
