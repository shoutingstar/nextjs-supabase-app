"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GoogleOAuthButton } from "@/components/google-oauth-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { LoginFormProps } from "@/lib/types/component";
import { cn } from "@/lib/utils";
import { translateAuthError } from "@/lib/utils/auth-errors";

interface LoginFormExtendedProps extends LoginFormProps {
  isAdminLogin?: boolean;
}

export function LoginForm({
  className,
  onSuccess,
  onError: _onError,
  redirectTo = "/",
  isAdminLogin = false,
  ...props
}: LoginFormExtendedProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      console.log("[LOGIN FORM] 로그인 시도, email:", email);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Step 1: 로그인 성공 후 사용자 정보 조회
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !authUser) {
        throw new Error("사용자 정보를 가져올 수 없습니다.");
      }

      // Step 2: 관리자 로그인인 경우 role 권한 검증
      if (isAdminLogin) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authUser.id)
          .single();

        if (profileError || !profile) {
          console.error("[LOGIN FORM] 프로필 조회 실패:", profileError);
          throw new Error("프로필 정보를 찾을 수 없습니다.");
        }

        // Step 3: role이 'admin'이 아니면 에러 처리
        if (profile.role !== "admin") {
          console.warn(
            `[LOGIN FORM] 관리자 로그인 시도 실패: 권한 없음 (role: ${profile.role})`,
          );

          // 로그아웃 처리
          await supabase.auth.signOut();

          throw new Error("관리자 계정이 아닙니다. 관리자 권한이 필요합니다.");
        }

        console.log("[LOGIN FORM] 관리자 로그인 성공, role:", profile.role);
      }

      onSuccess?.({
        id: authUser.id,
        email: authUser.email || "",
        name: null,
        role: isAdminLogin ? "admin" : "user",
        avatar_url: null,
        created_at: authUser.created_at,
        updated_at: null,
      });

      // 약간의 지연 후 리다이렉트 (세션 저장 시간 확보)
      setTimeout(() => {
        router.push(redirectTo);
        setTimeout(() => {
          router.refresh();
        }, 500);
      }, 100);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "오류가 발생했습니다";
      const translatedMessage = translateAuthError(message);
      setError(translatedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isAdminLogin ? "관리자 로그인" : "Login"}
          </CardTitle>
          <CardDescription>
            {isAdminLogin
              ? "관리자 계정으로 로그인하세요"
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? isAdminLogin
                    ? "로그인 중..."
                    : "Logging in..."
                  : isAdminLogin
                    ? "로그인"
                    : "Login"}
              </Button>

              {/* Google OAuth 구분선 (관리자 로그인 제외) */}
              {!isAdminLogin && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background text-muted-foreground px-2">
                        Or
                      </span>
                    </div>
                  </div>

                  {/* Google OAuth 버튼 */}
                  <GoogleOAuthButton
                    label="Login with Google"
                    next={redirectTo}
                  />
                </>
              )}
            </div>
            {isAdminLogin ? (
              <div className="mt-4 text-center text-sm">
                <Link
                  href="/auth/login"
                  className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  일반 로그인으로 이동
                </Link>
              </div>
            ) : (
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/auth/sign-up?next=${encodeURIComponent(redirectTo)}`}
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
