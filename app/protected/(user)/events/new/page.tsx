/**
 * 이벤트 생성 페이지 (/protected/events/new)
 * CreateEventForm으로 새 이벤트를 생성합니다.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { CreateEventForm } from "@/components/forms/create-event-form";

export const metadata: Metadata = {
  title: "새 이벤트 만들기 | Gather",
  description: "새로운 이벤트를 만들어 친구들을 초대하세요.",
};

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-24">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href="/protected/events"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← 이벤트 목록
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">새 이벤트 만들기</h1>
        <p className="mt-1 text-muted-foreground">
          이벤트 정보를 입력하고 친구들을 초대하세요.
        </p>
      </div>

      {/* 이벤트 생성 폼 */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <CreateEventForm redirectTo="/protected/events" />
      </div>
    </div>
  );
}
