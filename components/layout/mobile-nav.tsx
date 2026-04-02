"use client";

/**
 * 사용자용 하단 탭 네비게이션
 * 모든 화면 크기에서 표시 (모바일 우선 설계)
 * usePathname으로 현재 경로에 따라 active 상태 표시
 */

import { Calendar, Home, type LucideIcon, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** 모바일 하단 네비게이션 메뉴 (주요 4개 항목) */
const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "홈", href: "/protected", icon: Home },
  { label: "이벤트", href: "/protected/events", icon: Calendar },
  { label: "새이벤트", href: "/protected/events/new", icon: Plus },
  { label: "프로필", href: "/protected/account", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 border-t bg-background/95 shadow-lg">
      <div className="flex h-full items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          // 경로 매칭 로직
          let isActive = false;

          if (item.href === "/protected") {
            // 홈: 정확히 /protected일 때만 활성
            isActive = pathname === "/protected";
          } else if (item.href === "/protected/events/new") {
            // 새이벤트: /protected/events/new 정확히 일치
            isActive = pathname === "/protected/events/new";
          } else if (item.href === "/protected/events") {
            // 이벤트: /protected/events로 시작하되, /new는 제외
            isActive =
              pathname.startsWith("/protected/events") &&
              !pathname.startsWith("/protected/events/new");
          } else {
            // 프로필: /protected/account로 시작
            isActive = pathname.startsWith(item.href);
          }

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
