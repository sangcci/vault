---
aliases: [Hypervisor, VMM, Virtual Machine Monitor]
tags: [개념, 인프라, 가상화, OS]
created: 2026-02-07
updated: 2026-02-07
---
# 개념: 하이퍼바이저 (Hypervisor)

## 📝 정의
물리적 하드웨어 위에서 여러 개의 가상 머신(VM)을 생성하고 실행, 관리하는 논리적 플랫폼(소프트웨어, 펌웨어, 하드웨어)입니다. **VMM(Virtual Machine Monitor)**이라고도 불립니다.

---

## ⚙️ 핵심 원리

### 1. 가상화 (Virtualization)
물리적 하드웨어(CPU, Memory, Disk, NIC)를 논리적으로 추상화하여 게스트 OS가 자신만의 전용 하드웨어를 가진 것처럼 착각하게 만듭니다.

### 2. 하드웨어 수준 격리 (Hardware Level Isolation)
각 VM은 완전히 독립된 커널과 OS를 가집니다. 하나의 VM이 커널 패닉으로 멈춰도, 다른 VM이나 호스트에는 영향을 주지 않습니다. (Docker와의 가장 큰 차이점)

### 3. 유형 (Types)
- **Type 1 (Native/Bare-metal)**: 하드웨어 위에 직접 설치. 호스트 OS가 없어 오버헤드가 적음. (예: VMware ESXi, Xen, KVM)
- **Type 2 (Hosted)**: 일반 OS(Windows/Linux) 위에 애플리케이션처럼 설치. 관리가 쉬우나 성능 손실이 있음. (예: VirtualBox, VMware Workstation)

---

## 💡 한 줄 요약
**하이퍼바이저**는 하나의 물리적 컴퓨터를 여러 대의 '논리적 컴퓨터'로 쪼개어, 서로 다른 OS들이 한 집(서버)에 살면서도 남남처럼 지내게 해주는 **건물 관리인**이다.
