/**
 * EmptyState 컴포넌트
 * 다양한 상황에서 비어있는 상태를 표시합니다.
 * variant를 통해 상황별 스타일을 구분합니다.
 */

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

/* ============================================================================
 * EmptyState Props
 * ============================================================================ */

type EmptyStateVariant = "empty" | "error" | "no-results" | "no-permission";

interface EmptyStateProps {
  /** 아이콘 컴포넌트 (선택적) */
  icon?: ReactNode;

  /** 제목 */
  title: string;

  /** 설명 */
  description: string;

  /** 액션 버튼 또는 링크 (선택적) */
  action?: ReactNode;

  /** 상황 변형 (기본값: empty) */
  variant?: EmptyStateVariant;

  /** 커스텀 클래스 */
  className?: string;
}

/* ============================================================================
 * EmptyState 컴포넌트
 * ============================================================================ */

/**
 * 빈 상태 또는 데이터가 없는 상황을 표시합니다.
 *
 * 사용 예:
 * ```tsx
 * // 기본 비어있는 상태
 * <EmptyState
 *   icon={<Calendar />}
 *   title="이벤트가 없어요"
 *   description="새 이벤트를 만들어보세요"
 *   action={<Button>만들기</Button>}
 * />
 *
 * // 검색 결과 없음
 * <EmptyState
 *   variant="no-results"
 *   title="검색 결과가 없습니다"
 *   description="다른 키워드로 검색해보세요"
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "empty",
  className,
}: EmptyStateProps) {
  const variants: Record<EmptyStateVariant, string> = {
    empty: "border-dashed bg-background",
    error: "border-destructive/30 bg-destructive/5",
    "no-results": "border-muted bg-muted/20",
    "no-permission": "border-warning/30 bg-warning/5",
  };

  return (
    <div
      className={cn(
        "bg-card rounded-lg border p-12 text-center",
        variants[variant],
        className,
      )}
      role="status"
      aria-label={title}
    >
      {/* 아이콘 */}
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}

      {/* 제목 */}
      <p
        className={cn(
          "text-lg font-semibold",
          variant === "error" && "text-destructive",
          variant === "no-permission" && "text-warning",
        )}
      >
        {title}
      </p>

      {/* 설명 */}
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>

      {/* 액션 */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
