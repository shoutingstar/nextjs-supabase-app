/**
 * 초대 링크 API Route Handler
 * GET /api/join/[inviteCode]
 *
 * 미인증 사용자를 redirect_to 파라미터와 함께 로그인 페이지로 리다이렉트
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ inviteCode: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { inviteCode } = await context.params;

  console.log("[API JOIN] inviteCode:", inviteCode);

  // 인증 상태 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[API JOIN] 사용자 인증 상태:", user ? user.email : "미인증");

  // 로그인한 사용자는 일반 페이지로 리다이렉트
  if (user) {
    console.log("[API JOIN] 로그인 사용자, /join/[inviteCode]로 리다이렉트");
    return NextResponse.redirect(new URL(`/join/${inviteCode}`, request.url));
  }

  // 미인증 사용자: eventId 조회
  console.log("[API JOIN] 미인증 사용자, inviteCode로 eventId 조회");

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("invite_code", inviteCode)
    .single();

  if (eventError || !eventData) {
    console.error("[API JOIN] 초대 코드에 해당하는 이벤트를 찾을 수 없음");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("[API JOIN] 이벤트 조회 성공, eventId:", eventData.id);

  // redirect_to 파라미터와 함께 로그인 페이지로 리다이렉트
  const redirectTo = `/protected/events/${eventData.id}?join=true&code=${inviteCode}`;
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("redirect_to", redirectTo);

  console.log("[API JOIN] 로그인 페이지로 리다이렉트:", loginUrl.toString());

  return NextResponse.redirect(loginUrl);
}
