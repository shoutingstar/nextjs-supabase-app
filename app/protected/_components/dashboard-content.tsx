"use client";

/**
 * 대시보드 콘텐츠 (클라이언트 컴포넌트)
 * new Date() 사용으로 예정된 이벤트 필터링
 */

import { AlertCircle, Calendar, Users } from "lucide-react";
import Link from "next/link";

import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { MOCK_CURRENT_USER, MOCK_EVENTS } from "@/lib/data/mock-data";

export function DashboardContent() {
  // 현재 사용자의 이벤트 분석
  const myHostedEvents = MOCK_EVENTS.filter(
    (e) => e.host_id === MOCK_CURRENT_USER.id,
  );

  const myParticipatingEvents = MOCK_EVENTS.filter(
    (e) => e.host_id !== MOCK_CURRENT_USER.id && e.status === "published",
  );

  // 예정된 이벤트 (미래 이벤트만)
  const now = new Date();
  const upcomingEvents = [...myHostedEvents, ...myParticipatingEvents].filter(
    (e) => new Date(e.start_date) > now,
  );

  // 최근 이벤트 (생성 순서대로 최대 3개)
  const recentEvents = [...myHostedEvents, ...myParticipatingEvents]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
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
          어서오세요, {MOCK_CURRENT_USER.name}! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          당신의 이벤트 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 내 이벤트 */}
        <Link href="/protected/events" className="group">
          <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  내 이벤트
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {myHostedEvents.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              주최하는 이벤트
            </p>
          </div>
        </Link>

        {/* 참여 중인 이벤트 */}
        <Link href="/protected/events" className="group">
          <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  참여 중인 이벤트
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {myParticipatingEvents.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              참여 중인 이벤트
            </p>
          </div>
        </Link>

        {/* 예정된 이벤트 */}
        <Link href="/protected/events" className="group">
          <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  예정된 이벤트
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {upcomingEvents.length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">7일 이내 예정</p>
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
              className="text-sm text-primary hover:underline"
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
                <EventCard event={event} variant="compact" />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-lg border border-dashed bg-card p-6 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
          <h3 className="mt-3 font-semibold">아직 이벤트가 없어요</h3>
          <p className="mt-1 text-sm text-muted-foreground">
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
