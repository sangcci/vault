# Usecase 테스트 작성 시 여러 메서드로 흐름을 나타내라

이미 정책을 검증하는 곳은 domain test로 충분하다. 혹은 다른 영역.

Usecase 테스트가 보장하는 것은
- 시스템의 동작을 사람 혹은 AI Agent에게 보여주는 것
- 트랜잭션 단위 별로 흐름을 드러내는 것

```
ChangePassword Use Case

성공
 ├─ User 조회
 ├─ Password 변경
 ├─ 저장
 └─ Notification 발송

실패
 ├─ User 없음 → 실패
 └─ 변경 실패 → Notification 발송 X
```

- `changePasswordSuccessfully()` > 주요 Usecase 업무 성공 - AI가 이해하기 간편
- `failsWhenUserDoesNotExist()` > 트랜잭션 롤백이 어디까지 되는지 보여주는 용도
- `sendsNotificationAfterPasswordChanged()` > 트랜잭션 이후 업무 보장
- `doesNotSendNotificationWhenChangeFails()`

그래서 usecase 테스트는 정책 테스트처럼 하나만 독립적으로 보는게 아니라, **여러개 테스트가 유기적으로 연결된 형태임.**
