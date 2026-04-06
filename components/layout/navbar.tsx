"use client";

/**
 * 상단 네비게이션 바
 * 로고, 사용자 정보, 로그아웃 버튼, 테마 토글러 포함
 */

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="bg-background fixed left-0 right-0 top-0 z-40 h-16 border-b">
      <div className="flex h-full items-center justify-between px-4">
        {/* 왼쪽: 로고 및 앱 이름 */}
        <Link
          href="/protected"
          className="flex items-center gap-2 font-semibold"
        >
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
            <span className="text-sm font-bold">G</span>
          </div>
          <span className="hidden sm:inline">Gather</span>
        </Link>

        {/* 오른쪽: 사용자 정보, 로그아웃, 테마 토글러 */}
        <div className="flex items-center gap-3">
          {!isLoading && user && (
            <>
              <span className="text-muted-foreground hidden text-sm sm:inline">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
