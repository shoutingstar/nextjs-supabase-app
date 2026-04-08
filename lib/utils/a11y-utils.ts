/**
 * 접근성(a11y) 유틸리티 함수
 * WCAG 2.1 AA 기준을 준수하여 접근성을 향상시킵니다.
 */

/* ============================================================================
 * ARIA 속성 헬퍼
 * ============================================================================ */

/**
 * ARIA label 속성을 생성합니다.
 * @param text - 레이블 텍스트
 * @returns ARIA label 속성 객체
 */
export function ariaLabel(text: string): { "aria-label": string } {
  return { "aria-label": text };
}

/**
 * ARIA description 속성을 생성합니다.
 * @param id - description ID
 * @returns ARIA describedby 속성 객체
 */
export function ariaDescription(id: string): { "aria-describedby": string } {
  return { "aria-describedby": id };
}

/**
 * ARIA live region 속성을 생성합니다.
 * @param polite - polite(기본) 또는 assertive
 * @returns ARIA live region 속성 객체
 */
export function ariaLive(polite = true): {
  "aria-live": "polite" | "assertive";
} {
  return { "aria-live": polite ? "polite" : "assertive" };
}

/**
 * ARIA pressed 상태를 생성합니다.
 * @param pressed - 눌린 상태 여부
 * @returns ARIA pressed 속성 객체
 */
export function ariaPressed(pressed: boolean): { "aria-pressed": boolean } {
  return { "aria-pressed": pressed };
}

/**
 * ARIA disabled 상태를 생성합니다.
 * @param disabled - 비활성화 상태 여부
 * @returns ARIA disabled 속성 객체
 */
export function ariaDisabled(disabled: boolean): { "aria-disabled": boolean } {
  return { "aria-disabled": disabled };
}

/**
 * ARIA expanded 상태를 생성합니다.
 * @param expanded - 확장 상태 여부
 * @returns ARIA expanded 속성 객체
 */
export function ariaExpanded(expanded: boolean): { "aria-expanded": boolean } {
  return { "aria-expanded": expanded };
}

/**
 * ARIA modal 속성을 생성합니다.
 * @returns ARIA modal 속성 객체
 */
export function ariaModal(): { "aria-modal": true } {
  return { "aria-modal": true };
}

/**
 * ARIA hidden 속성을 생성합니다.
 * @returns ARIA hidden 속성 객체
 */
export function ariaHidden(): { "aria-hidden": true } {
  return { "aria-hidden": true };
}

/* ============================================================================
 * 색상 대비 검증 헬퍼
 * ============================================================================ */

/**
 * 16진수 색상을 RGB로 변환합니다.
 * @param hex - 16진수 색상 문자열 (예: #FFFFFF)
 * @returns RGB 객체 { r, g, b }
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * 색상의 상대 휘도를 계산합니다.
 * @param r - Red 값 (0-255)
 * @param g - Green 값 (0-255)
 * @param b - Blue 값 (0-255)
 * @returns 상대 휘도 (0-1)
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((x) => {
    x = x / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 두 색상 사이의 대비 비율을 계산합니다. (WCAG 표준)
 * @param foreground - 전경색 (16진수)
 * @param background - 배경색 (16진수)
 * @returns 대비 비율 (1-21)
 */
export function getContrastRatio(
  foreground: string,
  background: string,
): number {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) {
    return 0;
  }

  const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 색상 대비가 WCAG 기준을 충족하는지 확인합니다.
 * @param foreground - 전경색 (16진수)
 * @param background - 배경색 (16진수)
 * @param level - WCAG 수준 ('AA' | 'AAA')
 * @returns 기준 충족 여부
 */
export function isContrастValid(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
): boolean {
  const ratio = getContrastRatio(foreground, background);

  // WCAG 기준: AA = 4.5:1, AAA = 7:1
  const minRatio = level === "AA" ? 4.5 : 7;

  return ratio >= minRatio;
}

/* ============================================================================
 * 키보드 네비게이션 헬퍼
 * ============================================================================ */

/**
 * 키보드 이벤트 핸들러를 생성합니다.
 * @param onEnter - Enter 키 누름 시 실행
 * @param onEscape - Escape 키 누름 시 실행
 * @returns 키보드 이벤트 핸들러
 */
export function createKeyboardHandler(
  onEnter?: () => void,
  onEscape?: () => void,
): (event: React.KeyboardEvent) => void {
  return (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && onEnter) {
      event.preventDefault();
      onEnter();
    } else if (event.key === "Escape" && onEscape) {
      event.preventDefault();
      onEscape();
    }
  };
}

/**
 * 포커스를 관리하는 헬퍼입니다.
 * @param element - 포커스할 HTML 요소
 */
export function focusElement(element: HTMLElement | null): void {
  if (element && typeof element.focus === "function") {
    element.focus();
  }
}

/**
 * 포커스 가능한 요소들을 찾습니다.
 * @param container - 검색 범위 컨테이너
 * @returns 포커스 가능한 요소 배열
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
  return Array.from(container.querySelectorAll(selector));
}

/**
 * Focus trap을 관리합니다. (모달, 다이얼로그용)
 * @param event - 키보드 이벤트
 * @param container - 포커스 범위 컨테이너
 */
export function manageFocusTrap(
  event: React.KeyboardEvent,
  container: HTMLElement,
): void {
  if (event.key !== "Tab") return;

  const focusables = getFocusableElements(container);
  const firstElement = focusables[0] as HTMLElement;
  const lastElement = focusables[focusables.length - 1] as HTMLElement;

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
}

/* ============================================================================
 * 스크린 리더 텍스트 헬퍼
 * ============================================================================ */

/**
 * 스크린 리더에서만 보이는 텍스트를 위한 클래스입니다.
 * 시각적으로는 숨기고 스크린 리더에서만 읽힙니다.
 */
export const srOnlyClass =
  "sr-only absolute -top-full -left-full h-px w-px overflow-hidden whitespace-nowrap";

/**
 * 스크린 리더 전용 텍스트 컴포넌트를 생성하는 팩토리 함수입니다.
 * 사용 예:
 * ```tsx
 * import { srOnlyClass } from "@/lib/utils/a11y-utils";
 *
 * export function MyComponent() {
 *   return <span className={srOnlyClass}>스크린 리더 전용 텍스트</span>;
 * }
 * ```
 */

/* ============================================================================
 * 접근성 검증 유틸
 * ============================================================================ */

/**
 * 폼 필드의 접근성을 검증합니다.
 */
export function validateFormA11y(formElement: HTMLFormElement): {
  hasLabels: boolean;
  hasErrors: string[];
} {
  const errors: string[] = [];
  const inputs = formElement.querySelectorAll("input, textarea, select");

  inputs.forEach((input) => {
    const inputElement = input as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const id = inputElement.id;

    // label이 있는지 확인
    if (id) {
      const label = formElement.querySelector(`label[for="${id}"]`);
      if (!label) {
        errors.push(`Input #${id}에 label이 없습니다`);
      }
    } else {
      errors.push(`${inputElement.name} input에 id가 없습니다`);
    }

    // aria-label이 있는지 확인 (또는 label)
    const hasAriaLabel = inputElement.getAttribute("aria-label");
    if (!hasAriaLabel && !formElement.querySelector(`label[for="${id}"]`)) {
      errors.push(`${inputElement.name}에 aria-label이 없습니다`);
    }
  });

  return {
    hasLabels: errors.length === 0,
    hasErrors: errors,
  };
}

/* ============================================================================
 * 접근성 설정 모음
 * ============================================================================ */

/**
 * 일반적인 접근성 속성 모음
 */
export const A11Y = {
  // ARIA 속성 헬퍼
  label: ariaLabel,
  description: ariaDescription,
  live: ariaLive,
  pressed: ariaPressed,
  disabled: ariaDisabled,
  expanded: ariaExpanded,
  modal: ariaModal,
  hidden: ariaHidden,

  // 색상 대비
  contrast: {
    check: getContrastRatio,
    isValid: isContrастValid,
  },

  // 키보드 네비게이션
  keyboard: {
    handler: createKeyboardHandler,
    focus: focusElement,
    getFocusable: getFocusableElements,
    manageTrap: manageFocusTrap,
  },

  // 스크린 리더
  srOnly: srOnlyClass,

  // 검증
  validate: {
    form: validateFormA11y,
  },
} as const;
