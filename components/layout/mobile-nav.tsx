"use client";

/**
 * 사용자용 하단 탭 네비게이션
 * 모든 화면 크기에서 표시 (모바일 우선 설계)
 * usePathname으로 현재 경로에 따라 active 상태 표시
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/** 모바일 네비게이션 아이템 타입 */
interface MobileNavItem {
  label: string;
  href: string;
  /** 아이콘 텍스트 (Phase 2에서 lucide-react 아이콘으로 교체 예정) */
  icon: string;
}

/** 모바일 하단 네비게이션 메뉴 (5개 항목) */
const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: "카테고리", href: "/protected/categories", icon: "≡" },
  { label: "검색", href: "/protected/search", icon: "🔍" },
  { label: "홈", href: "/protected", icon: "⊞" },
  { label: "찜", href: "/protected/liked", icon: "💝" },
  { label: "계정", href: "/protected/account", icon: "👤" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 border-t bg-background/95 shadow-lg">
      <div className="flex h-full items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          // 정확한 경로 매칭: /protected는 정확히 일치, 나머지는 startsWith
          const isActive =
            item.href === "/protected"
              ? pathname === "/protected"
              : pathname.startsWith(item.href);

          const isHome = item.href === "/protected";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                isHome
                  ? "text-primary"
                  : isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "leading-none transition-all",
                  isHome ? "text-3xl" : "text-2xl",
                )}
              >
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
