# Google OAuth 로그인 설정 가이드

Google 로그인 기능이 완전히 동작하려면 다음 3단계 설정이 필요합니다.

---

## 1단계: Google Cloud Console 설정

### 1.1 Google Cloud 프로젝트 생성/선택

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 상단의 프로젝트 드롭다운에서 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1.2 OAuth 2.0 Client ID 생성

1. 좌측 메뉴 → **APIs & Services** → **Credentials**
2. **+ Create Credentials** → **OAuth 2.0 Client ID**
3. 처음 생성하는 경우 "Consent Screen 설정 필요" 메시지 표시:
   - **Create Consent Screen** 버튼 클릭
   - User Type: **External** 선택 후 생성
   - 다음 페이지에서 최소 필수 정보만 입력 후 저장

4. 다시 **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application** 선택
6. Name: 예) "My Next.js App"

### 1.3 Authorized Redirect URIs 추가

1. **Authorized redirect URIs** 섹션에 다음 URLs 추가:

   ```
   https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
   ```

   예시:

   ```
   https://abcdefghijk.supabase.co/auth/v1/callback
   ```

2. **Create** 클릭

### 1.4 Client ID와 Secret 복사

생성 후 팝업 또는 Credentials 페이지에서:

- **Client ID** (긴 문자열, `.apps.googleusercontent.com` 포함)
- **Client Secret** (비밀번호처럼 관리)

→ 다음 단계에서 필요하므로 어딘가 메모해두세요.

---

## 2단계: Supabase Dashboard 설정

### 2.1 Google Provider 활성화

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → **Authentication** → **Providers**
3. **Google** 찾기 → 토글 **활성화**

### 2.2 Google Client 정보 입력

Google Cloud Console에서 복사한 정보 입력:

- **Client ID**: (Google Cloud에서 복사)
- **Client Secret**: (Google Cloud에서 복사)

### 2.3 저장

**Save** 버튼 클릭

---

## 3단계: Supabase URL 설정

### 3.1 Site URL 확인

1. **Authentication** → **URL Configuration**
2. **Site URL** 확인 (기본값: `https://example.com`)

### 3.2 Redirect URLs 추가

**Additional Redirect URLs** 섹션에 다음 추가:

**개발 환경:**

```
http://localhost:3000/auth/callback
```

**프로덕션 환경:**

```
https://your-production-domain.com/auth/callback
```

예시:

```
http://localhost:3000/auth/callback
https://myapp.com/auth/callback
https://www.myapp.com/auth/callback
```

→ 각 줄에 하나씩 입력

### 3.3 저장

**Save** 클릭

---

## 로컬 테스트

설정 완료 후 로컬에서 테스트:

```bash
npm run dev
```

브라우저에서 다음 경로 접속:

- **로그인 페이지**: http://localhost:3000/auth/login
- **회원가입 페이지**: http://localhost:3000/auth/sign-up

### 테스트 순서

1. "Login with Google" 또는 "Sign up with Google" 버튼 클릭
2. Google 계정 선택 화면으로 이동 확인
3. Google 계정 선택
4. `/protected` 페이지로 리다이렉트되고 인증 상태 확인

### 발생 가능한 에러

| 에러                    | 원인                     | 해결                  |
| ----------------------- | ------------------------ | --------------------- |
| "Redirect URI mismatch" | Supabase URL 설정 미완료 | 3단계 확인            |
| "Invalid Client ID"     | Google Cloud 설정 오류   | 1단계-1.2 재확인      |
| "Unknown error"         | CORS 또는 네트워크 문제  | 개발자 도구 콘솔 확인 |

---

## 구현 코드 위치

### OAuth 콜백 처리

- **파일**: `app/auth/callback/route.ts`
- **역할**: Google에서 받은 `code`를 서버 세션으로 교환

### Google 로그인 버튼

- **파일**: `components/google-oauth-button.tsx`
- **역할**: 로그인/회원가입 폼에 추가된 Google 버튼 컴포넌트

### 통합된 폼

- **로그인 폼**: `components/login-form.tsx`
- **회원가입 폼**: `components/sign-up-form.tsx`

---

## 프로덕션 배포 체크리스트

- [ ] Google Cloud Console에서 프로덕션 도메인을 Authorized Redirect URI에 추가
- [ ] Supabase URL Configuration에서 프로덕션 도메인 추가
- [ ] 환경 변수 설정 (`.env.local` 또는 배포 플랫폼의 비밀 변수):
  - `NEXT_PUBLIC_SUPABASE_URL` (기존 - 변경 불필요)
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (기존 - 변경 불필요)

---

## 문제 해결

### 로컬 테스트 중 계속 로그인 페이지로 리다이렉트됨

**원인**: Supabase 또는 Google 설정 오류

**확인 사항**:

1. 개발자 도구 → Network 탭에서 `/auth/callback?code=...` 요청 확인
2. 해당 요청의 응답 상태 코드 확인 (200이어야 함)
3. 콘솔 탭에서 에러 메시지 확인

---

## 참고

- [Supabase 공식 Google Auth 가이드](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Next.js OAuth 베스트 프랙티스](https://nextjs.org/docs/authentication)
