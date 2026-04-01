/**
 * 이벤트 수정 페이지 (/protected/events/[eventId]/edit)
 * Phase 2에서 실제 이벤트 수정 폼 구현 예정
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이벤트 수정 | 이벤트 플래너",
};

interface EditEventPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  // Next.js 15: params는 Promise로 처리
  const { eventId } = await params;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href={`/protected/events/${eventId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 이벤트 상세
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">이벤트 수정</h1>
        <p className="text-sm text-muted-foreground">ID: {eventId}</p>
      </div>

      {/* TODO: Phase 2 - 이벤트 수정 폼 (기존 값 불러와서 초기화) */}
      <div className="rounded-lg border p-6">
        <p className="text-center text-sm text-muted-foreground">
          Phase 2에서 이벤트 수정 폼이 구현됩니다.
        </p>
        <div className="mt-4 space-y-4">
          {[
            "이벤트 제목",
            "날짜 및 시간",
            "장소",
            "최대 참여 인원",
            "설명",
          ].map((field) => (
            <div key={field} className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                {field}
              </label>
              <div className="h-9 w-full rounded-md border bg-muted/30" />
            </div>
          ))}
        </div>
      </div>

      {/* 이벤트 상태 변경 (취소/완료) */}
      <div className="rounded-lg border border-destructive/30 p-6">
        <h3 className="mb-2 text-sm font-semibold text-destructive">
          위험 구역
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Phase 2에서 이벤트 취소/삭제 기능이 구현됩니다.
        </p>
        <button
          disabled
          className="rounded-md border border-destructive px-4 py-2 text-sm text-destructive opacity-50"
        >
          이벤트 취소
        </button>
      </div>

      {/* 폼 액션 버튼 */}
      <div className="flex justify-end gap-2">
        <Link
          href={`/protected/events/${eventId}`}
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          취소
        </Link>
        <button
          disabled
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50"
        >
          변경 저장
        </button>
      </div>
    </div>
  );
}
