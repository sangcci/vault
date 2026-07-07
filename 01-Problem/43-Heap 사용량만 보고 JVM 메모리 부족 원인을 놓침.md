---
aliases: [JVM Memory OOM Not Heap, Metaspace Native Memory, JVM Runtime Data Areas]
tags: [문제, 작성중, JVM, Memory]
difficulty: High
type: Problem
---

# Problem: 43-Heap 사용량만 보고 JVM 메모리 부족 원인을 놓침

## 상황

애플리케이션이 `OutOfMemoryError` 또는 컨테이너 OOM으로 죽었다. 대시보드에서는 heap used만 보고 있었고, heap은 여유가 있어 보였다. 하지만 실제 원인은 Metaspace, thread stack, direct buffer, native memory 같은 heap 밖 영역이었다.

```text
JVM process memory
  ├─ Java Heap
  ├─ Metaspace / class metadata
  ├─ Thread stacks
  ├─ Code cache
  ├─ Direct buffer / native memory
  └─ JVM internal structures
```

---

## 관찰된 증거

- heap used는 안정적인데 process RSS가 계속 증가한다.
- `OutOfMemoryError: Metaspace`가 발생한다.
- class loading 수가 계속 증가하거나 classloader가 해제되지 않는다.
- thread 수 증가와 함께 native memory가 증가한다.
- 컨테이너 memory limit에 먼저 걸린다.

---

## 의심 문제

가장 가능성 높은 문제는 **JVM 메모리를 heap 하나로만 본 것**이다.

JVM은 실행 중 여러 runtime data area를 사용한다. Heap은 객체/배열이 사는 대표 영역이지만, 클래스 메타데이터, 스레드별 stack/pc, native buffer는 별도 영역이다.

---

## 원인

```text
Heap
  - 객체와 배열
  - GC 대상
  - 모든 JVM thread가 공유

Metaspace / Method Area
  - class metadata
  - classloader 생명주기와 연결
  - native memory 사용

Stack / PC Register
  - thread별 실행 context
  - thread 생성 수에 비례

Direct / Native Memory
  - NIO buffer, JVM 내부, native library
  - heap metric만으로 보이지 않음
```

---

## 확인 방법

- heap used/committed/max와 process RSS를 함께 본다.
- `jcmd VM.native_memory summary` 또는 Native Memory Tracking을 확인한다.
- loaded class count, classloader leak, Metaspace usage를 확인한다.
- thread count와 stack size를 확인한다.
- direct buffer 사용량과 Netty/NIO 설정을 확인한다.

---

## 해결책 후보

| 해결책 | 장점 | 비용/주의 |
|---|---|---|
| heap 외 영역 metric 추가 | 실제 OOM 원인 구분 | 관측 설정 필요 |
| Metaspace 상한 설정 | runaway class loading 방지 | 너무 낮으면 정상 기동 실패 |
| classloader leak 제거 | Metaspace 회수 가능 | 재배포/플러그인 구조 분석 필요 |
| thread 수 제한 | stack/native memory 감소 | 처리량 영향 |
| direct memory limit/모니터링 | off-heap 폭주 방지 | 라이브러리 설정 확인 필요 |

---

## 트레이드오프

Heap만 보면 GC 대상 객체 문제는 잘 보이지만, JVM process가 실제 OS에서 점유하는 메모리 전체를 설명하지 못한다. 운영에서는 heap metric과 process/native memory metric을 함께 봐야 한다.

---

## 연결되는 본질

- [[본질-JVM 런타임 영역과 생명주기]]
- [[본질-Heap 객체와 메타데이터 간접 참조]]
- [[본질-관측 신호의 상관관계]]

---

## 참고

> "The Java Virtual Machine defines various run-time data areas that are used during execution of a program." — [JVM Specification §2.5](https://docs.oracle.com/en/java/javase/26/docs/specs/jvms/jvms-2.html)

> "Starting with JDK 8, the permanent generation was removed and the class metadata is allocated in native memory." — [Oracle Java SE GC Tuning Guide: Other Considerations](https://docs.oracle.com/en/java/javase/25/gctuning/other-considerations.html)
