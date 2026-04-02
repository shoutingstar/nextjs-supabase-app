/**
 * 컴포넌트 테스트 페이지 인덱스
 * 각 컴포넌트 테스트 페이지로 이동하는 링크를 제공합니다.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "컴포넌트 테스트 | Dev",
  description: "Task 003 컴포넌트 테스트 페이지 모음",
};

/** 테스트 페이지 목록 */
const TEST_PAGES = [
  {
    href: "/test/components/event-card",
    title: "EventCard",
    description: "이벤트 카드 컴포넌트 (default/compact variant, 커버 이미지)",
  },
  {
    href: "/test/components/participant-card",
    title: "ParticipantCard",
    description: "참여자 카드 컴포넌트 (default/compact variant, 호스트 표시)",
  },
  {
    href: "/test/components/loading-skeletons",
    title: "LoadingSkeletons",
    description: "이벤트/참여자 카드 로딩 스켈레톤 컴포넌트",
  },
  {
    href: "/test/components/empty-states",
    title: "EmptyStates",
    description: "빈 상태 컴포넌트 (데이터 없음, 에러 상태)",
  },
] as const;

export default function ComponentTestIndexPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">컴포넌트 테스트</h1>
        <p className="text-muted-foreground mt-2">
          Task 003에서 구현된 컴포넌트들을 더미 데이터로 렌더링 테스트합니다.
        </p>
      </div>

      {/* 테스트 페이지 카드 목록 */}
      <div className="grid gap-4 sm:grid-cols-2">
        {TEST_PAGES.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="bg-card hover:border-primary group rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
          >
            <h2 className="group-hover:text-primary font-semibold">
              {page.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {page.description}
            </p>
          </Link>
        ))}
      </div>

      {/* 뒤로 가기 */}
      <div className="mt-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
