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
import type { SignUpFormProps } from "@/lib/types/component";
import { cn } from "@/lib/utils";
import { translateAuthError } from "@/lib/utils/auth-errors";

export function SignUpForm({
  className,
  onSuccess,
  onError,
  redirectTo = "/",
  ...props
}: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("비밀번호가 일치하지 않습니다");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        },
      });

      // 디버깅: 실제 응답 로깅
      console.log("[SignUp Response]", {
        data,
        error,
        userExists: !!data?.user,
      });

      // 먼저 error 객체 확인 (API 에러, rate limit 등)
      if (error) {
        // "already" 포함 시 중복 이메일 에러
        if (error.message?.toLowerCase().includes("already")) {
          throw new Error("이미 가입된 이메일 주소입니다");
        }
        // 다른 에러는 그대로 던지기
        throw error;
      }

      // error가 없고 user가 없는 경우만 중복 이메일로 판단
      // (Supabase 보안 정책: 중복 이메일은 error 없이 user: null 반환)
      if (!data?.user) {
        console.warn("[SignUp] Email already registered (user is null)");
        throw new Error("이미 가입된 이메일 주소입니다");
      }

      console.log("[SignUp] 회원가입 성공, redirectTo:", redirectTo);

      onSuccess?.({
        id: "",
        email,
        name: null,
        role: "user",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: null,
      });

      // redirectTo를 먼저 저장
      const targetUrl = `/auth/sign-up-success?next=${encodeURIComponent(redirectTo)}`;

      // 약간의 지연 후 리다이렉트
      setTimeout(() => {
        console.log("[SignUp] 회원가입 성공 페이지로 이동:", targetUrl);
        router.push(targetUrl);

        // 페이지 이동 후에 서버 상태 새로고침
        setTimeout(() => {
          router.refresh();
        }, 500);
      }, 100);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "오류가 발생했습니다";
      // 이미 한국어 메시지면 그대로 사용, 영어면 번역
      const translatedMessage = message.includes("이미 가입된")
        ? message
        : translateAuthError(message);
      setError(translatedMessage);
      onError?.(translatedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
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
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating an account..." : "Sign up"}
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
              <GoogleOAuthButton
                label="Sign up with Google"
                next={redirectTo}
              />
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href={`/auth/login?next=${encodeURIComponent(redirectTo)}`}
                className="underline underline-offset-4"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
