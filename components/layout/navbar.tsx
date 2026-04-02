"use client";

/**
 * 상단 네비게이션 바
 * 로고, 앱 이름, 유저 메뉴(Phase 2 구현 예정) 포함
 * 모바일/데스크톱 공통 사용
 */

import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme-switcher";

export function Navbar() {
  return (
    <header className="bg-background fixed left-0 right-0 top-0 z-40 h-16 border-b">
      <div className="flex h-full items-center justify-between px-4">
        {/* 로고 및 앱 이름 */}
        <Link
          href="/protected"
          className="flex items-center gap-2 font-semibold"
        >
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
            <span className="text-sm font-bold">E</span>
          </div>
          <span className="hidden sm:inline">이벤트 플래너</span>
        </Link>

        {/* 우측 액션 영역 - Phase 2에서 유저 드롭다운 메뉴로 교체 예정 */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          {/* TODO: Phase 2 - UserMenu 컴포넌트 추가 */}
        </div>
      </div>
    </header>
  );
}
