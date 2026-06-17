---
aliases: [Git File Status, Staged, Unstaged, Untracked, Git Staging Area]
tags: [개념, 작성중]
difficulty: Low
type: Concept
---

## 한 문장 정의

> (사전적) Git 파일 상태는 working directory의 파일이 Git의 추적 대상인지, 그리고 다음 커밋에 포함되도록 staging area에 올라갔는지를 구분하는 상태 모델이다.
> (이해용) `untracked`는 Git이 처음 보는 파일, `unstaged`는 Git이 알지만 아직 이번 커밋 후보가 아닌 변경, `staged`는 다음 커밋에 넣겠다고 골라둔 변경이다.

> "Each file in your working directory can be in one of two states: tracked or untracked." — [Pro Git Book, Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

---

## 해결하는 문제

- `git status`에 보이는 `Changes to be committed`, `Changes not staged for commit`, `Untracked files`의 차이를 구분한다.
- `git add`, `git restore`, `git reset`이 어느 영역을 바꾸는지 판단한다.
- 커밋에 들어갈 변경과 아직 작업 중인 변경을 분리한다.

> "The git status command displays the state of the working directory and the staging area." — [Git Documentation, git-status](https://git-scm.com/docs/git-status)

---

## 치르는 비용

- staging area를 따로 이해해야 해서 초반에는 `git add`의 의미가 헷갈린다.
- `git add .`를 습관적으로 쓰면 의도하지 않은 변경까지 staged 상태가 될 수 있다.
- staged와 unstaged가 같은 파일에 동시에 존재할 수 있어, 부분 stage를 쓰면 상태 해석이 더 복잡해진다.

> "The git add command adds a change in the working directory to the staging area." — [Git Documentation, git-add](https://git-scm.com/docs/git-add)

---

## 동작 원리

```text
Git 파일 상태를 세로로 보면 이렇게 흐른다.

[1] 파일이 Working Directory에 있음
    │
    ├─ 새 파일이고 Git이 아직 모름
    │
    │     ┌─────────────┐
    │     │ untracked   │
    │     │ 처음 보는 파일 │
    │     └─────────────┘
    │            │
    │            │ git add
    │            ▼
    │     ┌─────────────┐
    │     │ staged      │
    │     │ 다음 커밋 후보 │
    │     └─────────────┘
    │            │
    │            │ git commit
    │            ▼
    │     ┌─────────────┐
    │     │ repository  │
    │     │ 커밋 이력     │
    │     └─────────────┘
    │
    └─ 이미 Git이 추적 중인 파일을 수정함

          ┌─────────────┐
          │ unstaged    │
          │ 수정됐지만    │
          │ 커밋 후보 아님 │
          └─────────────┘
                 │
                 │ git add
                 ▼
          ┌─────────────┐
          │ staged      │
          │ 다음 커밋 후보 │
          └─────────────┘
                 │
                 │ git commit
                 ▼
          ┌─────────────┐
          │ repository  │
          │ 커밋 이력     │
          └─────────────┘
```

```text
명령어 기준으로 보면 다음과 같다.

untracked ── git add ──▶ staged ── git commit ──▶ repository

unstaged  ── git add ──▶ staged ── git commit ──▶ repository

staged    ── git restore --staged ──▶ unstaged
unstaged  ── git restore          ──▶ 마지막 커밋 상태로 되돌림
```

| 상태 | 의미 | 대표 표시 | 다음 행동 |
|---|---|---|---|
| `untracked` | Git이 아직 관리하지 않는 새 파일 | `Untracked files` | 커밋하려면 `git add`, 무시하려면 `.gitignore` |
| `unstaged` | Git이 추적 중이지만 변경분이 staging area에 없음 | `Changes not staged for commit` | 커밋하려면 `git add`, 버리려면 `git restore` |
| `staged` | 다음 커밋에 포함될 변경분 | `Changes to be committed` | 확정하려면 `git commit`, 내리려면 `git restore --staged` |

핵심은 파일 자체가 아니라 **변경분이 어느 영역에 등록되어 있는가**다. 그래서 같은 파일도 일부 변경은 staged, 나머지 변경은 unstaged일 수 있다.

---

## 관련 본질

- [[본질-영속성 (Persistence)]]
- [[본질-코드와 상태의 비대칭성 (Code-State Asymmetry)]]

---

## 관련 노트

- [[개념-Git Reset 모드]]
- [[개념-Git Worktree]]

---

## 참고

- [Pro Git Book, Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
- [Git Documentation, git-status](https://git-scm.com/docs/git-status)
- [Git Documentation, git-add](https://git-scm.com/docs/git-add)
