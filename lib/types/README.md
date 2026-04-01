# 타입 정의 시스템 (lib/types)

## 📋 개요

이 디렉토리는 전체 애플리케이션의 TypeScript 타입을 중앙화하여 관리합니다.
Type-safe 개발을 위해 모든 도메인 모델, 컴포넌트 Props, 폼 데이터, 상태 등을 여기서 정의합니다.

## 📁 파일 구조

```
lib/types/
├── index.ts                    # 모든 타입의 중앙 재내보내기
├── database.types.ts           # Supabase 데이터베이스 스키마 타입 (자동 생성)
├── user.ts                     # 사용자 관련 타입
├── event.ts                    # 이벤트 관련 타입
├── participant.ts              # 참여자 관련 타입
├── api.ts                      # API 응답 타입
├── component.ts                # 컴포넌트 Props 타입
├── form.ts                     # 폼 데이터 및 Zod 스키마 타입
├── context.ts                  # Context API 타입
├── ui.ts                       # UI 상태 타입
├── routes.ts                   # 라우트 파라미터 및 쿼리 타입
├── storage.ts                  # 로컬/세션 스토리지 타입
└── README.md                   # 이 파일
```

## 🚀 사용 방법

### 기본 import

```typescript
// 전체 export 사용
import type {
  Event,
  User,
  LoadingState,
  EventCardProps,
  LoginFormData,
} from "@/lib/types";

// 또는 구체적인 파일에서
import type { Event, EventStatus } from "@/lib/types/event";
import type { EventCardProps } from "@/lib/types/component";
```

### 파일별 사용 예

#### 1. **user.ts** - 사용자 타입

```typescript
import type { User, UserProfile } from "@/lib/types";

const user: User = {
  id: "123",
  email: "user@example.com",
  name: "홍길동",
  role: "user",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: null,
};
```

#### 2. **event.ts** - 이벤트 타입

```typescript
import type { Event, CreateEventInput } from "@/lib/types";

const eventData: CreateEventInput = {
  title: "팀 빌딩",
  start_date: "2026-04-15T10:00:00Z",
  location: "서울",
  description: "팀 협력 활동",
};
```

#### 3. **component.ts** - 컴포넌트 Props

```typescript
import type { EventCardProps } from "@/lib/types";

export function EventCard({ event, variant = "default" }: EventCardProps) {
  // 컴포넌트 구현
}
```

#### 4. **form.ts** - 폼 데이터

```typescript
import type { CreateEventFormData, LoginFormData } from "@/lib/types";

// React Hook Form과 함께 사용
function EventForm() {
  const { register } = useForm<CreateEventFormData>();

  return (
    <input {...register("title")} />
  );
}
```

#### 5. **context.ts** - Context 타입

```typescript
import type { AuthContextType } from "@/lib/types";

const AuthContext = createContext<AuthContextType | null>(null);
```

#### 6. **ui.ts** - UI 상태

```typescript
import type { LoadingState, FetchState } from "@/lib/types";

interface MyComponentState {
  loading: LoadingState; // 'idle' | 'loading' | 'success' | 'error'
  data: FetchState<User[]>;
}
```

#### 7. **routes.ts** - 라우트 파라미터

```typescript
import {
  ROUTES,
  buildQueryString,
  type EventDetailPageParams,
} from "@/lib/types";

// 라우트 경로 접근
const eventListUrl = ROUTES.PROTECTED.EVENTS.LIST; // "/protected/events"
const eventDetailUrl = ROUTES.PROTECTED.EVENTS.DETAIL("123"); // "/protected/events/123"

// 쿼리 문자열 생성
const url = `/protected/events${buildQueryString({
  page: "1",
  sort: "date",
  order: "desc",
})}`; // "/protected/events?page=1&sort=date&order=desc"

// 페이지 컴포넌트에서 params 사용
export default async function EventDetailPage({
  params,
}: {
  params: EventDetailPageParams;
}) {
  const { eventId } = params;
  // ...
}
```

#### 8. **storage.ts** - 스토리지 타입

```typescript
import { LocalStorageKey, type LocalStorageState } from "@/lib/types";

// 키 오타 방지
localStorage.setItem(
  LocalStorageKey.THEME,
  JSON.stringify({
    mode: "dark",
  }),
);
```

## 🔄 Phase별 진행 현황

### Phase 1: 애플리케이션 골격 ✅

- ✅ 기본 도메인 타입 정의 (user, event, participant)
- ✅ API 응답 타입 정의
- ✅ 컴포넌트 Props 타입 중앙화
- ✅ 폼 데이터 타입 정의
- ✅ Context 타입 정의
- ✅ UI 상태 타입 정의
- ✅ 라우트 파라미터 타입 정의
- ✅ 스토리지 타입 정의

### Phase 3: 데이터베이스 설정 (예정)

🔄 **database.types.ts 마이그레이션 계획**

현재 `database.types.ts`는 Supabase 기본 프로필 스키마만 포함합니다.
Phase 3에서 실제 데이터베이스 스키마가 생성되면, 다음과 같이 업데이트됩니다:

```bash
# Supabase 스키마가 정의된 후 실행
npx supabase gen types typescript > lib/types/database.types.ts
```

그 이후 다음 타입들을 자동 생성된 타입으로 교체할 수 있습니다:

- `User` → `Database["public"]["Tables"]["users"]["Row"]`
- `Event` → `Database["public"]["Tables"]["events"]["Row"]`
- `Participant` → `Database["public"]["Tables"]["event_participants"]["Row"]`

### 마이그레이션 예시

```typescript
// Phase 1 (현재)
import type { Event } from "@/lib/types/event";

const event: Event = {
  /* ... */
};

// Phase 3 (이후)
import type { Database } from "@/lib/types/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];
const event: Event = {
  /* ... */
};
```

## 📐 타입 설계 원칙

### 1. **도메인별 분리**

각 도메인 모델은 독립적인 파일로 관리합니다:

- `user.ts`: 사용자 관련
- `event.ts`: 이벤트 관련
- `participant.ts`: 참여자 관련

### 2. **컴포넌트 Props 중앙화**

모든 컴포넌트 Props를 `component.ts`에서 관리하여:

- Props 타입 재사용 용이
- Props 변경시 영향 범위 명확
- IDE 자동완성 지원

### 3. **UI 상태 제네릭 활용**

```typescript
// 제네릭으로 재사용성 극대화
type FetchState<T> = { data: T | null; loading: boolean; error: string | null };

const events: FetchState<Event[]> = {
  /* ... */
};
const user: FetchState<User> = {
  /* ... */
};
```

### 4. **Literal Union Types**

```typescript
// ❌ 피해야 할 것
type Status = string;

// ✅ 권장
type Status = "idle" | "loading" | "success" | "error";
```

### 5. **JSDoc 주석**

모든 주요 타입과 인터페이스는 JSDoc 주석을 포함합니다:

```typescript
/**
 * 사용자 기본 정보
 * @description DB의 users 테이블에 대응될 예정 (Phase 3)
 */
export interface User {
  /* ... */
}
```

## ⚠️ 주의사항

### 1. **database.types.ts는 자동 생성**

`database.types.ts`는 Supabase에서 자동 생성됩니다.
직접 수정하지 말고, 다음 명령어로만 업데이트합니다:

```bash
npx supabase gen types typescript > lib/types/database.types.ts
```

### 2. **타입 순환 참조 회피**

예를 들어:

```typescript
// ❌ 순환 참조 회피
// event.ts에서 participant를 import하고
// participant.ts에서 event를 import하는 경우

// ✅ 해결책: 공통 인터페이스 분리
// common.ts에서 정의 후 양쪽에서 import
```

### 3. **`any` 타입 최소화**

- `any`는 마지막 수단으로만 사용
- 대신 `unknown`, 제네릭, Union type 활용

### 4. **Optional과 Required 명확화**

```typescript
// ✅ 명확한 타입
interface CreateEventInput {
  title: string; // 필수
  description?: string; // 선택사항
}
```

## 🧪 타입 검증

프로젝트 타입 검사:

```bash
# TypeScript 타입 검사 (빌드 없이)
npm run type-check

# ESLint 검사
npm run lint

# 자동 수정
npm run lint -- --fix
```

## 📞 추가 리소스

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Types](https://supabase.com/docs/guides/api/generating-types)
- [React Props Typing](https://react.dev/reference/react/FC#typing-react-component)

## 🔮 향후 개선 사항

- [ ] Zod 스키마 구현 (Phase 4)
- [ ] API 타입 자동 생성 (OpenAPI/GraphQL)
- [ ] 폴리모픽 컴포넌트 타입 개선
- [ ] 스토리지 타입 런타임 검증
