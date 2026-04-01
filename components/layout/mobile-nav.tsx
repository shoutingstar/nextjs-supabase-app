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

/** 모바일 하단 네비게이션 메뉴 (주요 4개 항목) */
const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: "홈", href: "/protected", icon: "⊞" },
  { label: "이벤트", href: "/protected/events", icon: "📅" },
  { label: "참여자", href: "/protected/participants", icon: "👥" },
  { label: "계정", href: "/protected/account", icon: "⚙" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background">
      <div className="flex h-full items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
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
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
