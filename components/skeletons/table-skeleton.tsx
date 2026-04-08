/**
 * TableSkeleton 컴포넌트
 * 테이블 데이터 로딩 중 표시되는 스켈레톤 UI입니다.
 */

import { cn } from "@/lib/utils";

/* ============================================================================
 * 기본 스켈레톤 블록
 * ============================================================================ */

/**
 * 기본 스켈레톤 블록 컴포넌트
 * @param className - 추가 스타일 클래스
 */
function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-md", className)}
      aria-hidden="true"
    />
  );
}

/* ============================================================================
 * 테이블 행 스켈레톤
 * ============================================================================ */

/**
 * 단일 테이블 행의 스켈레톤
 * 기본 4개 열 (체크박스, 제목, 상태, 액션)
 */
export function TableRowSkeleton({
  columnCount = 4,
}: {
  columnCount?: number;
}) {
  return (
    <div
      className="bg-card flex items-center gap-3 rounded-lg border p-4"
      role="row"
      aria-hidden="true"
    >
      {Array.from({ length: columnCount }, (_, i) => {
        // 첫 열: 좁은 너비 (체크박스 또는 아이콘)
        if (i === 0) {
          return <SkeletonBlock key={i} className="h-5 w-5 shrink-0" />;
        }
        // 마지막 열: 아주 좁은 너비 (액션)
        if (i === columnCount - 1) {
          return <SkeletonBlock key={i} className="h-8 w-8 shrink-0" />;
        }
        // 중간 열들: 유동적 너비
        const widthClass = i === 1 ? "w-1/3" : i === 2 ? "w-1/4" : "w-1/6";
        return (
          <SkeletonBlock key={i} className={cn("h-4 flex-1", widthClass)} />
        );
      })}
    </div>
  );
}

/* ============================================================================
 * 테이블 스켈레톤 목록
 * ============================================================================ */

/**
 * 여러 행의 테이블 스켈레톤
 * @param rowCount - 표시할 행 수 (기본값: 5)
 * @param columnCount - 열의 수 (기본값: 4)
 */
export function TableSkeleton({
  rowCount = 5,
  columnCount = 4,
}: {
  rowCount?: number;
  columnCount?: number;
}) {
  return (
    <div
      className="space-y-3"
      role="table"
      aria-label="테이블 로딩 중"
      aria-busy="true"
    >
      {/* 테이블 헤더 */}
      <div
        className="bg-muted/50 flex items-center gap-3 rounded-lg p-4"
        role="row"
      >
        {Array.from({ length: columnCount }, (_, i) => {
          if (i === 0) {
            return <SkeletonBlock key={i} className="h-4 w-5 shrink-0" />;
          }
          if (i === columnCount - 1) {
            return <SkeletonBlock key={i} className="h-4 w-8 shrink-0" />;
          }
          const widthClass = i === 1 ? "w-1/3" : i === 2 ? "w-1/4" : "w-1/6";
          return (
            <SkeletonBlock key={i} className={cn("h-4 flex-1", widthClass)} />
          );
        })}
      </div>

      {/* 테이블 행들 */}
      {Array.from({ length: rowCount }, (_, i) => (
        <TableRowSkeleton key={i} columnCount={columnCount} />
      ))}
    </div>
  );
}

/* ============================================================================
 * 간단한 테이블 스켈레톤 (컴팩트)
 * ============================================================================ */

/**
 * 간단한 목록 형태의 테이블 스켈레톤
 * 참여자 목록, 이벤트 참석자 등에 사용
 */
export function SimpleTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          {/* 아바타 */}
          <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full" />
          {/* 이름 */}
          <SkeletonBlock className="h-4 w-32 flex-1" />
          {/* 상태 또는 액션 */}
          <SkeletonBlock className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
 * 참여자 목록 스켈레톤
 * ============================================================================ */

/**
 * 이벤트 참여자 목록의 스켈레톤
 * 아바타 + 이름 + 상태 구조
 */
export function ParticipantListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            {/* 아바타 */}
            <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
            {/* 사용자 정보 */}
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-3 w-32" />
            </div>
          </div>
          {/* 액션 버튼 */}
          <SkeletonBlock className="h-8 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}
