/**
 * 관리자 데스크톱 웹앱 레이아웃
 * - 별개의 독립적 애플리케이션으로 설계
 * - Sidebar: 고정 네비게이션 (md 이상)
 * - Content: 풀 너비, max-w-lg 제약 없음
 * - 모바일: Sidebar 숨김, 콘텐츠 풀 너비
 */

import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Phase 3 - 관리자 역할(role: 'admin') 체크 로직 추가

  return (
    <div className="min-h-screen bg-background">
      {/* 관리자 전용 사이드바 */}
      <AdminSidebar />

      {/* 메인 콘텐츠 영역 - Sidebar 공간 예약 및 풀 너비 */}
      <main className="md:ml-64">{children}</main>
    </div>
  );
}
