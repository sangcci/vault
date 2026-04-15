---
aliases: [Configuration_Shadowing, 설정_은폐]
tags: [현상, 작성중]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의 (Definition)

> (사전적) 동일한 식별자(Key)를 가진 설정이 여러 계층에 존재할 때, 우선순위가 높은 계층의 값이 하위 계층의 값을 완전히 가려버려 보이지 않게 만드는 현상.
> (이해용) 여러 장의 색유리를 겹쳤을 때 가장 위에 놓인 유리의 색깔만 보이고 아래쪽 유리들은 무시되는 현상.

## 구조도 (Diagram)

```text
[ Precedence Stack ]
(TOP) Layer 4: System Env Var (Win!)  <-- 실제 런타임 반영값 (예: db.pool=50)
      ---------------------------
      Layer 3: Profile Config (Shadowed)  --+
      Layer 2: Common Config (Shadowed)   --|-- "유령 설정" (파일엔 존재함)
(BTM) Layer 1: Default Values (Shadowed)  --+    개발자는 Layer 3를 고쳤으나 
                                                 Layer 4가 이를 은폐함.
```

## 발생 환경 (Context)

- **Spring Boot**: `application-prod.yaml`이 `application.yaml`의 값을 덮어쓸 때.
- **OS**: 쉘 환경 변수(Export)가 프로그램 내부 기본값을 덮어쓸 때.
- **CSS**: 특정 클래스의 스타일이 전역 스타일을 가릴 때 (Specificity).

## 관찰되는 증상 (Symptoms)

- **설정 무시**: 분명히 설정 파일을 수정하고 재시작했음에도 불구하고 시스템 동작이 변하지 않음.
- **로컬-운영 불일치**: 내 컴퓨터(로컬)에서는 잘 작동하는데, 특정 환경(Staging, Prod)에서만 설정이 다르게 동작함.
- **디버깅 난항**: 코드나 파일에는 문제가 없는데 실제 주입된 값은 예상과 달라 원인 파악에 시간이 오래 걸림.

## 추측되는 원인 (Root Cause)

- **[[본질-우선순위 계층 구조 (Priority Hierarchy)]]**: 시스템이 충돌하는 설정 중 하나를 반드시 선택해야 하기 때문에 발생하는 필연적 결과.
- **암시적 오버라이드**: 명시적인 경고 없이 나중에 로드된 값이 이전 값을 무력화하는 설계 방식.

## 관련 사례 (Related Cases)

- [[사례-Spring Boot 외부 설정 우선순위 메커니즘]]
