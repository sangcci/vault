---
aliases: [SQL_Logging_Security, PII_Protection]
tags: [탐구, 작성중]
type: Question
difficulty: Medium
---

## 핵심 질문 (Question)

- 왜 운영(Prod) 환경의 SQL 로그에서 실제 파라미터(Value)를 제외하고 쿼리 구조(Skeleton)만 남겨야 하는가?

## 로깅 예시 (Logging Example)

```python
# [위험] 파라미터가 포함된 로깅 (Vulnerable)
def dangerous_logging(email, password):
    sql = f"SELECT * FROM users WHERE email='{email}' AND password='{password}'"
    logger.debug(sql) # 로그에 평문 비번과 이메일이 그대로 남음 -> 유출 사고 직결

# [권장] 구조화된 로깅 (Secure & Efficient)
def secure_logging(email, password):
    # 실제 실행되는 Prepared Statement 구조만 로깅
    sql_skeleton = "SELECT * FROM users WHERE email=? AND password=?"
    logger.info(sql_skeleton)
    
    # 파라미터는 로깅하지 않거나, 필요 시 개발 환경에서만 제한적으로 로깅
    # execute(sql_skeleton, [email, password])
```

## 핵심 메커니즘 (Mechanism)

### 1. 개인정보 및 민감 데이터 보호 (Security)
- **PII(Personally Identifiable Information) 유출 방지**: `WHERE email = 'user@example.com'`과 같은 로그는 그 자체로 개인정보 유출임.
- **컴플라이언스**: 개인정보보호법에 의거, 불필요한 개인 식별 데이터의 보관은 법적 처벌 대상이 될 수 있음.
- **로그 시스템의 취약성**: 어플리케이션은 보안이 강력하더라도, 로그가 쌓이는 스토리지나 모니터링 도구(ELK, Grafana 등)는 상대적으로 보안 설정이 느슨하거나 외부 API와 연동되는 경우가 많아 유출 경로가 됨.

### 2. 스토리지 효율성 (Efficiency)
- **로그 폭증 방지**: 파라미터가 포함된 전체 쿼리를 모두 기록하면 로그 저장소의 용량이 급격히 늘어남.
- **중복성 제거**: 쿼리 구조만 남기면 동일한 패턴의 쿼리를 그룹화(Aggregation)하여 분석하기 용이함.

### 3. 성능 영향 (Performance)
- **문자열 결합 비용**: 실제 값을 쿼리에 바인딩하여 로그용 문자열을 만드는 과정 자체가 CPU와 메모리 자원을 소모함.

## 해결책 (Solutions)

- **로그 레벨 분리**:
    - `hibernate.SQL=DEBUG`: 쿼리 구조만 출력 (안전).
    - `BasicBinder=TRACE`: 실제 파라미터 값 출력 (위험, 개발 환경에서만 사용).
- **파라미터 마스킹**: 필요한 경우 특정 필드(비밀번호, 주민번호 등)만 마스킹 처리하여 로그에 남김.

## 결론 (Conclusion)

- 로그는 **"무엇이 일어났는가"**를 파악하는 용도이지 **"데이터 자체를 복제하는 수단"**이 아님. SQL 구조 파악만으로도 로직 오류의 90% 이상은 식별 가능하므로, 보안을 위해 파라미터는 제거하는 것이 원칙임.

## 연결 지식
- [[판단기준-운영 환경 로그 레벨 및 보안 관리 전략]]
