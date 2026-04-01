/**
 * 이벤트 목록 페이지 (/protected/events)
 * Phase 2에서 실제 이벤트 목록 조회 및 필터링 구현 예정
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "내 이벤트 | 이벤트 플래너",
  description: "내가 주최하거나 참여 중인 이벤트 목록입니다.",
};

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">내 이벤트</h1>
          <p className="text-muted-foreground">
            주최하거나 참여 중인 이벤트를 관리하세요.
          </p>
        </div>
        {/* 이벤트 생성 버튼 */}
        <Link
          href="/protected/events/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          + 새 이벤트
        </Link>
      </div>

      {/* TODO: Phase 2 - 필터 탭 (전체/주최/참여) */}
      <div className="flex gap-2 border-b">
        {["전체", "주최한 이벤트", "참여 중"].map((tab) => (
          <button
            key={tab}
            className="border-b-2 border-transparent px-3 pb-2 text-sm text-muted-foreground first:border-primary first:font-medium first:text-foreground"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TODO: Phase 2 - 이벤트 카드 목록 (EventCard 컴포넌트 활용) */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Phase 2에서 이벤트 목록이 표시됩니다.
        </p>
        <Link
          href="/protected/events/new"
          className="mt-4 inline-flex items-center justify-center text-sm text-primary hover:underline"
        >
          첫 번째 이벤트를 만들어보세요 →
        </Link>
      </div>
    </div>
  );
}
