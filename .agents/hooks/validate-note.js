#!/usr/bin/env node
// Legacy PreToolUse hook for Write tool.
// The active validator is .pi/extensions/knowledge-architect/note-guard.ts.
// This file is kept only for older agents that still read .agents/hooks.

const fs = require('fs');
const path = require('path');

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const args = input.tool_input || {};
  const filePath = args.file_path || args.path;
  const content = args.content || '';

  if (!filePath || !filePath.endsWith('.md')) process.exit(0);

  const normalized = filePath.split(path.sep).join('/');
  const isVaultNote = /(\/|^)(01-Problem|02-Principle|03-Question)\//.test(normalized);
  if (!isVaultNote) process.exit(0);

  const violations = [];

  if (!content.startsWith('---')) {
    violations.push('- [YAML] YAML frontmatter is required at the top of the file.');
  }

  function requireSection(section, label) {
    if (!content.includes(section)) violations.push(`- [Section] '${label || section}' is required.`);
  }

  if (normalized.includes('/01-Problem/')) {
    requireSection('## 상황');
    requireSection('## 관찰된 증거');
    requireSection('## 원인');
    requireSection('## 해결 방향');
    requireSection('## 연결되는 본질');
    requireSection('## 참고');
  }

  if (normalized.includes('/02-Principle/')) {
    requireSection('**핵심 질문**:');
    requireSection('## 한 문장 정의');
    requireSection('## 판단 기준');
    requireSection('## 대표 문제');
    requireSection('## 참고');
  }

  if (normalized.includes('/03-Question/')) {
    requireSection('## 핵심 질문');
    requireSection('## 파생 노트');
  }

  if (violations.length > 0) {
    console.log(`[VALIDATION FAILED] Note does not comply with current 3-layer vault rules:\n${violations.join('\n')}`);
    process.exit(2);
  }

  process.exit(0);
} catch (_) {
  process.exit(0);
}
