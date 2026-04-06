/**
 * 초대 링크 페이지
 * /join/[inviteCode] - /api/join/[inviteCode]로 리다이렉트
 */

import { redirect } from "next/navigation";

interface JoinPageProps {
  params: Promise<{ inviteCode: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { inviteCode } = await params;

  console.log("[PAGE JOIN] /join/[inviteCode] 접속, /api/join로 리다이렉트");

  // API Route로 리다이렉트
  redirect(`/api/join/${inviteCode}`);
}
