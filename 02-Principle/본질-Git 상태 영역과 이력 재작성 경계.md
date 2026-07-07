---
aliases: [Git State Areas and History Rewrite Boundary, Working Tree Index HEAD]
tags: [본질, 작성중, Git]
difficulty: Medium
type: Principle
---

# Principle: Git 상태 영역과 이력 재작성 경계

**핵심 질문**: 지금 바꾸려는 것은 파일인가, staging area인가, commit history인가?

## 한 문장 정의

Git 상태 영역과 이력 재작성 경계는 Git이 working directory, staging area, repository history를 분리해 관리하므로 명령어 실행 전 어느 영역을 바꾸는지와 그 이력이 공유됐는지를 먼저 확인해야 한다는 원리.

---

## 판단 기준

```text
Working directory
  - 지금 파일 내용
  - restore --worktree, reset --hard 영향

Staging area / Index
  - 다음 commit 후보
  - add, restore --staged, reset --mixed 영향

Repository history
  - commit graph
  - commit, reset, revert, rebase 영향
```

---

## 실무 기준

- 아직 push 전이면 reset/rebase로 로컬 이력을 정리할 수 있다.
- 이미 공유한 commit은 reset보다 revert가 안전하다.
- `--hard`는 작업 파일까지 되돌리므로 실행 전 status를 본다.
- force push는 공유 기준점을 바꾸는 행위다.
- 복구 가능성 확인을 위해 reflog를 기억한다.

---

## 대표 문제

- [[56-reset과 force push로 공유 브랜치 이력이 꼬임]]

---

## 참고

> "Each file in your working directory can be in one of two states: tracked or untracked." — [Pro Git Book: Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

> "The git status command displays the state of the working directory and the staging area." — [Git Documentation: git-status](https://git-scm.com/docs/git-status)
