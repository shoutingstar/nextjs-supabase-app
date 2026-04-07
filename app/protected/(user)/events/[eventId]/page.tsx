/**
 * 이벤트 상세 페이지 (/protected/events/[eventId])
 * Supabase DB에서 실제 데이터를 조회합니다.
 */

import { Calendar, MapPin, Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyInviteButton } from "@/components/events/copy-invite-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventDetail } from "@/lib/queries/events";
import { createClient } from "@/lib/supabase/server";
import type { EventStatus } from "@/lib/types/event";

import { JoinEventButton } from "./_components/join-event-button";
import { ParticipantsCountDisplay } from "./_components/participants-count-display";
import { ParticipantsList } from "./_components/participants-list";

/* ============================================================================
 * 메타데이터 생성
 * ============================================================================ */

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEventDetail(eventId);

  if (!event) {
    return { title: "이벤트를 찾을 수 없습니다 | Gather" };
  }

  return {
    title: `${event.title} | Gather`,
    description: event.description ?? `${event.title} 이벤트에 참여하세요.`,
  };
}

/* ============================================================================
 * 상태 배지 헬퍼
 * ============================================================================ */

function getStatusBadgeProps(status: EventStatus): {
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
} {
  switch (status) {
    case "active":
      return { variant: "default", label: "활성" };
    case "draft":
      return { variant: "secondary", label: "예정" };
    case "cancelled":
      return { variant: "destructive", label: "취소됨" };
    case "completed":
      return { variant: "outline", label: "완료됨" };
  }
}

/* ============================================================================
 * 이벤트 상세 페이지 (서버 컴포넌트)
 * ============================================================================ */

export default async function EventDetailPage({
  params,
  searchParams,
}: EventDetailPageProps) {
  const { eventId } = await params;
  const sp = await searchParams;

  // 현재 로그인 사용자 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // DB에서 이벤트 상세 조회 (상태 자동 계산 포함)
  const event = await getEventDetail(eventId);
  if (!event) notFound();

  // 현재 사용자가 호스트인지 확인
  const isHost = user?.id === event.host_id;

  // 현재 사용자의 참여 여부 확인
  let isParticipating = false;
  if (user && !isHost) {
    const { data: participation } = await supabase
      .from("event_participants")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .single();

    isParticipating = !!participation;
  }

  const statusBadge = getStatusBadgeProps(event.status);

  // 시작일 포맷
  const startDate = new Date(event.event_date);
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

  // 초대 링크 URL
  // NEXT_PUBLIC_APP_URL 환경 변수가 필수입니다:
  // - 개발: http://localhost:3000
  // - 배포: https://your-actual-domain.com
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.warn(
      "[Warning] NEXT_PUBLIC_APP_URL이 설정되지 않았습니다. .env.local 파일을 확인하세요.",
    );
  }
  const inviteUrl = `${appUrl || "http://localhost:3000"}/join/${event.invite_code}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-24">
      {/* 뒤로가기 */}
      <Link
        href="/protected/events"
        className="text-muted-foreground hover:text-foreground inline-block text-sm transition-colors"
      >
        ← 이벤트 목록
      </Link>

      {/* 헤더: 제목 + 상태 배지 */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold leading-tight">{event.title}</h1>
          <Badge variant={statusBadge.variant} className="shrink-0">
            {statusBadge.label}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          주최: {event.host.full_name ?? "알 수 없음"}
        </p>
      </div>

      {/* 커버 이미지 */}
      {event.cover_image_url && (
        <div className="bg-muted relative aspect-video min-h-64 w-full overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.cover_image_url}
            alt={`${event.title} 커버 이미지`}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* 이벤트 정보 카드 */}
      <div className="bg-card rounded-lg border p-5 shadow-sm">
        <h2 className="mb-4 font-semibold">이벤트 정보</h2>
        <div className="space-y-3">
          {/* 날짜/시간 */}
          <div className="flex items-start gap-3 text-sm">
            <Calendar className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{formattedDate}</p>
              <p className="text-muted-foreground">{formattedTime}</p>
            </div>
          </div>

          {/* 장소 */}
          {event.location && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <p>{event.location}</p>
            </div>
          )}

          {/* 참여 인원 (Realtime 업데이트) */}
          <ParticipantsCountDisplay
            eventId={eventId}
            initialCount={event.participants_count}
            maxParticipants={event.max_participants}
          />
        </div>

        {/* 이벤트 설명 */}
        {event.description && (
          <div className="mt-4 border-t pt-4">
            <p className="text-muted-foreground text-sm">{event.description}</p>
          </div>
        )}
      </div>

      {/* 초대 코드 표시 */}
      <div className="bg-muted/50 rounded-lg border p-4">
        <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wider">
          초대 코드
        </p>
        <p className="font-mono text-lg font-semibold tracking-widest">
          {event.invite_code}
        </p>
      </div>

      {/* 액션 버튼 영역 */}
      <div className="flex flex-col gap-3 pb-4">
        {/* 초대 링크 복사 */}
        <CopyInviteButton
          eventId={eventId}
          inviteCode={event.invite_code}
          fullUrl={inviteUrl}
        />

        {/* 참여자 상태별 버튼 */}
        <JoinEventButton
          eventId={eventId}
          isHost={isHost}
          isParticipating={isParticipating}
          eventStatus={event.status}
        />

        {/* 호스트 전용: 수정 버튼 */}
        {isHost && (
          <Button variant="outline" className="w-full" asChild>
            <Link
              href={`/protected/events/${eventId}/edit`}
              className="flex items-center justify-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              이벤트 수정
            </Link>
          </Button>
        )}
      </div>

      {/* 참여자 목록 */}
      <ParticipantsList eventId={eventId} />
    </div>
  );
}
