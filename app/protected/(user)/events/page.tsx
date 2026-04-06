/**
 * 이벤트 목록 페이지 (/protected/events)
 * Supabase DB에서 현재 사용자의 이벤트를 조회합니다.
 */

import { Calendar, Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EventCard } from "@/components/events/event-card";
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

export default async function EventsPage() {
  const supabase = await createClient();

  // 현재 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // DB에서 이벤트 목록 조회 (병렬 실행)
  const [hostedEvents, participatingEvents] = await Promise.all([
    getUserHostedEvents(user.id),
    getUserParticipatingEvents(user.id),
  ]);

  const hasAnyEvents =
    hostedEvents.length > 0 || participatingEvents.length > 0;

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

      {/* 이벤트 없음 */}
      {!hasAnyEvents && (
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
      )}

      {/* 내가 주최하는 이벤트 */}
      {hostedEvents.length > 0 && (
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
      )}

      {/* 참여 중인 이벤트 */}
      {participatingEvents.length > 0 && (
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
      )}

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
