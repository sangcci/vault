# Anki Keyword Deletion Report

## 처리 일시

2026-07-08

## 백업

삭제 전 `💻::Keyword` 덱을 apkg로 백업했다.

```text
00-Meta/Anki-Keyword-Backup-Before-Delete-20260708.apkg
```

백업 대상:

```text
Deck: 💻::Keyword
includeSched: true
```

## 삭제 대상

삭제한 태그 범위:

```text
ka_keyword_delete_candidate
ka_keyword_converted_batch_001
ka_keyword_converted_batch_002
ka_keyword_converted_batch_003
ka_keyword_converted_batch_004
ka_keyword_converted_batch_005
ka_keyword_converted_batch_006
ka_keyword_converted_batch_007
```

삭제 전 확인:

```text
ka_keyword_delete_candidate          113
ka_keyword_converted_batch_001         6
ka_keyword_converted_batch_002        11
ka_keyword_converted_batch_003        14
ka_keyword_converted_batch_004        10
ka_keyword_converted_batch_005         8
ka_keyword_converted_batch_006         3
ka_keyword_converted_batch_007        12
unique_delete_notes                  177
```

삭제 전 덱 상태:

```text
Keyword total     230
Keyword active     53
Problem Solving    76
```

## 삭제 결과

삭제 완료:

```text
deleted_keyword_notes 177
```

삭제 후 검증:

```text
keyword_total                         53
keyword_active                        53
keyword_keep                          48
keyword_convert_active                 5
keyword_delete_candidate_remaining     0
keyword_converted_remaining            0
problem_total                         76
```

## 남은 Keyword

남은 `💻::Keyword`는 53장이다.

구성:

```text
KEEP 후보            48
보류 convert 후보      5
```

보류 convert 후보:

```text
장애 (Failure)
Access Token 수명
Tomcat 요청 처리
Blocking I/O
Hash 충돌 저항 (Collision Resistance)
```

이 5장은 현재 Problem 카드와 직접 전환 관계가 약하거나, 별도 판단이 필요한 항목이라 삭제하지 않았다.

## 결론

- 삭제 후보와 Problem 카드로 전환 완료된 Keyword 177장은 백업 후 삭제했다.
- `💻::Keyword`에는 유지할 카드 53장만 남았다.
- `💻::Problem Solving` 덱은 76장으로 유지된다.
