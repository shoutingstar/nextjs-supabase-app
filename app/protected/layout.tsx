"use client";

/**
 * 보호 레이아웃 (인증 체크 + 레이아웃 분기)
 * - 일반 사용자: 모바일 우선 레이아웃 (Navbar + BottomNav)
 * - 관리자: 웹 레이아웃 (Navbar + Sidebar)
 */

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = pathname.startsWith("/protected/admin");

  // 인증 체크
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return null; // 또는 로딩 스피너
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 바 */}
      <Navbar />

      {/* 데스크톱 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 */}
      <main
        className={cn(
          "pt-16", // Navbar 높이(h-16) 만큼 상단 패딩
          "pb-16", // BottomNav 높이 확보
          "min-h-screen",
          isAdmin ? "md:ml-64" : "md:ml-16", // 관리자: w-64, 일반: w-16
        )}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>

      {/* 하단 탭 네비게이션 (모든 화면 크기에서 표시 - 사용자용 모바일 우선) */}
      <MobileNav />
    </div>
  );
}
