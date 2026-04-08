/**
 * 이벤트 목록 페이지 (/protected/events)
 * Supabase DB에서 현재 사용자의 이벤트를 조회합니다.
 * Suspense를 활용한 점진적 렌더링을 구현합니다.
 */

import { Calendar, Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { EventCard } from "@/components/events/event-card";
import { EventListSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getUserHostedEvents,
  getUserParticipatingEvents,
} from "@/lib/queries/events";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "이벤트 | Gather",
  description: "내가 주최하는 이벤트와 참여 중인 이벤트를 확인하세요.",
};

/* ============================================================================
 * 호스팅 이벤트 섹션 (async 컴포넌트)
 * ============================================================================ */

async function HostedEventsSection({ userId }: { userId: string }) {
  const hostedEvents = await getUserHostedEvents(userId);

  if (hostedEvents.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">내가 주최하는 이벤트</h2>
        <span className="text-muted-foreground text-sm">
          {hostedEvents.length}개
        </span>
      </div>
      <div className="space-y-3">
        {hostedEvents.map((event) => (
          <Link
            key={event.id}
            href={`/protected/events/${event.id}`}
            className="block"
          >
            <EventCard
              event={{
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
                participant_count: event.participants_count,
              }}
              variant="compact"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ============================================================================
 * 참여 이벤트 섹션 (async 컴포넌트)
 * ============================================================================ */

async function ParticipatingEventsSection({ userId }: { userId: string }) {
  const participatingEvents = await getUserParticipatingEvents(userId);

  if (participatingEvents.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">참여 중인 이벤트</h2>
        <span className="text-muted-foreground text-sm">
          {participatingEvents.length}개
        </span>
      </div>
      <div className="space-y-3">
        {participatingEvents.map((event) => (
          <Link
            key={event.id}
            href={`/protected/events/${event.id}`}
            className="block"
          >
            <EventCard
              event={{
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
                participant_count: event.participants_count,
              }}
              variant="compact"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ============================================================================
 * EmptyState 섹션 (async 컴포넌트)
 * ============================================================================ */

async function EmptyEventsSection({ userId }: { userId: string }) {
  const [hostedEvents, participatingEvents] = await Promise.all([
    getUserHostedEvents(userId),
    getUserParticipatingEvents(userId),
  ]);

  const hasAnyEvents =
    hostedEvents.length > 0 || participatingEvents.length > 0;

  if (hasAnyEvents) {
    return null;
  }

  return (
    <EmptyState
      icon={<Calendar className="text-muted-foreground h-10 w-10" />}
      title="아직 이벤트가 없어요"
      description="새로운 이벤트를 만들거나 초대를 받아보세요!"
      action={
        <Link href="/protected/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            이벤트 만들기
          </Button>
        </Link>
      }
    />
  );
}

/* ============================================================================
 * EventsPage 메인 컴포넌트
 * ============================================================================ */

export default async function EventsPage() {
  const supabase = await createClient();

  // 현재 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6 pb-24">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">이벤트</h1>
        <button
          className="hover:bg-accent rounded-full p-2 transition-colors"
          aria-label="이벤트 검색"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* 비어있는 상태 표시 - Suspense 경계 없음 (빨리 판단 가능) */}
      <Suspense fallback={null}>
        <EmptyEventsSection userId={user.id} />
      </Suspense>

      {/* 호스팅 이벤트 - Suspense 경계 적용 */}
      <Suspense fallback={<EventListSkeleton count={2} variant="compact" />}>
        <HostedEventsSection userId={user.id} />
      </Suspense>

      {/* 참여 이벤트 - Suspense 경계 적용 */}
      <Suspense fallback={<EventListSkeleton count={2} variant="compact" />}>
        <ParticipatingEventsSection userId={user.id} />
      </Suspense>

      {/* FAB (Floating Action Button) - MobileNav(z-40) 위에 표시 */}
      <Link
        href="/protected/events/new"
        className="fixed bottom-24 right-4 z-50"
        aria-label="이벤트 만들기"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          aria-label="새 이벤트 만들기"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
