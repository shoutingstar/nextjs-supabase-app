/**
 * API 응답 관련 타입 정의
 * Next.js Route Handler 및 Server Action 응답에 사용
 */

/**
 * 기본 API 응답
 * @template T - 응답 데이터 타입
 * @description GET, POST, PATCH, DELETE 등 모든 API 응답에 사용
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 페이지네이션 메타데이터
 * @description 목록 조회 API의 메타 정보
 */
export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/**
 * 페이지네이션이 포함된 API 응답
 * @template T - 배열 요소 타입
 * @description 목록 조회 API 응답 (예: GET /api/events)
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

/**
 * 서버 액션 결과
 * @template T - 반환 데이터 타입
 * @description useFormState, useTransition 등에서 사용되는 서버 액션 응답 타입
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
