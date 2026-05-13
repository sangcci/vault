# LOG
2026-05-13 13:13 [UPDATE] [[개념-MVCC (PostgreSQL)]] · 트랜잭션 가시성 관점으로 xmin/xmax, snapshot, UPDATE 구버전 유지, VACUUM과 freeze까지 한 흐름으로 보강함
2026-05-12 15:33 [UPDATE] [[개념-스레드 안전성 (Thread Safety)]] · 서술 문장을 더 자연스러운 한국어 흐름으로 다듬고 오해하기 쉬운 지점을 읽기 쉽게 정리함
2026-05-12 15:33 [UPDATE] [[개념-Java 컬렉션의 스레드 안전성 보장 방식]] · 설명 문장의 번역투를 줄이고 선택 기준과 주의점을 더 사용자 말투에 가깝게 다듬음
2026-05-12 15:25 [CREATE] [[개념-Java 컬렉션의 스레드 안전성 보장 방식]] · 기본 컬렉션, synchronized 래퍼, ConcurrentHashMap의 차이와 복합 연산 주의점을 정리함
2026-05-12 15:25 [UPDATE] [[개념-스레드 안전성 (Thread Safety)]] · Java 컬렉션 관점의 상세 보장 방식 노트 링크를 추가함
2026-05-12 15:16 [CREATE] [[개념-스레드 안전성 (Thread Safety)]] · 여러 스레드의 동시 접근에서도 의미와 결과가 깨지지 않는 조건과 Java에서의 대표 보장 방식을 정리함
2026-05-12 15:16 [UPDATE] [[본질-격리성 (Isolation)]] · Thread Safety 항목을 독립 개념 노트 링크로 분리해 연결함
2026-05-09 12:18 [UPDATE] [[개념-B-Tree]] · 정렬된 키 순서와 실제 디스크 배치의 독립성을 새 본질 링크로 연결함
2026-05-09 12:18 [UPDATE] [[본질-논리 순서와 물리 순서는 다르다]] · B-Tree를 대표 개념 목록에 추가해 자료구조 사례를 보강함
2026-05-09 12:17 [UPDATE] [[개념-Heap Page 구조]] · heap page가 논리 순서와 물리 배치가 분리되는 사례임을 관련 본질로 연결함
2026-05-09 12:17 [UPDATE] [[개념-Index Scan]] · 인덱스 순서와 heap 접근 순서의 분리를 새 본질 노트와 연결함
2026-05-09 12:17 [UPDATE] [[개념-Bitmap Index Scan]] · 랜덤 heap 접근을 물리 페이지 순서로 재정렬하는 의미를 새 본질과 연결함
2026-05-09 12:17 [UPDATE] [[개념-DB 페이지와 Slotted Page 구조]] · 논리 식별자와 물리 배치의 독립성을 새 본질 링크로 명시함
2026-05-09 12:17 [UPDATE] [[개념-Seq Scan]] · 논리 정렬과 무관하게 물리 페이지 순서로 읽는 성격을 새 본질과 연결함
2026-05-09 12:17 [UPDATE] [[개념-MVCC (PostgreSQL)]] · 보이는 버전과 실제 heap 배치의 분리를 새 본질 링크로 연결함
2026-05-09 12:17 [UPDATE] [[개념-가상 메모리와 mmap의 관계]] · 가상 주소의 연속성과 실제 물리 배치의 비연속성을 새 본질과 연결함
2026-05-09 11:36 [CREATE] [[탐구-postgresql에서 테이블 마다 heap page 일정 공간을 할당해주고 그 안에서 순차적으로 page가 insert]] · PostgreSQL heap 저장 방식과 range 조회 시 random I/O 가능성에 대한 원문 질문을 기록함
2026-05-09 11:36 [CREATE] [[본질-논리 순서와 물리 순서는 다르다]] · 논리 순서와 물리 순서가 분리될 수 있는 이유와 DB/OS/파일시스템 사례를 정리함
2026-05-05 [CREATE] [[개념-PostgreSQL 테이블 잠금 모드 (Table Lock Modes)]] · 8가지 잠금 모드와 충돌 매트릭스 구조, 명령어별 자동 잠금 획득 원리 정리
2026-05-05 [UPDATE] [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] · 공식 문서 운영 환경 권고 인용, Two-Pass 알고리즘 상세 설명 및 신규 DML 자동 인덱스 기록 원리 추가
2026-05-05 [UPDATE] [[현상-잠금 경합 (Lock Contention)]] · 잠금의 본질(모드 목록 + 충돌 매트릭스 구조) 및 PostgreSQL 명령어 자동 잠금 획득 공식 문서 인용 추가
2026-05-05 [UPDATE] [[개념-Flyway]] · 트랜잭션 내부 실행(PostgreSQL vs MySQL DDL 차이), checksum 불일치와 repair 동작 원리 추가
2026-05-05 [CREATE] [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] · 쓰기 잠금 없이 인덱스를 백그라운드 빌드하는 CONCURRENTLY 옵션 동작 원리 및 Flyway 조합 주의사항 정리
2026-04-29 11:46 [CREATE] [[개념-Git Reset 모드]] · --soft/--mixed/--hard 옵션별 HEAD·staging·working dir 처리 차이 정리
2026-04-29 11:53 [CREATE] [[개념-Git Worktree]] · stash 없이 브랜치를 독립 작업공간으로 분리하는 worktree 개념 정리
2026-04-29 11:55 [CREATE] [[현상-AOP Self-Invocation 문제]] · 동일 빈 내부 호출 시 프록시 우회로 AOP 어드바이스가 미적용되는 현상
2026-04-29 11:56 [CREATE] [[개념-로컬 캐시 (Local Cache)]] · Caffeine lock-free 구조, cache vs buffer 구분, sync 옵션 포함 정리
2026-04-29 11:56 [CREATE] [[판단기준-캐시 쓰기 전략 선택]] · Write-Through vs DB 먼저 쓰기 선택 기준 및 불일치 위험 정리
2026-04-29 11:57 [CREATE] [[판단기준-Formatter vs Converter vs Mapper 선택]] · Spring 변환 도구 타입·포맷·도메인 객체 기준 선택 기준 정리
2026-04-29 11:58 [CREATE] [[판단기준-패키지 버전 업데이트 전략]] · 버전 고정 원칙, 업데이트 시점, 보안 패치 예외 등 의존성 관리 전략
2026-04-29 11:58 [CREATE] [[개념-분산 추적 (Distributed Tracing)]] · MSA 환경에서 traceId 전파로 요청 흐름을 단일 단위로 추적하는 기법
2026-04-29 17:40 [UPDATE] [[개념-로컬 캐시 (Local Cache)]] · @Cacheable AOP 프록시 흐름 및 캐시 키 설계 원칙(정렬 파라미터 주의사항) 추가
2026-04-29 21:14 [CREATE] [[판단기준-캐시 적용 레이어 선택]] · Repository vs Service 캐시 위치 선택 기준, JPA detached Entity LazyInitializationException 시나리오 포함
2026-04-30 11:41 [UPDATE] [[개념-JPA EntityManager]] ·
2026-04-30 11:42 [UPDATE] [[개념-JPA EntityManager]] ·
2026-04-30 11:42 [UPDATE] [[개념-JPA EntityManager]] ·
2026-05-04 21:45 [CREATE] [[현상-캐시 키 공간 폭발 (Cache Key Space Explosion)]] · 동적 검색 파라미터 조합으로 캐시 키가 무한 증가해 적중률이 0에 수렴하는 현상
2026-05-04 21:49 [CREATE] [[판단기준-캐시 가능 쿼리 유형 선별]] · 정형 쿼리(유한 키 공간)는 로컬 캐시, 동적 쿼리는 Redis·검색 엔진으로 위임하는 판단 기준
2026-05-04 21:56 [UPDATE] [[개념-로컬 캐시 (Local Cache)]] · 캐시 이름(value/cacheNames)의 네임스페이스 역할 및 키 공간 폭발 링크 추가
2026-05-04 21:56 [UPDATE] [[판단기준-캐시 적용 레이어 선택]] · 리스트 vs 개별 객체 캐싱 단위 선택 기준 및 별도 캐싱 레이어 패턴 추가
2026-05-04 23:04 [CREATE] [[개념-Redis (Remote Dictionary Server)]] · 인메모리 자료구조 서버로서의 본질과 자료구조별 사용 패턴(캐시·MQ·분산락·Pub/Sub 등) 매핑 정리
2026-05-04 23:04 [CREATE] [[개념-캐시 교체 정책 (Cache Eviction Policy)]] · LRU·LFU·W-TinyLFU·approximate LRU 비교 및 Redis maxmemory-policy 옵션 정리
2026-05-05 00:09 [UPDATE] [[개념-Flyway]] · 트랜잭션 내부 실행(PostgreSQL vs MySQL DDL 차이), checksum 불일치와 repair 동작 원리 추가
2026-05-05 00:10 [CREATE] [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] · 쓰기 잠금 없이 인덱스를 백그라운드 빌드하는 CONCURRENTLY 옵션 동작 원리 및 Flyway 조합 주의사항 정리
2026-05-05 00:11 [UPDATE] [[개념-Flyway]] · CONCURRENTLY와 트랜잭션 충돌 비용 항목 추가
2026-05-05 00:14 [CREATE] [[현상-잠금 경합 (Lock Contention)]] · 상호 배제가 강제하는 직렬화로 대기가 쌓이며 처리량이 저하되는 현상, CONCURRENTLY로 회피하는 패턴 포함
2026-05-05 00:14 [UPDATE] [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] · 관련 본질을 동시성으로 교체, 현상-잠금 경합 링크 추가
2026-05-05 09:40 [CREATE] [[탐구-운영 환경에서 CREATE INDEX CONCURRENTLY는 왜 무한 대기에 빠지는가]] · CONCURRENTLY가 Flyway 자신의 flyway_schema_history 외부 잠금 트랜잭션을 기다려 무한 대기에 빠지는 원인 질문
2026-05-05 09:57 [UPDATE] [[개념-Flyway]] · executeInTransaction=false의 한계 — SQL 래퍼만 제거되고 외부 잠금 트랜잭션은 유지됨을 2계층 ASCII 다이어그램으로 추가
2026-05-05 09:57 [UPDATE] [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] · Flyway와 조합 시 무한 대기 원인 및 해결 방향 상세화, flyway:nonTransactional 오기 정정
2026-05-05 10:02 [UPDATE] [[개념-Flyway]] · postgresql.transactional-lock=false — pg_advisory_xact_lock vs pg_advisory_lock 비교 다이어그램 및 Spring Boot 설정 추가
2026-05-05 10:03 [UPDATE] [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] · Flyway 섹션에 transactional-lock=false 해결책 코드 예시 추가
2026-05-05 18:07 [CREATE] [[개념-PostgreSQL 테이블 잠금 모드 (Table Lock Modes)]] ·
2026-05-05 18:07 [UPDATE] [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] ·
2026-05-05 18:07 [UPDATE] [[현상-잠금 경합 (Lock Contention)]] ·
2026-05-05 18:08 [UPDATE] [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] ·
2026-05-05 18:08 [UPDATE] [[개념-PostgreSQL CREATE INDEX CONCURRENTLY]] ·
2026-05-05 18:08 [UPDATE] [[현상-잠금 경합 (Lock Contention)]] ·
