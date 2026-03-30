# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 개발 환경 설정

### 필수 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# ESLint 검사
npm run lint

# 단일 파일 lint
npm run lint -- --fix path/to/file.ts
```

### 환경 변수 (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

> [!NOTE]
> `NEXT_PUBLIC_` 접두사는 브라우저에 노출되어도 안전한 공개 키에만 사용합니다.
> Supabase 대시보드의 API 설정에서 값을 찾을 수 있습니다.

---

## 🏗️ 아키텍처 개요

### 핵심 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS + shadcn/ui
- **Type Safety**: TypeScript (strict mode)
- **Auth Mechanism**: Cookie-based with supabase-ssr

### 주요 아키텍처 특징

#### 1. **SSR 기반 쿠키 인증**

```
Next.js Middleware → Supabase Session 검증 → 페이지 렌더링
                          ↓
                    쿠키 기반 유지
```

- 서버 컴포넌트에서 직접 쿠키 접근 가능
- 클라이언트와 서버에서 별도의 Supabase 클라이언트 사용
- 세션 갱신은 프록시를 통해 자동 처리

#### 2. **클라이언트 vs 서버 쿠키 분리**

```
lib/supabase/
├── client.ts    # 브라우저 환경용 (createBrowserClient)
└── server.ts    # 서버 환경용 (createServerClient)
                 # - 매번 새로운 인스턴스 생성 필수
                 # - 쿠키 업데이트 처리 포함
```

**⚠️ 중요**: 서버 클라이언트는 **함수 내부에서만** 생성합니다. 글로벌 변수로 선언하면 안 됩니다 (Supabase Fluid Compute 호환성).

#### 3. **라우트 계층 구조**

```
app/
├── (public routes)
│   ├── page.tsx              # 홈페이지
│   └── auth/                 # 인증 페이지들
│       ├── login/
│       ├── sign-up/
│       └── ...
└── protected/                # 인증 필수 라우트
    ├── layout.tsx            # 인증 체크 미들웨어
    └── [feature]/
        └── page.tsx
```

- `protected/` 하위는 자동으로 인증 검사
- 레이아웃의 `createClient()`로 세션 확인

#### 4. **타입 안전성**

```
lib/types/database.types.ts   # Supabase 생성 타입
                              # (supabase gen types typescript 로 갱신)
```

- 모든 DB 쿼리는 `Database` 제네릭과 함께 타입화
- 클라이언트와 서버 모두 동일한 타입 사용

---

## 📂 핵심 폴더 구조

### `app/` - App Router 페이지

```
app/
├── layout.tsx                # 전역 레이아웃 (테마, 프로바이더)
├── globals.css               # 전역 스타일
├── page.tsx                  # 홈페이지 (/)
├── auth/
│   ├── login/page.tsx
│   ├── sign-up/page.tsx
│   ├── forgot-password/page.tsx
│   └── [action]/route.ts     # OAuth 콜백
└── protected/
    ├── layout.tsx            # ← 인증 체크 로직
    ├── page.tsx              # 대시보드
    └── account/
        ├── page.tsx
        └── account-form.tsx  # 사용자 정보 수정
```

**규칙:**

- `page.tsx`: 해당 경로의 렌더링 컴포넌트
- `layout.tsx`: 자식 페이지의 공통 레이아웃/로직
- Route Handlers는 `[route]/route.ts`로 정의

### `components/` - UI 컴포넌트

```
components/
├── ui/                       # shadcn/ui 컴포넌트
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── auth-button.tsx           # Supabase 인증 버튼
├── login-form.tsx            # 로그인 폼 (클라이언트 컴포넌트)
├── sign-up-form.tsx          # 가입 폼 (클라이언트 컴포넌트)
├── theme-switcher.tsx        # 다크모드 토글
└── tutorial/                 # 튜토리얼 관련 컴포넌트
```

**규칙:**

- `ui/` 폴더: 순수 UI 컴포넌트만 (shadcn/ui 또는 커스텀)
- 나머지: 비즈니스 로직이 있는 컴포넌트
- 폼은 `'use client'`로 표시 (클라이언트 컴포넌트)

### `lib/` - 유틸리티 및 설정

```
lib/
├── supabase/
│   ├── client.ts             # 브라우저 클라이언트
│   ├── server.ts             # 서버 클라이언트
│   └── proxy.ts              # 세션 갱신 프록시
├── types/
│   └── database.types.ts     # Supabase 생성 타입
├── utils.ts                  # 공통 유틸리티 (clsx, cn 등)
└── hooks/                    # 커스텀 훅 (필요시)
```

---

## 🔐 인증 흐름

### 1. 로그인/가입 플로우

```
1. 사용자가 로그인/가입 폼 제출
   ↓
2. 클라이언트 컴포넌트 (signUpWithPassword 또는 signInWithPassword)
   ↓
3. Supabase에서 응답 (토큰 or 오류)
   ↓
4. 미들웨어가 쿠키 확인 및 유효한 세션 설정
   ↓
5. 사용자를 대시보드로 리다이렉트
```

### 2. 세션 유지

- **클라이언트**: `createClient()` (browser client)
  - 인터랙티브 요청(폼 제출, 버튼 클릭)에 사용
  - 자동으로 쿠키 업데이트

- **서버**: `createClient()` (server client)
  - 페이지 렌더링, 서버 액션에 사용
  - 쿠키 업데이트를 setAll 메서드로 처리
  - 항상 **새로운 인스턴스** 생성 (글로벌 변수 금지)

### 3. 인증 보호

```typescript
// app/protected/layout.tsx 예시
export default async function ProtectedLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return children;
}
```

---

## 🎨 스타일링 규칙

### Tailwind CSS + shadcn/ui

```bash
# shadcn/ui 컴포넌트 추가
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

**규칙:**

- UI 기본 컴포넌트는 `components/ui/`에서 관리
- 커스텀 스타일은 Tailwind 클래스로 추가
- CSS Modules 대신 Tailwind 사용
- `cn()` 함수로 클래스 병합 (`lib/utils.ts`)

```typescript
import { cn } from "@/lib/utils";

export function MyComponent() {
  return <div className={cn("bg-blue-500", "hover:bg-blue-600")} />
}
```

---

## 📝 타입 안전성

### Supabase 타입 생성

```bash
# 데이터베이스 스키마 변경 후
npm run supabase gen types typescript > lib/types/database.types.ts
```

또는 Supabase CLI:

```bash
supabase gen types typescript --project-id <project-id> > lib/types/database.types.ts
```

### 쿼리 작성 예시

```typescript
const { data, error } = await supabase
  .from("users")
  .select("*")
  .eq("id", userId)
  .single();

// 타입 자동 추론: data는 Database["public"]["Tables"]["users"]["Row"] | null
```

---

## 🔧 일반적인 개발 작업

### 새 페이지 추가

```bash
# 공개 페이지
app/about/page.tsx

# 인증 필수 페이지
app/protected/dashboard/page.tsx

# 동적 라우트
app/protected/users/[id]/page.tsx
```

### 새 컴포넌트 추가

```bash
# UI 컴포넌트 (shadcn/ui)
npx shadcn-ui@latest add your-component

# 커스텀 컴포넌트
components/my-feature.tsx (클라이언트) 또는
components/my-feature-server.tsx (서버)
```

### 서버 액션 작성

```typescript
// app/protected/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient();
  // 처리 로직
}
```

---

## ⚠️ 주의사항

### 1. 서버 클라이언트 생성

```typescript
// ❌ 잘못된 패턴 (글로벌 변수)
const supabase = await createClient();
export async function getUser() {
  return supabase.auth.getUser();
}

// ✅ 올바른 패턴 (함수 내부)
export async function getUser() {
  const supabase = await createClient();
  return supabase.auth.getUser();
}
```

**이유**: Supabase Fluid Compute와 호환성 유지.

### 2. 클라이언트 vs 서버 분리

```typescript
// ❌ 클라이언트 환경에서 서버 클라이언트 사용
// app/protected/page.tsx (서버 컴포넌트)
import { createClient as createServerClient } from "@/lib/supabase/server";

// ✅ 올바른 패턴
// 브라우저 상호작용: 클라이언트 컴포넌트 + createClient()
// 페이지 렌더링: 서버 컴포넌트 + createClient()
```

### 3. 환경 변수 접근

```typescript
// ✅ 브라우저 노출 가능 (공개 키)
process.env.NEXT_PUBLIC_SUPABASE_URL;
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// ❌ 서버 전용 변수는 NEXT_PUBLIC_ 없음
process.env.SUPABASE_SERVICE_ROLE_KEY; // 서버 액션에서만
```

### 4. 쿠키 업데이트

```typescript
// 서버 컴포넌트에서 쿠키 설정 시도하면 오류 발생
// → 서버 액션이나 Route Handler에서만 쿠키 업데이트 가능
```

---

## 🧪 테스트

### ESLint 검사

```bash
npm run lint
npm run lint -- --fix  # 자동 수정
```

---

## 📚 추가 리소스

### 프로젝트 문서

- `docs/guides/project-structure.md` - 폴더 구조 및 컨벤션
- `docs/guides/component-patterns.md` - 컴포넌트 작성 패턴
- `docs/guides/forms-react-hook-form.md` - 폼 작성 가이드
- `docs/guides/styling-guide.md` - 스타일링 가이드
- `docs/guides/nextjs-15.md` - Next.js 15 특화 가이드

### 공식 문서

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SSR with Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com)

---

## 💡 개발 팁

### 1. 빠른 디버깅

```typescript
// 브라우저 콘솔 확인
console.log("Debug info:", data);

// 서버 로그 확인 (터미널)
console.log("Server debug:", result);
```

### 2. 타입 검사

```bash
# TypeScript 타입 체크 (빌드 없이)
npm run build  # 빌드 시 타입 에러 감지
```

### 3. 성능 모니터링

Next.js 내장 성능 도구:

- `next/image` - 이미지 최적화
- `next/font` - 폰트 최적화
- Server Components - 자동 번들 크기 감소

---

## 🔄 일반적인 실수와 해결책

| 문제                       | 원인                          | 해결책                             |
| -------------------------- | ----------------------------- | ---------------------------------- |
| "Cannot read cookies" 오류 | 클라이언트에서 쿠키 접근 시도 | 서버 컴포넌트 또는 서버 액션 사용  |
| 무한 리다이렉트            | 세션 검증 루프                | `protected/layout.tsx`의 로직 확인 |
| 환경 변수 undefined        | 빌드 후 변수 변경             | 빌드 전에 `.env.local` 설정        |
| Supabase 타입 오래됨       | 스키마 변경 후 타입 미갱신    | `npm run supabase gen types` 실행  |
