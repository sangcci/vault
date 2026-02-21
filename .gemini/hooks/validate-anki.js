const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  if (!input) return;

  const data = JSON.parse(input);
  const modelResponse = data.model_response; // AfterModel 훅의 입력 데이터

  if (!modelResponse) {
    console.log("{}");
    return;
  }

  // Anki 카드 생성 시도 감지
  if (modelResponse.includes("create_note") || modelResponse.includes("batch_create_notes")) {
    // 사용자 컨펌 확인 로직은 사실 모델의 "생각" 단계에서 잡기 어려움.
    // 대신, 모델이 "카드를 생성했습니다"라고 말하기 전에 "컨펌을 받았는지" 스스로 체크하게 유도.
    
    // 여기서는 간단하게 경고만 날림. 실제 컨펌은 대화 흐름에서 이루어져야 함.
    console.log(JSON.stringify({
      hookSpecificOutput: {
        additionalContext: `[SYSTEM REMINDER]
Did you ask for user confirmation BEFORE calling 'create_note'?
If not, STOP NOW and ask for permission strictly following 'Rule-Anki.md'.`
      }
    }));
  } else {
    console.log("{}");
  }

} catch (e) {
  console.log("{}");
}
