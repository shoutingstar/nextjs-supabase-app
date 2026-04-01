/**
 * API 응답 관련 타입 정의
 */

/** 기본 API 응답 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

/** 페이지네이션 메타데이터 */
export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/** 페이지네이션이 포함된 API 응답 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

/** 서버 액션 결과 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
