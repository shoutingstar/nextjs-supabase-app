"use client";

/**
 * 데스크톱 사이드바 네비게이션
 * md(768px) 이상에서만 표시, 호버 시 확장
 * usePathname으로 현재 경로에 따라 active 상태 표시
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/** 네비게이션 링크 아이템 타입 */
interface NavItem {
  label: string;
  href: string;
  /** 아이콘 텍스트 (Phase 2에서 lucide-react 아이콘으로 교체 예정) */
  icon: string;
}

/** 보호된 영역 네비게이션 메뉴 */
const NAV_ITEMS: NavItem[] = [
  { label: "대시보드", href: "/protected", icon: "⊞" },
  { label: "이벤트", href: "/protected/events", icon: "📅" },
  { label: "참여자 관리", href: "/protected/participants", icon: "👥" },
  { label: "계정 설정", href: "/protected/account", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="group fixed bottom-0 left-0 top-16 z-30 hidden w-16 overflow-hidden border-r bg-background transition-all duration-300 hover:w-64 md:block">
      <nav className="flex flex-col gap-1 p-4">
        {NAV_ITEMS.map((item) => {
          // 정확한 경로 매칭: /protected는 정확히 일치, 나머지는 startsWith
          const isActive =
            item.href === "/protected"
              ? pathname === "/protected"
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
              <span className="w-5 flex-shrink-0 text-center">{item.icon}</span>
              <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
