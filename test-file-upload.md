# 파일 크기 제한 테스트 가이드

## 📋 테스트 계획

### 테스트 계정

- **이메일**: dhljjknd@gmail.com
- **비밀번호**: 123456

### 테스트 시나리오

#### 1️⃣ 프로필 사진 업로드 테스트

**경로**: `/protected/account`

**테스트 절차**:

1. 로그인 (dhljjknd@gmail.com / 123456)
2. 프로필 페이지 접속
3. 프로필 사진 영역에서 "사진 변경" 클릭
4. 다양한 크기의 이미지 파일 선택:
   - ✅ 2MB 이미지 (성공해야 함)
   - ✅ 4MB 이미지 (성공해야 함)
   - ❌ 6MB 이미지 (실패해야 함: "파일 크기는 5MB 이하여야 합니다.")

**예상 결과**:

```
5MB 이하: ✅ "프로필 사진이 업로드되었습니다"
5MB 초과: ❌ "파일 크기는 5MB 이하여야 합니다."
```

#### 2️⃣ 이벤트 커버 이미지 업로드 테스트

**경로**: `/protected/events/new` 또는 `/protected/events/{eventId}/edit`

**테스트 절차**:

1. 로그인 (dhljjknd@gmail.com / 123456)
2. 새 이벤트 생성 또는 기존 이벤트 수정
3. 커버 이미지 파일 입력란에서:
   - ✅ 2MB 이미지 (성공해야 함)
   - ✅ 4MB 이미지 (성공해야 함)
   - ❌ 6MB 이미지 (실패해야 함)

**예상 결과**:

```
5MB 이하: ✅ "이벤트가 생성/수정되었습니다"
5MB 초과: ❌ "파일 크기는 5MB 이하여야 합니다."
```

## 📊 현재 설정값

### 코드 검증

```typescript
// 모든 업로드에서 5MB 제한 적용
if (file.size > 5 * 1024 * 1024) {
  // 5MB = 5,242,880 bytes
  error: "파일 크기는 5MB 이하여야 합니다.";
}
```

### 파일별 위치

| 파일                | 위치                   | 제한 | 상태 |
| ------------------- | ---------------------- | ---- | ---- |
| 프로필 (클라이언트) | account-form.tsx:152   | 5MB  | ✅   |
| 프로필 (서버)       | account/actions.ts:115 | 5MB  | ✅   |
| 이벤트 (서버)       | events/actions.ts:296  | 5MB  | ✅   |

## 🔧 테스트 파일 생성 (로컬)

### Linux/Mac

```bash
# 2MB 파일 생성
dd if=/dev/zero of=test-2mb.jpg bs=1M count=2

# 4MB 파일 생성
dd if=/dev/zero of=test-4mb.jpg bs=1M count=4

# 6MB 파일 생성
dd if=/dev/zero of=test-6mb.jpg bs=1M count=6
```

### Windows PowerShell

```powershell
# 2MB 파일
$file = [System.IO.File]::Create("test-2mb.jpg")
$file.SetLength(2 * 1024 * 1024)
$file.Close()

# 4MB 파일
$file = [System.IO.File]::Create("test-4mb.jpg")
$file.SetLength(4 * 1024 * 1024)
$file.Close()

# 6MB 파일
$file = [System.IO.File]::Create("test-6mb.jpg")
$file.SetLength(6 * 1024 * 1024)
$file.Close()
```

## ✅ 검증 체크리스트

- [ ] 2MB 파일 업로드 성공 (프로필)
- [ ] 4MB 파일 업로드 성공 (프로필)
- [ ] 6MB 파일 업로드 실패 (프로필)
- [ ] 2MB 파일 업로드 성공 (이벤트)
- [ ] 4MB 파일 업로드 성공 (이벤트)
- [ ] 6MB 파일 업로드 실패 (이벤트)
- [ ] 에러 메시지 일관성 확인

## 📝 결론

**모든 파일 크기 제한이 5MB로 통일되어 있습니다.** ✅

사용자가 경험한 1MB 제한은:

1. Supabase Storage 자체의 기본 설정일 가능성
2. 과거 버전의 코드일 가능성
3. 다른 조건에서의 검증일 가능성

현재 코드에서는 **5MB 제한이 명확히 적용**되어 있습니다.
