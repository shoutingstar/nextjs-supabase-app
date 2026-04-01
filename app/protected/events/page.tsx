import { ChevronRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getUserHostedEvents,
  getUserParticipatingEvents,
} from "@/lib/queries/events";
import { createClient } from "@/lib/supabase/server";

/**
 * 이벤트 콘텐츠 (async Server Component)
 *
 * 데이터베이스에서 이벤트 데이터를 조회합니다.
 */
async function EventsContent() {
  // A. 인증 확인
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (authError || !user) {
    redirect("/auth/login");
  }

  // B. 이벤트 데이터 조회
  const hostedEventsWithHost = await getUserHostedEvents(user.id);
  const participatingEventsWithHost = await getUserParticipatingEvents(user.id);

  // 모든 이벤트 합치기 (인기 이벤트 섹션용)
  const allEvents = [
    ...hostedEventsWithHost,
    ...participatingEventsWithHost,
  ].slice(0, 6);

  return (
    <div className="space-y-6">
      {/* 프로모션 배너 */}
      <div className="rounded-lg bg-gray-600 p-4 text-white">
        <p className="text-sm">쉽고 편하게 이벤트를 계획하세요</p>
        <Link
          href="/events/new"
          className="mt-2 inline-flex items-center gap-2 rounded bg-white px-3 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
        >
          시작하기
        </Link>
      </div>

      {/* 큰 슬라이드 배너 */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-200 p-6 text-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              모든 이벤트를
              <br />
              한곳에서 관리하세요
            </h2>
            <Link
              href="/events/new"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              새 이벤트 만들기 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="text-4xl">📅</div>
        </div>

        {/* 페이지 표시 */}
        <div className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-gray-600/50 px-3 py-1 text-xs font-medium text-white">
          1 / 3
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { icon: "📋", label: "전체" },
          { icon: "🔔", label: "곧 시작" },
          { icon: "🔴", label: "진행중" },
          { icon: "✅", label: "완료" },
          { icon: "💝", label: "초대됨" },
          { icon: "⭐", label: "찜" },
        ].map((cat) => (
          <button
            key={cat.label}
            className="flex min-w-max flex-col items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-center transition-colors hover:bg-accent"
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="text-xs font-medium text-muted-foreground">
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* 인기 이벤트 섹션 */}
      {allEvents.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              인기 이벤트 <span className="text-xl">⭐</span>
            </h2>
            <Link
              href="#"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              전체보기 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {allEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <EventCard event={event} variant="compact" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 내가 만든 이벤트 */}
      {hostedEventsWithHost.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">내가 주최하는 이벤트</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {hostedEventsWithHost.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <EventCard event={event} variant="compact" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 내가 참여한 이벤트 */}
      {participatingEventsWithHost.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">참여 중인 이벤트</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {participatingEventsWithHost.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <EventCard event={event} variant="compact" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 모든 이벤트가 없을 때 */}
      {hostedEventsWithHost.length === 0 &&
        participatingEventsWithHost.length === 0 && (
          <EmptyState
            title="아직 이벤트가 없어요"
            description="새로운 이벤트를 만들거나 초대를 받아보세요!"
            action={
              <Link href="/events/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  이벤트 만들기
                </Button>
              </Link>
            }
          />
        )}

      {/* FAB (Floating Action Button) */}
      {hostedEventsWithHost.length > 0 && (
        <Link
          href="/events/new"
          className="fixed bottom-20 right-4 z-10"
          aria-label="이벤트 만들기"
        >
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      )}
    </div>
  );
}

/**
 * 이벤트 목록 페이지 (Wisely 스타일)
 *
 * Suspense로 async 콘텐츠를 감싼 동기 컴포넌트
 */
export default function EventsPage() {
  return (
    <div className="space-y-6 pb-24">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">이벤트</h1>
        <button className="rounded-full p-2 hover:bg-accent">
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Suspense로 async 콘텐츠 래핑 */}
      <Suspense fallback={<div className="py-8 text-center">로딩 중...</div>}>
        <EventsContent />
      </Suspense>
    </div>
  );
}
