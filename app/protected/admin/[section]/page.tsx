/**
 * 관리자 섹션 동적 페이지 (/protected/admin/[section])
 * 지원 섹션: events(이벤트 관리), users(사용자 관리), stats(통계)
 * Phase 2에서 각 섹션별 실제 콘텐츠 구현 예정
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{meta.title}</h1>
        <p className="text-muted-foreground">{meta.description}</p>
      </div>

      {/* TODO: Phase 2 - 섹션별 콘텐츠 구현 */}
      {/* events: 전체 이벤트 목록, 상태 필터, 강제 취소 기능 */}
      {/* users: 사용자 목록, 역할 변경, 계정 정지 기능 */}
      {/* stats: 가입자 추이, 이벤트 생성 추이, 인기 이벤트 */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium">{meta.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Phase 2에서 구현 예정입니다.
        </p>
      </div>
    </div>
  );
}
