---
aliases: [Spring_Boot_Config_Precedence, 스프링부트_설정_우선순위]
tags: [사례, 작성중]
type: Case
difficulty: Medium
---

## 상황 (Situation)

- **배경**: 스프링 부트 애플리케이션 개발 시 로컬(Local), 테스트(Test), 운영(Prod) 환경마다 서로 다른 DB 접속 정보와 API Key를 주입해야 함.
- **문제**: 설정 파일이 여러 개(application.yml, application-dev.yml 등)일 때, 어떤 값이 최종적으로 빈(Bean)에 주입되는지 정확히 모를 경우 디버깅이 어려움.

## 실제 발생한 일 (What Happened)

- **로딩 규칙**: `application.yml`이 먼저 로드되고, 활성화된 프로파일에 해당하는 `application-{profile}.yml`이 나중에 로드됨.
- **덮어쓰기(Overriding)**: 나중에 로드된 파일의 값이 기존 값을 덮어씀. 이는 파일 전체가 교체되는 것이 아니라, 동일한 키(Key) 값에 대해서만 발생함.
- **보안 주입**: 민감 정보는 `spring.config.import`를 통해 외부 Secret Manager나 별도의 보안 파일로부터 주입받을 수 있음.

## 근본 원인 (Root Cause)

- **[[개념-외부 설정 관리 (Externalized Configuration)]]**의 계층적 구현: 스프링 부트는 약 17가지 이상의 설정 소스(환경변수, 커맨드라인, 파일 등)에 우선순위를 부여하여 관리함.
- **[[본질-환경 격리 (Environment Isolation)]]**: 코드 수정 없이 실행 시점의 프로파일 지정만으로 환경별 동작을 다르게 하기 위함.

## 교훈 및 조치 (Lessons & Fixes)

- **명시적 프로파일 활용**: 테스트 시에는 `@ActiveProfiles("test")`를 활용하여 테스트 전용 설정을 명확히 분리함.
- **설정 중복 주의**: `application.yml`에 공통 설정을 두고, 환경별로 다른 부분만 프로파일 전용 파일에서 정의하여 중복을 최소화함.
- **보안 강화**: API Key나 패스워드 등은 절대 Git에 포함된 yml에 직접 적지 말고, 환경 변수나 Secret Manager를 통해 주입받도록 구성함.
