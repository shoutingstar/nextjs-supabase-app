/**
 * EventSkeleton 컴포넌트
 * 이벤트 카드 로딩 중 표시되는 스켈레톤 UI입니다.
 * bg-muted + animate-pulse 패턴으로 구현합니다.
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
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden="true"
    />
  );
}

/* ============================================================================
 * EventCard 스켈레톤 (default variant)
 * ============================================================================ */

/**
 * EventCard default variant의 스켈레톤
 * 헤더(제목+호스트) + 본문(설명+메타) 구조를 모방합니다.
 */
export function EventCardSkeleton() {
  return (
    <div
      className="rounded-lg border bg-card shadow-sm"
      aria-label="이벤트 카드 로딩 중"
      aria-busy="true"
    >
      {/* 커버 이미지 영역 스켈레톤 */}
      <SkeletonBlock className="h-48 w-full rounded-b-none rounded-t-lg" />

      {/* 헤더 영역: 제목 + 호스트 */}
      <div className="space-y-2 border-b p-4">
        <SkeletonBlock className="h-5 w-3/4" />
        <SkeletonBlock className="h-3 w-1/3" />
      </div>

      {/* 본문 영역: 설명 + 메타 정보 */}
      <div className="space-y-3 p-4">
        {/* 설명 텍스트 (3줄) */}
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-2/3" />
        </div>

        {/* 메타 정보: 날짜, 장소, 참여자 수 */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-4 w-4 rounded-full" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-4 w-4 rounded-full" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-4 w-4 rounded-full" />
            <SkeletonBlock className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * EventCard 스켈레톤 (compact variant)
 * ============================================================================ */

/**
 * EventCard compact variant의 스켈레톤
 * 날짜 박스 + 이벤트 정보 구조를 모방합니다.
 */
export function EventCardCompactSkeleton() {
  return (
    <div
      className="flex gap-4 rounded-lg border bg-card p-4"
      aria-label="이벤트 카드 로딩 중"
      aria-busy="true"
    >
      {/* 날짜 박스 스켈레톤 */}
      <SkeletonBlock className="h-16 w-16 shrink-0 rounded-lg" />

      {/* 이벤트 정보 스켈레톤 */}
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-2/3" />

        {/* 메타 정보 */}
        <div className="flex gap-4 pt-1">
          <div className="flex items-center gap-1">
            <SkeletonBlock className="h-4 w-4 rounded-full" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-1">
            <SkeletonBlock className="h-4 w-4 rounded-full" />
            <SkeletonBlock className="h-3 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * EventCard 스켈레톤 목록
 * ============================================================================ */

/**
 * EventCard 스켈레톤 목록 컴포넌트
 * @param count - 표시할 스켈레톤 수 (기본값: 3)
 * @param variant - 카드 변형 ('default' | 'compact')
 */
export function EventListSkeleton({
  count = 3,
  variant = "default",
}: {
  count?: number;
  variant?: "default" | "compact";
}) {
  return (
    <div
      className={
        variant === "compact"
          ? "space-y-3"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {Array.from({ length: count }, (_, i) =>
        variant === "compact" ? (
          <EventCardCompactSkeleton key={i} />
        ) : (
          <EventCardSkeleton key={i} />
        ),
      )}
    </div>
  );
}
