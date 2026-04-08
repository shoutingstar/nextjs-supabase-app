/**
 * 에러 처리 유틸
 * 프로젝트 전체에서 일관된 에러 처리를 위한 헬퍼 함수들
 */

/* ============================================================================
 * 타입 정의
 * ============================================================================ */

export interface ParsedError {
  message: string;
  code?: string;
  status?: number;
  isRetryable: boolean;
  type: "client" | "server" | "network" | "unknown";
}

/* ============================================================================
 * 에러 메시지 상수
 * ============================================================================ */

const ERROR_MESSAGES = {
  // 4xx 에러 (클라이언트 에러)
  400: "잘못된 요청입니다.",
  401: "인증이 필요합니다. 다시 로그인해주세요.",
  403: "접근 권한이 없습니다.",
  404: "요청한 리소스를 찾을 수 없습니다.",
  409: "충돌이 발생했습니다. 나중에 다시 시도해주세요.",
  422: "입력 데이터를 확인해주세요.",
  429: "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.",

  // 5xx 에러 (서버 에러)
  500: "서버 오류가 발생했습니다.",
  502: "서버 연결 오류입니다.",
  503: "서비스가 일시적으로 이용 불가능합니다.",
  504: "서버 응답 시간이 초과되었습니다.",

  // 네트워크 에러
  NETWORK_ERROR: "네트워크 연결을 확인해주세요.",
  TIMEOUT: "요청 시간이 초과되었습니다.",

  // 기본 에러
  UNKNOWN: "알 수 없는 오류가 발생했습니다.",
} as const;

/* ============================================================================
 * 에러 타입 판단 함수
 * ============================================================================ */

/**
 * 에러 객체에서 상태 코드를 추출합니다.
 * @param error - 처리할 에러 객체
 * @returns 상태 코드 또는 undefined
 */
export function getStatusCode(error: unknown): number | undefined {
  if (!error) return undefined;

  // FetchError 또는 Response 객체
  if (typeof error === "object" && "status" in error) {
    return (error as { status: number }).status;
  }

  // Supabase 에러
  if (typeof error === "object" && "status" in error) {
    return (error as { status: number }).status;
  }

  return undefined;
}

/**
 * 에러가 재시도 가능한지 판단합니다.
 * @param error - 처리할 에러 객체
 * @returns 재시도 가능 여부
 */
export function isRetryableError(error: unknown): boolean {
  const status = getStatusCode(error);

  // 5xx 에러는 재시도 가능
  if (status && status >= 500 && status < 600) {
    return true;
  }

  // 429 (Rate Limit)는 재시도 가능
  if (status === 429) {
    return true;
  }

  // 네트워크 에러는 재시도 가능
  if (error instanceof TypeError) {
    const message = (error as Error).message.toLowerCase();
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("timeout")
    ) {
      return true;
    }
  }

  return false;
}

/**
 * 에러 타입을 판단합니다.
 * @param error - 처리할 에러 객체
 * @returns 에러 타입 ('client' | 'server' | 'network' | 'unknown')
 */
export function getErrorType(
  error: unknown,
): "client" | "server" | "network" | "unknown" {
  const status = getStatusCode(error);

  // 4xx: 클라이언트 에러
  if (status && status >= 400 && status < 500) {
    return "client";
  }

  // 5xx: 서버 에러
  if (status && status >= 500 && status < 600) {
    return "server";
  }

  // 네트워크 에러
  if (error instanceof TypeError) {
    const message = (error as Error).message.toLowerCase();
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("timeout")
    ) {
      return "network";
    }
  }

  return "unknown";
}

/* ============================================================================
 * 에러 메시지 추출 함수
 * ============================================================================ */

/**
 * 에러 객체에서 메시지를 추출합니다.
 * @param error - 처리할 에러 객체
 * @returns 에러 메시지 문자열
 */
export function getErrorMessage(error: unknown): string {
  // Error 객체
  if (error instanceof Error) {
    return error.message;
  }

  // Supabase 에러
  if (typeof error === "object" && error !== null) {
    if ("message" in error) {
      const msg = (error as { message: unknown }).message;
      if (typeof msg === "string" && msg.length > 0) {
        return msg;
      }
    }

    // 상태 코드 기반 메시지
    if ("status" in error) {
      const status = (error as { status: number }).status;
      const key = status as keyof typeof ERROR_MESSAGES;
      if (key in ERROR_MESSAGES) {
        return ERROR_MESSAGES[key];
      }
    }
  }

  // 문자열 에러
  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  // 기본 메시지
  return ERROR_MESSAGES.UNKNOWN;
}

/**
 * 에러를 파싱하여 구조화된 정보를 반환합니다.
 * @param error - 처리할 에러 객체
 * @returns 파싱된 에러 정보
 */
export function parseError(error: unknown): ParsedError {
  const message = getErrorMessage(error);
  const status = getStatusCode(error);
  const type = getErrorType(error);
  const isRetryable = isRetryableError(error);

  return {
    message,
    status,
    type,
    isRetryable,
    code: status?.toString(),
  };
}

/* ============================================================================
 * 사용자 친화적 메시지 변환 함수
 * ============================================================================ */

/**
 * 기술적 에러 메시지를 사용자 친화적으로 변환합니다.
 * @param error - 처리할 에러 객체
 * @returns 사용자 친화적 에러 메시지
 */
export function getUserFriendlyMessage(error: unknown): string {
  const parsed = parseError(error);

  // 이미 사용자 친화적인 메시지인 경우 그대로 반환
  if (Object.values(ERROR_MESSAGES).includes(parsed.message as never)) {
    return parsed.message;
  }

  // 기술적 메시지를 기반으로 변환
  if (parsed.type === "network") {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (parsed.type === "server") {
    return "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  if (parsed.type === "client") {
    return "입력 데이터를 확인해주세요.";
  }

  return ERROR_MESSAGES.UNKNOWN;
}

/* ============================================================================
 * 에러 로깅 함수
 * ============================================================================ */

/**
 * 에러를 콘솔에 로깅합니다. (개발 환경에서만)
 * @param context - 에러 컨텍스트 (함수명, 위치 등)
 * @param error - 로깅할 에러
 * @param additionalInfo - 추가 정보 (선택사항)
 */
export function logError(
  context: string,
  error: unknown,
  additionalInfo?: Record<string, unknown>,
): void {
  const parsed = parseError(error);

  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}]`, {
      message: parsed.message,
      status: parsed.status,
      type: parsed.type,
      isRetryable: parsed.isRetryable,
      ...additionalInfo,
    });
  }

  // 프로덕션 환경에서는 외부 에러 추적 서비스로 전송 가능
  // Sentry, LogRocket 등
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_SENTRY_DSN
  ) {
    // TODO: 외부 에러 추적 서비스 통합
  }
}
