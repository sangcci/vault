# PostgreSQL Boolean 타입

## 핵심

PostgreSQL은 **`BOOLEAN`을 네이티브 타입**으로 지원한다.
MySQL의 `TINYINT(1)` 방식과 달리, 진짜 true/false로 저장된다.

---

## MySQL vs PostgreSQL 비교

| 항목 | MySQL | PostgreSQL |
|------|-------|------------|
| Boolean 저장 방식 | `TINYINT(1)` (0/1 정수) | `BOOLEAN` (true/false) |
| JDBC setter | `ps.setByte(4, (byte) 0)` | `ps.setBoolean(4, false)` |
| 값 표현 | 0, 1 | true, false, 't', 'f', 'yes', 'no', '1', '0' |

---

## 실제 사례 (NotificationJdbcRepository)

### 문제가 된 코드 (MySQL 방식)
```java
ps.setByte(4, (byte) 0);  // TINYINT(1) 방식
```

PostgreSQL에서는 `BOOLEAN` 컬럼에 byte 타입 바인딩 시 타입 불일치 에러 발생

### 수정된 코드
```java
ps.setBoolean(4, false);  // PostgreSQL BOOLEAN 방식
```

---

## JDBC에서 PostgreSQL Boolean 처리

```java
// 올바른 방식
ps.setBoolean(index, true);   // true 저장
ps.setBoolean(index, false);  // false 저장

// PreparedStatement.setObject도 가능
ps.setObject(index, Boolean.FALSE);
```

---

## JPA/Hibernate에서는?

```java
@Column(name = "is_read")
private boolean isRead;  // 자동으로 BOOLEAN 매핑
```

JPA는 `boolean` / `Boolean` 타입을 자동으로 PostgreSQL `BOOLEAN`에 매핑하므로 별도 설정 불필요.
문제는 **JDBC 직접 사용 시** (JdbcTemplate.batchUpdate 등) 수동으로 타입을 맞춰야 한다는 점.

---

## MySQL → PostgreSQL 마이그레이션 체크리스트

- [ ] `TINYINT(1)` 컬럼 → `BOOLEAN`으로 DDL 변경
- [ ] `JdbcTemplate` / `NamedParameterJdbcTemplate` 사용 코드에서 `setByte` → `setBoolean` 변경
- [ ] `ResultSet.getByte()` → `ResultSet.getBoolean()` 변경 (조회 시)
- [ ] MyBatis 사용 시 `resultMap`의 `javaType`/`jdbcType` 확인

---

## PostgreSQL Boolean 리터럴

```sql
-- 모두 동일한 true
SELECT TRUE, 'true', 't', 'yes', 'on', '1';

-- 모두 동일한 false
SELECT FALSE, 'false', 'f', 'no', 'off', '0';
```

> DDL에서 기본값 설정 예시: `is_read BOOLEAN NOT NULL DEFAULT FALSE`