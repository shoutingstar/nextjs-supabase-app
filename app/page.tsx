import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { HomeNav } from "@/components/layout/home-nav";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  // 이미 로그인되었으면 대시보드로 리다이렉트
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/protected");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full flex-1 flex-col items-center gap-20">
        <nav className="border-b-foreground/10 bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed left-0 right-0 top-0 z-40 flex h-16 w-full justify-center border-b backdrop-blur">
          <div className="flex w-full max-w-sm items-center justify-between p-3 px-5 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Link href={"/"}>Gather</Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          </div>
        </nav>
        <div className="flex w-full max-w-sm flex-1 flex-col gap-12 p-5 pb-20 pt-20">
          <Hero />
        </div>

        <footer className="text-muted-foreground mx-auto w-full py-8 text-center text-xs">
          © 2026 Gather
        </footer>

        {/* 하단 네비게이션 - 비로그인 사용자는 버튼 비활성화 */}
        <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-sm -translate-x-1/2">
          <HomeNav isLoggedIn={!!user} />
        </div>
      </div>
    </main>
  );
}
