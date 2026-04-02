/**
 * 이벤트 수정 페이지 (/protected/events/[eventId]/edit)
 * UpdateEventForm으로 기존 이벤트 데이터를 수정합니다.
 * Phase 2: 더미 데이터(MOCK_EVENTS) 사용
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { UpdateEventForm } from "@/components/forms/update-event-form";
import { MOCK_EVENTS } from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "이벤트 수정 | Gather",
};

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  // Next.js 15: params는 Promise로 처리
  const { eventId } = await params;

  // 더미 데이터에서 이벤트 조회 (Phase 3에서 Supabase 쿼리로 교체)
  const event = MOCK_EVENTS.find((e) => e.id === eventId);

  // 이벤트가 없으면 404
  if (!event) {
    notFound();
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
