/**
 * 관리자 데스크톱 웹앱 레이아웃
 * - 별개의 독립적 애플리케이션으로 설계
 * - Sidebar: 고정 네비게이션 (md 이상)
 * - Content: 풀 너비, max-w-lg 제약 없음
 * - 모바일: Sidebar 숨김, 콘텐츠 풀 너비
 *
 * 권한 검증:
 * - profiles 테이블에서 role 조회
 * - role !== 'admin'이면 /auth/login으로 리다이렉트
 */

import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { getUserRole } from "@/lib/queries/profiles";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 현재 로그인한 사용자 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 비로그인 상태 처리 (미들웨어에서 처리되지만 방어적 코드)
  if (!user) {
    redirect("/auth/login");
  }

  // profiles 테이블에서 사용자 역할 조회
  const role = await getUserRole(user.id);

  // 관리자가 아닌 경우 접근 거부
  if (role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="bg-background min-h-screen">
      {/* 관리자 전용 사이드바 */}
      <AdminSidebar />

      {/* 메인 콘텐츠 영역 - Sidebar 공간 예약 및 풀 너비 */}
      <main className="md:ml-64">{children}</main>
    </div>
  );
}
