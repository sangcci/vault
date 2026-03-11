#!/usr/bin/env node
// PreToolUse hook for mcp__anki__create_note
// Reminds Claude to confirm with the user before creating Anki cards.
// Blocks the call and outputs a reminder — Claude must re-confirm user approval before retrying.

const fs = require('fs');

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));

  // Check if the note content signals user has already confirmed
  // Convention: Claude should pass a note field or the call context shows approval.
  // Since we cannot reliably detect this in the hook, we always remind and block.
  // Claude should call this tool only AFTER showing the card preview and getting "Yes".
  // If Claude is already past that step, it should include a special marker to skip this check.

  const args = input.tool_input || {};

  // Allow if Claude explicitly marks this as confirmed (fields.confirmed == "true")
  if (args.fields && args.fields['_confirmed'] === 'true') {
    process.exit(0);
  }

  console.log(
    `[ANKI SAFETY CHECK] Before calling 'create_note':\n` +
    `1. Did you show the card preview (question/answer/type/deck) to the user?\n` +
    `2. Did the user explicitly say "Yes" or "확인"?\n\n` +
    `If not, STOP and show the preview first. If already confirmed, proceed by retrying.`
  );
  process.exit(2);
} catch (e) {
  process.exit(0);
}
