/**
 * 보호 레이아웃 (인증 체크)
 * - 미인증 사용자를 /auth/login으로 리다이렉트
 * - 일반 사용자: 모바일 우선 레이아웃 (Navbar + BottomNav)
 * - 관리자: admin/layout.tsx에서 Sidebar로 오버라이드
 */

import { redirect } from "next/navigation";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 인증 상태 확인 - 미인증 시 로그인 페이지로 리다이렉트
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 바 */}
      <Navbar />

      {/* 메인 콘텐츠 영역 (사용자 페이지는 좌측 네비게이션 없음) */}
      <main className={["pt-16", "pb-16", "min-h-screen"].join(" ")}>
        <div className="p-4 md:p-6">{children}</div>
      </main>

      {/* 하단 탭 네비게이션 (모든 화면 크기에서 표시) */}
      <MobileNav />
    </div>
  );
}
