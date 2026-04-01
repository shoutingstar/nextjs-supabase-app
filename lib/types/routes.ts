/**
 * Route 파라미터 타입 정의
 * Next.js App Router 동적 라우트 파라미터 타입
 */

/**
 * 루트 레이아웃 파라미터
 * @description app/layout.tsx에서 사용
 */
export interface RootLayoutParams {
  locale?: string;
  theme?: string;
}

/* ============================================================================
 * 공개 라우트 파라미터
 * ============================================================================ */

/**
 * 홈 페이지 파라미터
 * @description app/page.tsx - 동적 파라미터 없음
 */
export type HomePageParams = Record<string, never>;

/**
 * 인증 페이지 파라미터
 * @description app/auth/[action]/page.tsx
 */
export interface AuthPageParams {
  action: "login" | "sign-up" | "forgot-password" | "update-password";
}

/* ============================================================================
 * 보호된 라우트 (Protected) 파라미터
 * ============================================================================ */

/**
 * Protected 레이아웃 파라미터
 * @description app/protected/layout.tsx
 */
export type ProtectedLayoutParams = Record<string, never>;

/**
 * 대시보드 페이지 파라미터
 * @description app/protected/page.tsx
 */
export type DashboardPageParams = Record<string, never>;

/**
 * 계정 페이지 파라미터
 * @description app/protected/account/page.tsx
 */
export type AccountPageParams = Record<string, never>;

/* ============================================================================
 * 이벤트 라우트 파라미터
 * ============================================================================ */

/**
 * 이벤트 목록 페이지 파라미터
 * @description app/protected/events/page.tsx
 */
export type EventsListPageParams = Record<string, never>;

/**
 * 이벤트 생성 페이지 파라미터
 * @description app/protected/events/new/page.tsx
 */
export type EventCreatePageParams = Record<string, never>;

/**
 * 이벤트 상세 페이지 파라미터
 * @description app/protected/events/[eventId]/page.tsx
 */
export interface EventDetailPageParams {
  eventId: string;
}

/**
 * 이벤트 수정 페이지 파라미터
 * @description app/protected/events/[eventId]/edit/page.tsx
 */
export interface EventEditPageParams {
  eventId: string;
}

/**
 * 이벤트 카풀 페이지 파라미터
 * @description app/protected/events/[eventId]/carpool/page.tsx
 */
export interface EventCarpoolPageParams {
  eventId: string;
}

/**
 * 이벤트 카풀 새 요청 페이지 파라미터
 * @description app/protected/events/[eventId]/carpool/new/page.tsx
 */
export interface EventCarpoolNewPageParams {
  eventId: string;
}

/* ============================================================================
 * 참여자 라우트 파라미터
 * ============================================================================ */

/**
 * 참여자 목록 페이지 파라미터
 * @description app/protected/participants/page.tsx
 */
export type ParticipantsPageParams = Record<string, never>;

/**
 * 사용자 프로필 페이지 파라미터
 * @description app/protected/profile/[userId]/page.tsx
 */
export interface UserProfilePageParams {
  userId: string;
}

/* ============================================================================
 * 관리자 라우트 파라미터
 * ============================================================================ */

/**
 * 관리자 레이아웃 파라미터
 * @description app/protected/admin/layout.tsx
 */
export type AdminLayoutParams = Record<string, never>;

/**
 * 관리자 대시보드 파라미터
 * @description app/protected/admin/page.tsx
 */
export type AdminDashboardPageParams = Record<string, never>;

/**
 * 관리자 섹션 파라미터
 * @description app/protected/admin/[section]/page.tsx
 */
export interface AdminSectionPageParams {
  section: "events" | "users" | "analytics" | "settings";
}

/* ============================================================================
 * 쿼리 파라미터 (searchParams)
 * ============================================================================ */

/**
 * 목록 조회 쿼리 파라미터
 * @description GET /protected/events?page=1&sort=date&filter=...
 */
export interface ListQueryParams {
  page?: string; // 페이지 번호 (1부터 시작)
  pageSize?: string; // 페이지 당 항목 수
  sort?: string; // 정렬 필드
  order?: "asc" | "desc"; // 정렬 순서
  search?: string; // 검색 키워드
  filter?: string; // 필터 조건 (JSON 형식)
  status?: string; // 상태 필터
  dateFrom?: string; // 시작 날짜 필터
  dateTo?: string; // 종료 날짜 필터
  location?: string; // 위치 필터
}

/**
 * 이벤트 목록 쿼리 파라미터
 * @description GET /protected/events?...
 */
export interface EventListQueryParams extends ListQueryParams {
  eventStatus?: string; // draft, published, cancelled, completed
  hostId?: string; // 주최자 필터
}

/**
 * 사용자 목록 쿼리 파라미터
 * @description GET /protected/admin/users?...
 */
export interface UserListQueryParams extends ListQueryParams {
  role?: string; // admin, moderator, user
  status?: string; // active, inactive, banned
}

/**
 * 모달/대화상자 쿼리 파라미터
 * @description Intercepted routes에서 사용
 */
export interface ModalQueryParams {
  modal?: string; // 표시할 모달 ID
  modalData?: string; // 모달에 전달할 데이터 (JSON)
}

/**
 * 통합 쿼리 파라미터
 * @description 모든 쿼리 파라미터를 포함
 */
export interface SearchParams extends ListQueryParams {
  // 추가 파라미터는 필요에 따라 확장
  modal?: string;
  redirect?: string;
  returnTo?: string;
  [key: string]: string | string[] | undefined;
}

/* ============================================================================
 * 네스트된 동적 라우트 파라미터
 * ============================================================================ */

/**
 * 다중 동적 세그먼트 파라미터
 * @description [...slug]/page.tsx 형식
 */
export interface CatchAllParams {
  slug: string[];
}

/**
 * 선택적 다중 동적 세그먼트 파라미터
 * @description [[...slug]]/page.tsx 형식
 */
export interface OptionalCatchAllParams {
  slug?: string[];
}

/* ============================================================================
 * 타입 안전 라우팅 헬퍼
 * ============================================================================ */

/**
 * 라우트 경로 정의
 * @description 모든 라우트 경로를 한곳에서 관리
 */
export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    SIGN_UP: "/auth/sign-up",
    FORGOT_PASSWORD: "/auth/forgot-password",
    UPDATE_PASSWORD: "/auth/update-password",
  },
  PROTECTED: {
    DASHBOARD: "/protected",
    ACCOUNT: "/protected/account",
    EVENTS: {
      LIST: "/protected/events",
      NEW: "/protected/events/new",
      DETAIL: (eventId: string) => `/protected/events/${eventId}`,
      EDIT: (eventId: string) => `/protected/events/${eventId}/edit`,
      CARPOOL: (eventId: string) => `/protected/events/${eventId}/carpool`,
      CARPOOL_NEW: (eventId: string) =>
        `/protected/events/${eventId}/carpool/new`,
    },
    PARTICIPANTS: "/protected/participants",
    PROFILE: (userId: string) => `/protected/profile/${userId}`,
    ADMIN: {
      DASHBOARD: "/protected/admin",
      EVENTS: "/protected/admin/events",
      USERS: "/protected/admin/users",
      ANALYTICS: "/protected/admin/analytics",
      SETTINGS: "/protected/admin/settings",
    },
  },
};

/**
 * 쿼리 파라미터 빌더
 * @description 타입 안전한 쿼리 문자열 생성
 * @example
 * ```typescript
 * const params = buildQueryString({
 *   page: '1',
 *   search: 'event name',
 *   sort: 'date',
 *   order: 'desc',
 * });
 * // 결과: "?page=1&search=event%20name&sort=date&order=desc"
 * ```
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const entries = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);

  return entries.length > 0 ? `?${entries.join("&")}` : "";
}

/**
 * 쿼리 파라미터 파서
 * @description URL 쿼리 문자열 파싱 (서버 컴포넌트에서 사용)
 */
export function parseQueryString(
  searchParams: Record<string, string | string[] | undefined>,
): ListQueryParams {
  return {
    page: typeof searchParams.page === "string" ? searchParams.page : undefined,
    pageSize:
      typeof searchParams.pageSize === "string"
        ? searchParams.pageSize
        : undefined,
    sort: typeof searchParams.sort === "string" ? searchParams.sort : undefined,
    order:
      searchParams.order === "asc" || searchParams.order === "desc"
        ? searchParams.order
        : undefined,
    search:
      typeof searchParams.search === "string" ? searchParams.search : undefined,
  };
}
