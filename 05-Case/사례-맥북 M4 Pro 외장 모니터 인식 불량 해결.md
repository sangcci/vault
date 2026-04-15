---
aliases: [MacBook External Display Issue, DR1602 Connection]
tags: [사례, MacOS, Hardware, Troubleshooting]
difficulty: Low
type: Case
---
# Case: 맥북 M4 Pro 외장 모니터(DR1602) 인식 불량 해결

## Situation
맥북 M4 Pro와 가성비 휴대용 모니터(DR1602) 연결 시, 전원은 공급되나 화면 신호가 출력되지 않거나 '신호 없음' 메시지가 뜨는 상황. 특히 One Key HiDPI 스크립트나 BetterDisplay 설정 도구 사용 중 설정 충돌이 의심됨.

## What Actually Happened
단계별 설정을 통해 디스플레이 캐시를 초기화하고 소프트웨어 충돌을 제거하여 정상 인식을 확인함.

### 1단계: macOS 디스플레이 캐시 강제 삭제
맥북이 기억하고 있는 잘못된 모니터 설정값을 초기화.
1. 다음 두 경로로 각각 이동하여 관련 파일을 삭제:
   - **/시스템 전체 설정**: `/Library/Preferences/` 이동 후 `com.apple.windowserver.displays.plist` 삭제.
   - **/사용자별 설정**: `~/Library/Preferences/ByHost/` 이동 후 `com.apple.windowserver.displays.[UUID].plist` 형태의 파일들 모두 삭제.
2. 재부팅 후 모니터를 다시 연결.

### 2단계: 액세서리 보안 설정 초기화
macOS의 '액세서리 연결 허용' 설정에서 실수로 거부를 눌러 물리적 신호가 차단된 경우 해결.
1. **시스템 설정 > 개인정보 보호 및 보안** 이동.
2. **액세서리 연결 허용** 옵션을 [잠금 해제 시 자동으로 허용] 또는 **[항상]**으로 변경.
3. 팝업이 다시 뜨지 않는다면 터미널에서 `sudo tccutil reset All` 실행.

### 3단계: 불필요한 스크립트 제거 (One Key HiDPI)
Apple Silicon 맥북에서는 시스템 파일을 건드리는 스크립트보다 앱 기반 설정이 안전함.
1. 터미널에서 설치 시 사용했던 명령어를 다시 입력하여 `Uninstall` 메뉴를 선택해 제거.
2. `/Library/Displays/Contents/Resources/Overrides` 폴더 내의 VendorID 관련 폴더를 수동 삭제.

## Root Cause (Connected Principle)
- **보안 격리**: macOS의 액세서리 보안 정책이 하드웨어 연결을 소프트웨어 레벨에서 차단함.
- **설정 충돌**: 시스템 파일을 수정하는 스크립트(One Key HiDPI)와 앱(BetterDisplay)의 설정이 충돌하여 출력 불가능한 해상도 값이 고정됨.
- **캐시 오염**: OS가 해당 모니터의 잘못된 식별 정보를 기억하여 지속적으로 인식을 거부함.

## Lessons
- **도구 중복 금지**: BetterDisplay를 사용한다면 One Key HiDPI는 절대 다시 설치하지 않는다.
- **전원 공급 우선**: 인식 불안정 시 모니터에 별도의 USB-C 전원을 먼저 공급한 뒤 맥북과 연결한다.
- **하드웨어 인식 진단**: `System Report`의 USB 버스 항목에서 `USB C Video Adaptor` 표시 여부를 통해 물리적 연결 상태를 우선 확인한다.

---

## 💡 부록: 16:10 비율 해상도 가이드 (HiDPI 적용 권장)
1280 × 800 (기본)에서 선명도와 작업 공간을 고려한 업그레이드 단계:

1. **1440 × 900 (추천)**: 가독성을 유지하며 화면 공간을 살짝 넓히기 좋음 (과거 맥북 에어 13인치 표준).
2. **1680 × 1050**: 15인치 노트북 고급형 해상도로, 넓은 작업 공간 확보 가능.
3. **1920 × 1200 (WUXGA)**: 16:10 비율의 Full HD 버전. DR1602의 물리적 최대 지원 해상도일 확률이 높음.

> [!TIP]
> BetterDisplay에서 위 해상도를 선택할 때 반드시 **HiDPI**가 활성화된 항목을 선택해야 글자가 흐릿하지 않고 선명하게 보입니다.

- [one-key-hidpi](https://github.com/xzhih/one-key-hidpi)