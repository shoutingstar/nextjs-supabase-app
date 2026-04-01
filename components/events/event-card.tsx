"use client";

import { Calendar, MapPin, Users } from "lucide-react";

import type { EventCardProps } from "@/lib/types/component";

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const startDate = new Date(event.start_date);
  const formattedDate = startDate.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (variant === "compact") {
    return (
      <div className="flex gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
        {/* 날짜 박스 */}
        <div className="flex flex-col items-center justify-center rounded-lg bg-primary px-4 py-3 text-white">
          <p className="text-2xl font-bold">{formattedDate}</p>
          <p className="text-xs opacity-90">{formattedTime}</p>
        </div>

        {/* 이벤트 정보 */}
        <div className="flex-1">
          <h3 className="font-semibold">{event.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {event.description}
          </p>

          {/* 메타 정보 */}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
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

  return (
    <div className="rounded-lg border bg-card shadow-sm transition-colors hover:bg-accent">
      {/* 헤더 */}
      <div className="border-b p-4">
        <h3 className="font-semibold">{event.title}</h3>
        {event.host && (
          <p className="mt-1 text-xs text-muted-foreground">
            주최: {event.host.full_name}
          </p>
        )}
      </div>

      {/* 본문 */}
      <div className="p-4">
        {event.description && (
          <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}

        {/* 메타 정보 */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {startDate.toLocaleDateString("ko-KR")} {formattedTime}
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
