/**
 * 컴포넌트 애니메이션
 * 스켈레톤, 토스트, 모달, 호버 효과 등 컴포넌트별 애니메이션
 */

/* ============================================================================
 * 컴포넌트 애니메이션 객체
 * ============================================================================ */

/**
 * 스켈레톤 로딩 애니메이션
 * 점진적 렌더링 중 보이는 로딩 상태 애니메이션
 */
export const SKELETON_ANIMATIONS = {
  // 기본 파
  pulse: "animate-pulse",

  // 맥박 효과
  shimmer: "bg-gradient-to-r from-muted via-background to-muted animate-pulse",

  // 스켈레톤 로딩 바
  bar: "h-4 rounded bg-muted animate-pulse",

  // 원형 스켈레톤 (프로필 사진)
  circle: "rounded-full bg-muted animate-pulse",

  // 큰 박스 스켈레톤
  block: "rounded-lg bg-muted animate-pulse",
} as const;

/**
 * 토스트 알림 애니메이션
 * 토스트 메시지의 진입/퇴출 효과
 */
export const TOAST_ANIMATIONS = {
  // 우측 아래에서 나타남
  slideUp: {
    enter: "animate-in fade-in slide-in-from-bottom-4 duration-300",
    exit: "animate-out fade-out slide-out-to-bottom-4 duration-200",
  },

  // 우측 상단에서 나타남
  slideDown: {
    enter: "animate-in fade-in slide-in-from-top-4 duration-300",
    exit: "animate-out fade-out slide-out-to-top-4 duration-200",
  },

  // 중앙에서 확대
  zoom: {
    enter: "animate-in fade-in zoom-in-95 duration-300",
    exit: "animate-out fade-out zoom-out-95 duration-200",
  },

  // 빠른 페이드
  fade: {
    enter: "animate-in fade-in duration-200",
    exit: "animate-out fade-out duration-150",
  },
} as const;

/**
 * 모달 & 다이얼로그 애니메이션
 * 모달 열림/닫힘 효과
 */
export const MODAL_ANIMATIONS = {
  // 기본 모달 (확대하며 나타남)
  default: {
    enter: "animate-in fade-in zoom-in-95 duration-300",
    exit: "animate-out fade-out zoom-out-95 duration-200",
  },

  // 위에서 내려오는 모달
  slideDown: {
    enter: "animate-in fade-in slide-in-from-top-8 duration-300",
    exit: "animate-out fade-out slide-out-to-top-8 duration-200",
  },

  // 아래에서 올라오는 모달 (바텀시트 스타일)
  slideUp: {
    enter: "animate-in fade-in slide-in-from-bottom-8 duration-300",
    exit: "animate-out fade-out slide-out-to-bottom-8 duration-200",
  },

  // 천천히 열리는 모달
  slow: {
    enter: "animate-in fade-in zoom-in-90 duration-500",
    exit: "animate-out fade-out zoom-out-90 duration-400",
  },
} as const;

/**
 * 드롭다운 & 팝오버 애니메이션
 * 작은 팝업 메뉴의 진입/퇴출 효과
 */
export const DROPDOWN_ANIMATIONS = {
  // 기본 드롭다운
  default: {
    enter: "animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200",
    exit: "animate-out fade-out zoom-out-95 slide-out-to-top-2 duration-150",
  },

  // 위에서 내려오는 스타일
  top: {
    enter: "animate-in fade-in slide-in-from-top-2 duration-200",
    exit: "animate-out fade-out slide-out-to-top-2 duration-150",
  },

  // 아래에서 올라오는 스타일
  bottom: {
    enter: "animate-in fade-in slide-in-from-bottom-2 duration-200",
    exit: "animate-out fade-out slide-out-to-bottom-2 duration-150",
  },
} as const;

/**
 * 호버 & 인터랙션 애니메이션
 * 버튼, 카드 등의 호버 효과
 */
export const INTERACTION_ANIMATIONS = {
  // 버튼 호버 (약간 축소)
  buttonHover: "hover:scale-95 transition-transform duration-200",

  // 버튼 호버 (약간 확대)
  buttonHoverExpand: "hover:scale-105 transition-transform duration-200",

  // 카드 호버 (들어올려지는 효과)
  cardHover: "hover:shadow-lg hover:scale-105 transition-all duration-300",

  // 부드러운 전환
  smoothTransition: "transition-all duration-300",

  // 빠른 전환
  fastTransition: "transition-all duration-150",

  // 느린 전환
  slowTransition: "transition-all duration-500",
} as const;

/**
 * 리스트 아이템 애니메이션
 * 리스트에서 각 아이템의 진입 효과
 */
export const LIST_ANIMATIONS = {
  // 위에서 아래로 나타남 (스태거 효과 적용)
  slideDown: "animate-in fade-in slide-in-from-top-4 duration-300",

  // 아래에서 위로 나타남
  slideUp: "animate-in fade-in slide-in-from-bottom-4 duration-300",

  // 좌측에서 나타남
  slideRight: "animate-in fade-in slide-in-from-left-4 duration-300",

  // 우측에서 나타남
  slideLeft: "animate-in fade-in slide-in-from-right-4 duration-300",

  // 빠른 페이드
  fadeIn: "animate-in fade-in duration-200",
} as const;

/**
 * 페이드 애니메이션
 * 간단한 투명도 변화
 */
export const FADE_ANIMATIONS = {
  // 빠른 페이드
  fast: "animate-in fade-in duration-150",

  // 기본 페이드
  normal: "animate-in fade-in duration-300",

  // 느린 페이드
  slow: "animate-in fade-in duration-500",

  // 매우 느린 페이드
  slowest: "animate-in fade-in duration-700",
} as const;

/* ============================================================================
 * 통합 컴포넌트 애니메이션 객체
 * ============================================================================ */

/**
 * 모든 컴포넌트 애니메이션을 한 곳에서 접근
 */
export const COMPONENT_ANIMATIONS = {
  skeleton: SKELETON_ANIMATIONS,
  toast: TOAST_ANIMATIONS,
  modal: MODAL_ANIMATIONS,
  dropdown: DROPDOWN_ANIMATIONS,
  interaction: INTERACTION_ANIMATIONS,
  list: LIST_ANIMATIONS,
  fade: FADE_ANIMATIONS,
} as const;

/* ============================================================================
 * 타입 정의
 * ============================================================================ */

/**
 * 애니메이션 객체의 타입 (진입/퇴출 쌍)
 */
export interface AnimationPair {
  enter: string;
  exit: string;
}

/**
 * 모든 애니메이션 그룹의 키
 */
export type AnimationGroup = keyof typeof COMPONENT_ANIMATIONS;

/**
 * 특정 애니메이션 그룹 내의 키
 */
export type SkeletonAnimation = keyof typeof SKELETON_ANIMATIONS;
export type ToastAnimation = keyof typeof TOAST_ANIMATIONS;
export type ModalAnimation = keyof typeof MODAL_ANIMATIONS;
export type DropdownAnimation = keyof typeof DROPDOWN_ANIMATIONS;
export type ListAnimation = keyof typeof LIST_ANIMATIONS;
export type FadeAnimation = keyof typeof FADE_ANIMATIONS;

/* ============================================================================
 * 유틸리티 함수
 * ============================================================================ */

/**
 * 토스트 애니메이션의 진입 클래스를 반환합니다.
 * @param type - 토스트 애니메이션 타입 (기본값: slideUp)
 * @returns 진입 애니메이션 클래스
 */
export function getToastEnterAnimation(
  type: ToastAnimation = "slideUp",
): string {
  return TOAST_ANIMATIONS[type].enter;
}

/**
 * 토스트 애니메이션의 퇴출 클래스를 반환합니다.
 * @param type - 토스트 애니메이션 타입 (기본값: slideUp)
 * @returns 퇴출 애니메이션 클래스
 */
export function getToastExitAnimation(
  type: ToastAnimation = "slideUp",
): string {
  return TOAST_ANIMATIONS[type].exit;
}

/**
 * 모달 애니메이션의 진입 클래스를 반환합니다.
 * @param type - 모달 애니메이션 타입 (기본값: default)
 * @returns 진입 애니메이션 클래스
 */
export function getModalEnterAnimation(
  type: ModalAnimation = "default",
): string {
  return MODAL_ANIMATIONS[type].enter;
}

/**
 * 모달 애니메이션의 퇴출 클래스를 반환합니다.
 * @param type - 모달 애니메이션 타입 (기본값: default)
 * @returns 퇴출 애니메이션 클래스
 */
export function getModalExitAnimation(
  type: ModalAnimation = "default",
): string {
  return MODAL_ANIMATIONS[type].exit;
}
