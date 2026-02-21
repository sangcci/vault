const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  if (!input) return;

  const data = JSON.parse(input);
  
  // write_file 도구 호출 정보 확인
  // data 구조는 hook 시점에 따라 다를 수 있으나, 일반적으로 tool_calls 또는 유사 필드에 있음
  // AfterTool 훅에서는 tool_name과 tool_arguments를 직접 받을 수 있음
  
  // Gemini CLI AfterTool 훅의 입력 스키마에 따라 조정 필요
  // 여기서는 tool_name이 "write_file"인 경우만 필터링되었다고 가정 (config.json의 matcher)
  
  const args = data.tool_arguments;
  if (!args || !args.file_path) {
    console.log("{}");
    return;
  }

  const filePath = args.file_path;
  let validationMsg = "";

  // 1. Question 노트 검사
  if (filePath.includes("01-Question")) {
    if (!args.content.includes("## 핵심 질문")) {
      validationMsg += "- [Rule Violation] '## 핵심 질문' section is MISSING in Question note.
";
    }
  }

  // 2. Phenomenon 노트 검사
  if (filePath.includes("02-Phenomenon")) {
    if (!args.content.includes("## 관찰되는 증상")) {
      validationMsg += "- [Rule Violation] '## 관찰되는 증상' section is MISSING in Phenomenon note.
";
    }
  }

  // 3. Concept 노트 검사
  if (filePath.includes("03-Concept")) {
    if (!args.content.includes("tags: [개념")) {
      validationMsg += "- [Rule Violation] YAML 'tags: [개념...]' is MISSING.
";
    }
    if (!args.content.includes("## 한 문장 정의")) {
      validationMsg += "- [Rule Violation] '## 한 문장 정의' section is MISSING.
";
    }
  }

  // 4. Principle 노트 검사
  if (filePath.includes("04-Principle")) {
    if (!args.content.includes("**핵심 질문**:")) {
      validationMsg += "- [Rule Violation] '**핵심 질문**' field is MISSING in Principle note.
";
    }
  }

  // 위반 사항이 있으면 경고 메시지 출력
  if (validationMsg) {
    console.log(JSON.stringify({
      hookSpecificOutput: {
        additionalContext: `[SYSTEM WARNING: VALIDATION FAILED]
Your file writing attempt contains violations:
${validationMsg}

PLEASE FIX THESE ISSUES IMMEDIATELY in the next turn.`
      }
    }));
  } else {
    console.log("{}");
  }

} catch (e) {
  console.log("{}");
}
