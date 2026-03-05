const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  if (!input) return;

  const data = JSON.parse(input);
  
  // write_file 도구 호출 정보 확인
  // AfterTool 훅에서는 tool_name과 tool_input를 직접 받을 수 있음
  
  const args = data.tool_input;
  if (!args || !args.file_path) {
    console.log("{}");
    return;
  }

  const filePath = args.file_path;
  let validationMsg = "";

  // 1. Question 노트 검사
  if (filePath.includes("01-Question")) {
    if (!args.content.includes("## 핵심 질문")) {
      validationMsg += "- [Rule Violation] '## 핵심 질문' section is MISSING in Question note.\n";
    }
  }

  // 2. Phenomenon 노트 검사
  if (filePath.includes("02-Phenomenon")) {
    if (!args.content.includes("## 관찰되는 증상")) {
      validationMsg += "- [Rule Violation] '## 관찰되는 증상' section is MISSING in Phenomenon note.\n";
    }
  }

  // 3. Concept 노트 검사
  if (filePath.includes("03-Concept")) {
    if (!args.content.includes("tags: [개념")) {
      validationMsg += "- [Rule Violation] YAML 'tags: [개념...]' is MISSING.\n";
    }
    if (!args.content.includes("## 한 문장 정의")) {
      validationMsg += "- [Rule Violation] '## 한 문장 정의' section is MISSING.\n";
    }
  }

  // 4. Principle 노트 검사
  if (filePath.includes("04-Principle")) {
    if (!args.content.includes("**핵심 질문**:")) {
      validationMsg += "- [Rule Violation] '**핵심 질문**' field is MISSING in Principle note.\n";
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
