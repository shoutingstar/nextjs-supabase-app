/**
 * 이벤트 상세 페이지 (/protected/events/[eventId])
 * Phase 2: 더미 데이터(MOCK_EVENTS, MOCK_PARTICIPANTS) 사용
 * Phase 3에서 Supabase 쿼리로 교체 예정
 */

import { Calendar, MapPin, Pencil, Trash2, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyInviteButton } from "@/components/events/copy-invite-button";
import { ParticipantCard } from "@/components/participants/participant-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_CURRENT_USER,
  MOCK_EVENTS,
  MOCK_PARTICIPANTS,
} from "@/lib/data/mock-data";
import type { EventStatus } from "@/lib/types/event";

/* ============================================================================
 * 메타데이터 생성
 * ============================================================================ */

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = MOCK_EVENTS.find((e) => e.id === eventId);

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
    case "published":
      return { variant: "default", label: "공개" };
    case "draft":
      return { variant: "secondary", label: "초안" };
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
}: EventDetailPageProps) {
  const { eventId } = await params;

  // 더미 데이터에서 이벤트 조회
  const event = MOCK_EVENTS.find((e) => e.id === eventId);
  if (!event) notFound();

  // 참여자 목록 (더미 데이터 사용, 최대 15명)
  const participants = MOCK_PARTICIPANTS.slice(0, 15);

  // 현재 사용자가 호스트인지 확인
  const isHost = event.host_id === MOCK_CURRENT_USER.id;

  const statusBadge = getStatusBadgeProps(event.status);

  // 시작일 포맷
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

  // 더미 초대 코드 (실제로는 event.invite_code 사용)
  const inviteCode =
    event.invite_code ?? `GATHER-${event.id.slice(0, 8).toUpperCase()}`;

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
        <p className="text-muted-foreground text-sm">주최: {event.host.name}</p>
      </div>

      {/* 커버 이미지 */}
      {event.cover_image && (
        <div className="bg-muted relative aspect-video min-h-64 w-full overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.cover_image}
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

          {/* 참여 인원 */}
          <div className="flex items-start gap-3 text-sm">
            <Users className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <p>
              {event.participant_count}명 참여
              {event.max_participants && ` / 최대 ${event.max_participants}명`}
            </p>
          </div>
        </div>

        {/* 이벤트 설명 */}
        {event.description && (
          <div className="mt-4 border-t pt-4">
            <p className="text-muted-foreground text-sm">{event.description}</p>
          </div>
        )}
      </div>

      {/* 참여자 목록 */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">
            참여자 목록
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              ({participants.length}명)
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {participants.map((participant, index) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              variant="compact"
              isHost={index === 0}
            />
          ))}
        </div>
      </section>

      {/* 액션 버튼 영역 */}
      <div className="flex flex-col gap-3 pb-4">
        {/* 초대 링크 복사 */}
        <CopyInviteButton eventId={eventId} inviteCode={inviteCode} />

        {/* 호스트 전용: 수정/삭제 버튼 */}
        {isHost && (
          <>
            <Button variant="outline" className="w-full" asChild>
              <Link
                href={`/protected/events/${eventId}/edit`}
                className="flex items-center justify-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                이벤트 수정
              </Link>
            </Button>
            <Button variant="destructive" className="w-full" asChild>
              <Link
                href={`/protected/events/${eventId}/edit`}
                className="flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                이벤트 삭제
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
