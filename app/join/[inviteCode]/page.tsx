/**
 * 초대 링크를 통한 이벤트 참여 페이지
 * /join/[inviteCode] - 미인증 사용자는 로그인 페이지로 리다이렉트
 *
 * 클라이언트 컴포넌트를 사용하여 로그인 후 초대 페이지로 자동 이동
 */

import type { Metadata } from "next";

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

  // 모든 로직을 클라이언트 컴포넌트에서 처리
  return <ClientJoinPage inviteCode={inviteCode} initialUser={null} />;
}
