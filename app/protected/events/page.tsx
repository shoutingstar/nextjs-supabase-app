import { Plus } from "lucide-react";
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

  // 호스팅 이벤트가 있을 때만 FAB 표시
  const showFAB = hostedEventsWithHost.length > 0;

  return (
    <>
      {/* 내가 만든 이벤트 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">내가 만든 이벤트</h2>
        {hostedEventsWithHost.length === 0 ? (
          <EmptyState
            title="아직 만든 이벤트가 없어요"
            description="새로운 이벤트를 만들어 사람들을 초대해보세요!"
            action={
              <Link href="/events/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  이벤트 만들기
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {hostedEventsWithHost.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <EventCard event={event} variant="compact" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 내가 참여한 이벤트 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">내가 참여한 이벤트</h2>
        {participatingEventsWithHost.length === 0 ? (
          <EmptyState
            title="참여한 이벤트가 없어요"
            description="초대 코드로 이벤트에 참여해보세요!"
          />
        ) : (
          <div className="grid gap-4">
            {participatingEventsWithHost.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <EventCard event={event} variant="compact" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FAB (Floating Action Button) - 하단 네비게이션 위 */}
      {/* 호스팅 이벤트가 있을 때만 표시 */}
      {showFAB && (
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
    </>
  );
}

/**
 * 이벤트 목록 페이지
 *
 * Suspense로 async 콘텐츠를 감싼 동기 컴포넌트
 */
export default function EventsPage() {
  return (
    <div className="space-y-8 pb-24">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">내 이벤트</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          참여하거나 호스팅하는 이벤트를 관리하세요
        </p>
      </div>

      {/* Suspense로 async 콘텐츠 래핑 */}
      <Suspense fallback={<div>로딩 중...</div>}>
        <EventsContent />
      </Suspense>
    </div>
  );
}
