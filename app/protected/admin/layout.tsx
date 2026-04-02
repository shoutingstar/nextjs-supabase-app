/**
 * 관리자 전용 레이아웃 (/protected/admin)
 * - AdminSidebar로 일반 Sidebar 대체 (z-index 40으로 위에 표시)
 * - 데스크톱 최적화: max-w-lg 제약 제거, 풀 너비 활용
 * - md 이상: Sidebar(64px) + Content로 레이아웃
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

      {/* Admin 페이지 내용 (데스크톱: ml-64로 Sidebar 공간 확보, 풀 너비 사용) */}
      <div className="md:ml-64">
        {/* max-w-lg 제약 제거하고 데스크톱 최적화된 패딩 적용 */}
        <div className="min-h-screen bg-background">{children}</div>
      </div>
    </>
  );
}
