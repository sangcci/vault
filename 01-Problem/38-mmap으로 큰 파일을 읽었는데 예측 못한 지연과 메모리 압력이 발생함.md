---
aliases: [mmap Page Fault Latency, Memory Mapped File Stall, Virtual Memory Pressure]
tags: [문제, 작성중, OS, mmap, VirtualMemory]
difficulty: High
type: Problem
---

# Problem: 38-mmap으로 큰 파일을 읽었는데 예측 못한 지연과 메모리 압력이 발생함

## 상황

큰 파일을 빠르게 읽기 위해 `read()` 대신 `mmap()`을 사용했다. 초기 매핑은 빠르게 끝났지만, 실제 데이터 접근 중 page fault가 발생하면서 latency가 튀고, 메모리 압력과 I/O가 예측하기 어렵게 증가한다.

```text
mmap(file)
  → 파일 내용 전체를 즉시 읽는 것이 아님
  → 가상 주소 공간에 mapping 생성

프로그램이 주소 접근
  → page가 RAM에 없으면 page fault
  → 커널이 디스크에서 page를 로드
```

---

## 관찰된 증거

- `mmap()` 호출 자체는 빠른데 실제 접근 시점에 지연이 발생한다.
- major page fault가 증가한다.
- RSS, page cache, swap activity가 증가한다.
- 순차 접근과 랜덤 접근에서 latency 차이가 크다.
- DB나 검색 엔진에서 `mmap` 사용 여부에 따라 I/O 제어 가능성이 달라진다.

---

## 의심 문제

가장 가능성 높은 문제는 **mmap을 “파일을 메모리에 올리는 API”로 오해한 것**이다.

`mmap()`은 파일을 프로세스의 가상 주소 공간에 매핑하는 API다. 실제 데이터 로딩은 접근 시점의 page fault와 커널 paging 정책에 의해 일어난다.

---

## 원인

```text
read()
  application이 read syscall 호출
  kernel이 buffer로 데이터 복사
  호출 지점에서 I/O 비용이 드러남

mmap()
  file을 virtual address range에 연결
  접근 전까지 실제 page load 없음
  접근 시 page fault로 I/O 비용 발생
```

즉 비용이 사라진 것이 아니라 이동한다.

```text
장점:
  - 복사 감소
  - 파일을 배열처럼 접근
  - OS page cache 활용

비용:
  - page fault 지연이 접근 경로에 섞임
  - eviction/readahead 제어가 간접적
  - 메모리 압력 시 tail latency 예측 어려움
```

---

## 확인 방법

- major/minor page fault 수를 확인한다.
- 파일 접근 패턴이 순차인지 랜덤인지 본다.
- page cache hit/miss와 swap 활동을 확인한다.
- latency spike가 page fault와 겹치는지 확인한다.
- DBMS처럼 I/O 스케줄링을 직접 통제해야 하는 workload인지 판단한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| 순차 접근 + readahead 활용 | page fault 비용 완화 | 랜덤 접근에는 제한 |
| explicit read/buffer 관리 | I/O 시점 제어 가능 | 복사/코드 복잡도 증가 |
| working set 크기 제한 | 메모리 압력 감소 | cache hit 저하 가능 |
| `madvise`/prefetch 검토 | 접근 패턴 힌트 제공 | 플랫폼 의존성 |
| DBMS 수준 buffer pool 사용 | eviction 정책 제어 | 구현/운영 복잡도 |

---

## 트레이드오프

`mmap()`은 파일 I/O를 가상 메모리 접근으로 추상화해 코드를 단순하게 만들고 복사를 줄일 수 있다. 하지만 I/O 비용과 eviction 판단을 커널 paging 정책에 맡기므로, 지연 시간과 메모리 압력 제어가 어려워질 수 있다.

---

## 연결되는 본질

- [[본질-가상 주소와 지연 로딩]]
- [[본질-시스템 콜과 커널 경계]]
- [[본질-논리 순서와 물리 접근 비용]]

---

## 참고

> "mmap() creates a new mapping in the virtual address space of the calling process." — [Linux man-pages: mmap(2)](https://man7.org/linux/man-pages/man2/mmap.2.html)
