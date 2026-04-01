/**
 * 관리자 전용 레이아웃 (/protected/admin)
 * - AdminSidebar로 일반 Sidebar 대체 (z-index 40으로 위에 표시)
 * - main margin을 md:ml-64로 조정 (Sidebar 전체 너비 대응)
 */

import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Phase 2 - 관리자 역할(role: 'admin') 체크 로직 추가

  return (
    <>
      {/* 관리자 전용 사이드바 (z-40으로 Sidebar 위에 표시) */}
      <AdminSidebar />

      {/* Admin 페이지 내용 (margin을 ml-64로 조정) */}
      <div className="md:ml-64">{children}</div>
    </>
  );
}
