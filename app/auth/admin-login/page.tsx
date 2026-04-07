import { LoginForm } from "@/components/login-form";

interface AdminLoginPageProps {
  searchParams: Promise<{
    next?: string;
    redirect_to?: string;
    redirect?: string;
  }>;
}

export default async function Page({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;

  // 리다이렉트 URL 결정 (우선순위: redirect > redirect_to > next > 관리자 기본값)
  const redirectTo =
    params.redirect || params.redirect_to || params.next || "/protected/admin";

  console.log("[Admin Login Page] searchParams:", JSON.stringify(params));
  console.log("[Admin Login Page] 최종 redirectTo:", redirectTo);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm redirectTo={redirectTo} isAdminLogin />
      </div>
    </div>
  );
}
