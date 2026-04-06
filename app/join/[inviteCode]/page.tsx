/**
 * 초대 링크를 통한 이벤트 참여 페이지
 * /join/[inviteCode] - 미인증 사용자는 redirect_to 파라미터와 함께 로그인 페이지로 리다이렉트
 *
 * 서버 컴포넌트에서 미인증 감지 → 바로 이벤트 참여 페이지로 리다이렉트
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { ClientJoinPage } from "./client-join-page";

interface JoinPageProps {
  params: Promise<{ inviteCode: string }>;
}

export async function generateMetadata({
  params,
}: JoinPageProps): Promise<Metadata> {
  const { inviteCode } = await params;

  return {
    title: `이벤트 초대 | Gather`,
    description: `초대 링크를 통해 이벤트에 참여하세요.`,
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { inviteCode } = await params;

  console.log("[SERVER JOIN PAGE] 초대 링크 접속, inviteCode:", inviteCode);

  // 인증 상태 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(
    "[SERVER JOIN PAGE] 사용자 인증 상태:",
    user ? user.email : "미인증",
  );

  // 미인증 사용자인 경우
  if (!user) {
    console.log(
      "[SERVER JOIN PAGE] 미인증 사용자 감지, inviteCode로 eventId 조회",
    );

    // 초대 코드로 이벤트ID 조회
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("invite_code", inviteCode)
      .single();

    if (eventError || !eventData) {
      console.error(
        "[SERVER JOIN PAGE] 초대 코드에 해당하는 이벤트를 찾을 수 없음",
      );
      // 이벤트를 찾을 수 없으면 홈으로 리다이렉트
      redirect("/");
    }

    console.log("[SERVER JOIN PAGE] 이벤트 조회 성공, eventId:", eventData.id);

    // redirect_to 파라미터와 함께 로그인 페이지로 리다이렉트
    const redirectTo = `/protected/events/${eventData.id}?join=true&code=${inviteCode}`;
    const loginUrl = `/auth/login?redirect_to=${encodeURIComponent(redirectTo)}`;

    console.log("[SERVER JOIN PAGE] 로그인 페이지로 리다이렉트:", loginUrl);
    redirect(loginUrl);
  }

  console.log("[SERVER JOIN PAGE] 인증 사용자, 클라이언트 컴포넌트 렌더링");

  // 로그인한 사용자는 클라이언트 컴포넌트로 렌더링
  return <ClientJoinPage inviteCode={inviteCode} initialUser={user} />;
}
