const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  if (!input) return;

  const data = JSON.parse(input);
  const userMsg = data.prompt || "";

  if (!userMsg) {
    console.log("{}");
    return;
  }

  let injectedContext = "";

  // 1. [ALWAYS ON] Core Rules
  // 기본적으로 항상 'Architect First' 모드로 동작하게 하여, 어떤 질문이든 구조적으로 분석하게 함.
  try {
    const coreRule = fs.readFileSync(".gemini/Manuals/Rule-Core.md", "utf-8");
    injectedContext += `\n\n--- [SYSTEM: CORE RULES] ---\n${coreRule}\n`;
  } catch (e) {}


  // 2. [CONDITIONAL] Context-Specific Manuals
  const keywordMap = [
    { keywords: ["탐구", "Question", "왜", "Why"], file: "Rule-Question.md", type: "Question" },
    { keywords: ["현상", "Phenomenon", "증상", "에러", "오류"], file: "Rule-Phenomenon.md", type: "Phenomenon" },
    { keywords: ["개념", "Concept", "정의", "도구", "용어"], file: "Rule-Concept.md", type: "Concept" },
    { keywords: ["본질", "Principle", "원리", "법칙"], file: "Rule-Principle.md", type: "Principle" },
    { keywords: ["사례", "Case", "경험", "로그"], file: "Rule-Case.md", type: "Case" },
    { keywords: ["판단", "Heuristic", "기준", "전략"], file: "Rule-Heuristic.md", type: "Heuristic" }
  ];

  for (const item of keywordMap) {
    if (item.keywords.some(k => userMsg.includes(k))) {
      try {
        const content = fs.readFileSync(`.gemini/Manuals/${item.file}`, "utf-8");
        injectedContext += `\n\n--- [AUTO-INJECTED MANUAL: ${item.type}] ---\n${content}\n`;
      } catch (e) {}
    }
  }


  // 3. [CONDITIONAL] Anki Rules
  const ankiKeywords = ["Anki", "앙키", "안키", "카드", "암기"];
  if (ankiKeywords.some(k => userMsg.includes(k))) {
    try {
      const ankiRule = fs.readFileSync(".gemini/Manuals/Rule-Anki.md", "utf-8");
      injectedContext += `\n\n--- [AUTO-INJECTED MANUAL: ANKI] ---\n${ankiRule}\n`;
    } catch (e) {}
  }

  // Final Output
  if (injectedContext) {
    console.log(JSON.stringify({
      hookSpecificOutput: {
        additionalContext: `[SYSTEM NOTICE] The following Manuals are AUTO-ACTIVATED for this turn.\n${injectedContext}\n\nIMPORTANT: You are the Knowledge Architect. Follow these rules strictly.`
      }
    }));
  } else {
    console.log("{}");
  }

} catch (e) {
  console.log("{}");
}
