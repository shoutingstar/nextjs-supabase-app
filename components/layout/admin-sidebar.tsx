"use client";

/**
 * 관리자 전용 사이드바 네비게이션
 * /protected/admin 하위 경로에서만 사용
 * - 상단: Gather 로고 (대시보드로 이동)
 * - 중단: 관리자 섹션 메뉴
 * - 하단: 일반 영역으로 돌아가기
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

/** 관리자 네비게이션 아이템 타입 */
interface AdminNavItem {
  label: string;
  href: string;
  /** 아이콘 텍스트 (Phase 2에서 lucide-react 아이콘으로 교체 예정) */
  icon: string;
  description: string;
}

/** 관리자 섹션 네비게이션 메뉴 */
const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "관리자 대시보드",
    href: "/protected/admin",
    icon: "◈",
    description: "전체 현황 요약",
  },
  {
    label: "이벤트 관리",
    href: "/protected/admin/events",
    icon: "📋",
    description: "모든 이벤트 관리",
  },
  {
    label: "사용자 관리",
    href: "/protected/admin/users",
    icon: "👤",
    description: "사용자 계정 관리",
  },
  {
    label: "통계",
    href: "/protected/admin/stats",
    icon: "📊",
    description: "서비스 이용 통계",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = () => {
    // 로고 클릭 시 관리자 대시보드로 이동
    router.push("/protected/admin");
  };

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 border-r bg-background pt-16 md:block">
      {/* Gather 로고 영역 - 클릭 시 대시보드로 이동 */}
      <div className="border-b px-4 py-1">
        <button
          onClick={handleLogoClick}
          className="flex w-full items-center justify-center rounded-lg bg-accent/10 px-4 py-1 font-bold transition-colors hover:bg-accent/20"
          title="관리자 대시보드"
        >
          <span className="text-lg text-black dark:text-white">Gather</span>
        </button>
      </div>

      {/* 관리자 섹션 헤더 */}
      <div className="border-b px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          관리자 영역
        </p>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {ADMIN_NAV_ITEMS.map((item) => {
          // /protected/admin은 정확히 일치, 나머지는 startsWith
          const isActive =
            item.href === "/protected/admin"
              ? pathname === "/protected/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <span className="w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 일반 영역으로 돌아가기 */}
      <div className="absolute bottom-0 left-0 right-0 border-t p-4">
        <Link
          href="/protected"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <span>←</span>
          <span>일반 영역으로</span>
        </Link>
      </div>
    </aside>
  );
}
