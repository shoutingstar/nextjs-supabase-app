import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "관리자 로그인 | Gather",
  description: "관리자 계정으로 로그인하세요.",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">관리자 로그인</h1>
          <p className="text-muted-foreground text-sm">
            관리자 계정으로 로그인하세요.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
