"use client";

/**
 * ErrorBoundary 컴포넌트
 * React의 에러 경계 기능을 활용하여 예상치 못한 에러를 포착하고 처리합니다.
 * 클라이언트 컴포넌트에서만 사용 가능합니다.
 */

import React, { ReactNode } from "react";

import { ServerErrorState } from "@/components/ui/error-state";
import { parseError } from "@/lib/utils/error-handler";

/* ============================================================================
 * ErrorBoundary Props
 * ============================================================================ */

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 에러 발생 시 콜백 함수 (선택사항) */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** 폴백 UI (선택사항) */
  fallback?: ReactNode;
  /** 에러 발생 시 재시도 버튼 표시 여부 (기본값: true) */
  showRetry?: boolean;
}

/* ============================================================================
 * ErrorBoundary 상태
 * ============================================================================ */

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/* ============================================================================
 * ErrorBoundary 클래스 컴포넌트
 * ============================================================================ */

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 상태 업데이트
    this.setState({
      errorInfo,
    });

    // 콜백 함수 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 개발 환경에서 콘솔에 에러 로깅
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // 프로덕션 환경에서는 외부 에러 추적 서비스로 전송 가능
    // if (process.env.NODE_ENV === "production") {
    //   logErrorToService(error, errorInfo);
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;
      const parsed = parseError(error);

      return (
        <ServerErrorState
          onRetry={
            this.props.showRetry !== false ? this.handleReset : undefined
          }
        />
      );
    }

    return this.props.children;
  }
}

/* ============================================================================
 * 에러 처리 유틸 함수
 * ============================================================================ */

/**
 * ErrorBoundary로 컴포넌트를 감싸는 HOC
 * @param Component - 감쌀 컴포넌트
 * @param errorBoundaryProps - ErrorBoundary props
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
