/**
 * ParticipantSkeleton 컴포넌트
 * 참여자 카드 로딩 중 표시되는 스켈레톤 UI입니다.
 * bg-muted + animate-pulse 패턴으로 구현합니다.
 */

import { cn } from "@/lib/utils";

/* ============================================================================
 * 기본 스켈레톤 블록
 * ============================================================================ */

/**
 * 기본 스켈레톤 블록 컴포넌트
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
 * ParticipantCard 스켈레톤 (default variant)
 * ============================================================================ */

/**
 * ParticipantCard default variant의 스켈레톤
 * 헤더(아바타+이름+배지) + 본문(RSVP+날짜) 구조를 모방합니다.
 */
export function ParticipantCardSkeleton() {
  return (
    <div
      className="rounded-lg border bg-card shadow-sm"
      aria-label="참여자 카드 로딩 중"
      aria-busy="true"
    >
      {/* 헤더 영역: 아바타 + 이름 + 배지 */}
      <div className="flex items-center gap-3 border-b p-4">
        {/* 아바타 원형 스켈레톤 */}
        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />

        <div className="flex-1 space-y-2">
          {/* 이름 */}
          <SkeletonBlock className="h-4 w-28" />
          {/* 배지 */}
          <SkeletonBlock className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* 본문 영역: RSVP + 참여 일시 */}
      <div className="space-y-2 p-4">
        {/* RSVP 상태 */}
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-4 w-4 rounded-full" />
          <SkeletonBlock className="h-3 w-20" />
        </div>

        {/* 참여 일시 */}
        <SkeletonBlock className="h-3 w-36" />
      </div>
    </div>
  );
}

/* ============================================================================
 * ParticipantCard 스켈레톤 (compact variant)
 * ============================================================================ */

/**
 * ParticipantCard compact variant의 스켈레톤
 * 아바타 + 이름 + RSVP 아이콘 구조를 모방합니다.
 */
export function ParticipantCardCompactSkeleton() {
  return (
    <div
      className="flex items-center gap-3 rounded-lg border bg-card p-3"
      aria-label="참여자 카드 로딩 중"
      aria-busy="true"
    >
      {/* 아바타 원형 스켈레톤 */}
      <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full" />

      {/* 이름 영역 */}
      <div className="flex-1 space-y-1">
        <SkeletonBlock className="h-3.5 w-24" />
        <SkeletonBlock className="h-3 w-16" />
      </div>

      {/* RSVP 아이콘 */}
      <SkeletonBlock className="h-4 w-4 rounded-full" />
    </div>
  );
}

/* ============================================================================
 * ParticipantCard 스켈레톤 목록
 * ============================================================================ */

/**
 * ParticipantCard 스켈레톤 목록 컴포넌트
 * @param count - 표시할 스켈레톤 수 (기본값: 4)
 * @param variant - 카드 변형 ('default' | 'compact')
 */
export function ParticipantListSkeleton({
  count = 4,
  variant = "default",
}: {
  count?: number;
  variant?: "default" | "compact";
}) {
  return (
    <div
      className={
        variant === "compact"
          ? "space-y-2"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {Array.from({ length: count }, (_, i) =>
        variant === "compact" ? (
          <ParticipantCardCompactSkeleton key={i} />
        ) : (
          <ParticipantCardSkeleton key={i} />
        ),
      )}
    </div>
  );
}
