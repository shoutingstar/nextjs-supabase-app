/**
 * UI 상태 타입 정의
 * 컴포넌트 전반에서 사용할 재사용 가능한 상태 타입
 * Context, 컴포넌트 상태, 서버 액션 결과 전반에서 활용
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* ============================================================================
 * 기본 상태 타입
 * ============================================================================ */

/**
 * 로딩 상태
 * @description 비동기 작업의 상태를 나타냄
 * - idle: 초기 상태 또는 아무것도 진행 중이지 않음
 * - loading: 작업 진행 중
 * - success: 작업 완료
 * - error: 작업 실패
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * 비동기 작업 상태 (제네릭)
 * @template T - 데이터 타입
 * @description 데이터 로딩 상태를 제네릭으로 관리
 * @example
 * ```typescript
 * const [state, setState] = useState<FetchState<Event[]>>({
 *   data: [],
 *   loading: false,
 *   error: null,
 * });
 * ```
 */
export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * 페이지네이션 상태
 * @description 목록 페이지네이션 정보
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/* ============================================================================
 * 모달 / 다이얼로그 타입
 * ============================================================================ */

/**
 * 모달 상태
 * @description 모달의 표시/숨김 상태 및 데이터
 */
export interface ModalState {
  isOpen: boolean;
  type?:
    | "alert"
    | "confirm"
    | "form"
    | "custom"
    | "event-detail"
    | "event-edit"
    | "delete-confirm";
  title?: string;
  description?: string;
  data?: Record<string, any>;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * 모달 옵션 (모달 열 때 전달)
 * @description openModal() 함수에 전달되는 옵션
 */
export interface ModalOptions {
  type?: ModalState["type"];
  title?: string;
  description?: string;
  data?: Record<string, any>;
  size?: ModalState["size"];
}

/* ============================================================================
 * 토스트 / 알림 타입
 * ============================================================================ */

/**
 * 토스트 상태
 * @description 임시 알림 메시지 (우상단)
 */
export interface ToastState {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number; // milliseconds
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 토스트 옵션 (토스트 표시 시 전달)
 * @description showToast() 함수에 전달되는 옵션
 */
export interface ToastOptions {
  message: string;
  type?: ToastState["type"];
  duration?: number;
  action?: ToastState["action"];
  dismissible?: boolean;
}

/**
 * 알림 상태
 * @description 화면 상단 영구 알림 (배너)
 */
export interface NotificationState {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  dismissible: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  closedAt?: string;
}

/**
 * 알림 옵션 (알림 표시 시 전달)
 */
export interface NotificationOptions {
  message: string;
  type?: NotificationState["type"];
  dismissible?: boolean;
  action?: NotificationState["action"];
}

/* ============================================================================
 * 폼 / 입력 상태 타입
 * ============================================================================ */

/**
 * 폼 필드 에러
 * @description 개별 폼 필드의 검증 에러
 */
export interface FormFieldError {
  message: string;
  type: "required" | "pattern" | "custom" | "min" | "max";
}

/**
 * 폼 검증 에러
 * @description 폼 전체의 검증 에러 맵
 */
export type FormValidationErrors = Record<string, FormFieldError>;

/**
 * 입력 상태
 * @description 단일 입력 필드의 상태
 */
export interface InputState {
  value: string | number | boolean;
  error?: FormFieldError;
  touched: boolean;
  isDirty: boolean;
}

/**
 * 셀렉트 상태
 * @description 셀렉트/드롭다운 필드의 상태
 */
export interface SelectState {
  selectedValue: string | string[];
  isOpen: boolean;
  searchQuery?: string;
  highlightedIndex?: number;
}

/* ============================================================================
 * 데이터 테이블 상태 타입
 * ============================================================================ */

/**
 * 테이블 열 정렬
 * @description 데이터 테이블의 정렬 상태
 */
export interface SortState {
  sortBy?: string;
  sortOrder: "asc" | "desc";
}

/**
 * 테이블 행 선택
 * @description 테이블의 체크박스 선택 상태
 */
export interface RowSelectionState {
  selectedRows: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

/**
 * 테이블 필터
 * @description 테이블의 필터 상태
 */
export interface TableFilterState {
  filters: Record<string, any>;
  hasActiveFilters: boolean;
}

/**
 * 데이터 테이블 상태
 * @description 전체 데이터 테이블 상태
 */
export interface DataTableState<T = any> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  sorting: SortState;
  selection: RowSelectionState;
  filters: TableFilterState;
  expandedRows: Set<string>;
}

/* ============================================================================
 * UI 컴포넌트 상태 타입
 * ============================================================================ */

/**
 * 아코디언 항목 상태
 * @description 아코디언의 열림/닫힘 상태
 */
export interface AccordionItemState {
  id: string;
  isOpen: boolean;
}

/**
 * 탭 상태
 * @description 탭 UI의 활성 탭
 */
export interface TabState {
  activeTab: string;
  tabs: Array<{
    id: string;
    label: string;
    disabled?: boolean;
  }>;
}

/**
 * 팝오버/드롭다운 위치 상태
 * @description 팝오버/드롭다운의 위치 정보
 */
export interface PopoverPositionState {
  isOpen: boolean;
  triggerRef?: React.RefObject<HTMLElement>;
  contentRef?: React.RefObject<HTMLElement>;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: { x: number; y: number };
}

/**
 * 토글 상태
 * @description 토글 스위치/체크박스의 상태
 */
export interface ToggleState {
  isToggled: boolean;
  label?: string;
  disabled?: boolean;
}

/* ============================================================================
 * API 응답 상태 타입
 * ============================================================================ */

/**
 * 파일 업로드 상태
 * @description 파일 업로드의 진행 상태
 */
export interface FileUploadState {
  file: File | null;
  progress: number; // 0-100
  loading: boolean;
  error: string | null;
  uploadedUrl?: string;
}

/**
 * 다중 파일 업로드 상태
 * @description 여러 파일 업로드의 진행 상태
 */
export interface MultiFileUploadState {
  files: Map<string, FileUploadState>;
  totalProgress: number;
  isUploading: boolean;
  errors: Map<string, string>;
}

/**
 * 무한 스크롤 상태
 * @description 무한 스크롤 로드 상태
 */
export interface InfiniteScrollState<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
}

/* ============================================================================
 * 애니메이션 / 트랜지션 상태
 * ============================================================================ */

/**
 * 애니메이션 상태
 * @description 애니메이션 진행 상태
 */
export interface AnimationState {
  isAnimating: boolean;
  direction?: "in" | "out";
  duration?: number;
  delay?: number;
}

/**
 * 트랜지션 상태
 * @description 페이지/모달 트랜지션 상태
 */
export interface TransitionState {
  isTransitioning: boolean;
  from?: string;
  to?: string;
  direction?: "forward" | "backward";
}

/* ============================================================================
 * 브라우저 상태 타입
 * ============================================================================ */

/**
 * 온라인 상태
 * @description 네트워크 연결 상태
 */
export interface OnlineState {
  isOnline: boolean;
  lastOnlineAt?: string;
  lastOfflineAt?: string;
}

/**
 * 포커스 상태
 * @description 창/탭 포커스 상태
 */
export interface FocusState {
  isFocused: boolean;
  lastFocusedAt?: string;
  lastBlurredAt?: string;
}

/**
 * 뷰포트 상태
 * @description 현재 뷰포트 정보
 */
export interface ViewportState {
  width: number;
  height: number;
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/* ============================================================================
 * 권한 / 접근 제어 상태
 * ============================================================================ */

/**
 * 권한 상태
 * @description 사용자 권한/역할 상태
 */
export interface PermissionState {
  role?: string;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

/**
 * 접근 제어 상태
 * @description 특정 기능/영역의 접근 가능 여부
 */
export interface AccessControlState {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  reason?: string; // 접근 불가 이유
}

/* ============================================================================
 * 유틸리티 타입
 * ============================================================================ */

/**
 * 옵션 아이템
 * @description select, checkbox, radio 등에서 사용
 */
export interface OptionItem<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * 목록 아이템
 * @description 목록 표시용 아이템
 */
export interface ListItem<T = any> {
  id: string;
  label: string;
  value?: T;
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

/**
 * 브레드크럼 아이템
 * @description 네비게이션 브레드크럼
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}
