---
aliases: [RAG, Retrieval-Augmented Generation, 검색 증강 생성]
tags: [개념, 작성중]
type: Concept
difficulty: Medium
---

## 한 문장 정의

> (사전적) LLM이 답변을 생성하기 전에 외부 저장소에서 관련 정보를 검색해 컨텍스트에 주입하는 기법.
> (이해용) LLM의 지식 부족을 외부 검색으로 보완하는 것 — 시험 볼 때 오픈북 허용하는 것과 같다.

---

## 해결하는 문제

- LLM은 학습 데이터 이후의 정보를 모름 (지식 컷오프)
- Context Window가 유한해 문서 전체를 넣을 수 없음
- 매번 Fine-tuning 없이 최신 정보 활용 가능

---

## 치르는 비용

- 검색 단계가 추가되므로 응답 지연 증가
- 검색 품질이 나쁘면 오히려 노이즈 주입
- 검색 인프라(Vector DB 등) 별도 운영 필요

---

## 동작 원리

```
[ 단순 RAG ]
사용자 질문 → 외부 저장소 검색 → 관련 문서 추출
    → [시스템 프롬프트 + 검색 결과 + 질문] → LLM → 답변

[ 에이전트 RAG ]
사용자 질문 → LLM 판단: "검색 필요" → Tool Use 실행
    → 결과를 컨텍스트에 추가 → LLM 재호출 → 답변
```

RAG는 구현체에 제약이 없음:
- Vector DB (의미 기반 검색)
- MEMORY.md / CLAUDE.md (파일 주입)
- SQL DB (정형 데이터 검색)
- Grep / Glob (파일 시스템 검색)

---

## 관련 본질

- [[본질-간접 참조 (Indirection)]] — 질문과 지식 사이에 검색 층을 끼워넣는 것
- [[본질-무상태성 (Statelessness)]] — LLM이 무상태이기 때문에 RAG가 필요해진 이유
