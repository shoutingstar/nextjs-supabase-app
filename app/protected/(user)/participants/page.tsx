/**
 * 참여자 관리 페이지 (/protected/participants)
 * Phase 2에서 실제 참여 이벤트 목록 및 RSVP 관리 구현 예정
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "참여자 관리 | 이벤트 플래너",
  description: "내가 참여 중인 이벤트와 RSVP 상태를 관리하세요.",
};

export default function ParticipantsPage() {
  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">참여자 관리</h1>
        <p className="text-muted-foreground">
          내가 참여 중인 이벤트와 RSVP 상태를 관리하세요.
        </p>
      </div>

      {/* TODO: Phase 2 - RSVP 상태별 필터 */}
      <div className="flex gap-2 border-b">
        {["전체", "참석 예정", "미정", "불참"].map((tab, i) => (
          <button
            key={tab}
            className={[
              "border-b-2 px-3 pb-2 text-sm",
              i === 0
                ? "border-primary text-foreground font-medium"
                : "text-muted-foreground border-transparent",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TODO: Phase 2 - 참여 이벤트 목록 */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Phase 2에서 참여 중인 이벤트 목록이 표시됩니다.
        </p>
      </div>

      {/* TODO: Phase 2 - 초대 링크로 이벤트 참여 */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-2 text-lg font-semibold">초대 링크로 참여</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          초대 코드가 있다면 입력하여 이벤트에 참여하세요.
        </p>
        <div className="flex gap-2">
          <div className="bg-muted/30 h-9 flex-1 rounded-md border" />
          <button
            disabled
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm opacity-50"
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}
