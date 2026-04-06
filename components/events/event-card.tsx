"use client";

/**
 * EventCard 컴포넌트
 * 이벤트 정보를 카드 형태로 표시합니다.
 * - default variant: 상세 정보 + 커버 이미지 지원
 * - compact variant: 날짜 박스 + 간략 정보
 */

import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import type { EventCardProps } from "@/lib/types/component";
import type { EventStatus } from "@/lib/types/event";
// EventCardData 타입은 EventCardProps.event 필드에서 참조됨

/* ============================================================================
 * 상태 배지 스타일 매핑
 * ============================================================================ */

function getStatusBadgeProps(status: EventStatus): {
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
} {
  switch (status) {
    case "active":
      return { variant: "default", label: "활성" };
    case "draft":
      return { variant: "secondary", label: "예정" };
    case "cancelled":
      return { variant: "destructive", label: "취소됨" };
    case "completed":
      return { variant: "outline", label: "완료됨" };
  }
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const startDate = new Date(event.start_date);
  const _formattedDate = startDate.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
  // SSR/CSR 간 hydration mismatch 방지: locale을 명시적으로 고정
  const formattedTime = startDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24시간 형식으로 고정 (am/pm 제거)
  });

  /* ----------------------------------------------------------------
   * compact variant: 커버 이미지 + 날짜 박스 + 이벤트 기본 정보
   * ---------------------------------------------------------------- */
  if (variant === "compact") {
    const statusProps = getStatusBadgeProps(event.status);
    return (
      <div className="bg-card hover:bg-accent flex gap-4 rounded-lg border p-4 transition-colors">
        {/* 왼쪽: 커버 이미지 (있을 때만 표시) */}
        {event.cover_image && (
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={event.cover_image}
              alt={`${event.title} 커버 이미지`}
              fill
              sizes="128px"
              className="object-cover"
              priority={false}
            />
          </div>
        )}

        {/* 오른쪽: 이벤트 정보 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold">{event.title}</h3>
            <Badge variant={statusProps.variant} className="shrink-0">
              {statusProps.label}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
            {event.description}
          </p>

          {/* 메타 정보 */}
          <div className="text-muted-foreground mt-3 flex flex-wrap gap-4 text-xs">
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            )}
            {event.participants_count !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.participants_count}명
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------
   * default variant: 커버 이미지 + 상세 정보
   * ---------------------------------------------------------------- */
  const statusProps = getStatusBadgeProps(event.status);
  return (
    <div className="bg-card hover:bg-accent rounded-lg border shadow-sm transition-colors">
      {/* 커버 이미지 (cover_image 필드가 있을 때만 표시) */}
      {event.cover_image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={event.cover_image}
            alt={`${event.title} 커버 이미지`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
      )}

      {/* 헤더: 제목 + 호스트 + 상태 배지 */}
      <div
        className={`border-b p-4 ${event.cover_image ? "" : "rounded-t-lg"}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold">{event.title}</h3>
            {event.host && (
              <p className="text-muted-foreground mt-1 text-xs">
                주최:{" "}
                {(event.host.full_name ?? event.host.name) as string | null}
              </p>
            )}
          </div>
          <Badge variant={statusProps.variant} className="shrink-0">
            {statusProps.label}
          </Badge>
        </div>
      </div>

      {/* 본문: 설명 + 메타 정보 */}
      <div className="p-4">
        {event.description && (
          <p className="text-muted-foreground mb-3 line-clamp-3 text-sm">
            {event.description}
          </p>
        )}

        {/* 메타 정보: 날짜, 장소, 참여자 수 */}
        <div className="text-muted-foreground space-y-2 text-xs">
          <div className="flex items-center gap-2" suppressHydrationWarning>
            <Calendar className="h-4 w-4" />
            <span>
              {startDate.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              {formattedTime}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          {event.participants_count !== undefined && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{event.participants_count}명 참여</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
