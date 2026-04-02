/**
 * 사용자 페이지 레이아웃 (모바일 우선)
 * - 상단 네비게이션 바 (Navbar)
 * - 최대 너비 제한 (max-w-lg)
 * - 하단 탭 네비게이션 (MobileNav)
 */

import { MobileNav } from "@/components/layout/mobile-nav";
import { Navbar } from "@/components/layout/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      {/* 상단 네비게이션 바 */}
      <Navbar />

      {/* 메인 콘텐츠 영역 (모바일 우선, 최대 너비 제한) */}
      <main
        className={[
          "pt-16",
          "pb-20",
          "min-h-screen",
          "mx-auto",
          "max-w-lg",
        ].join(" ")}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>

      {/* 하단 탭 네비게이션 (max-w-lg 제약 적용) */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-lg -translate-x-1/2">
        <MobileNav />
      </div>
    </div>
  );
}
