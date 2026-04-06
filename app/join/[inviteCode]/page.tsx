/**
 * 초대 링크를 통한 이벤트 참여 페이지
 * /join/[inviteCode] - API Route Handler (/api/join/[inviteCode])로 리다이렉트
 *
 * 미인증 사용자: /api/join/[inviteCode] → eventId 조회 → /auth/login?redirect_to=...
 * 로그인 사용자: 이벤트 상세 페이지 표시
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

  console.log("[PAGE JOIN] 초대 링크 접속, inviteCode:", inviteCode);

  // 인증 상태 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[PAGE JOIN] 사용자 인증 상태:", user ? user.email : "미인증");

  // 미인증 사용자는 API Route Handler로 리다이렉트
  // (API Route가 redirect_to 파라미터를 올바르게 처리함)
  if (!user) {
    console.log("[PAGE JOIN] 미인증 사용자, API Route로 리다이렉트");
    redirect(`/api/join/${inviteCode}`);
  }

  console.log("[PAGE JOIN] 인증 사용자, 클라이언트 컴포넌트 렌더링");

  // 로그인한 사용자는 클라이언트 컴포넌트로 렌더링
  return <ClientJoinPage inviteCode={inviteCode} initialUser={user} />;
}
