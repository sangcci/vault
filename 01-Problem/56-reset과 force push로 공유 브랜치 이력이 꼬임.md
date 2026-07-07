---
aliases: [Git Reset Force Push Incident, Shared Branch History Rewrite]
tags: [문제, 작성중, Git, Collaboration]
difficulty: Medium
type: Problem
---

# Problem: 56-reset과 force push로 공유 브랜치 이력이 꼬임

## 상황

로컬 커밋을 정리하려고 `git reset --hard`를 한 뒤 공유 브랜치에 force push했다. 이후 팀원의 로컬 브랜치와 원격 히스토리가 갈라지고, 일부 변경이 사라진 것처럼 보인다.

```text
origin/main: A - B - C
local main : A - B - D
force push
origin/main: A - B - D  ← C가 공유 이력에서 사라짐
```

---

## 관찰된 증거

- 팀원이 pull할 때 non-fast-forward 오류를 만난다.
- PR diff가 예상보다 커진다.
- staging area와 working directory 중 어디가 바뀌었는지 모르고 reset을 실행한다.
- 긴급 수정 중 stash/pop 충돌로 작업 맥락이 섞인다.

---

## 원인

Git은 working directory, staging area, commit history를 분리해서 다룬다. `reset`은 옵션에 따라 이 세 영역 중 어디까지 되돌릴지 결정한다. 로컬 정리에는 유용하지만, 이미 공유된 commit history를 다시 쓰면 협업자의 기준점이 깨진다.

---

## 해결 방향

- 공유 브랜치에서는 reset + force push 대신 revert를 우선 고려한다.
- reset 전에는 `git status`, `git log --oneline --graph`, `git reflog`를 확인한다.
- `--hard`는 working directory 변경까지 버린다는 점을 확인한다.
- 긴급 hotfix는 stash보다 `git worktree`로 작업 공간을 분리한다.
- force push가 필요하면 `--force-with-lease`와 팀 공지를 함께 사용한다.

---

## 연결되는 본질

- [[본질-Git 상태 영역과 이력 재작성 경계]]
- [[본질-작업 공간 격리와 컨텍스트 전환 비용]]

---

## 참고

> "The git status command displays the state of the working directory and the staging area." — [Git Documentation: git-status](https://git-scm.com/docs/git-status)

> "The git add command adds a change in the working directory to the staging area." — [Git Documentation: git-add](https://git-scm.com/docs/git-add)
