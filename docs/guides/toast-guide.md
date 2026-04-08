# Toast 알림 시스템 가이드

프로젝트에서 일관된 사용자 피드백을 제공하기 위한 Toast 알림 시스템 사용 가이드입니다.

## 개요

`lib/utils/toast-utils.ts`는 도메인별로 분류된 Toast 메시지를 제공합니다:

- **EventToast**: 이벤트 CRUD 작업
- **ParticipantToast**: 참여자 관련 작업
- **ProfileToast**: 프로필 수정 작업
- **AuthToast**: 인증 작업
- **CommonToast**: 일반적인 작업

## 사용 방법

### 기본 사용법

```typescript
import { Toast, EventToast, ParticipantToast } from "@/lib/utils/toast-utils";

// 기본 Toast 함수들
Toast.success("성공 메시지");
Toast.error("에러 메시지");
Toast.warning("경고 메시지");
Toast.info("정보 메시지");

// 도메인별 Toast
EventToast.created("이벤트명", "초대코드");
ParticipantToast.joined("이벤트명");
ProfileToast.updated();
AuthToast.loginSuccess("사용자명");
```

## 도메인별 사용 규칙

### 1. EventToast - 이벤트 관련

**사용 시점:**

- 이벤트 생성/수정/삭제 성공/실패
- 커버 이미지 업로드 성공/실패

**사용 예:**

```typescript
// 이벤트 생성 성공
try {
  const event = await createEvent(formData);
  EventToast.created(event.title, event.invite_code);
} catch (error) {
  const msg = getErrorMessage(error);
  EventToast.createError(msg);
}

// 이벤트 수정 성공
try {
  await updateEvent(eventId, formData);
  EventToast.updated(eventName);
} catch (error) {
  EventToast.updateError();
}

// 이벤트 삭제 성공
try {
  await deleteEvent(eventId);
  EventToast.deleted();
} catch (error) {
  EventToast.deleteError();
}

// 커버 이미지 업로드 실패 (이벤트는 생성됨)
try {
  await uploadCoverImage(file);
} catch (error) {
  EventToast.coverImageUploadError();
}
```

**사용 가능한 메서드:**

- `created(eventName, inviteCode)`: 이벤트 생성 성공
- `updated(eventName)`: 이벤트 수정 성공
- `deleted()`: 이벤트 삭제 성공
- `createError(error?)`: 이벤트 생성 실패
- `updateError(error?)`: 이벤트 수정 실패
- `deleteError(error?)`: 이벤트 삭제 실패
- `coverImageUploadError()`: 커버 이미지 업로드 실패 (경고)
- `warningUploadFailed(description?)`: 이미지 업로드 실패 (경고)

---

### 2. ParticipantToast - 참여자 관련

**사용 시점:**

- 사용자가 이벤트에 참여
- 사용자가 이벤트에서 탈퇴
- 참여 실패 (이미 참여 중, 인원 초과 등)

**사용 예:**

```typescript
// 이벤트 참여 성공
try {
  await joinEvent(eventId);
  ParticipantToast.joined(eventName);
} catch (error) {
  if (error.code === "ALREADY_JOINED") {
    ParticipantToast.alreadyJoined();
  } else if (error.code === "MAX_PARTICIPANTS") {
    ParticipantToast.maxParticipantsReached();
  } else {
    const msg = getErrorMessage(error);
    ParticipantToast.joinError(msg);
  }
}

// 이벤트 탈퇴 성공
try {
  await leaveEvent(eventId);
  ParticipantToast.left(eventName);
} catch (error) {
  ParticipantToast.leaveError();
}
```

**사용 가능한 메서드:**

- `joined(eventName)`: 이벤트 참여 성공
- `left(eventName)`: 이벤트 탈퇴 성공
- `joinError(error?)`: 이벤트 참여 실패
- `leaveError(error?)`: 이벤트 탈퇴 실패
- `alreadyJoined()`: 이미 참여 중 (경고)
- `maxParticipantsReached()`: 참여 인원 초과 (에러)

---

### 3. ProfileToast - 프로필 관련

**사용 시점:**

- 사용자 프로필 수정
- 프로필 사진 업로드
- 프로필 초기 설정

**사용 예:**

```typescript
// 프로필 수정 성공
try {
  await updateProfile(formData);
  ProfileToast.updated();
} catch (error) {
  ProfileToast.updateError(getErrorMessage(error));
}

// 프로필 사진 업로드 성공
try {
  await uploadAvatar(file);
  ProfileToast.avatarUploaded();
} catch (error) {
  ProfileToast.avatarUploadError();
}

// 프로필 초기 설정 완료
try {
  await setupProfile(formData);
  ProfileToast.setupSuccess();
} catch (error) {
  ProfileToast.setupError();
}
```

**사용 가능한 메서드:**

- `updated()`: 프로필 수정 성공
- `avatarUploaded()`: 프로필 사진 업로드 성공
- `setupSuccess()`: 프로필 설정 완료
- `updateError(error?)`: 프로필 수정 실패
- `avatarUploadError(error?)`: 프로필 사진 업로드 실패
- `setupError(error?)`: 프로필 설정 실패
- `usernameNotAvailable()`: 사용자명 중복 (에러)

---

### 4. AuthToast - 인증 관련

**사용 시점:**

- 회원가입 성공/실패
- 로그인 성공/실패
- 로그아웃
- 비밀번호 변경

**사용 예:**

```typescript
// 회원가입 성공
try {
  await signUp(email, password);
  AuthToast.signUpSuccess();
  router.push("/auth/login");
} catch (error) {
  if (error.code === "EMAIL_EXISTS") {
    AuthToast.emailAlreadyExists();
  } else {
    AuthToast.signUpError(getErrorMessage(error));
  }
}

// 로그인 성공
try {
  await login(email, password);
  AuthToast.loginSuccess(userName);
  router.push("/protected");
} catch (error) {
  AuthToast.loginError(getErrorMessage(error));
}

// 로그아웃
await logout();
AuthToast.logoutSuccess();

// 비밀번호 변경
try {
  await resetPassword(newPassword);
  AuthToast.passwordResetSuccess();
} catch (error) {
  AuthToast.passwordResetError();
}
```

**사용 가능한 메서드:**

- `signUpSuccess()`: 회원가입 성공
- `loginSuccess(userName)`: 로그인 성공
- `logoutSuccess()`: 로그아웃 성공
- `passwordResetSuccess()`: 비밀번호 변경 성공
- `signUpError(error?)`: 회원가입 실패
- `loginError(error?)`: 로그인 실패
- `passwordResetError(error?)`: 비밀번호 변경 실패
- `emailAlreadyExists()`: 이메일 중복 (에러)

---

### 5. CommonToast - 일반적인 작업

**사용 시점:**

- 텍스트 복사
- 항목 삭제
- 데이터 저장
- 네트워크/서버 에러
- 예상 불가능한 에러

**사용 예:**

```typescript
// 텍스트 복사
const copyInviteLink = () => {
  navigator.clipboard.writeText(inviteLink);
  CommonToast.copySuccess("초대 링크");
};

// 항목 삭제
try {
  await deleteItem(id);
  CommonToast.deleteSuccess("항목명");
} catch (error) {
  CommonToast.unexpectedError();
}

// 데이터 저장
try {
  await saveData(formData);
  CommonToast.saveSuccess("데이터명");
} catch (error) {
  CommonToast.serverError();
}

// 네트워크 에러
try {
  await fetchData();
} catch (error) {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    CommonToast.networkError();
  } else {
    CommonToast.unexpectedError(getErrorMessage(error));
  }
}
```

**사용 가능한 메서드:**

- `copySuccess(text)`: 복사 성공
- `deleteSuccess(itemName)`: 삭제 성공
- `saveSuccess(itemName)`: 저장 성공
- `networkError()`: 네트워크 에러
- `serverError()`: 서버 에러
- `unexpectedError(error?)`: 예상 불가능한 에러
- `comingSoon()`: 준비 중 (정보)
- `confirmAction(action)`: 작업 확인 (정보)

---

## 베스트 프랙티스

### 1. 에러 메시지 처리

```typescript
// ❌ 잘못된 예: 기술적 에러 메시지 노출
try {
  await createEvent(data);
  EventToast.created(data.title);
} catch (error) {
  EventToast.createError(error.message); // ← 사용자가 모를 메시지
}

// ✅ 올바른 예: 사용자 친화적 메시지
import { getErrorMessage } from "@/lib/utils/error-handler";

try {
  await createEvent(data);
  EventToast.created(data.title);
} catch (error) {
  const userMessage = getErrorMessage(error); // ← 사용자 친화적
  EventToast.createError(userMessage);
}
```

### 2. 폼 제출 후 Toast 사용

```typescript
// ✅ 올바른 패턴: 폼 제출 완료 후에만 Toast
const onSubmit = async (data: FormData) => {
  try {
    const result = await createEvent(data);
    EventToast.created(result.title, result.invite_code);
    router.push(`/events/${result.id}`);
  } catch (error) {
    EventToast.createError(getErrorMessage(error));
  }
};
```

### 3. 로딩 Toast (장시간 작업용)

```typescript
// 장시간 작업의 경우 로딩 Toast 사용
const handleUpload = async () => {
  const toastId = Toast.loading("파일 업로드 중...");

  try {
    await uploadFile(file);
    Toast.dismiss(toastId); // 로딩 Toast 닫기
    Toast.success("업로드 완료");
  } catch (error) {
    Toast.dismiss(toastId);
    Toast.error(getErrorMessage(error));
  }
};
```

### 4. 실시간 업데이트 알림

```typescript
// useRealtimeSubscription 훅과 함께 사용
const [participants] = useRealtimeSubscription("event_participants", {
  event_id: eventId,
});

useEffect(() => {
  if (participants.length > prevCount) {
    const newParticipant = participants[participants.length - 1];
    ParticipantToast.joined(newParticipant.name); // ← 새 참여자 알림
  }
}, [participants]);
```

---

## Toast 타이밍 정리

| 작업               | Toast 타입   | 언제 표시                          |
| ------------------ | ------------ | ---------------------------------- |
| 데이터 저장        | success      | 서버 응답 수신 후                  |
| 데이터 삭제        | success      | 서버 응답 수신 후                  |
| 입력값 검증        | -            | Toast 사용 금지 (필드 에러만 표시) |
| 폼 제출 실패       | error        | 즉시 표시                          |
| 네트워크 연결 끊김 | error        | 즉시 표시                          |
| 파일 복사          | success      | 즉시 표시                          |
| 실시간 업데이트    | success/info | 업데이트 수신 후                   |

---

## 주의사항

1. **폼 검증 에러는 Toast 사용 금지**: 필드 옆에 에러 메시지를 표시합니다
2. **너무 많은 Toast 표시 금지**: 동시에 여러 Toast가 나타나면 사용자 경험 저하
3. **정확한 에러 메시지 사용**: `getErrorMessage(error)`로 변환하여 사용
4. **도메인 분류 준수**: EventToast, ParticipantToast 등 적절한 도메인 선택
5. **로딩 상태 관리**: 로딩 Toast는 반드시 `dismiss()`로 닫기
