---
aliases: [Circular Reference, Jackson 무한루프, 양방향 순환참조]
tags: [현상, 작성중, JPA, Spring]
type: Phenomenon
difficulty: Medium
---

## 한 문장 정의

> (사전적) 양방향 연관관계 엔티티를 JSON으로 직렬화할 때, 두 객체가 서로를 무한히 참조하며 StackOverflowError가 발생하는 현상.
> (이해용) A가 B를 가리키고 B가 A를 가리키는 상태에서 JSON으로 풀면, A→B→A→B... 무한 루프에 빠지는 것.

---

## 발생 환경

- JPA `@OneToMany` + `@ManyToOne` 양방향 관계 설정 후
- Controller에서 Entity를 직접 반환할 때 (Jackson ObjectMapper 직렬화 시점)

---

## 관찰되는 증상

- `StackOverflowError` 또는 `HttpMessageNotWritableException`
- JSON 응답 미생성, 500 에러 반환

---

## 추측되는 원인

```text
[Post] ──has──▶ [Comment]
  ▲                  │
  └──────has──────────┘
```

```java
@Entity
class Post {
    @OneToMany(mappedBy = "post")
    List<Comment> comments;   // Post → Comment 참조
}

@Entity
class Comment {
    @ManyToOne
    Post post;                // Comment → Post 참조
}
```

**Jackson `ObjectMapper.writeValueAsString(post)` 호출 시**

```
1. PostSerializer.serialize(post)
     → post.comments 필드 직렬화 시작
2.   CommentSerializer.serialize(comments[0])
       → comment.post 필드 직렬화 시작
3.     PostSerializer.serialize(post)        ← 동일 객체!
         → post.comments 필드 직렬화 시작
4.       CommentSerializer.serialize(comments[0])
             → comment.post 필드 직렬화 시작
5.         PostSerializer.serialize(post)    ← 또 동일 객체!
           ...
           StackOverflowError 💀
```

핵심: Jackson은 **객체 동일성 검사 없이** 재귀 직렬화.
JPA 영속성 컨텍스트 내에서는 정상 동작 — **직렬화 시점의 문제**.

- [[본질-연관 (Association)]] — 양방향 참조 구조가 직렬화와 충돌

---

## 해결 방법

**DTO 변환** (권장): Service 레이어에서 엔티티 → DTO 매핑 후 반환

```text
Entity (양방향 참조)
      │
   Service        ← 순환 참조 차단 지점
      │
     DTO (단방향 데이터)
      │
   Jackson
      │
     JSON
```

- `@JsonIgnore`: 한쪽 방향 차단 (엔티티 직접 반환 안티패턴 유지됨)
- `@JsonManagedReference` / `@JsonBackReference`: Jackson 방향 지정

---

## 관련 사례

- [[판단기준-JPA 연관관계 방향 선택 (단방향 vs 양방향)]]
