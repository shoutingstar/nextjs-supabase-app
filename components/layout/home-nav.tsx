"use client";

/**
 * 홈페이지용 하단 네비게이션
 * 비로그인 사용자는 버튼이 비활성화됨
 */

import { Calendar, Home, type LucideIcon, Plus, User } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const HOME_NAV_ITEMS: NavItem[] = [
  { label: "홈", href: "/protected", icon: Home },
  { label: "이벤트", href: "/protected/events", icon: Calendar },
  { label: "새이벤트", href: "/protected/events/new", icon: Plus },
  { label: "프로필", href: "/protected/account", icon: User },
];

export function HomeNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <nav className="bg-background/95 h-20 border-t shadow-lg">
      <div className="flex h-full items-center justify-around">
        {HOME_NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          if (isLoggedIn) {
            // 로그인된 경우: 일반 링크
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          }

          // 비로그인: 비활성화된 버튼
          return (
            <button
              key={item.href}
              disabled
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                "text-muted-foreground/50 cursor-not-allowed opacity-50",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
