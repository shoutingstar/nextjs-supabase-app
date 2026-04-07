import Link from "next/link";

import { LoginForm } from "@/components/login-form";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
    redirect_to?: string;
    redirect?: string;
  }>;
}

export default async function Page({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  // 리다이렉트 URL 결정 (우선순위: redirect > redirect_to > next > 기본값)
  const redirectTo =
    params.redirect || params.redirect_to || params.next || "/protected/events";

  console.log("[Login Page] searchParams:", JSON.stringify(params));
  console.log("[Login Page] 최종 redirectTo:", redirectTo);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <LoginForm redirectTo={redirectTo} />

        {/* 관리자 로그인 링크 */}
        <div className="text-center text-sm">
          <Link
            href="/auth/admin-login"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            관리자 로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
