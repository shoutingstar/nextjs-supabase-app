/**
 * 인증 보호 레이아웃
 * - 미인증 사용자를 /auth/login으로 리다이렉트
 * - Navbar(상단) + Sidebar(좌측, 데스크톱) + MobileNav(하단, 모바일) 구성
 */

import { redirect } from "next/navigation";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
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

      {/* 데스크톱 사이드바 (md 이상에서만 표시) */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 */}
      <main
        className={[
          "pt-16", // Navbar 높이(h-16) 만큼 상단 패딩
          "pb-16 md:pb-0", // 모바일: MobileNav 높이 확보, 데스크톱: 불필요
          "md:ml-64", // 데스크톱: Sidebar 너비(w-64) 만큼 좌측 마진
          "min-h-screen",
        ].join(" ")}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>

      {/* 모바일 하단 네비게이션 (md 미만에서만 표시) */}
      <MobileNav />
    </div>
  );
}
