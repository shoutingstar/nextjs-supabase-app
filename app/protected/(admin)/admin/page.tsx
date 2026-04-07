/**
 * 관리자 대시보드 페이지 (/protected/admin)
 * 실제 데이터베이스 연동 - getAdminDashboardStats 호출
 */

import { BarChart3, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboardStats } from "@/lib/queries/admin";

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

export default async function AdminDashboardPage() {
  const dashboardStats = await getAdminDashboardStats();

  const stats = [
    {
      title: "전체 이벤트",
      value: dashboardStats.totalEvents,
      description: `활성: ${dashboardStats.activeEvents}개`,
      icon: BarChart3,
    },
    {
      title: "전체 사용자",
      value: dashboardStats.totalUsers,
      description: "총 가입 사용자 수",
      icon: Users,
    },
    {
      title: "활성 참여",
      value: dashboardStats.totalParticipations,
      description: "총 참여 기록 수",
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-6 px-6 py-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">관리자 대시보드</h1>
        <p className="text-muted-foreground mt-2">
          서비스 전체 현황을 관리합니다.
        </p>
      </div>

      {/* 통계 카드 그리드 - 데스크톱 레이아웃 */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground text-xs">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 관리 섹션 바로가기 - 3열 고정 레이아웃 */}
      <div className="grid grid-cols-3 gap-4">
        {ADMIN_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-card hover:bg-accent flex items-start gap-4 rounded-lg border p-6 shadow-sm transition-colors"
          >
            <span className="text-2xl">{section.icon}</span>
            <div>
              <h3 className="font-semibold">{section.title}</h3>
              <p className="text-muted-foreground text-sm">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
