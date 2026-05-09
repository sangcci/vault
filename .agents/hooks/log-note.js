#!/usr/bin/env node
// PostToolUse hook for Write|Edit tools
// Appends a log stub to LOG.md when a knowledge note is created or updated.
// The active agent must then complete the stub by filling in the summary after '·'.

const fs = require('fs');
const path = require('path');

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const toolName = input.tool_name || '';
  const args = input.tool_input;

  if (!args || !args.file_path) process.exit(0);

  const filePath = args.file_path;
  const isVaultNote = /\/(01-Question|02-Phenomenon|03-Concept|04-Principle|05-Case|06-Heuristic)\//.test(filePath);
  if (!isVaultNote) process.exit(0);

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const filename = path.basename(filePath, '.md');
  const action = toolName === 'Write' ? 'CREATE' : 'UPDATE';

  const logFile = path.resolve(__dirname, '../../00-Meta/LOG.md');
  const entry = `${timestamp} [${action}] [[${filename}]] ·\n`;

  fs.appendFileSync(logFile, entry);
  process.exit(0);
} catch (e) {
  process.exit(0);
}
