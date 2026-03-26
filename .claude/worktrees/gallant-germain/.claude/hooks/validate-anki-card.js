#!/usr/bin/env node
// PreToolUse hook for Bash — matches curl calls to localhost:8765
// Reads /tmp/anki-card.json and validates before AnkiConnect addNote is executed.

const fs = require('fs');
const path = require('path');

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const command = (input.tool_input?.command || '');

  // Only run for AnkiConnect addNote calls
  if (!command.includes('localhost:8765') || !command.includes('addNote')) {
    process.exit(0);
  }

  // --- Read temp card file ---
  const cardPath = '/tmp/anki-card.json';
  if (!fs.existsSync(cardPath)) {
    console.log(
      '[ANKI BLOCKED] /tmp/anki-card.json not found.\n' +
      'Write card JSON to /tmp/anki-card.json before calling curl.'
    );
    process.exit(2);
  }

  const card = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
  const note = card?.params?.note;
  if (!note) {
    console.log('[ANKI BLOCKED] Invalid JSON structure. Expected: params.note');
    process.exit(2);
  }

  const fields = note.fields || {};
  const violations = [];

  // 1. Required fields
  for (const f of ['Question', 'Answer', 'Type', 'Category', 'Difficulty']) {
    if (!fields[f] || String(fields[f]).trim() === '') {
      violations.push(`[MISSING] '${f}' field is empty or missing.`);
    }
  }

  // 2. modelName
  if (note.modelName !== '🧑🏻‍💻 Interview v2') {
    violations.push(`[INVALID] modelName must be '🧑🏻‍💻 Interview v2', got '${note.modelName}'.`);
  }

  // 3. deckName
  const validDecks = ['💻::Keyword', '💻::Q&A'];
  if (!validDecks.includes(note.deckName)) {
    violations.push(`[INVALID] deckName must be one of: ${validDecks.join(' | ')}`);
  }

  // 4. Type
  const validTypes = ['Concept', 'Principle', 'Question', 'Phenomenon', 'Case', 'Heuristic'];
  if (fields.Type && !validTypes.includes(fields.Type)) {
    violations.push(`[INVALID] Type must be one of: ${validTypes.join(' | ')}`);
  }

  // 5. Difficulty
  if (fields.Difficulty && !['Low', 'Medium', 'High'].includes(fields.Difficulty)) {
    violations.push(`[INVALID] Difficulty must be: Low | Medium | High`);
  }

  // 6. Deck ↔ Type mapping
  const keywordTypes = ['Concept', 'Principle', 'Phenomenon'];
  const qaTypes = ['Question', 'Case', 'Heuristic'];
  if (note.deckName === '💻::Keyword' && fields.Type && !keywordTypes.includes(fields.Type)) {
    violations.push(`[MISMATCH] '💻::Keyword' requires Type: ${keywordTypes.join(' | ')}. Got '${fields.Type}'.`);
  }
  if (note.deckName === '💻::Q&A' && fields.Type && !qaTypes.includes(fields.Type)) {
    violations.push(`[MISMATCH] '💻::Q&A' requires Type: ${qaTypes.join(' | ')}. Got '${fields.Type}'.`);
  }

  // 7. Category: must be '본질-*' and match existing file
  const category = fields.Category || '';
  if (!category.startsWith('본질-')) {
    violations.push(
      `[INVALID] Category must be in format '본질-{노트명}'.\n` +
      `  Example: '본질-원자성 (Atomicity)'\n` +
      `  Got: '${category}'`
    );
  } else {
    const principleDir = path.join(process.cwd(), '04-Principle');
    const expectedFile = path.join(principleDir, `${category}.md`);

    if (!fs.existsSync(expectedFile)) {
      // Find similar 본질 notes by partial keyword match
      let candidates = [];
      try {
        const keyword = category.replace('본질-', '').toLowerCase().split(/[\s()]/)[0];
        candidates = fs.readdirSync(principleDir)
          .filter(f => f.endsWith('.md') && f.toLowerCase().includes(keyword))
          .map(f => `  • ${f.replace('.md', '')}`);
      } catch (_) {}

      let msg =
        `[NOT FOUND] '${category}.md' does not exist in 04-Principle/.\n` +
        `  → Create the 본질 note first, then retry card creation.`;
      if (candidates.length > 0) {
        msg += `\n  → Similar existing 본질 notes:\n${candidates.join('\n')}`;
      }
      violations.push(msg);
    }
  }

  // --- Block if any violations ---
  if (violations.length > 0) {
    console.log(`[ANKI CARD BLOCKED]\n\n${violations.map(v => `• ${v}`).join('\n\n')}`);
    process.exit(2);
  }

  // --- Non-blocking warnings ---
  const warnings = [];
  const answer = fields.Answer || '';
  if (answer.includes('입니다') || answer.includes('합니다')) {
    warnings.push(`[WARN] Answer contains '입니다/합니다'. Use speaking-oriented phrasing.`);
  }
  if (note.deckName === '💻::Keyword' && (fields.Question || '').includes('?')) {
    warnings.push(`[WARN] Keyword deck: Question should be a term name, not a question sentence.`);
  }
  if (note.deckName === '💻::Q&A' && !(fields.Question || '').includes('?')) {
    warnings.push(`[WARN] Q&A deck: Question should be an interview-style question ending with '?'.`);
  }

  if (warnings.length > 0) {
    console.log(`[ANKI WARNINGS]\n${warnings.map(w => `• ${w}`).join('\n')}`);
  }

  process.exit(0);
} catch (e) {
  process.exit(0);
}
