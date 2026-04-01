/**
 * 관리자 전용 레이아웃 (/protected/admin)
 * - Phase 2에서 admin 역할 체크 로직 추가 예정
 * - AdminSidebar로 일반 Sidebar 대체
 */

import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Phase 2 - 관리자 역할(role: 'admin') 체크 로직 추가
  // 현재는 protected/layout.tsx의 인증 체크에만 의존

  return (
    <>
      {/* 관리자 전용 사이드바 (일반 Sidebar 위에 렌더링되어 덮어씀) */}
      <AdminSidebar />
      {children}
    </>
  );
}
