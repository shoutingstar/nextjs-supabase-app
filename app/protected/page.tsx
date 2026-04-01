/**
 * 대시보드 페이지 (/protected)
 * Phase 2에서 실제 콘텐츠(이벤트 요약, 참여자 현황 등) 구현 예정
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드 | 이벤트 플래너",
  description: "이벤트 현황을 한눈에 확인하세요.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          이벤트 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* TODO: Phase 2 - 통계 카드 (이벤트 수, 참여자 수, 예정된 이벤트) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {["내 이벤트", "참여 중인 이벤트", "예정된 이벤트"].map((title) => (
          <div
            key={title}
            className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold">-</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Phase 2에서 구현 예정
            </p>
          </div>
        ))}
      </div>

      {/* TODO: Phase 2 - 최근 이벤트 목록 */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">최근 이벤트</h2>
        <p className="text-sm text-muted-foreground">
          Phase 2에서 최근 이벤트 목록이 표시됩니다.
        </p>
      </div>
    </div>
  );
}
