/**
 * 이벤트 상세 페이지 (/protected/events/[eventId])
 * Phase 2에서 실제 이벤트 상세 정보 및 참여자 목록 구현 예정
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이벤트 상세 | 이벤트 플래너",
};

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  // Next.js 15: params는 Promise로 처리
  const { eventId } = await params;

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href="/protected/events"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 이벤트 목록
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">이벤트 상세</h1>
          <p className="text-sm text-muted-foreground">ID: {eventId}</p>
        </div>
        {/* TODO: Phase 2 - 호스트에게만 수정/삭제 버튼 표시 */}
        <Link
          href={`/protected/events/${eventId}/edit`}
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          수정
        </Link>
      </div>

      {/* TODO: Phase 2 - 이벤트 정보 카드 */}
      <div className="rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          Phase 2에서 이벤트 상세 정보가 표시됩니다.
        </p>
        <div className="mt-4 space-y-2">
          {["날짜", "장소", "호스트", "참여 인원"].map((info) => (
            <div key={info} className="flex gap-2">
              <span className="w-24 text-sm font-medium text-muted-foreground">
                {info}
              </span>
              <div className="h-4 w-32 rounded bg-muted/30" />
            </div>
          ))}
        </div>
      </div>

      {/* TODO: Phase 2 - 참여자 목록 */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">참여자 목록</h2>
        <p className="text-sm text-muted-foreground">
          Phase 2에서 참여자 목록이 표시됩니다.
        </p>
      </div>

      {/* TODO: Phase 2 - 카풀, 정산, 공지 탭 */}
      <div className="flex gap-2 border-b">
        {["공지", "카풀", "정산"].map((tab) => (
          <button
            key={tab}
            className="border-b-2 border-transparent px-3 pb-2 text-sm text-muted-foreground"
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
