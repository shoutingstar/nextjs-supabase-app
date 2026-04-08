/**
 * FormErrorMessage 컴포넌트
 * React Hook Form의 에러 메시지를 표시합니다.
 * FormMessage와 유사하지만, 아이콘과 색상을 강조합니다.
 */

import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/* ============================================================================
 * FormErrorMessage Props
 * ============================================================================ */

interface FormErrorMessageProps {
  /** 에러 메시지 */
  message?: string;

  /** 보조 텍스트 (더 상세한 설명) */
  hint?: string;

  /** 아이콘 표시 여부 (기본값: true) */
  showIcon?: boolean;

  /** 커스텀 클래스 */
  className?: string;
}

/* ============================================================================
 * FormErrorMessage 컴포넌트
 * ============================================================================ */

/**
 * 폼 필드의 에러 메시지를 표시합니다.
 *
 * 사용 예:
 * ```tsx
 * <FormErrorMessage message={field.error?.message} />
 * ```
 */
export function FormErrorMessage({
  message,
  hint,
  showIcon = true,
  className,
}: FormErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn("mt-2 flex flex-col gap-1", className)}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        {showIcon && (
          <AlertCircle className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
        )}
        <span className="text-destructive text-sm font-medium">{message}</span>
      </div>

      {hint && (
        <p className="text-muted-foreground pl-6 text-xs leading-relaxed">
          💡 {hint}
        </p>
      )}
    </div>
  );
}

/* ============================================================================
 * FormFieldStatus 컴포넌트 (필드 상태 표시)
 * ============================================================================ */

interface FormFieldStatusProps {
  /** 필드 검증 상태 */
  isValid?: boolean;
  isError?: boolean;
  isTouched?: boolean;

  /** 성공 메시지 */
  successMessage?: string;

  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 폼 필드의 검증 상태를 시각적으로 표시합니다.
 * 성공(초록색), 에러(빨강색) 상태를 표현합니다.
 */
export function FormFieldStatus({
  isValid,
  isError,
  isTouched,
  successMessage,
  className,
}: FormFieldStatusProps) {
  // touched 상태에서만 표시
  if (!isTouched) return null;

  // 에러 상태
  if (isError) {
    return (
      <div
        className={cn(
          "text-destructive mt-1 flex items-center gap-1.5 text-xs font-medium",
          className,
        )}
      >
        <span className="bg-destructive inline-block h-2 w-2 rounded-full" />
        검증 오류
      </div>
    );
  }

  // 성공 상태
  if (isValid && successMessage) {
    return (
      <div
        className={cn(
          "mt-1 flex items-center gap-1.5 text-xs font-medium text-green-600",
          className,
        )}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
        {successMessage}
      </div>
    );
  }

  return null;
}

/* ============================================================================
 * FormFieldHint 컴포넌트 (입력 가이드)
 * ============================================================================ */

interface FormFieldHintProps {
  /** 가이드 텍스트 */
  text: string;

  /** 남은 글자 수 (문자열 길이 검증용) */
  remainingLength?: number;
  maxLength?: number;

  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 폼 필드의 입력 가이드와 남은 글자 수를 표시합니다.
 */
export function FormFieldHint({
  text,
  remainingLength,
  maxLength,
  className,
}: FormFieldHintProps) {
  const showCharCount =
    remainingLength !== undefined && maxLength !== undefined;
  const isNearLimit = showCharCount && remainingLength < maxLength * 0.2; // 20% 이하

  return (
    <div
      className={cn(
        "text-muted-foreground mt-1.5 flex items-center justify-between text-xs",
        className,
      )}
    >
      <span>{text}</span>

      {showCharCount && (
        <span
          className={isNearLimit ? "font-medium text-amber-600" : undefined}
        >
          {remainingLength}/{maxLength}
        </span>
      )}
    </div>
  );
}

/* ============================================================================
 * FormFieldValidation 컴포넌트 (통합)
 * ============================================================================ */

interface FormFieldValidationProps {
  /** 에러 메시지 */
  errorMessage?: string;

  /** 에러 힌트 */
  errorHint?: string;

  /** 가이드 텍스트 */
  guideText?: string;

  /** 현재 입력값 길이 (character count용) */
  inputLength?: number;

  /** 최대 길이 */
  maxLength?: number;

  /** 필드가 touched 상태인지 여부 */
  isTouched?: boolean;

  /** 커스텀 클래스 */
  className?: string;
}

/**
 * 폼 필드의 모든 검증 피드백을 통합하여 표시합니다.
 *
 * 사용 예:
 * ```tsx
 * <FormFieldValidation
 *   errorMessage={errors.title?.message}
 *   guideText="이벤트 제목을 입력해주세요"
 *   inputLength={title.length}
 *   maxLength={100}
 *   isTouched={touched.title}
 *   isValid={!errors.title}
 * />
 * ```
 */
export function FormFieldValidation({
  errorMessage,
  errorHint,
  guideText,
  inputLength,
  maxLength,
  isTouched,
  className,
}: FormFieldValidationProps) {
  return (
    <div className={cn("mt-2", className)}>
      {/* 에러 메시지 (우선순위 1) */}
      {errorMessage && isTouched && (
        <FormErrorMessage message={errorMessage} hint={errorHint} />
      )}

      {/* 가이드 텍스트 (에러 없을 때만) */}
      {!errorMessage && guideText && (
        <FormFieldHint
          text={guideText}
          remainingLength={
            inputLength !== undefined && maxLength
              ? maxLength - inputLength
              : undefined
          }
          maxLength={maxLength}
        />
      )}

      {/* 필드 상태 인디케이터 */}
      <FormFieldStatus isTouched={isTouched} isError={!!errorMessage} />
    </div>
  );
}
