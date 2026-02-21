# Generalized Keymap Reference

> Leader key: `Space`
> 이 문서는 Neovim 설정을 기반으로 작성된 범용 키맵 레퍼런스입니다.
> IntelliJ IDEA, Obsidian, Brave Browser 등 다른 앱에서 동일한 키보드 매핑을 구현할 때 참고하세요.

---

## 표기 규칙

| 표기 | 의미 |
|------|------|
| `<leader>` | Space |
| `<C-x>` | Ctrl + x |
| `<M-x>` | Alt + x |
| `[n]` | Normal mode |
| `[v]` | Visual / Selection mode |
| `[i]` | Insert / Editing mode |
| `[t]` | Terminal mode |

---

## 1. General / UI

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<Esc>` | `[n]` | Clear search highlights | 검색 하이라이트 제거 |
| `Q` | `[n]` | (disabled) | 매크로 실행 비활성화 |

---

## 2. Pane / Split Management

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<leader>wv` | `[n]` | Split pane vertically | 세로 분할 |
| `<leader>wh` | `[n]` | Split pane horizontally | 가로 분할 |
| `<M-h>` | `[n][t]` | Focus pane left | 왼쪽 창으로 포커스 이동 |
| `<M-j>` | `[n][t]` | Focus pane down | 아래 창으로 포커스 이동 |
| `<M-k>` | `[n][t]` | Focus pane up | 위 창으로 포커스 이동 |
| `<M-l>` | `[n][t]` | Focus pane right | 오른쪽 창으로 포커스 이동 |

---

## 3. Cursor & Scroll

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<C-d>` | `[n]` | Scroll down half page | 반 페이지 아래 스크롤 |
| `<C-u>` | `[n]` | Scroll up half page | 반 페이지 위 스크롤 |
| `n` | `[n]` | Next search match (centered) | 다음 검색 결과 (화면 중앙 정렬) |
| `N` | `[n]` | Prev search match (centered) | 이전 검색 결과 (화면 중앙 정렬) |

---

## 4. Editing

| Key         | Mode     | Action                           | Description                 |
| ----------- | -------- | -------------------------------- | --------------------------- |
| `<`         | `[v]`    | Decrease indent (keep selection) | 들여쓰기 감소 (선택 유지)             |
| `>`         | `[v]`    | Increase indent (keep selection) | 들여쓰기 증가 (선택 유지)             |
| `J`         | `[v]`    | Move selected lines down         | 선택 영역 한 줄 아래로 이동            |
| `K`         | `[v]`    | Move selected lines up           | 선택 영역 한 줄 위로 이동             |
| `J`         | `[n]`    | Join lines (preserve cursor)     | 줄 합치기 (커서 위치 보존)            |
| `oo`        | `[n]`    | Add blank line below             | 아래에 빈 줄 추가 (normal 유지)      |
| `OO`        | `[n]`    | Add blank line above             | 위에 빈 줄 추가 (normal 유지)       |
| `<C-Enter>` | `[n][i]` | Insert new line below            | 아래에 새 줄 삽입                  |
| `<Enter>`   | `[n]`    | Break line at cursor             | 커서 위치에서 줄바꿈 후 normal        |
| `Y`         | `[n]`    | Copy to end of line              | 커서부터 줄 끝까지 복사               |
| `<leader>p` | `[n][v]` | Paste from primary clipboard     | 복사 전용 클립보드에서 붙여넣기 (덮어쓰기 방지) |
| `<leader>s` | `[n]`    | Find and replace word at cursor  | 커서 단어 전체 치환 (확인 포함)         |

---

## 5. File Explorer (Sidebar)

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<leader>ee` | `[n]` | Open file explorer | 파일 탐색기 열기 |
| `<leader>eh` | `[n]` | Toggle hidden files | 숨김 파일 표시 토글 |

---

## 6. Quick Search (Fuzzy Finder)

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<leader>ff` | `[n]` | Find file by name | 파일 이름 검색 (빌드 디렉터리 제외) |
| `<leader>fa` | `[n]` | Find file by name (all) | 전체 파일 이름 검색 |
| `<leader>fg` | `[n]` | Find text in project | 프로젝트 전체 텍스트 검색 |
| `<leader>fb` | `[n]` | Find open file (tab/buffer) | 현재 열린 파일 목록 검색 |
| `<leader>fh` | `[n]` | Find in documentation | 도움말 검색 |
| `<leader>ft` | `[n]` | Find TODO comment (all) | TODO 주석 전체 검색 |
| `<leader>fT` | `[n]` | Find TODO / FIX comment | TODO/FIX 주석만 검색 |
| `<leader>f.` | `[n]` | Find symbol in current file | 현재 파일의 심볼 검색 |
| `<leader>fw` | `[n]` | Find symbol in project | 프로젝트 전체 심볼 검색 |
| `<C-n>` | `[i]` (search panel) | Next result | 검색 결과 다음 항목 |
| `<C-p>` | `[i]` (search panel) | Prev result | 검색 결과 이전 항목 |

---

## 7. Pinned File Navigation (Quick Jump)

> 자주 쓰는 파일을 최대 4개까지 고정해두고 즉시 이동하는 기능입니다.
> 앱에 따라 "Bookmarks", "Favorites", "Pinned Tabs", "Quick Access" 등으로 불립니다.

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<leader>h` | `[n]` | Open pinned file list | 고정 파일 목록 열기 |
| `<leader>a` | `[n]` | Pin current file | 현재 파일 고정 추가 |
| `<leader>1` | `[n]` | Jump to pinned file 1 | 고정 파일 1번으로 이동 |
| `<leader>2` | `[n]` | Jump to pinned file 2 | 고정 파일 2번으로 이동 |
| `<leader>3` | `[n]` | Jump to pinned file 3 | 고정 파일 3번으로 이동 |
| `<leader>4` | `[n]` | Jump to pinned file 4 | 고정 파일 4번으로 이동 |
| `<leader>P` | `[n]` | Jump to previous pinned file | 이전 고정 파일로 이동 |
| `<leader>N` | `[n]` | Jump to next pinned file | 다음 고정 파일로 이동 |

---

## 8. Code Intelligence (Go to...)

> IDE의 "Go to Definition", "Find Usages" 등과 동일한 기능입니다.

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `gd` | `[n]` | Go to definition | 정의로 이동 |
| `gr` | `[n]` | Find all references | 참조 목록 보기 |
| `gi` | `[n]` | Go to implementation | 구현으로 이동 |
| `gt` | `[n]` | Go to type definition | 타입 정의로 이동 |
| `gl` | `[n]` | Show all diagnostics | 진단(오류/경고) 목록 보기 |
| `gL` | `[n]` | Show inline diagnostic | 현재 줄 진단 팝업 열기 |
| `<leader>r` | `[n]` | Format file | 파일 포맷팅 |

---

## 9. Code Actions / Refactoring

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<leader>ci` | `[n]` | Organize imports | import 정리 (Java) |
| `<leader>cr` | `[n]` | Extract to variable | 변수 추출 리팩터링 (Java) |

---

## 10. Version Control (Git)

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<leader>go` | `[n]` | Open diff view | 변경 사항 diff 뷰 열기 |
| `<leader>gc` | `[n]` | Close diff view | diff 뷰 닫기 |
| `<leader>gh` | `[n]` | Show project commit history | 프로젝트 전체 커밋 히스토리 |
| `<leader>gf` | `[n]` | Show current file history | 현재 파일 커밋 히스토리 |
| `<C-n>` | (diff panel) | Next changed file | 다음 변경 파일로 이동 |
| `<C-p>` | (diff panel) | Prev changed file | 이전 변경 파일로 이동 |

---

## 11. Debugger

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<leader>ds` | `[n]` | Start / Resume debugging | 디버그 시작 / 계속 실행 |
| `<leader>db` | `[n]` | Toggle breakpoint | 브레이크포인트 토글 |
| `<leader>dc` | `[n]` | Run to cursor | 커서 위치까지 실행 |
| `<leader>dd` | `[n]` | Step over | 다음 줄 실행 (함수 건너뜀) |
| `<leader>di` | `[n]` | Step into | 함수 내부로 진입 |
| `<leader>do` | `[n]` | Step out | 현재 함수에서 나오기 |
| `<leader>dr` | `[n]` | Restart debugger | 디버그 재시작 |
| `<leader>dp` | `[n]` | Pause execution | 실행 일시 정지 |
| `<leader>dt` | `[n]` | Stop debugger | 디버그 종료 |

---

## 12. Test Runner

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<leader>tn` | `[n]` | Run nearest test | 커서 근처 테스트 실행 |
| `<leader>tf` | `[n]` | Run tests in current file | 현재 파일 테스트 실행 |
| `<leader>tA` | `[n]` | Run all tests in project | 프로젝트 전체 테스트 실행 |
| `<leader>tS` | `[n]` | Run test suite | 테스트 스위트 실행 |
| `<leader>tl` | `[n]` | Re-run last test | 마지막 테스트 재실행 |
| `<leader>ta` | `[n]` | Attach to running test | 실행 중인 테스트 프로세스에 연결 |
| `<leader>ts` | `[n]` | Toggle test summary panel | 테스트 요약 패널 토글 |
| `<leader>to` | `[n]` | Open test output | 테스트 출력 보기 |
| `<leader>tO` | `[n]` | Toggle test output panel | 테스트 출력 패널 토글 |
| `<leader>tt` | `[n]` | Stop running test | 테스트 중단 |
| `<leader>td` | `[n]` | Debug nearest test | 근처 테스트 디버그 실행 |
| `<leader>tD` | `[n]` | Debug tests in current file | 현재 파일 테스트 디버그 실행 |

---

## 13. Annotation Navigation (TODO / Error markers)

> 코드 내 `TODO`, `FIXME`, `ERROR`, `WARNING` 등 주석 태그 간 이동입니다.
> 앱에 따라 "Bookmarks", "Annotations", "Tags" 등으로 불립니다.

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `]t` | `[n]` | Jump to next TODO | 다음 TODO 주석으로 이동 |
| `[t` | `[n]` | Jump to prev TODO | 이전 TODO 주석으로 이동 |
| `]e` | `[n]` | Jump to next ERROR / WARNING | 다음 ERROR/WARNING 주석으로 이동 |
| `[e` | `[n]` | Jump to prev ERROR / WARNING | 이전 ERROR/WARNING 주석으로 이동 |

---

## 14. History

| Key | Mode | Action | Description |
|-----|------|--------|-------------|
| `<leader>u` | `[n]` | Toggle undo history tree | 편집 히스토리 트리 보기 / 닫기 |

---

## Leader Key Group Summary

| Prefix | Category | Description |
|--------|----------|-------------|
| `<leader>w` | Pane / Window | 창 분할 및 이동 |
| `<leader>f` | Find / Search | 파일·텍스트·심볼 검색 |
| `<leader>e` | Explorer | 파일 탐색기 |
| `<leader>g` | Git / VCS | 버전 관리 (diff, 히스토리) |
| `<leader>d` | Debugger | 디버거 제어 |
| `<leader>t` | Test | 테스트 실행 및 탐색 |
| `<leader>c` | Code Actions | 코드 액션 및 리팩터링 |
| `<leader>j` | Language-specific (Java) | Java 전용 기능 |
| `<leader>h/a/1-4/P/N` | Pinned Files | 파일 고정 북마크 및 빠른 이동 |
| `<leader>r` | Format | 코드 포맷팅 |
| `<leader>s` | Find & Replace | 단어 치환 |
| `<leader>p` | Paste (safe) | 클립보드 안전 붙여넣기 |
| `<leader>u` | History | 편집 히스토리 |
| `g*` | Go to... | 코드 탐색 (정의, 참조, 구현 등) |
| `[x` / `]x` | Jump between markers | TODO·에러 등 마커 간 이동 |
| `<M-hjkl>` | Pane focus | 창 포커스 이동 |
