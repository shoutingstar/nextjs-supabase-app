"use client";

/**
 * 대시보드 콘텐츠 (클라이언트 컴포넌트)
 * - 서버 컴포넌트(DashboardPage)에서 데이터를 받아 UI를 렌더링
 * - new Date() 사용으로 '예정된 이벤트' 필터링 (클라이언트에서 처리)
 */

import { AlertCircle, Calendar, Users } from "lucide-react";
import Link from "next/link";

import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import type { EventWithHost } from "@/lib/queries/events";

/* ============================================================================
 * Props 타입
 * ============================================================================ */

interface DashboardContentProps {
  /** 현재 로그인 사용자 이름 */
  userName: string | null;
  /** 내가 주최하는 이벤트 목록 */
  hostedEvents: EventWithHost[];
  /** 참여 중인 이벤트 목록 */
  participatingEvents: EventWithHost[];
}

/* ============================================================================
 * EventWithHost → EventCard용 포맷 변환 유틸
 * ============================================================================ */

function toEventCardData(event: EventWithHost) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    start_date: event.event_date,
    location: event.location,
    host_id: event.host.id,
    status: event.status,
    invite_code: event.invite_code,
    max_participants: event.max_participants,
    cover_image: event.cover_image_url,
    created_at: new Date().toISOString(),
    updated_at: null,
    host: {
      id: event.host.id,
      name: event.host.full_name ?? "알 수 없음",
      avatar_url: null,
    },
    participants_count: event.participants_count,
  };
}

/* ============================================================================
 * 대시보드 콘텐츠 컴포넌트
 * ============================================================================ */

export function DashboardContent({
  userName,
  hostedEvents,
  participatingEvents,
}: DashboardContentProps) {
  // 예정된 이벤트 (미래 이벤트만) - 클라이언트에서 현재 시각 기준으로 필터링
  const now = new Date();
  const upcomingEvents = [...hostedEvents, ...participatingEvents].filter(
    (e) => new Date(e.event_date) > now,
  );

  // 최근 이벤트 (최대 3개, 날짜 기준 내림차순)
  const recentEvents = [...hostedEvents, ...participatingEvents]
    .sort(
      (a, b) =>
        new Date(b.event_date).getTime() - new Date(a.event_date).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-24">
      {/* 인사말 및 헤더 */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          suppressHydrationWarning
        >
          어서오세요, {userName ?? "사용자"}님! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          당신의 이벤트 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 내 이벤트 */}
        <Link href="/protected/events" className="group">
          <div className="bg-card text-card-foreground group-hover:border-primary/50 rounded-lg border p-5 shadow-sm transition-all group-hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  내 이벤트
                </p>
                <p className="mt-2 text-3xl font-bold">{hostedEvents.length}</p>
              </div>
              <Calendar className="text-muted-foreground h-8 w-8 opacity-50" />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              주최하는 이벤트
            </p>
          </div>
        </Link>

        {/* 참여 중인 이벤트 */}
        <Link href="/protected/events" className="group">
          <div className="bg-card text-card-foreground group-hover:border-primary/50 rounded-lg border p-5 shadow-sm transition-all group-hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  참여 중인 이벤트
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {participatingEvents.length}
                </p>
              </div>
              <Users className="text-muted-foreground h-8 w-8 opacity-50" />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              참여 중인 이벤트
            </p>
          </div>
        </Link>

        {/* 예정된 이벤트 */}
        <Link href="/protected/events" className="group">
          <div className="bg-card text-card-foreground group-hover:border-primary/50 rounded-lg border p-5 shadow-sm transition-all group-hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  예정된 이벤트
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {upcomingEvents.length}
                </p>
              </div>
              <AlertCircle className="text-muted-foreground h-8 w-8 opacity-50" />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">7일 이내 예정</p>
          </div>
        </Link>
      </div>

      {/* 최근 이벤트 목록 */}
      {recentEvents.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">최근 이벤트</h2>
            <Link
              href="/protected/events"
              className="text-primary text-sm hover:underline"
            >
              모두 보기 →
            </Link>
          </div>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                href={`/protected/events/${event.id}`}
                className="block"
              >
                <EventCard event={toEventCardData(event)} variant="compact" />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-card rounded-lg border border-dashed p-6 text-center">
          <Calendar className="text-muted-foreground mx-auto h-10 w-10 opacity-50" />
          <h3 className="mt-3 font-semibold">아직 이벤트가 없어요</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            새로운 이벤트를 만들거나 친구의 초대를 기다려 보세요.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/protected/events/new">새 이벤트 만들기</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
