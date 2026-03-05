---
aliases: [Externalized_Configuration, 외부_설정]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의 (Definition)

> 애플리케이션의 소스 코드 내부에 설정값(DB 접속 정보, API Key 등)을 하드코딩하지 않고, 실행 시점에 외부에서 주입받아 동작을 제어하는 방식.

## 1. 개요 (Overview)

이 방식은 **[[본질-환경 격리 (Environment Isolation)]]**을 실현하기 위한 핵심 기술적 수단이며, **12-Factor App**의 "설정(Config)" 원칙과 궤를 같이합니다.

## 2. 핵심 메커니즘 (Mechanism)

1.  **계층화 (Layering)**: 여러 소스(파일, 환경변수, 커맨드라인 인자)에서 설정을 읽어오되, 특정 우선순위에 따라 값이 결정됨.
2.  **오버라이딩 (Overriding)**: 기본 설정(Default)을 두고, 특정 환경(Test, Prod)에서만 필요한 값을 덮어씌움.
3.  **동적 주입 (Injection)**: 애플리케이션 구동 시점에 컨테이너나 프레임워크가 외부 설정값을 읽어 내부 빈(Bean)이나 변수에 할당.

## 3. 왜 사용하는가? (Why?)

- **재컴파일 방지**: 환경이 바뀔 때마다 코드를 수정하고 다시 빌드할 필요가 없음 (Build Once, Run Anywhere).
- **보안성**: 민감한 정보(비밀번호, 시크릿 키)를 소스 코드 저장소(Git)에 노출하지 않고 안전하게 관리 가능.
- **유연성**: 운영 중에도 설정값만 변경하여 애플리케이션의 동작(로그 레벨, 타임아웃 등)을 제어할 수 있음.

## 4. 구체적 수단 (How)

- **환경 변수 (Environment Variables)**: OS 수준에서 주입 (가장 범용적).
- **설정 파일 (Configuration Files)**: `.yml`, `.properties`, `.json` 등.
- **커맨드라인 인자 (CLI Arguments)**: 실행 시 직접 전달.
- **설정 서버 (Config Server)**: 중앙화된 서비스(Spring Cloud Config, AWS AppConfig)에서 설정 로드.

## 5. 관련 개념

- **[[사례-Spring Boot 외부 설정 우선순위 메커니즘]]**: 이 개념이 실제 프레임워크에서 구현된 예시.
- **[[판단기준-테스트 환경 설정 격리 전략]]**: 설정을 관리할 때 고려해야 할 전략적 기준.
