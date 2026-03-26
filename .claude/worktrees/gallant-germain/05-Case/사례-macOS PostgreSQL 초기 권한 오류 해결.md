---
aliases: [PostgreSQL_Auth_Error, 포스트그레스_권한_오류]
tags: [사례, 작성중]
type: Case
difficulty: Low
---

## 상황 (Situation)

- **환경**: macOS에서 Homebrew를 통해 PostgreSQL을 설치한 직후.
- **문제**: 기본 `postgres` 사용자로 접속하려고 할 때 `Ident authentication failed` 또는 비밀번호 불일치 오류가 발생함. (특히, 초기 비밀번호가 설정되지 않았거나 macOS 계정명과 연동된 문제)

## 실제 발생한 일 (What Happened)

- `psql -U postgres` 명령 실행 시 권한 오류 발생.
- PostgreSQL의 인증 설정(`pg_hba.conf`)에 따라 로컬 접속 시 실제 OS 사용자 계정과 DB 사용자 계정이 일치해야 하는 경우가 많음.
- 대부분의 관리 명령어는 `\`로 시작하는 메타 명령어로 구성됨. (예: `\d`, `\du`, `\l` 등)

## 근본 원인 (Root Cause)

- **인증 방식의 불일치**: 초기 설치 시 PostgreSQL은 로컬 접속(Unix Domain Socket)에 대해 비밀번호 없이 OS 사용자 인증(Peer/Ident)을 시도하거나, 초기 비밀번호가 랜덤하게 설정되어 있음.
- **초기 유저 미비**: 기본 `postgres` 유저가 생성되어 있지 않거나, 현재 macOS 계정에 대한 DB 유저가 없어 발생하는 문제.

## 교훈 및 조치 (Lessons & Fixes)

1.  **초기 비밀번호 재설정**:
    - `psql postgres` (현재 OS 계정으로 접속 시도)
    - `ALTER USER postgres WITH PASSWORD 'your_password';` 명령으로 비밀번호 수동 설정.
2.  **명령어 팁**:
    - `\d`: 테이블, 뷰, 시퀀스 목록 조회 (기본).
    - `\dt`: 테이블 목록만 조회.
    - `\du`: 사용자 및 권한 목록 조회.
    - `\q`: 접속 종료.
3.  **참고 자료**: [PostgreSQL 인증 오류 해결 가이드 (tistory)](https://memoryhub.tistory.com/entry/PostgreSQL-%EC%9D%B8%EC%A6%9D-%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B0-%EA%B0%80%EC%9D%B4%EB%93%9C-Mac%EC%97%90%EC%84%9C-%EB%B9%84%EB%B0%80%EB%B2%88%ED%98%B8-%EC%9E%AC%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)
