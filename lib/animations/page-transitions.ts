/**
 * 페이지 전환 애니메이션
 * tailwindcss-animate를 활용한 페이지 전환 효과
 */

/* ============================================================================
 * 페이지 전환 애니메이션 객체
 * ============================================================================ */

/**
 * 페이지 진입/퇴출 애니메이션 설정
 * Tailwind CSS animate 클래스 조합으로 구성
 */
export const PAGE_ANIMATIONS = {
  // 기본 페이드 인/아웃
  fade: {
    enter: "animate-in fade-in duration-300",
    exit: "animate-out fade-out duration-200",
  },

  // 아래에서 올라오는 애니메이션
  slideUp: {
    enter: "animate-in fade-in slide-in-from-bottom-4 duration-400",
    exit: "animate-out fade-out slide-out-to-bottom-4 duration-300",
  },

  // 좌측에서 나타나는 애니메이션
  slideRight: {
    enter: "animate-in fade-in slide-in-from-left-4 duration-400",
    exit: "animate-out fade-out slide-out-to-left-4 duration-300",
  },

  // 우측에서 나타나는 애니메이션
  slideLeft: {
    enter: "animate-in fade-in slide-in-from-right-4 duration-400",
    exit: "animate-out fade-out slide-out-to-right-4 duration-300",
  },

  // 위에서 내려오는 애니메이션
  slideDown: {
    enter: "animate-in fade-in slide-in-from-top-4 duration-400",
    exit: "animate-out fade-out slide-out-to-top-4 duration-300",
  },

  // 확대되는 애니메이션
  zoomIn: {
    enter: "animate-in fade-in zoom-in-95 duration-500",
    exit: "animate-out fade-out zoom-out-95 duration-300",
  },

  // 빠른 페이드
  fastFade: {
    enter: "animate-in fade-in duration-150",
    exit: "animate-out fade-out duration-100",
  },

  // 슬로우 페이드
  slowFade: {
    enter: "animate-in fade-in duration-500",
    exit: "animate-out fade-out duration-400",
  },
} as const;

/* ============================================================================
 * 페이지 애니메이션 타입
 * ============================================================================ */

/**
 * 사용 가능한 페이지 애니메이션 타입
 */
export type PageAnimationType = keyof typeof PAGE_ANIMATIONS;

/**
 * 페이지 애니메이션 객체 타입
 */
export interface PageAnimation {
  enter: string;
  exit: string;
}

/* ============================================================================
 * 유틸리티 함수
 * ============================================================================ */

/**
 * 지정된 페이지 애니메이션의 진입 클래스를 반환합니다.
 * @param type - 애니메이션 타입
 * @returns 진입 애니메이션 클래스 문자열
 */
export function getPageEnterAnimation(
  type: PageAnimationType = "fade",
): string {
  return PAGE_ANIMATIONS[type].enter;
}

/**
 * 지정된 페이지 애니메이션의 퇴출 클래스를 반환합니다.
 * @param type - 애니메이션 타입
 * @returns 퇴출 애니메이션 클래스 문자열
 */
export function getPageExitAnimation(type: PageAnimationType = "fade"): string {
  return PAGE_ANIMATIONS[type].exit;
}

/**
 * 전체 페이지 애니메이션 (진입 + 퇴출)을 반환합니다.
 * @param type - 애니메이션 타입
 * @returns 진입과 퇴출 애니메이션을 모두 포함하는 객체
 */
export function getPageAnimation(
  type: PageAnimationType = "fade",
): PageAnimation {
  return PAGE_ANIMATIONS[type];
}
