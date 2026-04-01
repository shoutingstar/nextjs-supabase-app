/**
 * 로컬스토리지/세션스토리지 타입 정의
 * 클라이언트 스토리지 상태 관리를 위한 타입
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* ============================================================================
 * 스토리지 키 열거형
 * ============================================================================ */

/**
 * 로컬스토리지 키
 * @description localStorage에 저장되는 모든 키를 열거형으로 관리
 * 오타 방지 및 타입 안전성 확보
 */
export enum LocalStorageKey {
  // 테마 관련
  THEME = "gather_theme",
  THEME_MODE = "gather_theme_mode",

  // 사용자 선호도
  USER_PREFERENCES = "gather_user_preferences",
  LANGUAGE = "gather_language",

  // 최근 활동
  RECENT_EVENTS = "gather_recent_events",
  RECENT_SEARCHES = "gather_recent_searches",
  VIEWED_EVENTS = "gather_viewed_events",

  // 필터 및 정렬
  EVENT_LIST_FILTERS = "gather_event_list_filters",
  EVENT_LIST_SORT = "gather_event_list_sort",
  USER_LIST_FILTERS = "gather_user_list_filters",

  // 모달 상태
  LAST_MODAL_STATE = "gather_last_modal_state",

  // 사이드바 상태
  SIDEBAR_COLLAPSED = "gather_sidebar_collapsed",

  // 알림 설정
  NOTIFICATION_SETTINGS = "gather_notification_settings",

  // 개발/디버그 (선택사항)
  DEBUG_MODE = "gather_debug_mode",
}

/**
 * 세션스토리지 키
 * @description sessionStorage에 저장되는 모든 키를 열거형으로 관리
 * 페이지 새로고침 후 자동 삭제
 */
export enum SessionStorageKey {
  // 폼 데이터 (임시 저장)
  TEMP_EVENT_FORM = "gather_temp_event_form",
  TEMP_EVENT_EDIT_FORM = "gather_temp_event_edit_form",

  // 필터 상태 (임시)
  ACTIVE_FILTERS = "gather_active_filters",
  CURRENT_SEARCH_QUERY = "gather_current_search_query",

  // 스크롤 위치
  SCROLL_POSITION = "gather_scroll_position",
  LIST_SCROLL_POSITION = "gather_list_scroll_position",

  // 모달 상태
  MODAL_STACK = "gather_modal_stack",
  PENDING_MODAL_DATA = "gather_pending_modal_data",

  // 페이지 네비게이션
  NAVIGATION_HISTORY = "gather_navigation_history",
  LAST_TAB = "gather_last_tab",

  // 임시 선택 상태
  SELECTED_ITEMS = "gather_selected_items",
  BULK_ACTION_MODE = "gather_bulk_action_mode",
}

/* ============================================================================
 * 로컬스토리지 상태 타입
 * ============================================================================ */

/**
 * 테마 설정
 * @description 애플리케이션 테마 설정
 */
export interface ThemePreference {
  mode: "light" | "dark" | "system";
  primaryColor?: string;
  customTheme?: Record<string, string>;
}

/**
 * 사용자 선호도
 * @description 사용자 개인 선호도 설정
 */
export interface UserPreferences {
  language: string;
  timezone?: string;
  dateFormat?: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  timeFormat?: "12h" | "24h";
  weekStartDay?: 0 | 1; // 0: Sunday, 1: Monday
  compactMode?: boolean;
  animationEnabled?: boolean;
  soundEnabled?: boolean;
  emailNotifications?: boolean;
}

/**
 * 최근 이벤트
 * @description 사용자가 최근에 본 이벤트 목록
 */
export interface RecentEvent {
  id: string;
  title: string;
  viewedAt: string; // ISO 8601
}

/**
 * 최근 검색
 * @description 사용자 검색 이력
 */
export interface RecentSearch {
  query: string;
  type: "event" | "user" | "location";
  searchedAt: string; // ISO 8601
}

/**
 * 필터 설정
 * @description 저장된 필터 프리셋
 */
export interface SavedFilter {
  name: string;
  type: "event" | "user";
  filters: Record<string, any>;
  createdAt: string; // ISO 8601
  isPinned?: boolean;
}

/**
 * 로컬스토리지 상태 (전체)
 * @description localStorage에 저장되는 모든 데이터의 타입
 */
export interface LocalStorageState {
  // 테마
  theme?: ThemePreference;

  // 사용자 선호도
  userPreferences?: UserPreferences;
  language?: string;

  // 최근 활동
  recentEvents?: RecentEvent[];
  recentSearches?: RecentSearch[];
  viewedEvents?: string[]; // Event IDs

  // 필터 및 정렬
  eventListFilters?: SavedFilter[];
  eventListSort?: {
    sortBy: string;
    order: "asc" | "desc";
  };
  userListFilters?: SavedFilter[];

  // UI 상태
  sidebarCollapsed?: boolean;
  lastModalState?: Record<string, any>;

  // 알림
  notificationSettings?: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };

  // 추가 데이터
  [key: string]: any;
}

/* ============================================================================
 * 세션스토리지 상태 타입
 * ============================================================================ */

/**
 * 임시 폼 데이터
 * @description 작성 중인 폼 데이터 (자동 저장)
 */
export interface TempFormData {
  formName: string;
  data: Record<string, any>;
  savedAt: string; // ISO 8601
  isDirty: boolean;
}

/**
 * 필터 상태 (세션)
 * @description 현재 세션의 활성 필터
 */
export interface SessionFilters {
  type: "event" | "user";
  filters: Record<string, any>;
  appliedAt: string; // ISO 8601
}

/**
 * 스크롤 위치
 * @description 페이지별 스크롤 위치 저장
 */
export interface ScrollPosition {
  page: string; // 경로
  position: number; // 스크롤 Y 좌표
  timestamp: string; // ISO 8601
}

/**
 * 모달 스택
 * @description 열려있는 모달 스택
 */
export interface ModalInStack {
  id: string;
  type: string;
  data?: Record<string, any>;
}

/**
 * 네비게이션 이력
 * @description 페이지 네비게이션 이력 (뒤로 가기용)
 */
export interface NavigationHistory {
  path: string;
  timestamp: string; // ISO 8601
  scrollPosition?: number;
}

/**
 * 벌크 액션 상태
 * @description 테이블 다중 선택 상태
 */
export interface BulkActionMode {
  enabled: boolean;
  selectedIds: Set<string>;
  action?: "delete" | "archive" | "approve" | "reject";
}

/**
 * 세션스토리지 상태 (전체)
 * @description sessionStorage에 저장되는 모든 데이터의 타입
 */
export interface SessionStorageState {
  // 임시 폼 데이터
  tempEventForm?: TempFormData;
  tempEventEditForm?: TempFormData;

  // 필터
  activeFilters?: SessionFilters;
  currentSearchQuery?: string;

  // 스크롤
  scrollPositions?: Map<string, number>;
  lastScrollPosition?: number;

  // 모달
  modalStack?: ModalInStack[];
  pendingModalData?: Record<string, any>;

  // 네비게이션
  navigationHistory?: NavigationHistory[];
  lastTab?: string;

  // 선택 상태
  selectedItems?: Set<string>;
  bulkActionMode?: BulkActionMode;

  // 추가 데이터
  [key: string]: any;
}

/* ============================================================================
 * 스토리지 접근 헬퍼 타입
 * ============================================================================ */

/**
 * 스토리지 아이템 옵션
 * @description 스토리지 아이템 저장/로드 시 옵션
 */
export interface StorageItemOptions {
  expiresIn?: number; // milliseconds
  version?: number;
  encrypted?: boolean;
}

/**
 * 스토리지 아이템 메타데이터
 * @description 스토리지에 저장된 아이템의 메타데이터
 */
export interface StorageItemMetadata {
  key: string;
  value: any;
  type: "json" | "string" | "number" | "boolean";
  createdAt: string; // ISO 8601
  expiresAt?: string; // ISO 8601
  version: number;
}

/**
 * 스토리지 아이템 (제네릭)
 * @template T - 저장할 데이터 타입
 */
export interface StorageItem<T = any> {
  data: T;
  metadata: StorageItemMetadata;
}

/* ============================================================================
 * 스토리지 유틸리티 함수 시그니처
 * ============================================================================ */

/**
 * 로컬스토리지 설정 함수
 * @description 로컬스토리지에 데이터 저장
 * @example
 * ```typescript
 * setLocalStorage<ThemePreference>(
 *   LocalStorageKey.THEME,
 *   { mode: 'dark' },
 *   { version: 1 }
 * );
 * ```
 */
export type SetLocalStorageFunction = <T = any>(
  key: LocalStorageKey | string,
  value: T,
  options?: StorageItemOptions,
) => void;

/**
 * 로컬스토리지 조회 함수
 * @description 로컬스토리지에서 데이터 조회
 * @example
 * ```typescript
 * const theme = getLocalStorage<ThemePreference>(
 *   LocalStorageKey.THEME
 * );
 * ```
 */
export type GetLocalStorageFunction = <T = any>(
  key: LocalStorageKey | string,
  defaultValue?: T,
) => T | null;

/**
 * 로컬스토리지 제거 함수
 */
export type RemoveLocalStorageFunction = (
  key: LocalStorageKey | string,
) => void;

/**
 * 세션스토리지 설정 함수
 */
export type SetSessionStorageFunction = <T = any>(
  key: SessionStorageKey | string,
  value: T,
  options?: StorageItemOptions,
) => void;

/**
 * 세션스토리지 조회 함수
 */
export type GetSessionStorageFunction = <T = any>(
  key: SessionStorageKey | string,
  defaultValue?: T,
) => T | null;

/**
 * 세션스토리지 제거 함수
 */
export type RemoveSessionStorageFunction = (
  key: SessionStorageKey | string,
) => void;

/* ============================================================================
 * 스토리지 마이그레이션 타입
 * ============================================================================ */

/**
 * 스토리지 마이그레이션 함수
 * @description 스토리지 스키마 버전 업그레이드 시 사용
 */
export interface StorageMigration {
  fromVersion: number;
  toVersion: number;
  migrate: (data: any) => any;
}

/**
 * 스토리지 마이그레이션 계획
 * @description 여러 마이그레이션을 순차적으로 실행
 */
export interface StorageMigrationPlan {
  currentVersion: number;
  targetVersion: number;
  migrations: StorageMigration[];
}
