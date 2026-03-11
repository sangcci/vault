---
aliases: [Priority_Hierarchy, 계층적_구성]
tags: [본질, 작성중]
type: Principle
difficulty: High
---

**핵심 질문**: "동일한 설정 키에 대해 여러 소스가 충돌할 때, 시스템은 어떤 논리로 승자를 결정하는가?"

## 한 문장 정의 (Definition)

> (사전적) 구성 요소들 간의 우선순위를 명확히 정의하여, 충돌 발생 시 최종적으로 적용될 값을 결정하는 수직적 구조.
> (이해용) "더 구체적이고(Specific), 더 명시적이며(Explicit), 더 나중에(Latest) 로드된 것이 이긴다"는 소프트웨어 구성의 권력 서열.

## 로직 예시 (Pseudo Code)

```python
# 우선순위가 높은 순서대로 소스 나열
# (위로 갈수록 권한이 강함)
config_sources = [
    "Command-Line Arguments",  # 최상위: 실행 시 직접 입력
    "System Properties",       # JVM 옵션 (-D)
    "OS Environment Variables",# 운영체제 환경변수
    "Profile Config File",     # application-prod.yaml
    "Common Config File",      # application.yaml
    "Default Values"           # 코드 내 하드코딩된 값
]

def get_final_config():
    final_dict = {}
    # 낮은 순위부터 순회하며 덮어쓰기 (업데이트)
    for source in reversed(config_sources):
        data = load_source(source)
        final_dict.update(data) # 동일 키가 있으면 나중 소스의 값으로 교체됨
    
    return final_dict
```

## 사용 예시 (Examples)

1. **Spring Boot**: 약 14단계 이상의 외부 설정 우선순위를 가짐.
2. **Kubernetes**: 컨테이너 내부 환경 변수가 이미지 내부의 기본 설정을 덮어씀.
3. **OOP Overriding**: 자식 클래스의 메서드가 부모 클래스의 메서드를 재정의하여 우선권을 가짐.

## 트레이드오프 (Trade-off)

- **이득**: 코드 변경 없이 환경(Dev/Prod)에 따라 동작을 유연하게 변경할 수 있음 (추상화).
- **손실**: 설정의 최종 출처를 파악하기 위한 인지 부하(Cognitive Load)가 증가함.

## 왜 사라지지 않는가 (Persistence)

- **환경별 가변성**: 동일한 바이너리(Jar/Image)를 서로 다른 환경에서 실행해야 하는 현대 소프트웨어 배포 철학(Build Once, Run Anywhere)을 실현하기 위한 필수 장치이기 때문임.

## 연결 지식
- [[현상-설정 섀도잉 (Configuration Shadowing)]]
