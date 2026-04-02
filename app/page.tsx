import Link from "next/link";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full flex-1 flex-col items-center gap-20">
        <nav className="border-b-foreground/10 bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed left-0 right-0 top-0 z-40 flex h-16 w-full justify-center border-b backdrop-blur">
          <div className="flex w-full max-w-sm items-center justify-between p-3 px-5 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Link href={"/"}>이벤트 플래너</Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </div>
        </nav>
        <div className="flex w-full max-w-sm flex-1 flex-col gap-12 p-5 pt-20">
          <Hero />
          <main className="flex flex-1 flex-col gap-6 px-0">
            <h2 className="mb-4 text-xl font-medium">다음 단계</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </main>
        </div>

        <footer className="text-muted-foreground mx-auto w-full py-8 text-center text-xs">
          © 2026 이벤트 플래너
        </footer>
      </div>
    </main>
  );
}
