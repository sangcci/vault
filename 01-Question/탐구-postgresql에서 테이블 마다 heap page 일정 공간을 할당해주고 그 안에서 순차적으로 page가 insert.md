---
aliases: [PostgreSQL heap page 질문, PostgreSQL range scan random I/O 질문]
tags: [질문, 작성중]
difficulty: High
type: Question
---

## 질문

> postgresql에서 테이블 마다 heap page 일정 공간을 할당해주고 그 안에서 순차적으로 page가 insert되는 구조가 아니고, 그냥 heap 영역의 의미에 맞게 random으로 disk 영역에 저장되는거지? 그러면 인덱스로 조회할 때 만일 range 조회라면 인덱스는 순차여도 disk i/o 시에는 random i/o로 각기 다른 heap page를 가져올 수 있다는 의미네?

## 관련 노트

- [[본질-논리 순서와 물리 순서는 다르다]]
- [[개념-Heap Page 구조]]
- [[개념-Index Scan]]
- [[개념-Bitmap Index Scan]]
