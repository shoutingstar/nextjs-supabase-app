/**
 * FormSkeleton 컴포넌트
 * 폼 필드 로딩 중 표시되는 스켈레톤 UI입니다.
 * 기본 SkeletonBlock 패턴을 따릅니다.
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
 * FormField 스켈레톤
 * ============================================================================ */

/**
 * 단일 폼 필드의 스켈레톤
 * label + input 구조
 */
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      {/* 레이블 */}
      <SkeletonBlock className="h-4 w-24" />
      {/* 입력 필드 */}
      <SkeletonBlock className="h-10 w-full rounded-md" />
    </div>
  );
}

/* ============================================================================
 * FormField 스켈레톤 그룹
 * ============================================================================ */

/**
 * 여러 폼 필드의 스켈레톤 목록
 * @param count - 표시할 필드 수 (기본값: 3)
 */
export function FormFieldListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <FormFieldSkeleton key={i} />
      ))}
    </div>
  );
}

/* ============================================================================
 * TextArea 스켈레톤
 * ============================================================================ */

/**
 * 긴 텍스트 입력 필드(textarea)의 스켈레톤
 */
export function TextAreaFieldSkeleton() {
  return (
    <div className="space-y-2">
      {/* 레이블 */}
      <SkeletonBlock className="h-4 w-24" />
      {/* 텍스트 영역 */}
      <SkeletonBlock className="h-24 w-full rounded-md" />
    </div>
  );
}

/* ============================================================================
 * Select 스켈레톤
 * ============================================================================ */

/**
 * 드롭다운 선택 필드(select)의 스켈레톤
 */
export function SelectFieldSkeleton() {
  return (
    <div className="space-y-2">
      {/* 레이블 */}
      <SkeletonBlock className="h-4 w-24" />
      {/* 선택 필드 */}
      <SkeletonBlock className="h-10 w-full rounded-md" />
    </div>
  );
}

/* ============================================================================
 * 전체 폼 스켈레톤 (조합형)
 * ============================================================================ */

/**
 * 완전한 이벤트 생성 폼의 스켈레톤
 * 실제 폼 구조를 반영합니다.
 */
export function EventFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* 이벤트 제목 */}
      <FormFieldSkeleton />

      {/* 날짜 및 시간 */}
      <FormFieldSkeleton />

      {/* 장소 */}
      <FormFieldSkeleton />

      {/* 최대 참여 인원 */}
      <FormFieldSkeleton />

      {/* 설명 (텍스트 영역) */}
      <TextAreaFieldSkeleton />

      {/* 파일 업로드 */}
      <FormFieldSkeleton />

      {/* 폼 액션 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <SkeletonBlock className="h-10 w-20 rounded-md" />
        <SkeletonBlock className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}

/* ============================================================================
 * 프로필 폼 스켈레톤
 * ============================================================================ */

/**
 * 사용자 프로필 편집 폼의 스켈레톤
 */
export function ProfileFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* 아바타 섹션 */}
      <div className="flex flex-col items-center gap-4">
        <SkeletonBlock className="h-24 w-24 rounded-full" />
        <SkeletonBlock className="h-10 w-32 rounded-md" />
      </div>

      {/* 이름 */}
      <FormFieldSkeleton />

      {/* 사용자명 */}
      <FormFieldSkeleton />

      {/* 웹사이트 */}
      <FormFieldSkeleton />

      {/* 제출 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <SkeletonBlock className="h-10 w-20 rounded-md" />
        <SkeletonBlock className="h-10 w-20 rounded-md" />
      </div>
    </div>
  );
}
