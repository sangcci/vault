#!/usr/bin/env node
// PreToolUse hook for Write tool
// Validates knowledge notes before writing. Exits 2 to block on violation.

const fs = require('fs');

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const args = input.tool_input;

  if (!args || !args.file_path) process.exit(0);

  const filePath = args.file_path;
  const content = args.content || '';
  const violations = [];

  // Only validate markdown files inside the vault directories
  const isVaultNote = /\/(01-Question|02-Phenomenon|03-Concept|04-Principle|05-Case|06-Heuristic)\//.test(filePath);
  if (!isVaultNote) process.exit(0);

  // Common: YAML frontmatter must exist
  if (!content.startsWith('---')) {
    violations.push("- [Rule] YAML frontmatter (---) is MISSING at the top of the file.");
  }

  // Per-type validation
  if (filePath.includes('01-Question')) {
    if (!content.includes('## 핵심 질문')) {
      violations.push("- [Rule] '## 핵심 질문' section is MISSING in Question note.");
    }
  }

  if (filePath.includes('02-Phenomenon')) {
    if (!content.includes('## 관찰되는 증상')) {
      violations.push("- [Rule] '## 관찰되는 증상' section is MISSING in Phenomenon note.");
    }
  }

  if (filePath.includes('03-Concept')) {
    if (!content.includes('tags: [개념')) {
      violations.push("- [Rule] YAML 'tags: [개념...]' is MISSING in Concept note.");
    }
    if (!content.includes('## 한 문장 정의')) {
      violations.push("- [Rule] '## 한 문장 정의' section is MISSING in Concept note.");
    }
  }

  if (filePath.includes('04-Principle')) {
    if (!content.includes('**핵심 질문**:')) {
      violations.push("- [Rule] '**핵심 질문**:' field is MISSING in Principle note.");
    }
  }

  if (filePath.includes('05-Case')) {
    if (!content.includes('## 상황')) {
      violations.push("- [Rule] '## 상황' section is MISSING in Case note.");
    }
    if (!content.includes('## 근본 원인')) {
      violations.push("- [Rule] '## 근본 원인' section is MISSING in Case note.");
    }
  }

  if (filePath.includes('06-Heuristic')) {
    if (!content.includes('## 판단 기준')) {
      violations.push("- [Rule] '## 판단 기준' section is MISSING in Heuristic note.");
    }
    if (!content.includes('## 효과적인 상황')) {
      violations.push("- [Rule] '## 효과적인 상황' section is MISSING in Heuristic note.");
    }
  }

  if (violations.length > 0) {
    console.log(
      `[VALIDATION FAILED] Note does not comply with CLAUDE.md rules:\n${violations.join('\n')}\n\nFix these issues before writing the file.`
    );
    process.exit(2);
  }

  process.exit(0);
} catch (e) {
  process.exit(0);
}
