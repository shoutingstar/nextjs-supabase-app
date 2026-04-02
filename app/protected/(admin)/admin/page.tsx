/**
 * 관리자 대시보드 페이지 (/protected/admin)
 * Phase 2: 더미 데이터 기반 통계 표시
 * Phase 3: 실제 데이터베이스 연동 예정
 */

import { BarChart3, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_EVENT_PARTICIPANTS,
  MOCK_EVENTS,
  MOCK_USERS,
} from "@/lib/data/mock-data";

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
  // 통계 계산
  const totalEvents = MOCK_EVENTS.length;
  const totalUsers = MOCK_USERS.length;
  const adminCount = MOCK_USERS.filter((u) => u.role === "admin").length;
  const moderatorCount = MOCK_USERS.filter(
    (u) => u.role === "moderator",
  ).length;
  const totalParticipations = Object.values(MOCK_EVENT_PARTICIPANTS).flat()
    .length;
  const thisMonthEvents = MOCK_EVENTS.filter((e) => {
    const eventDate = new Date(e.created_at);
    const now = new Date();
    return (
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const stats = [
    {
      title: "전체 이벤트",
      value: totalEvents,
      description: `공개: ${MOCK_EVENTS.filter((e) => e.status === "published").length}개`,
      icon: BarChart3,
    },
    {
      title: "전체 사용자",
      value: totalUsers,
      description: `관리자: ${adminCount}명, 운영진: ${moderatorCount}명`,
      icon: Users,
    },
    {
      title: "활성 참여",
      value: totalParticipations,
      description: `총 참여 기록 수`,
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-6 px-6 py-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">관리자 대시보드</h1>
        <p className="mt-2 text-muted-foreground">
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
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
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
