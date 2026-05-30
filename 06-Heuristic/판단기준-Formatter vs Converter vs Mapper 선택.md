---
aliases: [Formatter vs Converter, Spring 데이터 변환 도구 선택, Converter, Formatter, Mapper]
tags: [판단기준, 작성중]
type: Heuristic
difficulty: Low
---

## 판단 기준

```text
변환 대상이 다른 타입인가? (Short → Long, String → Integer)
  └─ Yes → Converter  (org.springframework.core.convert)

String 형식만 바뀌는가? (날짜 포맷, 통화 포맷)
  └─ Yes → Formatter  (org.springframework.format)

도메인 객체 간 매핑인가? (Entity ↔ DTO)
  └─ Yes → Mapper  (MapStruct, ModelMapper 등 — Spring Data 영역)
```

---

## 효과적인 상황

- HTTP 요청 파라미터를 도메인 타입으로 변환: **Converter**
- Locale에 따라 날짜/통화 표시 형식 변환: **Formatter**
- JPA Entity를 응답 DTO로 변환: **Mapper**

---

## 실패하는 상황

- Formatter로 타입 변환 시도: String 안에서만 처리하므로 범위 초과
- 구현 세부사항은 Spring 공식 문서 Type Conversion / Formatting 섹션에서 확인 후 사용

---

## 출처

- Spring 공식 문서: Core → Type Conversion / Formatting 섹션
