/**
 * FormFieldError 컴포넌트
 * React Hook Form과 함께 사용하여 필드별 실시간 에러 메시지를 표시합니다.
 */

import { AlertCircle, CheckCircle } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

/* ============================================================================
 * FormFieldError Props
 * ============================================================================ */

interface FormFieldErrorProps {
  /** 에러 메시지 */
  error?: string;
  /** 필드가 터치되었는지 여부 */
  touched?: boolean;
  /** 성공 메시지 (선택사항) */
  successMessage?: string;
  /** 필드가 유효한지 여부 */
  isValid?: boolean;
  /** 커스텀 아이콘 (선택사항) */
  icon?: ReactNode;
  /** 커스텀 클래스 */
  className?: string;
}

/* ============================================================================
 * FormFieldError 컴포넌트
 * ============================================================================ */

/**
 * 필드별 에러 메시지 표시 컴포넌트
 *
 * 사용 예:
 * ```tsx
 * const { formState: { errors, isDirty, dirtyFields } } = useForm();
 *
 * <FormFieldError
 *   error={errors.email?.message}
 *   touched={isDirty && dirtyFields.email}
 *   isValid={!errors.email && dirtyFields.email}
 * />
 * ```
 */
export function FormFieldError({
  error,
  touched = false,
  successMessage,
  isValid = false,
  icon,
  className,
}: FormFieldErrorProps) {
  // 에러가 없고 터치되지 않았으면 렌더링하지 않음
  if (!error && !touched && !isValid) {
    return null;
  }

  // 에러 상태
  if (error && touched) {
    return (
      <div
        className={cn(
          "text-destructive mt-1 flex items-center gap-1.5 text-sm",
          className,
        )}
        role="alert"
        aria-live="polite"
      >
        {icon || <AlertCircle className="h-4 w-4 shrink-0" />}
        <span>{error}</span>
      </div>
    );
  }

  // 성공 상태
  if (isValid && successMessage) {
    return (
      <div
        className={cn(
          "mt-1 flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <CheckCircle className="h-4 w-4 shrink-0" />
        <span>{successMessage}</span>
      </div>
    );
  }

  // 유효한 상태 (메시지 없음)
  if (isValid) {
    return (
      <div
        className={cn(
          "mt-1 flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400",
          className,
        )}
        role="status"
      >
        <CheckCircle className="h-4 w-4 shrink-0" />
      </div>
    );
  }

  return null;
}

/* ============================================================================
 * 필드 래퍼 컴포넌트
 * ============================================================================ */

interface FormFieldWrapperProps {
  /** 필드 레이블 */
  label?: string;
  /** 필드가 필수인지 여부 */
  required?: boolean;
  /** 필드 설명 */
  description?: string;
  /** 필드 ID (label htmlFor 연결용) */
  id?: string;
  /** 에러 메시지 */
  error?: string;
  /** 필드가 터치되었는지 여부 */
  touched?: boolean;
  /** 필드가 유효한지 여부 */
  isValid?: boolean;
  /** 자식 요소 (입력 필드) */
  children: ReactNode;
  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 필드를 감싼 래퍼 컴포넌트
 * 레이블, 입력 필드, 에러 메시지를 일관된 스타일로 구성합니다.
 *
 * 사용 예:
 * ```tsx
 * <FormFieldWrapper
 *   label="이메일"
 *   id="email"
 *   error={errors.email?.message}
 *   touched={isDirty && dirtyFields.email}
 *   isValid={!errors.email && dirtyFields.email}
 * >
 *   <Input {...register("email")} />
 * </FormFieldWrapper>
 * ```
 */
export function FormFieldWrapper({
  label,
  required,
  description,
  id,
  error,
  touched,
  isValid,
  children,
  className,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {/* 레이블 */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* 입력 필드 (상태에 따라 스타일 변경) */}
      <div
        className={
          error && touched
            ? "[&>input]:border-destructive [&>input]:focus:ring-destructive/30"
            : isValid
              ? "[&>input]:border-green-500 [&>input]:focus:ring-green-500/30"
              : ""
        }
      >
        {children}
      </div>

      {/* 설명 텍스트 */}
      {description && !error && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}

      {/* 에러 메시지 */}
      <FormFieldError error={error} touched={touched} isValid={isValid} />
    </div>
  );
}

/* ============================================================================
 * 인라인 에러 컴포넌트 (심플 버전)
 * ============================================================================ */

interface InlineErrorProps {
  /** 에러 메시지 */
  message?: string;
  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 간단한 인라인 에러 메시지
 */
export function InlineError({ message, className }: InlineErrorProps) {
  if (!message) return null;

  return (
    <p className={cn("text-destructive text-sm", className)} role="alert">
      {message}
    </p>
  );
}
