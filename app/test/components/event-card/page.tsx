/**
 * EventCard 컴포넌트 테스트 페이지
 * default/compact variant 및 커버 이미지 지원 테스트
 */

import type { Metadata } from "next";
import Link from "next/link";

import { EventCard } from "@/components/events/event-card";
import {
  MOCK_EVENTS,
  MOCK_EVENTS_WITH_COVER,
  MOCK_PUBLISHED_EVENTS,
} from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "EventCard 테스트 | Dev",
};

export default function EventCardTestPage() {
  // 테스트에 사용할 이벤트 데이터 (각 케이스별)
  const defaultEvent = MOCK_PUBLISHED_EVENTS[0];
  const eventWithCover = MOCK_EVENTS_WITH_COVER[0];
  const eventWithoutCover =
    MOCK_EVENTS.find((e) => !e.cover_image) ?? MOCK_EVENTS[2];
  const draftEvent =
    MOCK_EVENTS.find((e) => e.status === "draft") ?? MOCK_EVENTS[2];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <Link
          href="/test/components"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← 컴포넌트 목록
        </Link>
        <h1 className="mt-2 text-3xl font-bold">EventCard 테스트</h1>
        <p className="text-muted-foreground mt-1">
          이벤트 카드 컴포넌트의 다양한 variant와 상태를 테스트합니다.
        </p>
      </div>

      {/* ================================================================
       * 섹션 1: Default Variant
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Default Variant</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 커버 이미지 있는 이벤트 */}
          {eventWithCover && (
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">
                커버 이미지 있음
              </p>
              <EventCard event={eventWithCover} variant="default" />
            </div>
          )}

          {/* 커버 이미지 없는 이벤트 */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">
              커버 이미지 없음
            </p>
            <EventCard event={eventWithoutCover} variant="default" />
          </div>

          {/* Draft 상태 이벤트 */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium uppercase">
              Draft 상태
            </p>
            <EventCard event={draftEvent} variant="default" />
          </div>
        </div>
      </section>

      {/* ================================================================
       * 섹션 2: Compact Variant
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Compact Variant</h2>

        <div className="max-w-xl space-y-3">
          {MOCK_PUBLISHED_EVENTS.slice(0, 4).map((event) => (
            <EventCard key={event.id} event={event} variant="compact" />
          ))}
        </div>
      </section>

      {/* ================================================================
       * 섹션 3: 커버 이미지 있는 이벤트 그리드
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">
          커버 이미지 있는 이벤트 ({MOCK_EVENTS_WITH_COVER.length}개)
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_EVENTS_WITH_COVER.slice(0, 6).map((event) => (
            <EventCard key={event.id} event={event} variant="default" />
          ))}
        </div>
      </section>

      {/* ================================================================
       * 섹션 4: 전체 이벤트 목록 (더미 데이터 확인)
       * ================================================================ */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          전체 이벤트 목록 ({MOCK_EVENTS.length}개)
        </h2>

        <div className="space-y-2">
          {MOCK_EVENTS.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded border p-2 text-sm"
            >
              <span className="truncate font-medium">{event.title}</span>
              <span className="text-muted-foreground ml-4 shrink-0 text-xs">
                {event.status} |{" "}
                {event.cover_image ? "이미지 있음" : "이미지 없음"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 기본 이벤트 데이터 */}
      {defaultEvent && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">
            단일 이벤트 (전체 정보)
          </h2>
          <div className="max-w-sm">
            <EventCard event={defaultEvent} variant="default" />
          </div>
        </section>
      )}
    </div>
  );
}
