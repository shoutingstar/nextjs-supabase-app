import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error_description = searchParams.get("error_description");

  // OAuth 에러 처리 (사용자가 Google 인증을 거부한 경우 등)
  if (error_description) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error_description)}`,
    );
  }

  // code가 없으면 에러
  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=No+authorization+code`,
    );
  }

  // code를 서버 세션으로 교환 (OAuth PKCE 플로우)
  // 이 과정에서 쿠키에 access_token, refresh_token이 자동으로 저장됨
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error.message)}`,
    );
  }

  // 오픈 리다이렉트 공격 방지: next 파라미터가 "/"로 시작해야만 허용
  const safeNext = next.startsWith("/") ? next : "/";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
