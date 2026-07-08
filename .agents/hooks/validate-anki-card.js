#!/usr/bin/env node
// Legacy PreToolUse hook for Bash calls to AnkiConnect addNote.
// The preferred workflow is explicit user approval, then AnkiConnect.
// This hook supports the current Problem Solving model and legacy Keyword model.

const fs = require('fs');

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const command = input.tool_input?.command || '';

  if (!command.includes('localhost:8765') || !command.includes('addNote')) process.exit(0);

  const cardPath = '/tmp/anki-card.json';
  if (!fs.existsSync(cardPath)) {
    console.log('[ANKI BLOCKED] /tmp/anki-card.json not found. Write card JSON before calling AnkiConnect.');
    process.exit(2);
  }

  const card = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
  const note = card?.params?.note;
  if (!note) {
    console.log('[ANKI BLOCKED] Invalid JSON structure. Expected params.note.');
    process.exit(2);
  }

  const fields = note.fields || {};
  const violations = [];

  function requireFields(names) {
    for (const name of names) {
      if (!fields[name] || String(fields[name]).trim() === '') {
        violations.push(`[MISSING] '${name}' field is empty or missing.`);
      }
    }
  }

  if (note.deckName === '💻::Problem Solving' || note.modelName === '🧑🏻‍💻 Problem Solving v1') {
    if (note.deckName !== '💻::Problem Solving') {
      violations.push(`[INVALID] Problem cards must use deck '💻::Problem Solving'. Got '${note.deckName}'.`);
    }
    if (note.modelName !== '🧑🏻‍💻 Problem Solving v1') {
      violations.push(`[INVALID] Problem cards must use model '🧑🏻‍💻 Problem Solving v1'. Got '${note.modelName}'.`);
    }
    requireFields(['Question', 'Answer', 'CardType', 'Problem', 'Principles']);
    if (fields.CardType && !['Scenario', 'Code Review', 'Implementation'].includes(fields.CardType)) {
      violations.push("[INVALID] CardType must be 'Scenario', 'Code Review', or 'Implementation'.");
    }
  } else if (note.deckName === '💻::Keyword' || note.modelName === '🧑🏻‍💻 Interview v2') {
    if (note.deckName !== '💻::Keyword') {
      violations.push(`[INVALID] Keyword cards must use deck '💻::Keyword'. Got '${note.deckName}'.`);
    }
    if (note.modelName !== '🧑🏻‍💻 Interview v2') {
      violations.push(`[INVALID] Keyword cards must use model '🧑🏻‍💻 Interview v2'. Got '${note.modelName}'.`);
    }
    requireFields(['Question', 'Answer', 'Type', 'Category', 'Difficulty', 'Code']);
    if (fields.Type && !['Concept', 'Principle', 'Phenomenon', 'Evidence'].includes(fields.Type)) {
      violations.push("[INVALID] Keyword Type must be Concept, Principle, Phenomenon, or Evidence.");
    }
  } else {
    violations.push(`[INVALID] Unsupported Anki target deck/model: ${note.deckName} / ${note.modelName}`);
  }

  if (violations.length > 0) {
    console.log(`[ANKI CARD BLOCKED]\n\n${violations.map(v => `• ${v}`).join('\n')}`);
    process.exit(2);
  }

  process.exit(0);
} catch (_) {
  process.exit(0);
}
