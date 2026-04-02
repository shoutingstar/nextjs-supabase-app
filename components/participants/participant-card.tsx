"use client";

/**
 * ParticipantCard 컴포넌트
 * 이벤트 참여자 정보를 카드 형태로 표시합니다.
 * EventCard와 동일한 스타일 패턴을 따릅니다.
 */

import { CheckCircle, Crown, XCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ParticipantCardProps } from "@/lib/types/component";
import type { ParticipantStatus, RsvpStatus } from "@/lib/types/participant";

/* ============================================================================
 * 상태 배지 헬퍼
 * ============================================================================ */

/**
 * 참여자 상태에 따른 배지 variant와 레이블을 반환합니다.
 */
function getStatusBadge(status: ParticipantStatus): {
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
} {
  switch (status) {
    case "approved":
      return { variant: "default", label: "승인됨" };
    case "pending":
      return { variant: "secondary", label: "대기중" };
    case "rejected":
      return { variant: "destructive", label: "거절됨" };
    case "banned":
      return { variant: "destructive", label: "차단됨" };
    default:
      return { variant: "outline", label: "알수없음" };
  }
}

/**
 * RSVP 상태에 따른 아이콘과 레이블을 반환합니다.
 */
function getRsvpInfo(rsvp: RsvpStatus): {
  icon: React.ReactNode;
  label: string;
  className: string;
} {
  switch (rsvp) {
    case "attending":
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        label: "참석 확정",
        className: "text-green-600 dark:text-green-400",
      };
    case "not_attending":
      return {
        icon: <XCircle className="h-4 w-4" />,
        label: "불참",
        className: "text-red-500 dark:text-red-400",
      };
    case "maybe":
      return {
        icon: <CheckCircle className="h-4 w-4 opacity-50" />,
        label: "미정",
        className: "text-yellow-600 dark:text-yellow-400",
      };
    case "no_response":
    default:
      return {
        icon: null,
        label: "미응답",
        className: "text-muted-foreground",
      };
  }
}

/**
 * 사용자 이름에서 이니셜을 추출합니다.
 * @example "김민준" → "김" / "John Doe" → "JD"
 */
function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    // 한국어 이름 등 단일 단어 → 첫 글자
    return parts[0].charAt(0);
  }
  // 영어 이름 등 → 각 단어 첫 글자 (최대 2자)
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

/* ============================================================================
 * ParticipantCard Props 타입
 * ============================================================================ */

/**
 * ParticipantCard 컴포넌트 Props
 */
interface ParticipantCardComponentProps extends ParticipantCardProps {
  /** 카드 표시 형태 */
  variant?: "default" | "compact";
  /** 해당 참여자가 이벤트 호스트인지 여부 */
  isHost?: boolean;
}

/* ============================================================================
 * ParticipantCard 컴포넌트
 * ============================================================================ */

/**
 * ParticipantCard 컴포넌트
 *
 * @param participant - 참여자 상세 정보 (user 정보 포함)
 * @param variant - 카드 표시 형태 ('default' | 'compact')
 * @param isHost - 호스트 여부 (크라운 아이콘과 주최자 배지 표시)
 * @param editable - 편집 가능 여부
 * @param onRemove - 참여자 제거 콜백
 *
 * @example
 * // 기본 카드
 * <ParticipantCard participant={participant} />
 *
 * // 호스트 표시 compact 카드
 * <ParticipantCard participant={participant} variant="compact" isHost />
 */
export function ParticipantCard({
  participant,
  variant = "default",
  isHost = false,
}: ParticipantCardComponentProps) {
  const { user, status, rsvp } = participant;
  const statusBadge = getStatusBadge(status);
  const rsvpInfo = getRsvpInfo(rsvp);
  const initials = getInitials(user.name);
  const displayName = user.name ?? "이름 없음";

  /* ----------------------------------------------------------------
   * compact 변형: 아바타 + 이름 + RSVP 아이콘만 표시
   * ---------------------------------------------------------------- */
  if (variant === "compact") {
    return (
      <div className="bg-card hover:bg-accent flex items-center gap-3 rounded-lg border p-3 transition-colors">
        {/* 아바타 영역 */}
        <div className="relative">
          <Avatar size="default">
            <AvatarImage src={user.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {/* 호스트 크라운 배지 */}
          {isHost && (
            <span className="ring-background absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-white ring-2">
              <Crown className="h-2.5 w-2.5" />
            </span>
          )}
        </div>

        {/* 이름 + 역할 */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{displayName}</p>
          {isHost && <p className="text-muted-foreground text-xs">주최자</p>}
        </div>

        {/* RSVP 상태 아이콘 */}
        <span
          className={rsvpInfo.className}
          title={rsvpInfo.label}
          aria-label={`RSVP: ${rsvpInfo.label}`}
        >
          {rsvpInfo.icon}
        </span>
      </div>
    );
  }

  /* ----------------------------------------------------------------
   * default 변형: 전체 정보 표시
   * ---------------------------------------------------------------- */
  return (
    <div className="bg-card hover:bg-accent rounded-lg border shadow-sm transition-colors">
      {/* 카드 헤더: 아바타 + 이름 + 상태 배지 */}
      <div className="flex items-center gap-3 border-b p-4">
        <div className="relative shrink-0">
          <Avatar size="lg">
            <AvatarImage src={user.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {/* 호스트 크라운 표시 */}
          {isHost && (
            <span className="ring-background absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white ring-2">
              <Crown className="h-3 w-3" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* 이름 + 주최자 배지 */}
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{displayName}</h3>
            {isHost && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                주최자
              </Badge>
            )}
          </div>

          {/* 참여 승인 상태 배지 */}
          <div className="mt-1">
            <Badge variant={statusBadge.variant} className="text-xs">
              {statusBadge.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* 카드 본문: RSVP 응답 + 참여 일시 */}
      <div className="p-4">
        {/* RSVP 상태 */}
        <div
          className={`flex items-center gap-2 text-sm ${rsvpInfo.className}`}
        >
          {rsvpInfo.icon}
          <span>{rsvpInfo.label}</span>
        </div>

        {/* 참여 신청 일시 */}
        <p className="text-muted-foreground mt-2 text-xs">
          참여 신청:{" "}
          {new Date(participant.joined_at).toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
