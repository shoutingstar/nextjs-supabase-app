/**
 * 대시보드 페이지 (/protected)
 * 서버 컴포넌트: 메타데이터 선언
 * DashboardContent: 클라이언트 컴포넌트로 new Date() 처리
 */

import type { Metadata } from "next";

import { DashboardContent } from "./_components/dashboard-content";

export const metadata: Metadata = {
  title: "대시보드 | Gather",
  description: "이벤트 현황을 한눈에 확인하세요.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
