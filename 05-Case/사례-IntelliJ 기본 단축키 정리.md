---
aliases: [IntelliJ Keymap, IntelliJ 단축키]
tags: [사례, IntelliJ, Keymap, IdeaVim]
difficulty: Low
type: Case
---
# Case: IntelliJ 기본 단축키 정리 (macOS)

## Situation
IdeaVim으로 에디터 내부 vim 키맵은 그대로 사용하되,
Project Structure, Tool Window 등 에디터 외부 영역은 IntelliJ 기본 단축키를 새로 익혀야 함.

---

## Tool Windows (패널 열기/닫기)

| 단축키 | 기능 |
|---|---|
| `⌘1` | Project (파일 트리) |
| `⌘2` | Bookmarks |
| `⌘3` | Find (검색 결과) |
| `⌘4` | Run |
| `⌘5` | Debug |
| `⌘6` | Problems |
| `⌘7` | Structure (현재 파일 구조) |
| `⌘8` | Services |
| `⌘9` | Git |
| `⌘0` | Commit |
| `⌥F12` | Terminal |
| `⇧⌘F12` | 모든 Tool Window 숨기기/복원 |
| `Esc` | 에디터로 포커스 복귀 (Tool Window에서) |

---

## Project Tool Window (파일 트리) 내부

| 단축키 | 기능 |
|---|---|
| `Enter` | 파일 열기 / 폴더 펼치기 |
| `Space` | 미리보기 (열지 않고) |
| `F2` | 이름 변경 |
| `⌘⌫` | 삭제 |
| `⌘C` / `⌘V` | 복사 / 붙여넣기 (파일) |
| `⌘D` | 파일 복제 |
| `⌥↑/↓` | 트리에서 이전/다음 항목 |
| `⌘↑` | 현재 파일 위치로 스크롤 (Scroll from Source) |
| `⌥F1` | 현재 파일을 여러 뷰에서 보기 (Select In) |

---

## Navigation (탐색)

| 단축키 | 기능 |
|---|---|
| `⇧⇧` | Search Everywhere |
| `⌘O` | 클래스로 이동 |
| `⌘⇧O` | 파일로 이동 |
| `⌘⌥O` | 심볼로 이동 |
| `⌘E` | Recent Files |
| `⌘⇧E` | Recent Locations |
| `⌘L` | 특정 라인으로 이동 |
| `⌘[` / `⌘]` | Back / Forward |
| `⌘⇧⌫` | 마지막 편집 위치로 |
| `⌥⌘←/→` | 탭 이동 |
| `F3` | Bookmark 토글 |
| `⌘F3` | Bookmark 목록 |

---

## Search (검색)

| 단축키 | 기능 |
|---|---|
| `⌘F` | 현재 파일 내 검색 |
| `⌘R` | 현재 파일 내 치환 |
| `⌘⇧F` | 전체 경로 검색 (Find in Files) |
| `⌘⇧R` | 전체 경로 치환 |
| `⌘G` / `⌘⇧G` | 다음/이전 검색 결과 |
| `⌥F7` | Find Usages |
| `⌘⇧F7` | 현재 파일 내 Usages 하이라이트 |

---

## Refactoring

| 단축키 | 기능 |
|---|---|
| `⌃T` | Refactor This (리팩토링 메뉴) |
| `⇧F6` | Rename |
| `⌘⌥M` | Extract Method |
| `⌘⌥V` | Extract Variable |
| `⌘⌥F` | Extract Field |
| `⌘⌥C` | Extract Constant |
| `⌘⌥P` | Extract Parameter |
| `F6` | Move |
| `⌘⌫` | Safe Delete |

---

## Run / Debug

| 단축키 | 기능 |
|---|---|
| `⌃R` | Run (마지막 설정) |
| `⌃D` | Debug (마지막 설정) |
| `⌃⌥R` | Run Configuration 선택 후 실행 |
| `⌘F8` | Breakpoint 토글 |
| `⌘⇧F8` | Breakpoint 목록 |
| `F8` | Step Over |
| `F7` | Step Into |
| `⇧F8` | Step Out |
| `⌥F9` | Run to Cursor |
| `⌘F2` | Stop |
| `⌥⌘R` | Resume |

---

## Git / VCS

| 단축키 | 기능 |
|---|---|
| `⌃V` | VCS Operations Popup (빠른 git 메뉴) |
| `⌘K` | Commit |
| `⌘⇧K` | Push |
| `⌘T` | Update Project (pull) |
| `⌘⌥Z` | Rollback (현재 파일 변경 취소) |
| `⌘D` | Diff (변경사항 비교) |
| `⌃⇧↑/↓` | 이전/다음 변경 hunk로 이동 |

---

## Editor Tabs

| 단축키 | 기능 |
|---|---|
| `⌘W` | 탭 닫기 |
| `⌘⇧W` | 모든 탭 닫기 |
| `⌘⇧[` / `⌘⇧]` | 이전/다음 탭 |
| `⌘⇧,` | Split 세로 |
| `⌘⇧'` | Split 가로 |

---

## 우선순위 — 먼저 익힐 것

| 단축키 | 기능 |
|---|---|
| `⇧⇧` | 뭐든 찾을 때 |
| `⌘E` | 최근 파일 |
| `⌃V` | git 빠른 메뉴 |
| `⌃T` | 리팩토링 메뉴 |
| `⌘1` | 파일 트리 열기/닫기 |
| `Esc` | 에디터로 복귀 |

---

## 참고
- `.ideavimrc`의 `<leader>` 맵핑으로 상당수 커버됨
- Tool Window 토글(`⌘1~9`)과 `Esc` 에디터 복귀 패턴을 먼저 익힐 것
- 창 이동: `Goto Next/Previous Splitter`는 IntelliJ Keymap에서 `Alt+L/H`로 직접 등록
