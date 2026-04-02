/**
 * 이벤트 목록 페이지 (/protected/events)
 * Phase 2: 더미 데이터(MOCK_EVENTS, MOCK_CURRENT_USER) 사용
 * Phase 3에서 Supabase 쿼리로 교체 예정
 */

import { Calendar, Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_CURRENT_USER, MOCK_EVENTS } from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "이벤트 | Gather",
  description: "내가 주최하는 이벤트와 참여 중인 이벤트를 확인하세요.",
};

export default function EventsPage() {
  // Phase 2: 더미 데이터에서 현재 사용자 기준으로 이벤트 분리
  // MOCK_CURRENT_USER는 MOCK_USERS[2]이며 HOST_IDS(처음 5명)에 포함되지 않음
  // 테스트를 위해 처음 5개 이벤트를 주최 이벤트로, 다음 5개를 참여 이벤트로 사용
  const hostedEvents = MOCK_EVENTS.filter(
    (e) => e.host_id === MOCK_CURRENT_USER.id,
  ).slice(0, 5);

  // 참여 이벤트: 주최하지 않는 published 이벤트 중 일부 (더미)
  const participatingEvents = MOCK_EVENTS.filter(
    (e) => e.host_id !== MOCK_CURRENT_USER.id && e.status === "published",
  ).slice(0, 5);

  // 더미 데이터에서 호스팅 이벤트가 없으면 처음 3개를 보여줌
  const displayHostedEvents =
    hostedEvents.length > 0 ? hostedEvents : MOCK_EVENTS.slice(0, 3);
  const displayParticipatingEvents =
    participatingEvents.length > 0
      ? participatingEvents
      : MOCK_EVENTS.slice(3, 6);

  const hasAnyEvents =
    displayHostedEvents.length > 0 || displayParticipatingEvents.length > 0;

  return (
    <div className="space-y-6 pb-24">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">이벤트</h1>
        <button
          className="rounded-full p-2 transition-colors hover:bg-accent"
          aria-label="이벤트 검색"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* 이벤트 없음 */}
      {!hasAnyEvents && (
        <EmptyState
          icon={<Calendar className="h-10 w-10 text-muted-foreground" />}
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
      {displayHostedEvents.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">내가 주최하는 이벤트</h2>
            <span className="text-sm text-muted-foreground">
              {displayHostedEvents.length}개
            </span>
          </div>
          <div className="space-y-3">
            {displayHostedEvents.map((event) => (
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
      )}

      {/* 참여 중인 이벤트 */}
      {displayParticipatingEvents.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">참여 중인 이벤트</h2>
            <span className="text-sm text-muted-foreground">
              {displayParticipatingEvents.length}개
            </span>
          </div>
          <div className="space-y-3">
            {displayParticipatingEvents.map((event) => (
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
