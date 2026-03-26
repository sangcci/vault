# VS Code x Neovim x AI(Antigravity) 키맵 최적화 (Obsidian)

본 문서는 VS Code 환경에서 Neovim의 모달 편집과 AI 도구(Antigravity)를 충돌 없이 사용하기 위한 최종 키맵 전략을 기록합니다.

## 01-Question (탐구)
**어떻게 하면 Neovim의 편집 효율, VS Code의 IDE 기능, 그리고 AI 에이전트의 워크플로우를 하나의 통합된 키맵으로 공존시킬 수 있는가?**

## 02-Concept (개념)
- **VS Code Integration**: `vim.g.vscode`를 통한 환경 감지 및 조건부 키 매핑.
- **Leader Sequence**: `Space`를 접두사로 사용하여 복잡한 IDE 명령을 트리거.
- **Alt-Navigation**: 모드와 상관없이 일관된 창(Editor Group) 이동 방식.

## 03-Principle (본질)
**익숙함의 보존과 도구의 조화**: 기존에 손에 익은 Neovim 단축키(`leader`, `gd` 등)와 WezTerm 방식(`Alt+hjkl`)을 VS Code 내부 명령에 연결하여 학습 비용을 최소화함.

## 04-Case (사례)

### 1. 주요 기능 매핑 목록
| 기능 분류 | 단축키 | 대응되는 VS Code 명령 | 비고 |
| :--- | :--- | :--- | :--- |
| **Explorer** | `<leader>ee` | `workbench.view.explorer.focus` | Oil 대체 |
| **Window** | `<leader>wv`, `<leader>wh` | `workbench.action.splitEditorRight/Down` | 창 분할 |
| **Navigation** | `Alt + h, j, k, l` | `workbench.action.focusLeftGroup/Down/Up/Right` | 창 이동 |
| **LSP** | `gd`, `gr`, `gi`, `gt` | `revealDefinition`, `goToReferences` 등 | 심볼 이동 |
| **Diagnostic** | `gl` / `gL` | `editor.action.showHover` / `marker.next` | 에러 확인 |
| **IntelliJ-like** | `<leader>lv` | `editor.action.extractVariable` | 변수 추출 |
| **Testing** | `<leader>tn`, `<leader>tf` | `testing.runAtCursor`, `testing.runCurrentFile` | 테스트 실행 |

### 2. AI(Antigravity) 보호 설정 (`settings.json`)
```json
"extensions.neovim.handleKeys": {
    "<D-l>": false, // AI Chat
    "<D-i>": false, // AI Inline
    "<D-k>": false  // AI Edit
}
```

## 05-Heuristic (판단 기준)
- **Native VS Code UI**가 더 뛰어난 경우(Explorer, Global Search)는 Neovim 플러그인 대신 VS Code 명령을 우선 매핑한다.
- **모달 편집**이 유리한 경우(텍스트 조작, 로컬 이동)는 Neovim의 순수 기능을 유지한다.
- **창 관리**는 모드(Insert/Normal)에 구애받지 않도록 `Alt` 조합을 선호한다.
