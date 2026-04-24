# LOG

> Activity log — notes and cards created or updated.
> Format: `YYYY-MM-DD HH:MM [CREATE|UPDATE] [[filename]] · one-line summary`
2026-04-23 14:45 [CREATE] [[사례-JPA Unique Key 중복 저장 방지]] · Kotlin+JPA에서 @Transactional 내 flush 타이밍 문제로 UK 위반 예외를 catch 못하는 문제와 레이어 단위 해결 전략
2026-04-23 14:45 [CREATE] [[판단기준-중복 저장 방지 방법 선택 (Unique Key vs Lock)]] · duplicate INSERT 문제에서 원천 차단(Unique Key) vs 원자 보장(Lock/멱등키) 선택 기준
2026-04-23 14:45 [CREATE] [[판단기준-예외 처리 레이어 설계]] · Service/Infrastructure/ControllerAdvice 중 예외 처리 책임 배치 기준 — flush 타이밍과 Lazy Loading 관점 포함
2026-04-23 14:45 [UPDATE] [[판단기준-운영 환경 로그 레벨 및 보안 관리 전략]] · 예외 유형별 WARN/ERROR 분기 및 사용자 응답 500 은닉 섹션 추가
2026-04-23 14:57 [UPDATE] [[판단기준-중복 저장 방지 방법 선택 (Unique Key vs Lock)]] · 재시도 분기를 "기 처리 결과 반환 필요(멱등키) vs 단순 중복 차단(UK 충분)"으로 세분화
2026-04-23 15:15 [CREATE] [[개념-JPA Flush 타이밍]] · save() 이후 flush 전엔 SQL이 DB에 전송되지 않아 try-catch가 예외를 놓치는 메커니즘 설명
2026-04-23 15:20 [CREATE] [[개념-DataIntegrityViolationException]] · Spring이 DB 제약 위반을 추상화한 예외와 cause chain으로 제약명 추출하는 패턴
2026-04-24 22:39 [CREATE] [[탐구-100만건 순차 읽기에서 ArrayList vs LinkedList 선택]] · 대규모 순차 읽기 상황에서 자료구조 선택 근거를 묻는 면접 질문 수집
2026-04-24 22:39 [CREATE] [[탐구-HashMap 해시 충돌이 성능에 미치는 영향과 자바의 해결 방법]] · HashMap 해시 충돌 시 성능 저하 메커니즘과 Java 내부 해결 전략을 묻는 면접 질문 수집
2026-04-24 22:46 [CREATE] [[개념-ArrayList]] · 연속 메모리 기반 동적 배열로 O(1) 임의 접근과 참조 지역성 이점을 갖는 List 구현체
2026-04-24 22:46 [CREATE] [[개념-LinkedList]] · 불연속 노드 체인 구조로 중간 삽입·삭제 O(1)이나 캐시 미스로 순차 읽기 성능이 낮은 List 구현체
2026-04-24 22:46 [CREATE] [[개념-HashMap]] · 해시 기반 O(1) 조회 Map으로 Java 8부터 충돌 임계치 초과 시 Red-Black Tree로 전환하는 구현체
2026-04-24 22:46 [CREATE] [[본질-참조 지역성 (Locality of Reference)]] · 인접 데이터를 미리 가져오는 전략이 항상 유효한 이유 — CPU 캐시 계층 구조의 불변 원리
2026-04-24 22:47 [CREATE] [[본질-해시 함수 (Hash Function)]] · 임의 크기 입력을 고정 크기 대표값으로 압축해 O(1) 조회를 가능하게 하는 불변 원리
