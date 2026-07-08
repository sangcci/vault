# Anki Keyword Deck Improvement Report

## 적용 결과

| Decision | CSV | Anki tag count | Tag |
|---|---:|---:|---|
| KEEP | 48 | 48 | `ka_keyword_keep` |
| CONVERT | 69 | 69 | `ka_keyword_convert` |
| DELETE | 113 | 113 | `ka_keyword_delete_candidate` |

## 태그 의미

- `ka_keyword_keep`: Keyword 덱에 유지할 핵심 원리/지표
- `ka_keyword_convert`: Problem 카드로 전환한 뒤 삭제 또는 suspend할 후보
- `ka_keyword_delete_candidate`: Problem 중심 학습과 연결이 약해 삭제 또는 suspend할 후보

## 카테고리별 요약

### KEEP
- OS: 12
- Architecture: 10
- DB: 7
- Performance: 4
- Spring: 4
- Distributed System: 3
- Infra: 3
- API Design: 1
- Software Design: 1
- Security: 1
- JPA: 1
- Git: 1

### CONVERT
- DB: 29
- OS: 10
- Security: 6
- Architecture: 5
- Software Design: 3
- Infra: 3
- JPA: 3
- Network: 3
- Spring: 1
- Testing: 1
- Algorithm: 1
- Java: 1
- Tomcat: 1
- LLM: 1
- JVM: 1

### DELETE
- Architecture: 23
- Infra: 13
- Software Design: 13
- DB: 12
- OS: 9
- JPA: 6
- JVM: 6
- Software Engineering: 5
- Security: 4
- Network: 3
- Tomcat: 3
- Distributed System: 2
- Performance: 2
- Data Structure: 2
- Spring: 2
- Git: 2
- Java: 2
- Shell: 1
- Kotlin: 1
- JavaScript: 1
- Algorithm: 1

## 다음 단계

1. `ka_keyword_delete_candidate` 113장을 삭제할지 suspend할지 승인받는다.
2. `ka_keyword_convert` 69장은 Problem 카드 생성 후 처리한다.
3. `ka_keyword_keep` 48장은 Keyword 덱에 남긴다.

---

## 2026-07-08 Suspend 처리 결과

`ka_keyword_delete_candidate` 태그가 붙은 Keyword 카드 113장을 삭제하지 않고 suspend 처리했다.

검증 결과:

```text
total Keyword cards        230
ka_keyword_keep             48
ka_keyword_convert          69
ka_keyword_delete_candidate 113
suspended delete_candidate  113
active delete_candidate       0
active Keyword cards        117
```

의도:

```text
- 삭제 대신 suspend로 복구 가능성을 남긴다.
- Problem 카드 생성 전까지 convert 후보 69장은 유지한다.
- keep 후보 48장은 Keyword 회상용으로 유지한다.
```
