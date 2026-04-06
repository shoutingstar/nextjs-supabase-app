import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * POST /auth/logout - 로그아웃 처리
 *
 * 1. Supabase signOut() 호출 (서버 세션 무효화)
 * 2. 쿠키에서 auth 토큰 제거
 * 3. /auth/login으로 리다이렉트
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  // Supabase 세션 무효화
  await supabase.auth.signOut();

  // 요청의 origin 추출 (절대 경로 리다이렉트용)
  const { origin } = new URL(request.url);

  // 로그인 페이지로 리다이렉트
  // createClient의 setAll 핸들러가 쿠키 제거를 자동으로 처리
  return NextResponse.redirect(`${origin}/auth/login`, { status: 302 });
}
