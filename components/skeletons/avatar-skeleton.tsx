/**
 * AvatarSkeleton 컴포넌트
 * 사용자 아바타 로딩 중 표시되는 스켈레톤 UI입니다.
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
 * 기본 아바타 스켈레톤 (작은 사이즈)
 * ============================================================================ */

/**
 * 작은 크기 아바타 스켈레톤 (32x32)
 * 댓글, 목록 등에 사용
 */
export function AvatarSkeletonSmall() {
  return (
    <SkeletonBlock
      className="h-8 w-8 shrink-0 rounded-full"
      aria-label="아바타 로딩 중"
    />
  );
}

/* ============================================================================
 * 중간 크기 아바타 스켈레톤
 * ============================================================================ */

/**
 * 중간 크기 아바타 스켈레톤 (40x40)
 * 참여자 목록, 댓글 쓰기 등에 사용
 */
export function AvatarSkeletonMedium() {
  return (
    <SkeletonBlock
      className="h-10 w-10 shrink-0 rounded-full"
      aria-label="아바타 로딩 중"
    />
  );
}

/* ============================================================================
 * 큰 크기 아바타 스켈레톤
 * ============================================================================ */

/**
 * 큰 크기 아바타 스켈레톤 (96x96)
 * 프로필 페이지 등에 사용
 */
export function AvatarSkeletonLarge() {
  return (
    <SkeletonBlock
      className="h-24 w-24 shrink-0 rounded-full"
      aria-label="아바타 로딩 중"
    />
  );
}

/* ============================================================================
 * 프로필 헤더 스켈레톤
 * ============================================================================ */

/**
 * 사용자 프로필 헤더의 스켈레톤
 * 아바타 + 이름 + 이메일 + 상태 배지
 */
export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-card flex items-center gap-4 rounded-lg border p-4">
      {/* 큰 아바타 */}
      <AvatarSkeletonLarge />

      {/* 프로필 정보 */}
      <div className="flex-1 space-y-2">
        {/* 이름 */}
        <SkeletonBlock className="h-5 w-40" />
        {/* 이메일 */}
        <SkeletonBlock className="h-4 w-52" />
        {/* 상태 배지 */}
        <div className="flex gap-2 pt-1">
          <SkeletonBlock className="h-6 w-16 rounded-full" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* 액션 버튼 */}
      <SkeletonBlock className="h-10 w-24 rounded-md" />
    </div>
  );
}

/* ============================================================================
 * 사용자 카드 스켈레톤
 * ============================================================================ */

/**
 * 사용자 정보 카드의 스켈레톤
 * 그리드 레이아웃에 사용
 */
export function UserCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-4">
      {/* 아바타 */}
      <div className="mb-4 flex justify-center">
        <AvatarSkeletonLarge />
      </div>

      {/* 사용자 정보 */}
      <div className="space-y-2 text-center">
        {/* 이름 */}
        <SkeletonBlock className="mx-auto h-4 w-32" />
        {/* 이메일 */}
        <SkeletonBlock className="mx-auto h-3 w-40" />
      </div>

      {/* 액션 버튼 */}
      <div className="mt-4 flex gap-2">
        <SkeletonBlock className="h-9 flex-1 rounded-md" />
        <SkeletonBlock className="h-9 flex-1 rounded-md" />
      </div>
    </div>
  );
}

/* ============================================================================
 * 멀티 사용자 카드 그리드 스켈레톤
 * ============================================================================ */

/**
 * 여러 사용자 카드의 그리드 스켈레톤
 * @param count - 표시할 카드 수 (기본값: 6)
 */
export function UserCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ============================================================================
 * 사용자 목록 아이템 스켈레톤 (컴팩트)
 * ============================================================================ */

/**
 * 사용자 목록 항목의 스켈레톤 (리스트 형식)
 */
export function UserListItemSkeleton() {
  return (
    <div className="flex items-center justify-between border-b p-3">
      <div className="flex flex-1 items-center gap-3">
        {/* 아바타 */}
        <AvatarSkeletonMedium />
        {/* 사용자 정보 */}
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-3 w-32" />
        </div>
      </div>
      {/* 상태 배지 또는 액션 */}
      <SkeletonBlock className="h-6 w-20 rounded-full" />
    </div>
  );
}

/* ============================================================================
 * 사용자 목록 스켈레톤
 * ============================================================================ */

/**
 * 여러 사용자의 목록 스켈레톤
 * @param count - 표시할 항목 수 (기본값: 5)
 */
export function UserListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-card rounded-lg border">
      {Array.from({ length: count }, (_, i) => (
        <UserListItemSkeleton key={i} />
      ))}
    </div>
  );
}
