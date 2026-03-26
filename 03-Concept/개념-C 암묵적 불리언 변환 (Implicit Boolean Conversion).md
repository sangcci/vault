---
aliases: [Implicit Boolean, C Null Terminator, C Truthiness]
tags: [개념, 작성중]
type: Concept
difficulty: Low
---

## 한 문장 정의

> (사전적) C 언어에서 정수 0은 false, 0이 아닌 값은 true로 취급되는 암묵적 변환 규칙.
> (이해용) `\0`은 ASCII 코드 0번, 즉 정수 0이기 때문에 조건문에서 false가 된다.

## 해결하는 문제

- 별도의 bool 타입 없이 정수로 조건 분기 표현

## 치르는 비용

- 의도치 않은 조건 통과/차단 버그가 조용히 발생 (컴파일 에러 없음)

## 동작 원리

C에는 원래 boolean 타입이 없다. 조건식의 결과를 정수로 해석한다.

```
false → 정수 0
true  → 정수 0이 아닌 모든 값 (1, -1, 255 모두 true)
```

`\0`은 문자열 종결자이면서 동시에 ASCII 0번 = 정수 0 = false다.

```c
char *str = "hello";

while (*str) {        // *str == '\0' 이면 정수 0 → false → 루프 종료
    str++;
}

if (0)   { }  // 실행 안 됨
if ('\0') { }  // 실행 안 됨 — \0 == 0
if ('')   { }  // 컴파일 에러 — 빈 문자 리터럴은 불가
```

## 관련 개념

- [[개념-C 연산자 우선순위 (Operator Precedence)]]
