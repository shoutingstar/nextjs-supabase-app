/**
 * 보호 레이아웃 (인증 체크)
 * - 미인증 사용자를 /auth/login으로 리다이렉트
 * - 자식 레이아웃이 UI 담당 (route group 사용)
 *
 * 구조:
 * - /protected/(user)/* → 모바일 우선 (Navbar + BottomNav)
 * - /protected/(admin)/* → 웹앱 스타일 (Sidebar + FullWidth)
 */

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 인증 상태 확인 - 미인증 시 로그인 페이지로 리다이렉트
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 인증 완료 후 자식 레이아웃에 위임
  return <>{children}</>;
}
