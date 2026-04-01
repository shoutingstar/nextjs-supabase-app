/**
 * 관리자 대시보드 페이지 (/protected/admin)
 * Phase 2에서 실제 서비스 통계 및 관리 기능 구현 예정
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "관리자 대시보드 | 이벤트 플래너",
  description: "서비스 전체 현황을 관리합니다.",
};

/** 관리자 섹션 카드 목록 */
const ADMIN_SECTIONS = [
  {
    title: "이벤트 관리",
    description: "모든 이벤트를 조회하고 관리합니다.",
    href: "/protected/admin/events",
    icon: "📋",
  },
  {
    title: "사용자 관리",
    description: "사용자 계정 및 역할을 관리합니다.",
    href: "/protected/admin/users",
    icon: "👤",
  },
  {
    title: "통계",
    description: "서비스 이용 통계를 확인합니다.",
    href: "/protected/admin/stats",
    icon: "📊",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">관리자 대시보드</h1>
        <p className="text-muted-foreground">서비스 전체 현황을 관리합니다.</p>
      </div>

      {/* TODO: Phase 2 - 전체 통계 카드 (전체 이벤트, 전체 사용자, 이번 달 신규) */}
      <div className="grid gap-4 md:grid-cols-3">
        {["전체 이벤트", "전체 사용자", "이번 달 신규 이벤트"].map((title) => (
          <div
            key={title}
            className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold">-</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Phase 2에서 구현 예정
            </p>
          </div>
        ))}
      </div>

      {/* 관리 섹션 바로가기 */}
      <div className="grid gap-4 md:grid-cols-3">
        {ADMIN_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-start gap-4 rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent"
          >
            <span className="text-2xl">{section.icon}</span>
            <div>
              <h3 className="font-semibold">{section.title}</h3>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
