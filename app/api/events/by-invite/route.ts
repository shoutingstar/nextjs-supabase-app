/**
 * 초대 코드로 이벤트 정보를 조회하는 API
 * - 미인증 사용자도 접근 가능
 * - RLS를 우회하기 위해 Route Handler에서 실행
 */

import type { NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const inviteCode = searchParams.get("code");

  if (!inviteCode) {
    console.error("[Events API] 초대 코드 누락");
    return Response.json({ error: "초대 코드가 필요합니다." }, { status: 400 });
  }

  try {
    console.log(`[Events API] 초대 코드로 이벤트 조회 시작: "${inviteCode}"`);

    const supabase = await createClient();

    // 미인증 상태로 조회
    await supabase.auth.setSession(null);
    console.log("[Events API] 미인증 상태로 전환");

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select(
        "id, title, description, event_date, location, host_id, status, invite_code, cover_image_url, max_participants, created_at, updated_at",
      )
      .eq("invite_code", inviteCode)
      .single();

    if (eventError) {
      console.error(`[Events API] 이벤트 조회 실패:`, {
        code: eventError.code,
        message: eventError.message,
      });
      return Response.json(
        { error: "이벤트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (!event) {
      console.warn(`[Events API] 이벤트 없음`);
      return Response.json(
        { error: "이벤트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    console.log(`[Events API] 이벤트 조회 성공:`, {
      eventId: event.id,
      title: event.title,
      status: event.status,
    });

    // 호스트 정보 조회
    const { data: host } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", event.host_id)
      .single();

    // 참여자 수 조회
    const { count: participantsCount } = await supabase
      .from("event_participants")
      .select("id", { count: "exact", head: true })
      .eq("event_id", event.id);

    return Response.json({
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      status: event.status,
      invite_code: event.invite_code,
      cover_image_url: event.cover_image_url,
      max_participants: event.max_participants,
      host_id: event.host_id,
      host: host || { id: event.host_id, full_name: null, avatar_url: null },
      participants_count: participantsCount || 0,
      created_at: event.created_at,
      updated_at: event.updated_at,
    });
  } catch (error) {
    console.error("[Events API] 예외 발생:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
