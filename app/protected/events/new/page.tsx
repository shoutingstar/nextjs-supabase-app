/**
 * 이벤트 생성 페이지 (/protected/events/new)
 * Phase 2에서 실제 이벤트 생성 폼 구현 예정
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "새 이벤트 만들기 | 이벤트 플래너",
  description: "새로운 이벤트를 만들어 친구들을 초대하세요.",
};

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href="/protected/events"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 이벤트 목록
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">새 이벤트 만들기</h1>
        <p className="text-muted-foreground">
          이벤트 정보를 입력하고 친구들을 초대하세요.
        </p>
      </div>

      {/* TODO: Phase 2 - 이벤트 생성 폼 구현 */}
      {/* 폼 필드: 제목, 설명, 날짜, 장소, 최대 인원 */}
      <div className="rounded-lg border p-6">
        <p className="text-center text-sm text-muted-foreground">
          Phase 2에서 이벤트 생성 폼이 구현됩니다.
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

      {/* 폼 액션 버튼 (placeholder) */}
      <div className="flex justify-end gap-2">
        <Link
          href="/protected/events"
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          취소
        </Link>
        <button
          disabled
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50"
        >
          이벤트 만들기
        </button>
      </div>
    </div>
  );
}
