---
aliases: [Git Worktree, worktree, 작업트리]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 하나의 Git 저장소에서 여러 작업 디렉토리를 동시에 체크아웃하여 각각 다른 브랜치에서 독립적으로 작업할 수 있게 하는 기능.
> (이해용) 같은 저장소를 여러 개의 작업 공간으로 분리해 동시에 열어두는 것. stash 없이 브랜치를 갈아탄다.

---

## 해결하는 문제

- 현재 작업 중인 브랜치를 stash하지 않고 긴급 hotfix를 별도 공간에서 처리할 때.
- 여러 브랜치의 코드를 동시에 참조하거나 비교해야 할 때.

---

## 치르는 비용

- 디스크 공간을 추가로 사용함.
- worktree마다 별도의 IDE 창이 필요해 관리 복잡도 증가.

---

## 동작 원리

```text
기존 방식 (hotfix 발생 시):
  feature 작업 중 → stash → checkout hotfix → 작업 → cherry-pick → 복구
  ↳ stash/pop 과정에서 충돌 위험, 컨텍스트 스위칭 비용 발생

git worktree 방식:
  .git/ (원본 저장소)
    ├── /project          (현재 브랜치: feature/login)
    └── /project-hotfix   (새 worktree: hotfix/payment-bug)

  git worktree add ../project-hotfix hotfix/payment-bug
  → stash 없이 두 브랜치를 동시에 독립 작업 가능

  작업 완료 후:
  git worktree remove ../project-hotfix
```

---

## 관련 본질

- [[본질-격리성 (Isolation)]]
- [[본질-환경 격리 (Environment Isolation)]]
