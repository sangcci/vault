---
aliases: [RAG Retrieval Quality Failure, Vector Search Noise, Context Window Cost]
tags: [문제, 작성중, LLM, RAG, Search]
difficulty: Medium
type: Problem
---

# Problem: 61-RAG를 붙였는데 관련 없는 문서가 들어가 답변 품질이 나빠짐

## 상황

LLM 답변 품질을 높이려고 RAG를 붙였다. 하지만 검색 결과에 관련 없는 문서가 섞이고, 너무 많은 문서를 context에 넣어 답변이 장황하거나 틀린 근거를 사용한다.

```text
User question
  -> embedding search topK=20
  -> noisy chunks injected
  -> LLM answers with wrong context
```

---

## 관찰된 증거

- keyword로는 정확한 문서가 있는데 vector search는 비슷한 말투의 다른 문서를 가져온다.
- topK를 늘릴수록 답변 품질이 오히려 떨어진다.
- context window를 많이 써서 비용과 지연이 증가한다.
- 최신 문서가 indexing되지 않아 오래된 정보를 답한다.
- 검색 실패인지 생성 실패인지 구분하기 어렵다.

---

## 원인

RAG의 품질은 LLM 자체보다 검색 품질, chunking, ranking, context 압축에 크게 좌우된다. Vector DB는 의미 유사도를 찾지만, 정확한 식별자·버전·에러 코드처럼 키워드 일치가 중요한 질문에서는 노이즈를 만들 수 있다.

---

## 해결 방향

- 질문 유형별로 keyword search, vector search, hybrid search를 나눈다.
- chunk 크기와 overlap을 실제 질의 로그 기준으로 조정한다.
- topK를 무작정 늘리지 말고 rerank/threshold를 둔다.
- 검색 결과와 최종 답변을 별도로 로깅해 실패 지점을 분리한다.
- context window는 저장소가 아니라 비용이 드는 작업 메모리로 본다.
- 문서 변경 시 embedding 재생성/삭제 정책을 둔다.

---

## 연결되는 본질

- [[본질-검색 품질과 생성 품질의 분리]]
- [[본질-컨텍스트 윈도우와 비용 경계]]

---

## 참고

> "We explore a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) — models which combine pre-trained parametric and non-parametric memory" — [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)

> "Semantic search uses dense vectors." — [Pinecone Docs: Semantic search](https://docs.pinecone.io/guides/search/semantic-search)
