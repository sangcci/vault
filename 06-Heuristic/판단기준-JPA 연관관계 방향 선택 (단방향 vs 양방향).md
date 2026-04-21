---
aliases: [JPA 단방향 양방향, 연관관계 방향 선택, Bidirectional vs Unidirectional]
tags: [판단기준, 작성중, JPA, Spring]
type: Heuristic
difficulty: Medium
---

## 판단 기준

- 반대 방향 탐색이 자주 필요하고, 조회 쿼리를 단순하게 유지하고 싶다면 → **양방향**
- 연관의 독립성이 중요하고, 한 방향으로만 탐색한다면 → **단방향**

## 효과적인 상황

### 양방향이 유리한 경우

```text
// Comment → Post 역방향 탐색이 필요할 때
comment.getPost().getTitle()  // 양방향이면 자연스럽게 탐색 가능
```

- Spring Data JPA 쿼리 메서드로 대부분 해결 가능
  ```java
  List<Comment> findByPost_Id(Long postId);   // 추가 쿼리 작성 불필요
  ```
- 이전 방식(QueryDSL 직접 Join + Projection)보다 Repository가 가볍고 가독성 높음

**성능 우려는 대부분 근거 없음**

```text
// 단방향 방식 — 2번 쿼리
Post post = postRepository.findById(id);
List<Comment> comments = commentRepository.findByPostId(id);

// 양방향 방식 — Fetch Join으로 1번 쿼리
Post post = postRepository.findByIdWithComments(id);
// → 컬럼 수가 100개 이하면 성능 차이 미미
// → BLOB(게시글 본문 등)은 별도 분리 검토
```

### 단방향이 유리한 경우

- 연관이 단순하고 역방향 탐색이 없는 경우
- 팀 내 JPA 숙련도가 낮아 양방향 부작용 리스크가 높은 경우

## 실패하는 상황

양방향 선택 시 반드시 주의해야 할 부작용:

| 문제 | 설명 | 해결 |
|------|------|------|
| N+1 | 연관 엔티티 Lazy Loading 순회 시 N번 추가 쿼리 | Fetch Join, Batch Size |
| 순환 참조 | JSON 직렬화 시 무한루프 | DTO 변환 |
| CascadeType 오남용 | 의도치 않은 연쇄 삭제/저장 | Cascade 범위 명시적 제한 |
| 고아 객체 | orphanRemoval 미설정 시 참조 끊긴 데이터 잔류 | orphanRemoval 명시 |

→ [[현상-JPA 순환 참조 (Circular Reference)]]
→ [[개념-N+1 문제 (N+1 Query Problem)]]

## 출처

- 2026-04-06 일지 — JPA 연관관계 설정에 관한 고찰
