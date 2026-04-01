/**
 * EmptyState 컴포넌트 테스트 페이지
 * 빈 상태 컴포넌트의 다양한 케이스 테스트
 */

import { AlertCircle, Calendar, Search, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "EmptyStates 테스트 | Dev",
};

export default function EmptyStatesTestPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <Link
          href="/test/components"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 컴포넌트 목록
        </Link>
        <h1 className="mt-2 text-3xl font-bold">EmptyState 테스트</h1>
        <p className="mt-1 text-muted-foreground">
          빈 상태 컴포넌트의 다양한 케이스를 테스트합니다.
        </p>
      </div>

      {/* ================================================================
       * 섹션 1: 기본 빈 상태
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">기본 빈 상태</h2>

        {/* 이벤트 없음 */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            이벤트 없음
          </p>
          <EmptyState
            title="이벤트가 없습니다"
            description="아직 등록된 이벤트가 없습니다. 첫 번째 이벤트를 만들어 보세요!"
          />
        </div>

        {/* 참여자 없음 */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            참여자 없음
          </p>
          <EmptyState
            title="참여자가 없습니다"
            description="아직 이벤트에 참여한 사람이 없습니다."
          />
        </div>
      </section>

      {/* ================================================================
       * 섹션 2: 아이콘과 함께
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">아이콘 포함 빈 상태</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* 검색 결과 없음 */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              검색 결과 없음
            </p>
            <EmptyState
              icon={<Search className="h-8 w-8 text-muted-foreground" />}
              title="검색 결과가 없습니다"
              description="다른 키워드로 검색해 보세요."
            />
          </div>

          {/* 이벤트 목록 빔 */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              이벤트 달력 비어있음
            </p>
            <EmptyState
              icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
              title="예정된 이벤트 없음"
              description="이번 주에 예정된 이벤트가 없습니다."
            />
          </div>

          {/* 참여자 없음 */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              참여자 목록 비어있음
            </p>
            <EmptyState
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              title="참여자 없음"
              description="아직 이 이벤트에 참여한 사람이 없습니다."
            />
          </div>

          {/* 에러 상태 */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              에러 상태
            </p>
            <EmptyState
              icon={<AlertCircle className="h-8 w-8 text-destructive" />}
              title="오류가 발생했습니다"
              description="데이터를 불러오는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요."
            />
          </div>
        </div>
      </section>

      {/* ================================================================
       * 섹션 3: 액션 버튼 포함
       * ================================================================ */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">액션 버튼 포함</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* 이벤트 생성 유도 */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              이벤트 생성 유도
            </p>
            <EmptyState
              icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
              title="이벤트를 만들어 보세요"
              description="간단한 정보만 입력하면 바로 이벤트를 만들 수 있어요."
              action={
                <Link
                  href="/test/components"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  이벤트 만들기
                </Link>
              }
            />
          </div>

          {/* 참여 유도 */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              참여 유도
            </p>
            <EmptyState
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              title="아직 참여한 이벤트가 없어요"
              description="관심 있는 이벤트를 찾아 참여해 보세요!"
              action={
                <Link
                  href="/test/components"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  이벤트 둘러보기
                </Link>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
