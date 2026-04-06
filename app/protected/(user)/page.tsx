/**
 * 대시보드 페이지 (/protected)
 * 서버 컴포넌트: Supabase에서 이벤트 데이터 조회 후 DashboardContent에 전달
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  getUserHostedEvents,
  getUserParticipatingEvents,
} from "@/lib/queries/events";
import { createClient } from "@/lib/supabase/server";

import { DashboardContent } from "./_components/dashboard-content";

export const metadata: Metadata = {
  title: "대시보드 | Gather",
  description: "이벤트 현황을 한눈에 확인하세요.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // 현재 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 사용자 프로필에서 이름 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // 이벤트 목록 병렬 조회
  const [hostedEvents, participatingEvents] = await Promise.all([
    getUserHostedEvents(user.id),
    getUserParticipatingEvents(user.id),
  ]);

  return (
    <DashboardContent
      userName={profile?.full_name ?? user.email ?? null}
      hostedEvents={hostedEvents}
      participatingEvents={participatingEvents}
    />
  );
}
