/**
 * 관리자 섹션 동적 페이지 (/protected/admin/[section])
 * 지원 섹션: events(이벤트 관리), users(사용자 관리), stats(통계)
 * Phase 2: 더미 데이터 기반 테이블 및 차트 표시
 * Phase 3: API 연동 예정
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventsTable } from "@/components/admin/events-table";
import { StatsCharts } from "@/components/admin/stats-charts";
import { UsersTable } from "@/components/admin/users-table";

/** 지원하는 관리자 섹션 */
const VALID_SECTIONS = ["events", "users", "stats"] as const;
type AdminSection = (typeof VALID_SECTIONS)[number];

/** 섹션별 메타데이터 */
const SECTION_META: Record<
  AdminSection,
  { title: string; description: string }
> = {
  events: {
    title: "이벤트 관리",
    description: "모든 이벤트를 조회하고 관리합니다.",
  },
  users: {
    title: "사용자 관리",
    description: "사용자 계정 및 역할을 관리합니다.",
  },
  stats: {
    title: "통계",
    description: "서비스 이용 통계를 확인합니다.",
  },
};

interface AdminSectionPageProps {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({
  params,
}: AdminSectionPageProps): Promise<Metadata> {
  const { section } = await params;
  const meta = SECTION_META[section as AdminSection];

  if (!meta) {
    return { title: "관리자 | 이벤트 플래너" };
  }

  return {
    title: `${meta.title} | 관리자 | 이벤트 플래너`,
    description: meta.description,
  };
}

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  // Next.js 15: params는 Promise로 처리
  const { section } = await params;

  // 유효하지 않은 섹션은 404
  if (!VALID_SECTIONS.includes(section as AdminSection)) {
    notFound();
  }

  const validSection = section as AdminSection;
  const meta = SECTION_META[validSection];

  return (
    <div className="space-y-6 px-6 py-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
        <p className="text-muted-foreground mt-2">{meta.description}</p>
      </div>

      {/* 섹션별 콘텐츠 렌더링 - 데스크톱 풀 너비 테이블 */}
      {validSection === "events" && <EventsTable />}
      {validSection === "users" && <UsersTable />}

      {/* 차트는 전체 너비 활용 */}
      {validSection === "stats" && <StatsCharts />}
    </div>
  );
}
