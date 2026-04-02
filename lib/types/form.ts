/**
 * Form 타입 정의 및 Zod 검증 스키마
 * React Hook Form과 Zod을 통합한 폼 타입 관리
 * Phase 4에서 서버 검증 스키마와 통합될 예정
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 로그인 폼 데이터
 * @description 이메일/비밀번호 로그인 폼
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * 회원가입 폼 데이터
 * @description 사용자 회원가입 폼
 */
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

/**
 * 비밀번호 변경 폼 데이터
 * @description 기존 비밀번호 확인 후 새 비밀번호 설정
 */
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 이벤트 생성 폼 데이터
 * @description CreateEventInput과 동일한 구조
 */
export interface CreateEventFormData {
  title: string;
  description?: string;
  start_date: string; // ISO 8601 형식
  location?: string;
  max_participants?: number;
  cover_image?: File;
}

/**
 * 이벤트 수정 폼 데이터
 * @description 이벤트 수정 시 사용
 */
export interface UpdateEventFormData extends Partial<CreateEventFormData> {
  status?: "draft" | "published" | "cancelled" | "completed";
}

/**
 * 이벤트 참여 폼 데이터
 * @description 초대 링크를 통한 이벤트 참여
 */
export interface JoinEventFormData {
  rsvp?: "attending" | "not_attending" | "maybe" | "no_response";
}

/**
 * RSVP 업데이트 폼 데이터
 * @description 참여 여부 변경
 */
export interface UpdateRsvpFormData {
  rsvp: "attending" | "not_attending" | "maybe" | "no_response";
}

/**
 * 사용자 프로필 수정 폼 데이터
 * @description 사용자 정보 수정
 */
export interface UpdateUserProfileFormData {
  name?: string;
  avatar_url?: string;
  avatar_file?: File;
}

/**
 * 폼 에러 정보
 * @description React Hook Form의 에러 객체
 */
export interface FieldError {
  message: string;
  type: string;
}

/**
 * 폼 상태
 * @description React Hook Form의 FormState 기반
 */
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, FieldError>;
  isDirty: boolean;
  isValid: boolean;
  isValidating: boolean;
  submitCount: number;
}

/* ============================================================================
 * Zod 스키마 정의 (Zod 설치 후 사용)
 * Phase 4에서 실제 검증 로직 구현
 * ============================================================================ */

/**
 * Zod 검증 스키마 타입 (선택사항)
 * @description import 타입으로 실제 Zod이 설치될 때까지 선택적 import
 */

/**
 * 로그인 검증 스키마
 * @example
 * ```typescript
 * import { z } from 'zod';
 *
 * export const loginSchema = z.object({
 *   email: z.string().email('유효한 이메일을 입력하세요'),
 *   password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
 * });
 *
 * type LoginFormData = z.infer<typeof loginSchema>;
 * ```
 */
export type LoginSchema = any; // Zod 설치 후 구체화

/**
 * 회원가입 검증 스키마
 * @example
 * ```typescript
 * export const signUpSchema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 *   confirmPassword: z.string(),
 *   name: z.string().optional(),
 * }).refine((data) => data.password === data.confirmPassword, {
 *   message: '비밀번호가 일치하지 않습니다',
 *   path: ['confirmPassword'],
 * });
 * ```
 */
export type SignUpSchema = any; // Zod 설치 후 구체화

/**
 * 이벤트 생성 검증 스키마
 * @see lib/validators/event-schema.ts
 */
export type { CreateEventFormValues as CreateEventSchema } from "@/lib/validators/event-schema";

/**
 * RSVP 업데이트 검증 스키마
 * @example
 * ```typescript
 * export const updateRsvpSchema = z.object({
 *   rsvp: z.enum(['attending', 'not_attending', 'maybe', 'no_response']),
 * });
 * ```
 */
export type UpdateRsvpSchema = any; // Zod 설치 후 구체화

/* ============================================================================
 * Form Builder Helper Types (Phase 4에서 사용)
 * ============================================================================ */

/**
 * 폼 필드 정의
 * @description 동적 폼 생성 시 사용할 필드 메타데이터
 */
export interface FormFieldDefinition {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "datetime-local"
    | "textarea"
    | "select"
    | "checkbox"
    | "file";
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
  options?: Array<{ value: string; label: string }>;
  helperText?: string;
  defaultValue?: any;
  disabled?: boolean;
}

/**
 * 폼 구성 정의
 * @description 전체 폼의 메타데이터
 */
export interface FormDefinition {
  name: string;
  fields: FormFieldDefinition[];
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: (data: any) => Promise<void> | void;
  onCancel?: () => void;
}

/**
 * 폼 제출 결과
 * @description 폼 제출 후 반환되는 결과
 */
export interface FormSubmitResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}
