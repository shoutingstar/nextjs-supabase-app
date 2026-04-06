/**
 * 이벤트 수정 페이지 (/protected/events/[eventId]/edit)
 * Supabase DB에서 이벤트를 조회하여 UpdateEventForm에 전달합니다.
 * 호스트만 접근 가능 (비호스트는 이벤트 상세로 리다이렉트)
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { UpdateEventForm } from "@/components/forms/update-event-form";
import { getEventDetail } from "@/lib/queries/events";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "이벤트 수정 | Gather",
};

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  // Next.js 15: params는 Promise로 처리
  const { eventId } = await params;

  // 현재 로그인 사용자 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // DB에서 이벤트 조회
  const event = await getEventDetail(eventId);

  // 이벤트가 없으면 404
  if (!event) {
    notFound();
  }

  // 호스트만 수정 가능 (비호스트는 상세 페이지로 리다이렉트)
  if (event.host_id !== user.id) {
    redirect(`/protected/events/${eventId}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-24">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href={`/protected/events/${eventId}`}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← 이벤트 상세
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">이벤트 수정</h1>
        <p className="text-muted-foreground mt-1">
          이벤트 정보를 변경한 후 저장하세요.
        </p>
      </div>

      {/* 이벤트 수정 폼 */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <UpdateEventForm
          event={event}
          redirectTo={`/protected/events/${eventId}`}
        />
      </div>
    </div>
  );
}
