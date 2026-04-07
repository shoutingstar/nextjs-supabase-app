/**
 * 관리자 섹션 동적 페이지 (/protected/admin/[section])
 * 지원 섹션: events(이벤트 관리), users(사용자 관리), stats(통계)
 * 실제 데이터베이스 연동
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminTableControls } from "@/components/admin/admin-table-controls";
import { EventsTable } from "@/components/admin/events-table";
import { StatsCharts } from "@/components/admin/stats-charts";
import { UsersTable } from "@/components/admin/users-table";
import {
  getAdminEvents,
  getAdminStats,
  getAdminUsers,
} from "@/lib/queries/admin";
import { createClient } from "@/lib/supabase/server";

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
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    role?: string;
  }>;
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

async function EventsSection({
  page,
  search,
  status,
}: {
  page: number;
  search?: string;
  status?: string;
}) {
  const data = await getAdminEvents({
    page,
    perPage: 20,
    search,
    status,
  });

  return (
    <>
      <AdminTableControls
        section="events"
        currentSearch={search}
        currentFilter={status}
      />
      <EventsTable events={data.data} />
      <AdminPagination
        currentPage={data.page}
        totalPages={data.totalPages}
        section="events"
      />
    </>
  );
}

async function UsersSection({
  page,
  search,
  role,
}: {
  page: number;
  search?: string;
  role?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = await getAdminUsers({
    page,
    perPage: 20,
    search,
    role,
  });

  return (
    <>
      <AdminTableControls
        section="users"
        currentSearch={search}
        currentFilter={role}
      />
      <UsersTable users={data.data} currentUserId={user?.id} />
      <AdminPagination
        currentPage={data.page}
        totalPages={data.totalPages}
        section="users"
      />
    </>
  );
}

async function StatsSection() {
  const data = await getAdminStats();

  return <StatsCharts data={data} />;
}

export default async function AdminSectionPage({
  params,
  searchParams,
}: AdminSectionPageProps) {
  const { section } = await params;
  const { page = "1", q, status, role } = await searchParams;

  // 유효하지 않은 섹션은 404
  if (!VALID_SECTIONS.includes(section as AdminSection)) {
    notFound();
  }

  const validSection = section as AdminSection;
  const meta = SECTION_META[validSection];
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  return (
    <div className="space-y-6 px-6 py-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
        <p className="text-muted-foreground mt-2">{meta.description}</p>
      </div>

      {/* 섹션별 콘텐츠 렌더링 */}
      <Suspense
        fallback={
          <div className="text-muted-foreground py-8 text-center">
            불러오는 중...
          </div>
        }
      >
        {validSection === "events" && (
          <EventsSection page={currentPage} search={q} status={status} />
        )}
        {validSection === "users" && (
          <UsersSection page={currentPage} search={q} role={role} />
        )}
        {validSection === "stats" && <StatsSection />}
      </Suspense>
    </div>
  );
}
