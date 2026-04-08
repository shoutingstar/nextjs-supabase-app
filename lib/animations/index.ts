/**
 * 애니메이션 유틸리티 통합 export
 * 모든 애니메이션을 한 곳에서 import할 수 있습니다.
 */

export type {
  AnimationGroup,
  AnimationPair,
  DropdownAnimation,
  FadeAnimation,
  ListAnimation,
  ModalAnimation,
  SkeletonAnimation,
  ToastAnimation,
} from "./component-animations";
export {
  COMPONENT_ANIMATIONS,
  DROPDOWN_ANIMATIONS,
  FADE_ANIMATIONS,
  getModalEnterAnimation,
  getModalExitAnimation,
  getToastEnterAnimation,
  getToastExitAnimation,
  INTERACTION_ANIMATIONS,
  LIST_ANIMATIONS,
  MODAL_ANIMATIONS,
  SKELETON_ANIMATIONS,
  TOAST_ANIMATIONS,
} from "./component-animations";
export type { PageAnimation, PageAnimationType } from "./page-transitions";
export {
  getPageAnimation,
  getPageEnterAnimation,
  getPageExitAnimation,
  PAGE_ANIMATIONS,
} from "./page-transitions";
