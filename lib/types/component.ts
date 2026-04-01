/**
 * 컴포넌트 Props 타입 정의
 * 모든 컴포넌트의 Props를 중앙화하여 관리
 * UI 기본 컴포넌트, 복합 컴포넌트, 도메인 컴포넌트로 분류
 */

import type { ReactNode } from "react";

import type { Event, EventDetail, ParticipantDetail } from "./event";
import type { User, UserProfile } from "./user";

/* ============================================================================
 * UI 기본 컴포넌트 Props
 * ============================================================================ */

/**
 * 버튼 Props
 * @description shadcn/ui Button과 호환, variant와 size 지원
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  isLoading?: boolean;
}

/**
 * 카드 Props
 * @description shadcn/ui Card 기본 Props (HTMLDivElement 확장)
 */
export type CardProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * 입력 필드 Props
 * @description shadcn/ui Input과 호환
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
}

/**
 * 레이블 Props
 * @description HTML label 요소와 호환
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

/**
 * 체크박스 Props
 * @description 체크박스 입력 필드
 */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

/**
 * 배지 Props
 * @description shadcn/ui Badge와 호환
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

/**
 * 드롭다운 메뉴 Props
 * @description shadcn/ui DropdownMenu와 호환
 */
export interface DropdownMenuProps {
  trigger: ReactNode;
  items: Array<{
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    disabled?: boolean;
  }>;
}

/* ============================================================================
 * 복합 컴포넌트 Props
 * ============================================================================ */

/**
 * 폼 Props
 * @description React Hook Form과 통합된 폼 컴포넌트
 */
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (formData: FormData) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * 모달 Props
 * @description 다이얼로그/모달 컴포넌트
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  closeButton?: boolean;
}

/**
 * 토스트 알림 Props
 * @description 일시적 알림 메시지
 */
export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

/**
 * 네비게이션 Props
 * @description 상단/하단 네비게이션
 */
export interface NavigationProps {
  items: Array<{
    label: string;
    href: string;
    icon?: ReactNode;
    badge?: number | string;
  }>;
  activePath?: string;
  onNavigate?: (href: string) => void;
  variant?: "horizontal" | "vertical";
}

/**
 * 모바일 네비게이션 Props
 * @description 모바일 하단 네비게이션
 */
export interface MobileNavProps {
  items: Array<{
    label: string;
    href: string;
    icon: ReactNode;
    badge?: number | string;
  }>;
  activePath?: string;
}

/**
 * 사이드바 Props
 * @description 관리자/좌측 사이드바
 */
export interface SidebarProps {
  title?: string;
  items: Array<{
    label: string;
    href?: string;
    icon?: ReactNode;
    onClick?: () => void;
    badge?: number | string;
    disabled?: boolean;
  }>;
  activeItem?: string;
  collapsible?: boolean;
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

/**
 * 빈 상태 Props
 * @description 데이터 없음, 오류 상태 등을 표시
 */
export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "empty" | "error" | "no-permission";
}

/**
 * 로딩 스켈레톤 Props
 * @description 콘텐츠 로딩 중 표시될 스켈레톤
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  variant?: "text" | "card" | "avatar";
}

/* ============================================================================
 * 도메인 컴포넌트 Props
 * ============================================================================ */

/**
 * 이벤트 카드 Props
 * @description 이벤트 목록/상세에서 사용되는 카드
 */
export interface EventCardProps {
  event: Event;
  variant?: "default" | "compact";
  onClick?: () => void;
  isSelected?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
}

/**
 * 이벤트 상세 Props
 * @description 이벤트 상세 페이지 컴포넌트
 */
export interface EventDetailProps {
  event: EventDetail;
  isEditable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

/**
 * 사용자 프로필 카드 Props
 * @description 사용자 정보를 표시하는 카드
 */
export interface UserProfileCardProps {
  user: UserProfile;
  showEmail?: boolean;
  editable?: boolean;
  onEdit?: () => void;
  onFollow?: () => void;
}

/**
 * 참여자 목록 Props
 * @description 이벤트 참여자 목록 표시
 */
export interface ParticipantListProps {
  participants: ParticipantDetail[];
  maxCount?: number;
  isEditable?: boolean;
  onRemove?: (participantId: string) => void;
}

/**
 * 참여자 카드 Props
 * @description 개별 참여자 정보 카드
 */
export interface ParticipantCardProps {
  participant: ParticipantDetail;
  editable?: boolean;
  onRemove?: () => void;
  onRsvpChange?: (rsvp: string) => void;
}

/**
 * 로그인 폼 Props
 * @description 로그인 폼 컴포넌트
 */
export interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

/**
 * 회원가입 폼 Props
 * @description 회원가입 폼 컴포넌트
 */
export interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

/**
 * Google OAuth 버튼 Props
 * @description Google 소셜 로그인 버튼
 */
export interface GoogleOAuthButtonProps {
  label?: string;
  next?: string;
  isLoading?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * 이벤트 필터 Props
 * @description 이벤트 목록 필터 컴포넌트
 */
export interface EventFilterProps {
  onFilterChange: (filters: {
    status?: string;
    dateRange?: [string, string];
    location?: string;
  }) => void;
  isLoading?: boolean;
}

/**
 * 페이지네이션 Props
 * @description 목록 페이지네이션
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/* ============================================================================
 * 레이아웃 컴포넌트 Props
 * ============================================================================ */

/**
 * 레이아웃 Props (상위)
 * @description 전체 레이아웃 래퍼
 */
export interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  showSidebar?: boolean;
  sidebarPosition?: "left" | "right";
}

/**
 * 네비바 Props
 * @description 상단 네비게이션 바
 */
export interface NavbarProps {
  logo?: ReactNode;
  title?: string;
  items?: NavigationProps["items"];
  rightContent?: ReactNode;
  onNavigate?: (href: string) => void;
}

/**
 * 콘텐츠 래퍼 Props
 * @description 메인 콘텐츠 영역 래퍼
 */
export interface ContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "sm" | "md" | "lg";
  children: ReactNode;
}

/**
 * 헤더 Props
 * @description 페이지 헤더/타이틀 영역
 */
export interface HeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  };
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

/* ============================================================================
 * 상태 표시 컴포넌트 Props
 * ============================================================================ */

/**
 * 로딩 표시기 Props
 * @description 로딩 중 표시할 인디케이터
 */
export interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "bar";
  message?: string;
}

/**
 * 에러 메시지 Props
 * @description 에러 메시지 표시
 */
export interface ErrorMessageProps {
  error: string | Error;
  onDismiss?: () => void;
  variant?: "inline" | "banner" | "toast";
  title?: string;
}

/**
 * 확인 대화상자 Props
 * @description 사용자 확인 대화상자
 */
export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}
