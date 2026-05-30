# LOG
2026-05-13 13:38 [CREATE] [[개념-EntityManager의 주입 방식과 AOP의 관계]] · EntityManager 공유 프록시와 트랜잭션 AOP가 각자 무엇을 맡는지 스레드 기준 흐름으로 분리해 정리함
2026-05-13 13:38 [UPDATE] [[개념-JPA EntityManager]] · @PersistenceContext로 주입되는 EntityManager가 shared proxy라는 점과 JpaTransactionManager 위임 흐름을 보강함
2026-05-13 13:38 [UPDATE] [[개념-Spring 트랜잭션 관리 (Transaction Management)]] · Tomcat worker thread 기준으로 Connection·EntityManager 바인딩과 AOP의 역할 경계를 더 명확히 정리함
2026-05-13 13:20 [UPDATE] [[본질-논리 순서와 물리 순서는 다르다]] · YAML frontmatter를 목록 형식으로 정리해 메타데이터 가독성을 맞춤
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
2026-05-14 02:10 [CREATE] [[탐구-grafana, prometheus, loki를 왜 선택하는가]] · Grafana·Prometheus·Loki를 ELK 및 metrics 대안과 비교해 선택 이유를 설명하려는 원문 질문을 진입점으로 기록함
2026-05-14 02:10 [CREATE] [[개념-시계열 메트릭 저장소 (TSDB)]] · 시간축 위 수치 데이터를 저장·집계하는 저장소의 성격과 Prometheus가 왜 이 범주에 들어가는지 정리함
2026-05-14 02:10 [CREATE] [[개념-Prometheus]] · pull 기반 메트릭 수집기이자 로컬 TSDB를 가진 모니터링 도구라는 점을 구조 중심으로 정리함
2026-05-14 02:10 [CREATE] [[개념-Grafana]] · 여러 관측 저장소를 하나의 대시보드와 알림 계층으로 묶는 시각화 도구의 역할을 정리함
2026-05-14 02:10 [CREATE] [[개념-Loki]] · label만 인덱싱하고 압축 chunk를 object storage에 저장하는 비용 효율적 로그 시스템의 성격을 정리함
2026-05-14 02:10 [CREATE] [[개념-Loki의 저장 구조]] · Loki가 일반 RDB보다 append-oriented한 로그 저장 구조에 가깝다는 점과 index·chunk 분리를 정리함
2026-05-14 02:10 [CREATE] [[개념-label 기반 로그 검색]] · label로 검색 범위를 먼저 줄인 뒤 chunk를 읽는 Loki식 로그 탐색 방식을 정리함
2026-05-14 02:10 [CREATE] [[개념-pull 모델과 push 모델]] · Prometheus와 Loki의 수집 방식 차이를 pull과 push 관점으로 비교 정리함
2026-05-14 02:10 [CREATE] [[개념-ELK 스택 (Elasticsearch, Logstash, Kibana)]] · ELK가 로그를 강하게 색인해 검색·분석 자유도를 높이는 대신 운영 비용이 커지는 구조를 정리함
2026-05-14 02:10 [CREATE] [[판단기준-Prometheus + Grafana + Loki와 ELK 중 무엇을 선택할 것인가]] · 운영 단순성과 비용을 중시할 때와 본문 검색 자유도를 중시할 때의 선택 기준을 정리함
2026-05-14 02:10 [CREATE] [[판단기준-Prometheus 대신 다른 metrics 시스템을 고려해야 하는 경우]] · 장기 보관·관리형 SaaS·시계열 DB 활용 목적에 따라 Mimir·VictoriaMetrics·Datadog·InfluxDB를 검토하는 기준을 정리함
2026-05-14 02:10 [UPDATE] [[본질-옵저버빌리티 (Observability)]] · Metrics·Logs·View 계층에 Prometheus·Loki·ELK·Grafana를 연결해 대표 도구 지도를 보강함
2026-05-14 02:10 [UPDATE] [[개념-구조화된 로그 (Structured Logging)]] · 같은 구조화 로그를 Loki와 Elasticsearch가 어떻게 다르게 활용하는지 비교 링크를 추가함
2026-05-14 02:18 [CREATE] [[개념-로그 시스템 선택의 트레이드오프]] · Loki와 ELK가 검색 자유도와 운영 비용 사이에서 어떻게 다른 선택을 하는지 구조 중심으로 정리함
2026-05-14 02:18 [CREATE] [[개념-metrics 시스템 선택의 트레이드오프]] · Prometheus와 확장형 backend·SaaS 대안이 어떤 운영 구조 차이를 가지는지 압축해 정리함
2026-05-14 02:24 [UPDATE] [[본질-캡슐화 (Encapsulation)]] · 공개 API와 내부 구현의 경계를 패키지·import·코드리뷰·AI 컨텍스트 절감 관점까지 확장해 보강함
2026-05-29 00:00 [CREATE] [[판단기준-Application Domain Implementation 경계]] · usecase 흐름, 행위자, 도메인 규칙을 어디에 둘지 판단하는 기준을 정리함
2026-05-29 00:00 [CREATE] [[판단기준-멀티모듈 아키텍처를 언제 도입할 것인가]] · 단순 CRUD에서 멀티모듈로 넘어갈 임계점과 비용을 판단 기준으로 정리함
2026-05-29 00:00 [CREATE] [[판단기준-기술 로직과 비즈니스 로직을 어떻게 구분할 것인가]] · 기술 교체와 제품 정책 변화 기준으로 core와 adapter 경계를 나누는 기준을 정리함
2026-05-29 00:00 [CREATE] [[개념-감사 로그 (Audit Log)]] · 누가 언제 무엇을 바꿨는지 추적하는 감사 로그의 목적과 일반 로그와의 차이를 정리함
2026-05-29 00:00 [CREATE] [[개념-캐시 Evict Race Condition]] · 트랜잭션 커밋 전 캐시 무효화로 오래된 값이 재저장되는 경쟁 상태를 정리함
2026-05-29 00:00 [CREATE] [[본질-정합성과 무결성의 차이]] · 값 자체를 방어하는 무결성과 여러 상태의 흐름을 맞추는 정합성의 차이를 정리함
2026-05-29 00:00 [CREATE] [[본질-의존성 방향 (Dependency Direction)]] · 변하기 쉬운 구현이 core 업무 규칙을 끌고 가지 않도록 의존성 방향의 원리를 정리함
2026-05-29 00:00 [CREATE] [[개념-포트와 어댑터 (Port and Adapter)]] · core port와 support adapter로 외부 기술 의존을 숨기는 구조를 정리함
2026-05-29 00:00 [CREATE] [[개념-Command Query 분리]] · 상태 변경 모델과 조회 모델을 분리해 각각의 목적에 맞게 설계하는 방식을 정리함
2026-05-29 00:00 [CREATE] [[판단기준-트랜잭션 경계를 어디에 둘 것인가]] · usecase 원자성과 외부 I/O 비용을 기준으로 트랜잭션 경계를 정하는 기준을 정리함
2026-05-29 00:00 [CREATE] [[본질-이벤트의 불변성]] · 이미 발생한 사건은 수정하지 않고 보정 이벤트로 남긴다는 원리를 정리함
2026-05-29 00:00 [CREATE] [[개념-Append-only 이벤트 이력]] · 현재 상태와 별도로 상태 변경 사건을 시간순으로 추가 저장하는 방식을 정리함
2026-05-29 00:00 [CREATE] [[개념-TransactionAwareCacheManagerProxy]] · Spring 트랜잭션 commit 이후로 cache 작업을 동기화하는 proxy의 역할을 정리함
2026-05-29 00:00 [CREATE] [[개념-Cache Stampede]] · cache miss가 동시에 몰려 backend 부하를 폭증시키는 현상과 완화 방향을 정리함
2026-05-29 00:00 [CREATE] [[개념-JVM Heap Metric]] · JVM heap의 used·committed·max 지표 의미와 GC 관찰 기준을 정리함
2026-05-29 00:00 [CREATE] [[개념-G1 Evacuation Pause]] · G1 GC가 live object를 옮기며 발생시키는 stop-the-world pause를 정리함
2026-05-29 00:00 [CREATE] [[판단기준-GC Metric을 어떻게 해석할 것인가]] · heap·GC pause·latency·CPU·thread 지표를 함께 해석하는 기준을 정리함
2026-05-29 00:00 [CREATE] [[탐구-SQL은 논리 구문에서 물리 실행까지 어떻게 동작하는가]] · SQL의 FROM과 WHERE를 disk page와 memory buffer 관점으로 이해하려는 원문 질문을 진입점으로 기록함
2026-05-29 00:00 [CREATE] [[개념-SQL 물리 실행 흐름]] · SQL 문자열이 planner와 executor를 거쳐 scan node와 page 접근으로 내려가는 전체 흐름을 정리함
2026-05-29 00:00 [UPDATE] [[개념-Seq Scan]] · heap page를 shared buffer로 올린 뒤 tuple visibility와 Filter 조건을 평가하는 물리 흐름을 보강함
2026-05-29 00:00 [UPDATE] [[개념-Index Scan]] · index page에서 TID를 찾고 heap page를 읽어 visibility와 Filter를 평가하는 흐름을 보강함
2026-05-29 00:00 [UPDATE] [[개념-EXPLAIN ANALYZE]] · Filter, Index Cond, Buffers를 FROM/WHERE의 물리 실행 관점으로 읽는 방법을 추가함
2026-05-29 00:00 [UPDATE] [[개념-DBMS의 역할과 저장소 관리자 (Storage Manager)]] · executor scan node와 storage buffer manager가 SQL 실행에서 연결되는 구조를 보강함
2026-05-29 00:00 [CREATE] [[개념-Implementation 계층]] · application과 domain 사이에서 조회·저장·not found 처리 같은 usecase 행위를 맡는 계층을 정리함
2026-05-29 00:00 [CREATE] [[개념-Application Service]] · 외부 요청 하나의 usecase 흐름과 트랜잭션 경계를 조합하는 계층을 정리함
2026-05-29 00:00 [CREATE] [[개념-Domain Service와 Policy]] · 한 aggregate에 넣기 어려운 순수 도메인 규칙을 분리하는 객체를 정리함
2026-05-29 00:00 [CREATE] [[개념-Filter와 Index Cond]] · EXPLAIN에서 index 탐색 조건과 tuple 읽은 뒤 평가되는 필터 조건의 차이를 정리함
2026-05-29 00:00 [CREATE] [[개념-Buffers shared hit와 shared read]] · PostgreSQL EXPLAIN의 shared hit와 shared read가 memory buffer와 disk read를 어떻게 구분하는지 정리함
2026-05-29 00:00 [CREATE] [[개념-서브쿼리 실행 계획]] · 서브쿼리가 SQL 괄호 순서가 아니라 planner의 비용 기반 선택에 따라 InitPlan·SubPlan·join으로 실행될 수 있음을 정리함
2026-05-29 00:00 [CREATE] [[개념-InitPlan과 SubPlan]] · EXPLAIN에서 서브쿼리가 한 번 실행되는지 반복 실행되는지 구분하는 기준을 정리함
2026-05-29 00:00 [CREATE] [[개념-Semi Join과 Anti Join]] · EXISTS·IN·NOT EXISTS가 존재성 검사 join으로 최적화되는 방식을 정리함
2026-05-29 00:00 [UPDATE] [[개념-SQL 물리 실행 흐름]] · 서브쿼리도 문법 순서가 아니라 planner 선택에 따라 join·InitPlan·SubPlan으로 바뀔 수 있음을 보강함
2026-05-29 00:00 [UPDATE] [[개념-EXPLAIN ANALYZE]] · InitPlan·SubPlan·Semi Join·Anti Join과 loops를 통해 서브쿼리 실행 비용을 읽는 방법을 추가함
2026-05-29 00:00 [CREATE] [[개념-HikariCP]] · HikariCP가 모든 저장소 connection manager가 아니라 JDBC DataSource connection pool이라는 역할을 정리함
2026-05-29 00:00 [CREATE] [[개념-PlatformTransactionManager]] · Spring에서 @Transactional의 실제 begin·commit·rollback을 담당하는 transaction 전략 인터페이스를 정리함
2026-05-29 00:00 [CREATE] [[개념-TransactionSynchronizationManager]] · 현재 Java thread에 transaction resource를 bind하는 Spring 내부 delegate를 정리함
2026-05-29 00:00 [UPDATE] [[개념-Spring 트랜잭션 관리 (Transaction Management)]] · Tomcat 외 Kafka·Scheduler·Batch thread에서도 ThreadLocal 기반 트랜잭션이 동작하는 구조와 HikariCP의 책임 경계를 보강함
