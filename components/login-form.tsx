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

export function LoginForm({
  className,
  onSuccess,
  onError: _onError,
  redirectTo = "/",
  ...props
}: LoginFormProps) {
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

      console.log("[LOGIN FORM] 로그인 성공");
      console.log("[LOGIN FORM] redirectTo:", redirectTo);

      onSuccess?.({
        id: "",
        email,
        name: null,
        role: "user",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: null,
      });

      // localStorage에서 초대 정보 확인
      let eventId: string | null = null;
      let inviteCode: string | null = null;
      try {
        eventId = localStorage.getItem("pending_event_id");
        inviteCode = localStorage.getItem("pending_invite_code");
        if (eventId && inviteCode) {
          console.log(
            "[LOGIN FORM] localStorage에서 초대 정보 감지 - eventId:",
            eventId,
            "inviteCode:",
            inviteCode,
          );
        }
      } catch (e) {
        console.error("[LOGIN FORM] localStorage 읽기 실패:", e);
      }

      // redirectTo를 먼저 저장 (refresh 후에도 접근 가능하도록)
      let targetUrl = redirectTo;

      // 초대 정보가 있으면 바로 이벤트 참여 페이지로 리다이렉트
      if (eventId && inviteCode) {
        console.log("[LOGIN FORM] 초대 정보 감지:", { eventId, inviteCode });
        targetUrl = `/protected/events/${eventId}?join=true&code=${inviteCode}`;
        console.log("[LOGIN FORM] 최종 리다이렉트 URL:", targetUrl);

        // localStorage에서 제거
        try {
          localStorage.removeItem("pending_event_id");
          localStorage.removeItem("pending_invite_code");
          console.log("[LOGIN FORM] localStorage에서 초대 정보 제거");
        } catch (e) {
          console.error("[LOGIN FORM] localStorage 제거 실패:", e);
        }
      }

      // 약간의 지연 후 리다이렉트 (세션 저장 시간 확보)
      // router.refresh()는 나중에 호출하여 searchParams 초기화 방지
      setTimeout(() => {
        console.log("[LOGIN FORM] 리다이렉트 시작, targetUrl:", targetUrl);
        router.push(targetUrl);

        // 페이지 이동 후에 서버 상태 새로고침
        setTimeout(() => {
          console.log("[LOGIN FORM] router.refresh() 호출");
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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              {/* Google OAuth 구분선 */}
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
              <GoogleOAuthButton label="Login with Google" next={redirectTo} />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href={`/auth/sign-up?next=${encodeURIComponent(redirectTo)}`}
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
