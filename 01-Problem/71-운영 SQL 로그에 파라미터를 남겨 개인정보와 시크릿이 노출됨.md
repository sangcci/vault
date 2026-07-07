---
aliases: [SQL Parameter Logging Leak, PII in SQL Logs, Sensitive Data Logging]
tags: [문제, 작성중, Logging, Security, DB]
difficulty: Medium
type: Problem
---

# Problem: 71-운영 SQL 로그에 파라미터를 남겨 개인정보와 시크릿이 노출됨

## 상황

운영 장애를 분석하려고 SQL 로그에 실제 바인딩 파라미터까지 출력했다. 이후 로그 저장소, APM, Slack 알림, 외부 모니터링 도구에 이메일, 토큰, 비밀번호, 주민번호 같은 민감 값이 함께 남았다.

```text
위험한 로그
SELECT * FROM users WHERE email='user@example.com' AND password='plain-text'

권장 로그
SELECT * FROM users WHERE email=? AND password=?
```

---

## 관찰된 증거

- 로그 검색 시스템에서 사용자 이메일/토큰이 검색된다.
- DB 쿼리 디버깅을 위해 `BasicBinder TRACE` 같은 설정이 운영에 켜져 있다.
- 로그 보존 기간이 실제 개인정보 보존 정책보다 길다.
- 로그 접근 권한이 운영 DB 접근 권한보다 넓다.
- 동일 쿼리 패턴 분석이 파라미터 값 때문에 어렵다.

---

## 원인

로그는 데이터 복제 저장소가 아니라 관측 신호다. 운영에서는 쿼리 구조, latency, row count, trace id, error code처럼 문제 분석에 필요한 신호만 남겨야 한다. 실제 값은 보안 위험과 저장 비용을 동시에 키운다.

---

## 해결 방향

- 운영 SQL 로그는 skeleton과 metric 중심으로 남긴다.
- 파라미터 값 로그는 로컬/개발 환경에서만 제한적으로 켠다.
- 민감 키워드(password, token, secret, email 등)는 마스킹한다.
- 로그 저장소 접근 권한과 보존 기간을 별도 정책으로 둔다.
- trace id와 요청 맥락을 남겨 값 없이도 장애 흐름을 추적한다.

---

## 연결되는 본질

- [[본질-관측 데이터 최소화와 민감정보 경계]]
- [[본질-요청 흐름 추적 가능성]]
- [[본질-요청 흐름 추적 가능성]]

---

## 참고

> "Logging should not be used to collect or store sensitive information." — [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

> "Never log data unless it is legally sanctioned." — [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
