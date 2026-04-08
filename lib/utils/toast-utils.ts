/**
 * Toast 알림 헬퍼 함수
 * 프로젝트 전체에서 일관된 toast 알림을 제공합니다.
 * Sonner 라이브러리를 기반으로 합니다.
 */

import { toast } from "sonner";

/* ============================================================================
 * Toast 설정 상수
 * ============================================================================ */

const TOAST_DURATION = {
  SHORT: 2000, // 2초
  DEFAULT: 3000, // 3초
  LONG: 4000, // 4초
} as const;

/* ============================================================================
 * 성공 Toast
 * ============================================================================ */

/**
 * 성공 알림을 표시합니다.
 * @param message - 알림 메시지
 * @param description - 추가 설명 (선택사항)
 * @param duration - 표시 시간 (기본값: 3000ms)
 */
export function showSuccessToast(
  message: string,
  description?: string,
  duration: number = TOAST_DURATION.DEFAULT,
) {
  toast.success(message, {
    description,
    duration,
  });
}

/* ============================================================================
 * 에러 Toast
 * ============================================================================ */

/**
 * 에러 알림을 표시합니다.
 * @param message - 에러 메시지
 * @param description - 추가 설명 (선택사항)
 * @param duration - 표시 시간 (기본값: 4000ms)
 */
export function showErrorToast(
  message: string,
  description?: string,
  duration: number = TOAST_DURATION.LONG,
) {
  toast.error(message, {
    description,
    duration,
  });
}

/* ============================================================================
 * 경고 Toast
 * ============================================================================ */

/**
 * 경고 알림을 표시합니다.
 * @param message - 경고 메시지
 * @param description - 추가 설명 (선택사항)
 * @param duration - 표시 시간 (기본값: 3000ms)
 */
export function showWarningToast(
  message: string,
  description?: string,
  duration: number = TOAST_DURATION.DEFAULT,
) {
  toast.warning(message, {
    description,
    duration,
  });
}

/* ============================================================================
 * 정보 Toast
 * ============================================================================ */

/**
 * 정보 알림을 표시합니다.
 * @param message - 정보 메시지
 * @param description - 추가 설명 (선택사항)
 * @param duration - 표시 시간 (기본값: 3000ms)
 */
export function showInfoToast(
  message: string,
  description?: string,
  duration: number = TOAST_DURATION.DEFAULT,
) {
  toast.info(message, {
    description,
    duration,
  });
}

/* ============================================================================
 * 로딩 Toast
 * ============================================================================ */

/**
 * 로딩 알림을 표시하고 ID를 반환합니다.
 * 작업 완료 후 dismiss() 함수로 닫아야 합니다.
 * @param message - 로딩 메시지
 * @returns Toast ID (닫기용)
 */
export function showLoadingToast(message: string): string | number {
  return toast.loading(message);
}

/**
 * 로딩 toast를 닫습니다.
 * @param toastId - showLoadingToast에서 반환받은 ID
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/* ============================================================================
 * 도메인별 Toast 헬퍼
 * ============================================================================ */

/**
 * 이벤트 관련 성공 메시지
 */
export const EventToast = {
  created: (eventName: string, inviteCode?: string) => {
    const description = inviteCode
      ? `"${eventName}" 이벤트가 만들어졌습니다. 초대 코드: ${inviteCode}`
      : `"${eventName}" 이벤트가 만들어졌습니다.`;
    showSuccessToast("이벤트가 생성되었습니다", description);
  },

  updated: (eventName: string) =>
    showSuccessToast(
      "이벤트가 수정되었습니다",
      `"${eventName}" 이벤트가 업데이트되었습니다.`,
    ),

  deleted: () =>
    showSuccessToast(
      "이벤트가 삭제되었습니다",
      "이벤트가 완전히 삭제되었습니다.",
    ),

  createError: (error?: string) =>
    showErrorToast("이벤트 생성에 실패했습니다", error),

  updateError: (error?: string) =>
    showErrorToast("이벤트 수정에 실패했습니다", error),

  deleteError: (error?: string) =>
    showErrorToast("이벤트 삭제에 실패했습니다", error),

  coverImageUploadError: () =>
    showWarningToast(
      "커버 이미지 업로드에 실패했습니다",
      "이벤트는 생성되었습니다. 나중에 이미지를 추가할 수 있습니다.",
    ),

  warningUploadFailed: (description?: string) =>
    showWarningToast(
      "커버 이미지 업로드에 실패했습니다",
      description || "나중에 이미지를 추가할 수 있습니다.",
    ),
};

/**
 * 참여 관련 성공 메시지
 */
export const ParticipantToast = {
  joined: (eventName: string) =>
    showSuccessToast(
      "이벤트에 참여했습니다",
      `"${eventName}" 이벤트에 참여했습니다.`,
    ),

  left: (eventName: string) =>
    showSuccessToast(
      "이벤트를 나갔습니다",
      `"${eventName}" 이벤트를 나갔습니다.`,
    ),

  joinError: (error?: string) =>
    showErrorToast("이벤트 참여에 실패했습니다", error),

  leaveError: (error?: string) =>
    showErrorToast("이벤트 탈퇴에 실패했습니다", error),

  alreadyJoined: () =>
    showWarningToast(
      "이미 참여 중입니다",
      "이 이벤트에는 이미 참여하고 있습니다.",
    ),

  maxParticipantsReached: () =>
    showErrorToast("참여 인원이 가득 찼습니다", "더 이상 참여할 수 없습니다."),
};

/**
 * 프로필 관련 성공 메시지
 */
export const ProfileToast = {
  updated: () =>
    showSuccessToast(
      "프로필이 수정되었습니다",
      "프로필 정보가 업데이트되었습니다.",
    ),

  avatarUploaded: () =>
    showSuccessToast(
      "프로필 사진이 업로드되었습니다",
      "새 사진이 적용되었습니다.",
    ),

  setupSuccess: () =>
    showSuccessToast("프로필 설정이 완료되었습니다", "환영합니다!"),

  updateError: (error?: string) =>
    showErrorToast("프로필 수정에 실패했습니다", error),

  avatarUploadError: (error?: string) =>
    showErrorToast("프로필 사진 업로드에 실패했습니다", error),

  setupError: (error?: string) =>
    showErrorToast("프로필 설정에 실패했습니다", error),

  usernameNotAvailable: () =>
    showErrorToast(
      "사용할 수 없는 사용자명입니다",
      "다른 사용자명을 입력해주세요.",
    ),
};

/**
 * 인증 관련 성공 메시지
 */
export const AuthToast = {
  signUpSuccess: () =>
    showSuccessToast("회원가입이 완료되었습니다", "로그인해주세요."),

  loginSuccess: (userName: string) =>
    showSuccessToast("로그인되었습니다", `${userName}님, 환영합니다!`),

  logoutSuccess: () => showSuccessToast("로그아웃되었습니다", "다시 만나요!"),

  passwordResetSuccess: () =>
    showSuccessToast(
      "비밀번호 변경이 완료되었습니다",
      "새로운 비밀번호로 로그인해주세요.",
    ),

  signUpError: (error?: string) =>
    showErrorToast("회원가입에 실패했습니다", error),

  loginError: (error?: string) =>
    showErrorToast("로그인에 실패했습니다", error),

  passwordResetError: (error?: string) =>
    showErrorToast("비밀번호 변경에 실패했습니다", error),

  emailAlreadyExists: () =>
    showErrorToast(
      "이미 사용 중인 이메일입니다",
      "다른 이메일로 가입해주세요.",
    ),
};

/**
 * 일반 작업 메시지
 */
export const CommonToast = {
  copySuccess: (text: string = "텍스트") =>
    showSuccessToast("복사되었습니다", `${text}이(가) 복사되었습니다.`),

  deleteSuccess: (itemName: string = "항목") =>
    showSuccessToast("삭제되었습니다", `${itemName}이(가) 삭제되었습니다.`),

  saveSuccess: (itemName: string = "데이터") =>
    showSuccessToast("저장되었습니다", `${itemName}이(가) 저장되었습니다.`),

  networkError: () =>
    showErrorToast(
      "네트워크 오류",
      "인터넷 연결을 확인해주세요.",
      TOAST_DURATION.LONG,
    ),

  serverError: () =>
    showErrorToast(
      "서버 오류",
      "잠시 후 다시 시도해주세요.",
      TOAST_DURATION.LONG,
    ),

  unexpectedError: (error?: string) =>
    showErrorToast(
      "오류가 발생했습니다",
      error || "문제가 발생했습니다. 다시 시도해주세요.",
      TOAST_DURATION.LONG,
    ),

  comingSoon: () => showInfoToast("준비 중입니다", "곧 출시될 예정입니다."),

  confirmAction: (action: string) =>
    showInfoToast("확인", `${action}을(를) 실행하시겠습니까?`),
};

/* ============================================================================
 * Toast 유틸 export
 * ============================================================================ */

export const Toast = {
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
  loading: showLoadingToast,
  dismiss: dismissToast,
  event: EventToast,
  participant: ParticipantToast,
  profile: ProfileToast,
  auth: AuthToast,
  common: CommonToast,
} as const;
