/**
 * 초대 링크 Route Handler
 * GET /join/[inviteCode]
 *
 * 미인증 사용자: eventId 조회 → /auth/login?redirect_to=/protected/events/[id]?join=true&code=[code]
 * 로그인 사용자: /protected/events/[id]?join=true&code=[code]로 리다이렉트 (자동 참여)
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ inviteCode: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  console.log("[ROUTE JOIN] === 라우트 핸들러 시작 ===");

  const { inviteCode } = await context.params;

  console.log("[ROUTE JOIN] 초대 링크 접속, inviteCode:", inviteCode);
  console.log("[ROUTE JOIN] 요청 URL:", request.url);

  // 인증 상태 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[ROUTE JOIN] 사용자 인증 상태:", user ? user.email : "미인증");

  // 초대 코드로 이벤트ID 조회
  console.log("[ROUTE JOIN] inviteCode로 eventId 조회");

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("invite_code", inviteCode)
    .single();

  if (eventError || !eventData) {
    console.error("[ROUTE JOIN] 초대 코드에 해당하는 이벤트를 찾을 수 없음");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("[ROUTE JOIN] 이벤트 조회 성공, eventId:", eventData.id);

  const eventPath = `/protected/events/${eventData.id}?join=true&code=${inviteCode}`;

  // 로그인한 사용자: 바로 이벤트 참여 페이지로 리다이렉트
  if (user) {
    console.log("[ROUTE JOIN] 로그인 사용자, 이벤트 참여 페이지로 리다이렉트");
    return NextResponse.redirect(new URL(eventPath, request.url));
  }

  // 미인증 사용자: 로그인 페이지로 리다이렉트 (with redirect)
  console.log("[ROUTE JOIN] 미인증 사용자, 로그인 페이지로 리다이렉트");

  const joinPath = `/join/${inviteCode}`;
  const redirectPath = encodeURIComponent(joinPath);
  const loginUrl = new URL(request.url);
  loginUrl.pathname = "/auth/login";
  loginUrl.searchParams.set("redirect", joinPath);

  console.log("[ROUTE JOIN] 최종 리다이렉트 URL:", loginUrl.toString());
  console.log("[ROUTE JOIN] joinPath:", joinPath);

  return NextResponse.redirect(loginUrl);
}
