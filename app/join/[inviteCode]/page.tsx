/**
 * 초대 링크를 통한 이벤트 참여 페이지
 * /join/[inviteCode] - 미인증 사용자도 접근 가능
 * Phase 2: 더미 데이터(MOCK_EVENTS) 기반 UI
 * Phase 3에서 실제 참여 로직 및 로그인 리다이렉트 추가 예정
 */

import { Calendar, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MOCK_EVENTS } from "@/lib/data/mock-data";

interface JoinPageProps {
  params: Promise<{ inviteCode: string }>;
}

export async function generateMetadata({
  params,
}: JoinPageProps): Promise<Metadata> {
  const { inviteCode } = await params;
  const event = MOCK_EVENTS.find((e) => e.invite_code === inviteCode);

  if (!event) {
    return { title: "이벤트를 찾을 수 없습니다 | Gather" };
  }

  return {
    title: `${event.title}에 초대되었습니다 | Gather`,
    description: `${event.title} 이벤트에 참여하세요. ${event.location}에서 열립니다.`,
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { inviteCode } = await params;

  // 초대 코드로 이벤트 찾기
  const event = MOCK_EVENTS.find((e) => e.invite_code === inviteCode);

  if (!event) {
    notFound();
  }

  // 날짜/시간 포맷팅
  const startDate = new Date(event.start_date);
  const formattedDate = startDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const formattedTime = startDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      {/* 상단 헤더 */}
      <div className="bg-white px-4 py-6 shadow-sm dark:bg-slate-950">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-lg font-bold">이벤트 초대</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            친구가 초대한 이벤트에 참여하세요
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        {/* 커버 이미지 */}
        {event.cover_image && (
          <div className="relative aspect-video min-h-48 w-full overflow-hidden rounded-lg bg-muted shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.cover_image}
              alt={`${event.title} 커버 이미지`}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* 이벤트 정보 카드 */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          {/* 제목 */}
          <h2 className="text-2xl font-bold leading-tight">{event.title}</h2>

          {/* 주최자 정보 */}
          <p className="mt-3 text-sm text-muted-foreground">
            주최자:{" "}
            <span className="font-medium text-foreground">
              {event.host.name}
            </span>
          </p>

          {/* 설명 */}
          {event.description && (
            <p className="mt-4 text-sm text-muted-foreground">
              {event.description}
            </p>
          )}

          {/* 이벤트 상세 정보 */}
          <div className="mt-6 space-y-3 border-t pt-6">
            {/* 날짜/시간 */}
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">{formattedDate}</p>
                <p className="text-sm text-muted-foreground">{formattedTime}</p>
              </div>
            </div>

            {/* 장소 */}
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="font-medium">{event.location}</p>
              </div>
            )}

            {/* 참여자 정보 */}
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">
                  {event.participant_count}명 참여 중
                  {event.max_participants &&
                    ` / 최대 ${event.max_participants}명`}
                </p>
                <p className="text-sm text-muted-foreground">현재 참여자 수</p>
              </div>
            </div>
          </div>
        </div>

        {/* 참여 액션 */}
        <div className="space-y-3">
          {/* 참여하기 버튼 - Phase 3에서 실제 참여 로직 추가 */}
          <Button size="lg" className="w-full" asChild>
            <Link href="/auth/login">로그인하고 참여하기</Link>
          </Button>

          {/* 하단 안내 텍스트 */}
          <p className="text-center text-xs text-muted-foreground">
            아직 계정이 없으신가요?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-primary hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>

        {/* 하단 여백 (모바일 네비게이션 대응) */}
        <div className="h-8" />
      </div>
    </div>
  );
}
