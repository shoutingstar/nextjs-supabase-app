/**
 * 이벤트 목록 페이지 (/protected/events)
 * 모바일 친화적 레이아웃 (Wisely 앱 스타일)
 * Phase 2에서 실제 이벤트 목록 조회 및 필터링 구현 예정
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "내 이벤트 | 이벤트 플래너",
  description: "내가 주최하거나 참여 중인 이벤트 목록입니다.",
};

/** 더미 이벤트 데이터 */
const DUMMY_EVENTS = [
  {
    id: 1,
    title: "서울 나들이",
    date: "2026.04.15",
    participants: 12,
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    title: "팀 빌딩 행사",
    date: "2026.05.10",
    participants: 28,
    gradient: "from-purple-400 to-purple-600",
  },
  {
    id: 3,
    title: "여름 캠프",
    date: "2026.07.01",
    participants: 45,
    gradient: "from-orange-400 to-orange-600",
  },
  {
    id: 4,
    title: "결혼식",
    date: "2026.06.20",
    participants: 150,
    gradient: "from-pink-400 to-pink-600",
  },
];

/** 이벤트 카테고리 */
const CATEGORIES = [
  { label: "전체", icon: "📋" },
  { label: "다가오는", icon: "📅" },
  { label: "진행중", icon: "🔴" },
  { label: "완료", icon: "✅" },
];

export default function EventsPage() {
  const hasEvents = DUMMY_EVENTS.length > 0;

  return (
    <div className="space-y-5">
      {/* 상단 배너 */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-md">
        <p className="text-sm font-medium opacity-90">이벤트 플래너</p>
        <h2 className="mt-2 text-lg font-bold">
          쉽고 편하게 이벤트를 만들어보세요
        </h2>
        <Link
          href="/protected/events/new"
          className="mt-3 inline-flex items-center gap-2 rounded bg-white/20 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/30"
        >
          + 새 이벤트 생성
        </Link>
      </div>

      {/* 카테고리 가로 스크롤 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.label}
            className="flex min-w-max flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-3 text-center transition-colors hover:border-accent hover:bg-accent"
          >
            <span className="text-2xl">{category.icon}</span>
            <span className="text-xs font-medium text-muted-foreground">
              {category.label}
            </span>
          </button>
        ))}
      </div>

      {/* 이벤트 카드 그리드 */}
      {hasEvents ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {DUMMY_EVENTS.map((event) => (
            <Link
              key={event.id}
              href={`/protected/events/${event.id}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-md"
            >
              {/* 그라데이션 배경 */}
              <div
                className={`h-32 bg-gradient-to-br ${event.gradient} opacity-90 transition-opacity group-hover:opacity-100`}
              />

              {/* 카드 정보 */}
              <div className="flex flex-col gap-2 p-3">
                <h3 className="line-clamp-2 text-sm font-semibold">
                  {event.title}
                </h3>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <span>📅</span>
                    {event.date}
                  </p>
                  <p className="flex items-center gap-1">
                    <span>👥</span>
                    {event.participants}명
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* 빈 상태 */
        <div className="rounded-lg border border-dashed bg-card p-12 text-center">
          <p className="text-lg font-semibold">이벤트가 없습니다</p>
          <p className="mt-2 text-sm text-muted-foreground">
            첫 번째 이벤트를 만들어보세요!
          </p>
          <Link
            href="/protected/events/new"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            + 새 이벤트 만들기
          </Link>
        </div>
      )}
    </div>
  );
}
