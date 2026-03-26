---
aliases: [Hibernate_JSON_Embedded_Collection_Limitation]
tags: [사례, 완료]
type: Case
difficulty: Medium
---
# Case: Hibernate Embedded 컬렉션의 JSON 매핑 실패와 한계

## 상황 (Situation)
- **환경**: Spring Boot 3.3.5 (Hibernate 6.5) -> **Spring Boot 3.4.0 (Hibernate 6.6) 업그레이드 후에도 동일**
- **요구사항**: `@Embeddable`로 선언된 객체 리스트(`List<Image>`)를 DB의 `jsonb` 컬럼에 매핑.
- **설정**:
    ```java
    @JdbcTypeCode(SqlTypes.JSON)  
    @Column(name = "detail_images", columnDefinition = "jsonb", nullable = false)  
    private List<Image> detailImages = new ArrayList<>();
    ```

## 실제 발생한 일 (What Happened)
- Hibernate 6.6(Spring Boot 3.4)으로 버전업을 진행했음에도 불구하고, 애플리케이션 기동 시 동일한 `AnnotationException` 발생:
    ```bash
    Failed to initialize JPA EntityManagerFactory: Property '...detailImages' is mapped as basic aggregate component array, but this is not yet supported.
    ```
- Hibernate 6.6에서 해결되었다고 알려진 `HHH-15862`는 기본 타입 배열에 집중되어 있으며, **`@Embeddable` 객체의 컬렉션**을 JSON으로 매핑하는 경우 여전히 내부 `PropertyBinder`에서 예외를 던지는 것으로 파악됨.

## 근본 원인 (Root Cause)
- **추상화의 불일치**: Hibernate의 `JSON` 타입 지원이 아직 `@Embeddable` 객체 리스트와 같은 복잡한 구조의 '컬렉션' 전체를 한 번에 처리하는 단계까지 완벽하게 도달하지 못함.
- **제약 조건**: Hibernate 엔진 내부에서 `isCollection() && isEmbedded()` 조건이 맞물릴 때 명시적으로 예외를 던지는 로직이 특정 조건(JSON 매핑 시)에서 여전히 작동함.

## 교훈 및 조치 (Lessons & Fixes)

### 조치 1: 실질적인 해결 (AttributeConverter 사용)
- **내용**: 프레임워크의 자동 매핑 기능을 포기하고, `AttributeConverter`를 통해 직접 JSON 직렬화/역직렬화 로직을 구현.
- **장점**: 프레임워크 버전에 의존하지 않으며 즉시 해결 가능.
- **단점**: QueryDSL 등을 통한 내부 필드 조건 검색이 어려워질 수 있음.

### 조치 2: 외부 라이브러리 검토 (Hypersistence Utils)
- **내용**: `vladmihalcea`의 `hypersistence-utils` 라이브러리를 사용하여 `@Type(JsonBinaryType.class)` 등을 적용.
- **판단**: 추가 의존성 발생의 부담이 있으나, Hibernate의 고질적인 JSON 매핑 문제를 해결하는 가장 성숙한 방법임.

### 최종 결론 및 판단기준
- **단순 조회 용도**: `AttributeConverter`를 사용하여 빠르게 해결하고 복잡도를 낮춤.
- **복잡한 필터링/인덱싱 필요**: JSON 내부 필드에 대한 빈번한 검색이 필요하다면 JSONB 매핑 대신 별도의 연관 관계 테이블로 풀거나, `hypersistence-utils`를 사용해 GIN 인덱스를 태우는 전략을 선택해야 함.
