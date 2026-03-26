const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  if (!input) return;

  const data = JSON.parse(input);
  
  // BeforeTool 훅에서는 matcher에 의해 create_note 또는 batch_create_notes일 때만 실행됨
  
  console.log(JSON.stringify({
    hookSpecificOutput: {
      additionalContext: `[SYSTEM REMINDER]
Did you ask for user confirmation BEFORE calling '${data.tool_name}'?
If not, STOP NOW and ask for permission strictly following 'Rule-Anki.md'.`
    }
  }));

} catch (e) {
  console.log("{}");
}
