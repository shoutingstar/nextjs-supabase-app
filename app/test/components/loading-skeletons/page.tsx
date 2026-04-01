/**
 * LoadingSkeleton 컴포넌트 테스트 페이지
 * EventCard/ParticipantCard 스켈레톤의 다양한 케이스 테스트
 */

import type { Metadata } from "next";
import Link from "next/link";

import {
  EventCardCompactSkeleton,
  EventCardSkeleton,
  EventListSkeleton,
} from "@/components/skeletons/event-skeleton";
import {
  ParticipantCardCompactSkeleton,
  ParticipantCardSkeleton,
  ParticipantListSkeleton,
} from "@/components/skeletons/participant-skeleton";

export const metadata: Metadata = {
  title: "LoadingSkeletons 테스트 | Dev",
};

export default function LoadingSkeletonsTestPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <Link
          href="/test/components"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 컴포넌트 목록
        </Link>
        <h1 className="mt-2 text-3xl font-bold">LoadingSkeleton 테스트</h1>
        <p className="mt-1 text-muted-foreground">
          이벤트 카드 및 참여자 카드 로딩 스켈레톤 컴포넌트를 테스트합니다.
        </p>
      </div>

      {/* ================================================================
       * 섹션 1: EventCard 스켈레톤
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">EventCard 스켈레톤</h2>

        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            단일 스켈레톤 (default)
          </p>
          <div className="max-w-sm">
            <EventCardSkeleton />
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            단일 스켈레톤 (compact)
          </p>
          <div className="max-w-xl">
            <EventCardCompactSkeleton />
          </div>
        </div>
      </section>

      {/* ================================================================
       * 섹션 2: EventList 스켈레톤 (그리드)
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">
          EventList 스켈레톤 그리드
        </h2>

        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            3개 그리드 (default)
          </p>
          <EventListSkeleton count={3} variant="default" />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            4개 목록 (compact)
          </p>
          <div className="max-w-xl">
            <EventListSkeleton count={4} variant="compact" />
          </div>
        </div>
      </section>

      {/* ================================================================
       * 섹션 3: ParticipantCard 스켈레톤
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">ParticipantCard 스켈레톤</h2>

        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            단일 스켈레톤 (default)
          </p>
          <div className="max-w-xs">
            <ParticipantCardSkeleton />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            단일 스켈레톤 (compact)
          </p>
          <div className="max-w-xs">
            <ParticipantCardCompactSkeleton />
          </div>
        </div>
      </section>

      {/* ================================================================
       * 섹션 4: ParticipantList 스켈레톤 (그리드)
       * ================================================================ */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">ParticipantList 스켈레톤</h2>

        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            4개 그리드 (default)
          </p>
          <ParticipantListSkeleton count={4} variant="default" />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            5개 목록 (compact)
          </p>
          <div className="max-w-xs">
            <ParticipantListSkeleton count={5} variant="compact" />
          </div>
        </div>
      </section>
    </div>
  );
}
