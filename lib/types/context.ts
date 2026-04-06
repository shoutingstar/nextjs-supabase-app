/**
 * Context API 타입 정의
 * 전역 상태 관리를 위한 Context 타입 구조
 * Redux 마이그레이션을 고려한 설계
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ReactNode } from "react";

import type { Event, EventDetail } from "./event";
import type { Participant, ParticipantDetail } from "./participant";
import type { LoadingState, ModalState, ToastState } from "./ui";
import type { User } from "./user";

/* ============================================================================
 * 인증 Context
 * ============================================================================ */

/**
 * 인증 상태
 * @description 사용자 인증 관련 전역 상태
 */
export interface AuthState {
  user: User | null;
  loading: LoadingState;
  error: string | null;
  isAuthenticated: boolean;
  role?: string;
}

/**
 * 인증 Context 액션
 * @description 인증 상태를 변경하는 함수들
 */
export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * 인증 Context 타입
 * @description useAuth() hook에서 반환되는 타입
 */
export interface AuthContextType extends AuthActions {
  state: AuthState;
}

/**
 * 인증 Provider Props
 * @description AuthProvider에 전달되는 Props
 */
export interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

/* ============================================================================
 * 이벤트 Context
 * ============================================================================ */

/**
 * 이벤트 상태
 * @description 이벤트 관련 전역 상태
 */
export interface EventContextState {
  events: Event[];
  selectedEvent: EventDetail | null;
  loading: LoadingState;
  error: string | null;
  filterOptions: {
    status?: string;
    dateRange?: [string, string];
    location?: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

/**
 * 이벤트 Context 액션
 * @description 이벤트 상태를 변경하는 함수들
 */
export interface EventActions {
  fetchEvents: (page?: number, filters?: any) => Promise<void>;
  fetchEventDetail: (eventId: string) => Promise<void>;
  createEvent: (data: any) => Promise<Event>;
  updateEvent: (eventId: string, data: any) => Promise<Event>;
  deleteEvent: (eventId: string) => Promise<void>;
  setFilter: (filters: any) => void;
  clearFilters: () => void;
  setSelectedEvent: (event: EventDetail | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * 이벤트 Context 타입
 * @description useEventContext() hook에서 반환되는 타입
 */
export interface EventContextType extends EventActions {
  state: EventContextState;
}

/**
 * 이벤트 Provider Props
 * @description EventProvider에 전달되는 Props
 */
export interface EventProviderProps {
  children: ReactNode;
}

/* ============================================================================
 * 참여자 Context
 * ============================================================================ */

/**
 * 참여자 상태
 * @description 이벤트 참여자 관련 전역 상태
 */
export interface ParticipantContextState {
  participants: ParticipantDetail[];
  currentUserParticipant: Participant | null;
  loading: LoadingState;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

/**
 * 참여자 Context 액션
 */
export interface ParticipantActions {
  fetchParticipants: (eventId: string, page?: number) => Promise<void>;
  joinEvent: (eventId: string, rsvp?: string) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
  updateRsvp: (participantId: string, rsvp: string) => Promise<void>;
  removeParticipant: (participantId: string) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * 참여자 Context 타입
 */
export interface ParticipantContextType extends ParticipantActions {
  state: ParticipantContextState;
}

/* ============================================================================
 * UI Context
 * ============================================================================ */

/**
 * UI 상태
 * @description 모달, 토스트, 알림 등 UI 전역 상태
 */
export interface UIContextState {
  modals: Record<string, ModalState>;
  toasts: ToastState[];
  notifications: NotificationState[];
  loadingOverlay: {
    isVisible: boolean;
    message?: string;
  };
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
}

/**
 * 알림 상태
 * @description 화면 상단 알림
 */
export interface NotificationState {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  dismissible?: boolean;
}

/**
 * UI Context 액션
 * @description UI 상태를 변경하는 함수들
 */
export interface UIActions {
  openModal: (modalId: string, data?: any) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;
  showToast: (message: string, type?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
  showNotification: (message: string, type?: string, duration?: number) => void;
  dismissNotification: (id: string) => void;
  showLoadingOverlay: (message?: string) => void;
  hideLoadingOverlay: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

/**
 * UI Context 타입
 * @description useUIContext() hook에서 반환되는 타입
 */
export interface UIContextType extends UIActions {
  state: UIContextState;
}

/**
 * UI Provider Props
 * @description UIProvider에 전달되는 Props
 */
export interface UIProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "system";
}

/* ============================================================================
 * 필터 Context (선택사항)
 * ============================================================================ */

/**
 * 필터 상태
 * @description 목록 필터링 상태
 */
export interface FilterContextState {
  filters: Record<string, any>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * 필터 Context 액션
 */
export interface FilterActions {
  setFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  setSortBy: (field: string, order: "asc" | "desc") => void;
  getActiveFilters: () => Record<string, any>;
}

/**
 * 필터 Context 타입
 */
export interface FilterContextType extends FilterActions {
  state: FilterContextState;
}

/* ============================================================================
 * 전체 앱 Context (선택사항 - 모든 context를 통합)
 * ============================================================================ */

/**
 * 전체 앱 Context 상태
 * @description 모든 context를 하나로 통합
 */
export interface AppContextState {
  auth: AuthState;
  events: EventContextState;
  participants: ParticipantContextState;
  ui: UIContextState;
  filters: FilterContextState;
}

/**
 * 전체 앱 Context 액션
 * @description 모든 context 액션을 통합
 * EventActions.setFilter와 FilterActions.setFilter 시그니처 충돌로 인해
 * setFilter는 더 유연한 시그니처로 오버라이드
 */
export interface AppContextActions
  extends
    AuthActions,
    Omit<EventActions, "setFilter">,
    ParticipantActions,
    UIActions,
    FilterActions {}

/**
 * 전체 앱 Context 타입
 * @description useAppContext() hook에서 반환되는 타입
 */
export interface AppContextType extends AppContextActions {
  state: AppContextState;
}

/**
 * 앱 Provider Props
 * @description AppProvider에 전달되는 Props
 */
export interface AppProviderProps {
  children: ReactNode;
  initialState?: Partial<AppContextState>;
}

/* ============================================================================
 * Context 초기값 (Provider 구현 시 사용)
 * ============================================================================ */

/**
 * 인증 상태 초기값
 */
export const authStateInitial: AuthState = {
  user: null,
  loading: "idle",
  error: null,
  isAuthenticated: false,
};

/**
 * 이벤트 상태 초기값
 */
export const eventStateInitial: EventContextState = {
  events: [],
  selectedEvent: null,
  loading: "idle",
  error: null,
  filterOptions: {},
  pagination: {
    currentPage: 1,
    totalPages: 0,
    pageSize: 20,
    totalItems: 0,
  },
};

/**
 * UI 상태 초기값
 */
export const uiStateInitial: UIContextState = {
  modals: {},
  toasts: [],
  notifications: [],
  loadingOverlay: {
    isVisible: false,
  },
  sidebarCollapsed: false,
  theme: "system",
};

/**
 * 필터 상태 초기값
 */
export const filterStateInitial: FilterContextState = {
  filters: {},
};
