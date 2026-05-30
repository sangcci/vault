---
aliases: [Everything is a File, Unix I/O, File Abstraction, 파일 디스크립터, File Descriptor]
tags: [본질, 작성중, OS, Unix]
type: Principle
difficulty: High
---

**핵심 질문**: "Unix는 왜 소켓, 키보드, 디스크, 파이프를 모두 '파일'이라 부르는가?"

## 한 문장 정의

> (사전적) Unix 계열 OS에서 디스크 파일, 네트워크 소켓, 장치(device), 파이프 등 모든 I/O 대상을 '파일'이라는 단일 추상화로 취급하고, 통일된 API(`open`, `read`, `write`, `close`)로 접근하는 설계 철학.
> (이해용) 소켓이든, 키보드든, 하드디스크든 전부 "데이터를 읽고 쓸 수 있는 통로"로 보고, 같은 리모컨(API)으로 조작하는 것.

---

## 사용 예시

1. "Linux에서 `cat /dev/urandom`으로 난수 장치를 일반 파일처럼 읽을 수 있는 것은 **파일 추상화** 덕분이다."
2. "Java의 `InputStream`이 File, Socket, ByteArray를 모두 같은 인터페이스로 다루는 것은 Unix의 **파일 추상화**를 JVM 레벨에서 재현한 것이다."
3. "셸에서 `ls | grep .md`가 가능한 것은 파이프도 **파일**이기 때문이다."

---

## 트레이드오프

- **단순성 vs 최적화**: 통일된 API는 학습 비용을 줄이지만, 장치별 특수 기능(소켓의 connect, 디바이스의 ioctl)을 별도로 노출해야 함.
- **추상화 vs 제어**: 파일로 추상화하면 편리하지만, DBMS처럼 I/O 순서를 정밀하게 제어해야 하는 경우 OS의 파일 추상화를 우회함 ([[탐구-DBMS는 왜 OS의 가상 메모리를 믿지 않을까]]).

---

## 왜 사라지지 않는가

I/O 대상의 종류는 시대마다 늘어나지만(디스크 → 네트워크 → GPU → 클라우드 스토리지), "데이터를 읽고 쓴다"는 본질은 변하지 않는다. 이 불변하는 본질을 단일 인터페이스로 포착한 것이 파일 추상화이며, 이것이 Unix가 50년 넘게 살아남은 핵심 설계 결정이다.

---

## 다른 모습들

### OS: File Descriptor

```text
프로세스의 File Descriptor Table
┌─────┬──────────────┬─────────────────────┐
│ fd  │ 타입          │ 연결 대상             │
├─────┼──────────────┼─────────────────────┤
│  0  │ 표준 입력     │ 키보드 (/dev/stdin)   │
│  1  │ 표준 출력     │ 터미널 (/dev/stdout)  │
│  2  │ 표준 에러     │ 터미널 (/dev/stderr)  │
│  3  │ 일반 파일     │ /home/data.txt       │
│  4  │ 소켓         │ TCP 192.168.1.1:8080  │
│  5  │ 파이프       │ pipe[read_end]        │
└─────┴──────────────┴─────────────────────┘

모두 read(fd), write(fd), close(fd)로 조작
```

- 0, 1, 2번은 프로세스 생성 시 자동 할당되며 수정/삭제 불가.
- 3번부터 사용자가 `open()`, `socket()`, `pipe()` 등으로 생성.

### JVM: InputStream 추상화

```text
       InputStream (abstract)     ← Unix의 "파일" 대응
       ├── FileInputStream        ← 디스크 파일
       ├── SocketInputStream      ← 네트워크 소켓
       ├── ByteArrayInputStream   ← 메모리 내 바이트 배열
       └── ...

       OS별 구현이 다름:
       - System.in → WindowsConsoleInputStream (Windows)
       - System.in → 다른 구현체 (Linux)
       → 추상 타입 반환으로 OS 이식성 보장
```

Java에서 `System.in`이 구체 타입이 아닌 `InputStream`을 반환하는 이유: OS마다 표준 입력 구현이 다르므로, 공통 인터페이스만 노출하여 이식성을 보장한다.

### Stream과 메모리 절약

```text
100GB 파일 전송 시:

[Without Stream]                [With Stream]
RAM에 100GB 적재 → 불가능       Buffer 단위로 조금씩 이동
                                ┌───────┐
                                │ 8KB   │ → write
                                │ Buffer│ → read → write
                                └───────┘ → ...반복
                                RAM 사용: Buffer 크기만큼만
```

Stream이라는 이름은 데이터가 물처럼 흘러가는 것에서 유래. 전체를 메모리에 올리는 것이 아니라, Buffer 단위로 흘려보내는 방식.

### 주의: Application Buffer ≠ OS Buffer

Java의 `BufferedReader`는 **JVM 힙 메모리**에 할당된 버퍼이다. OS 커널의 버퍼와 별개의 공간이며, `native` 코드가 아닌 이상 Application에서 OS 메모리를 직접 참조할 수 없다.

---

## 관련 본질

- [[본질-추상화 (Abstraction)]] — 파일 추상화는 추상화 원리의 가장 성공적인 적용 사례.
- [[개념-유닉스 파이프 (Unix Pipe)]] — 파이프도 파일로 취급되기에 `read`/`write`로 동작.
- [[개념-시스템 콜 (System Call)]] — `open`, `read`, `write`, `close`는 모두 시스템 콜.
