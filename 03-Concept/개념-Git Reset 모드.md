---
aliases: [Git Reset, git reset --soft, git reset --mixed, git reset --hard]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) 현재 브랜치의 HEAD를 지정한 커밋으로 되돌리며, staging area와 working directory의 상태를 옵션에 따라 다르게 처리하는 Git 명령어.
> (이해용) 커밋을 "얼마나 깊이 되돌릴지"를 3단계로 조절하는 되감기 버튼.

## 해결하는 문제

- 잘못된 커밋을 로컬에서 수정하거나 여러 커밋을 하나로 합칠 때.
- staging area나 working directory를 이전 상태로 복구할 때.

## 치르는 비용

- `--hard`: working directory 변경사항이 영구 삭제됨 (GC 전에는 reflog로 복구 가능).
- push 이후 reset + force push는 공유 브랜치에서 협업자의 히스토리를 파괴함.

## 동작 원리

```text
커밋 히스토리:   A → B → C (HEAD)
reset 대상:      B

옵션별 결과:
┌──────────┬────────────┬──────────────────┬──────────────────┐
│ 옵션      │ HEAD       │ Staging Area     │ Working Dir      │
├──────────┼────────────┼──────────────────┼──────────────────┤
│ --soft   │ B로 이동   │ C의 변경사항 유지  │ 파일 그대로 유지  │
│ --mixed  │ B로 이동   │ index 포인터 삭제  │ 파일 그대로 유지  │
│ --hard   │ B로 이동   │ index 포인터 삭제  │ B 스냅샷으로 복구 │
└──────────┴────────────┴──────────────────┴──────────────────┘

--mixed: index의 포인터만 삭제. 실제 blob은 GC가 정리.
--hard:  blob을 이전 커밋 버전으로 복원. 영구적.
```

## 관련 본질

- [[본질-영속성 (Persistence)]]
- [[본질-코드와 상태의 비대칭성 (Code-State Asymmetry)]]
