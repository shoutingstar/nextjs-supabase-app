/**
 * ErrorState 컴포넌트
 * 에러 상황을 사용자 친화적으로 표시합니다.
 * EmptyState와 유사한 구조로 일관성을 유지합니다.
 */

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ============================================================================
 * ErrorState Props
 * ============================================================================ */

interface ErrorStateProps {
  /** 에러 타이틀 */
  title: string;

  /** 에러 설명 */
  description: string;

  /** 커스텀 아이콘 (선택사항, 기본값: AlertCircle) */
  icon?: ReactNode;

  /** 재시도 버튼 (선택사항) */
  onRetry?: () => void;

  /** 추가 액션 버튼 (선택사항) */
  action?: ReactNode;

  /** 상세 에러 메시지 (기술 담당자용, 선택사항) */
  detailMessage?: string;

  /** 커스텀 스타일 (선택사항) */
  className?: string;
}

/* ============================================================================
 * ErrorState 컴포넌트
 * ============================================================================ */

/**
 * 에러 상태를 표시하는 컴포넌트
 *
 * 사용 예:
 * ```tsx
 * <ErrorState
 *   title="데이터를 불러올 수 없습니다"
 *   description="네트워크 연결을 확인하고 다시 시도해주세요."
 *   onRetry={handleRetry}
 * />
 * ```
 */
export function ErrorState({
  title,
  description,
  icon = <AlertCircle className="text-destructive h-10 w-10" />,
  onRetry,
  action,
  detailMessage,
  className,
}: ErrorStateProps) {
  const isNetworkError = description.includes("네트워크");

  return (
    <div
      className={cn(
        "bg-card border-destructive/20 bg-destructive/5 rounded-lg border p-12 text-center",
        className,
      )}
      role="alert"
      aria-label={title}
    >
      {/* 아이콘 */}
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}

      {/* 제목 */}
      <h2 className="text-destructive text-lg font-semibold">{title}</h2>

      {/* 설명 */}
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>

      {/* 상세 메시지 (개발 모드) */}
      {detailMessage && process.env.NODE_ENV === "development" && (
        <details className="mt-4 text-left">
          <summary className="text-muted-foreground hover:text-foreground cursor-pointer font-mono text-xs">
            상세 정보 보기
          </summary>
          <pre className="bg-muted mt-2 overflow-auto rounded-md p-3 text-xs">
            {detailMessage}
          </pre>
        </details>
      )}

      {/* 액션 버튼들 */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {/* 재시도 버튼 */}
        {onRetry && (
          <Button onClick={onRetry} variant="default" size="sm">
            다시 시도
          </Button>
        )}

        {/* 커스텀 액션 */}
        {action}

        {/* 기본 홈 버튼 (액션이 없는 경우) */}
        {!action && !onRetry && (
          <Button asChild variant="outline" size="sm">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        )}
      </div>

      {/* 도움말 텍스트 */}
      {isNetworkError && (
        <p className="text-muted-foreground mt-4 text-xs">
          계속 문제가 발생하면 관리자에게 문의해주세요.
        </p>
      )}
    </div>
  );
}

/* ============================================================================
 * 상황별 ErrorState 컴포넌트들
 * ============================================================================ */

/**
 * 네트워크 에러 상태
 */
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="네트워크 연결 오류"
      description="인터넷 연결을 확인하고 다시 시도해주세요."
      onRetry={onRetry}
    />
  );
}

/**
 * 서버 에러 상태
 */
export function ServerErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="서버 오류가 발생했습니다"
      description="잠시 후 다시 시도해주세요. 계속 문제가 발생하면 관리자에게 문의해주세요."
      onRetry={onRetry}
    />
  );
}

/**
 * 권한 없음 에러 상태
 */
export function UnauthorizedErrorState() {
  return (
    <ErrorState
      title="접근 권한이 없습니다"
      description="로그인이 필요하거나 권한이 부족합니다."
      action={
        <Button asChild variant="outline" size="sm">
          <Link href="/auth/login">로그인</Link>
        </Button>
      }
    />
  );
}

/**
 * 찾을 수 없음 에러 상태
 */
export function NotFoundErrorState({
  itemName = "항목",
}: {
  itemName?: string;
}) {
  return (
    <ErrorState
      title={`${itemName}을(를) 찾을 수 없습니다`}
      description="삭제되었거나 주소가 잘못되었을 수 있습니다."
      action={
        <Button asChild variant="outline" size="sm">
          <Link href="/">홈으로</Link>
        </Button>
      }
    />
  );
}

/**
 * 일반적인 에러 상태 (커스터마이징 가능)
 */
export function GenericErrorState({
  title = "오류가 발생했습니다",
  description = "잠시 후 다시 시도해주세요.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <ErrorState title={title} description={description} onRetry={onRetry} />
  );
}
