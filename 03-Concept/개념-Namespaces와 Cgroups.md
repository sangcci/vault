---
aliases: [Namespaces, Cgroups, Container Isolation Mechanism]
tags: [개념, 인프라, Docker, 커널]
created: 2026-02-06
updated: 2026-02-06
---
# 개념: Namespaces와 Cgroups

## 📝 정의
리눅스 커널에서 제공하는 기술로, 컨테이너(Docker 등)가 호스트 OS의 자원을 격리하고 제한할 수 있게 만드는 핵심 토대입니다.

## ⚙️ 핵심 원리

### 1. Namespaces (격리 - "무엇을 볼 수 있는가")
프로세스별로 시스템 자원을 독립적으로 투영(Virtual View)합니다.
- **PID Namespace**: 컨테이너 내부 프로세스가 고유한 PID(보통 1번)를 갖게 함.
- **NET Namespace**: 컨테이너마다 독립적인 네트워크 스택(IP, Port) 할당.
- **MNT Namespace**: 컨테이너만의 독립된 파일 시스템 마운트 지점 제공.

### 2. Cgroups (제한 - "얼마나 쓸 수 있는가")
Control Groups의 약자로, 프로세스 그룹이 사용하는 물리 자원의 양을 제어합니다.
- **제한 대상**: CPU 시간, 메모리 크기, 네트워크 대역폭, 디스크 I/O.
- **역할**: 특정 컨테이너가 자원을 독점하여 호스트나 다른 컨테이너를 멈추게 하는 현상을 방지함.

## 💡 한 줄 요약
**Namespaces**는 프로세스에 울타리를 쳐서 "너는 이것만 봐"라고 속이는 것이고, **Cgroups**는 "너는 이만큼만 써"라고 손발을 묶는 것이다.
