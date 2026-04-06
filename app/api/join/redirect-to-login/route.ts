/**
 * 초대 링크에서 로그인으로 리다이렉트하는 Route Handler
 * - 쿼리 파라미터를 유지하면서 리다이렉트
 * - next.js redirect() 함수는 쿼리 파라미터를 손실하므로, 307 리다이렉트를 사용
 */

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.error("[Redirect Handler] 초대 코드 누락");
    return new Response("초대 코드가 필요합니다.", { status: 400 });
  }

  console.log("[Redirect Handler] 초대 코드로부터 리다이렉트 시작:", code);

  // 307 Temporary Redirect를 사용하여 쿼리 파라미터를 유지하면서 리다이렉트
  const redirectUrl = `/auth/login?redirect_to=${encodeURIComponent(`/join/${code}`)}`;
  console.log("[Redirect Handler] 최종 리다이렉트 URL:", redirectUrl);

  return new Response(null, {
    status: 307,
    headers: {
      Location: redirectUrl,
    },
  });
}
