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

  // 프로필 자동 생성 (신규 사용자인 경우에만 INSERT)
  // OAuth 플로우 자체에는 영향을 주지 않도록 try-catch로 감싸기
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // 기존 프로필 존재 여부 확인
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      // 프로필이 없으면 신규 생성
      if (!existingProfile) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
          role: "user",
        });

        if (insertError) {
          // 프로필 생성 실패 시 로그만 남기고 OAuth 플로우 계속 진행
          console.error("프로필 자동 생성 실패:", insertError.message);
        }
      }
    }
  } catch (profileError) {
    // 프로필 처리 중 예외 발생 시 OAuth 플로우에 영향 주지 않음
    console.error("프로필 처리 중 오류:", profileError);
  }

  // 오픈 리다이렉트 공격 방지: next 파라미터가 "/"로 시작해야만 허용
  const safeNext = next.startsWith("/") ? next : "/";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
