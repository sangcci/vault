---
aliases: [PID 1 and Child Reaping Responsibility, Init Process, Zombie Reaping]
tags: [본질, 작성중, OS, Docker]
difficulty: Medium
type: Principle
---

# Principle: PID 1과 자식 프로세스 수거 책임

**핵심 질문**: 종료된 자식 프로세스의 상태를 누가 회수하는가?

## 한 문장 정의

PID 1과 자식 프로세스 수거 책임은 Unix 계열에서 종료된 자식 프로세스는 부모가 `wait()`로 회수해야 하며, 부모가 사라진 프로세스는 init 또는 subreaper가 입양해 수거해야 한다는 원리.

---

## 판단 기준

```text
child exits
  ↓
parent wait() 호출
  ↓
exit status 회수
  ↓
process table 정리

parent가 먼저 종료
  ↓
orphan process
  ↓
PID 1 또는 subreaper로 re-parenting
```

---

## 실무 기준

- 컨테이너의 PID 1이 init 역할을 할 수 있는지 확인한다.
- shell script를 PID 1로 둘 때 signal forwarding과 wait 처리를 확인한다.
- 자식 프로세스를 많이 만드는 작업은 supervisor 또는 init을 둔다.
- zombie는 메모리 누수와 다르지만 process table slot을 소모한다.
- graceful shutdown은 signal 전달, child wait, resource close를 함께 본다.

---

## 대표 문제

- [[66-컨테이너 PID 1이 자식 프로세스를 수거하지 않아 좀비가 쌓임]]

---

## 참고

> "A child that terminates, but has not been waited for becomes a 'zombie'." — [Linux man-pages: wait(2)](https://man7.org/linux/man-pages/man2/wait.2.html)

> "When a process becomes orphaned (i.e., its immediate parent terminates), then that process will be reparented to the nearest still living ancestor subreaper." — [Linux man-pages: PR_SET_CHILD_SUBREAPER](https://man7.org/linux/man-pages/man2/PR_SET_CHILD_SUBREAPER.2const.html)
