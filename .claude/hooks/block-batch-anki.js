#!/usr/bin/env node
// PreToolUse hook for mcp__anki__batch_create_notes
// batch_create_notes fails with custom note types (Rule-Anki.md §4). Always block.

console.log(
  `[BLOCKED] 'batch_create_notes' is prohibited by Rule-Anki.md §4.\n` +
  `Custom note type '🧑🏻‍💻 Interview v2' is incompatible with batch creation.\n` +
  `Use 'create_note' iteratively instead (one call per card).`
);
process.exit(2);
