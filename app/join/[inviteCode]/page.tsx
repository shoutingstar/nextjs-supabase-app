import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JoinEventPreviewButton } from "@/app/join/[inviteCode]/_components/join-event-preview-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getEventByInviteCode } from "@/lib/queries/events";
import { createClient } from "@/lib/supabase/server";

interface JoinPageProps {
  params: Promise<{ inviteCode: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { inviteCode } = await params;

  console.log("[JOIN PAGE] 초대 링크 확인 페이지, inviteCode:", inviteCode);

  // Step 1: 초대 코드로 이벤트 정보 조회
  const event = await getEventByInviteCode(inviteCode);

  if (!event) {
    console.error("[JOIN PAGE] 이벤트를 찾을 수 없음, inviteCode:", inviteCode);
    notFound();
  }

  console.log("[JOIN PAGE] 이벤트 조회 성공:", event.title);

  // Step 2: 현재 로그인 사용자 확인
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  console.log("[JOIN PAGE] 인증 상태:", authUser ? authUser.email : "미인증");

  // Step 3: 로그인한 사용자의 경우 참여 여부 확인
  let isAlreadyParticipating = false;
  if (authUser) {
    const { data: participation } = await supabase
      .from("event_participants")
      .select("id")
      .eq("event_id", event.id)
      .eq("user_id", authUser.id)
      .single();

    isAlreadyParticipating = !!participation;
    console.log(
      "[JOIN PAGE] 참여 여부:",
      isAlreadyParticipating ? "이미 참여 중" : "미참여",
    );
  }

  // 이벤트 호스트인 경우 참여할 수 없음
  const isHost = authUser && event.host_id === authUser.id;

  // 포맷팅
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

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* 헤더 */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">이벤트 초대</h1>
          <p className="text-muted-foreground text-sm">
            다음 이벤트에 참여하시겠습니까?
          </p>
        </div>

        {/* 이벤트 카드 */}
        <Card className="overflow-hidden">
          {/* 커버 이미지 */}
          {event.cover_image_url && (
            <div className="bg-muted relative aspect-video w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.cover_image_url}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* 이벤트 정보 */}
          <div className="space-y-4 p-4">
            {/* 제목 */}
            <div>
              <h2 className="text-xl font-bold">{event.title}</h2>
              <p className="text-muted-foreground text-sm">
                주최: {event.host.full_name || "알 수 없음"}
              </p>
            </div>

            {/* 주요 정보 */}
            <div className="space-y-3 border-t pt-4">
              {/* 날짜/시간 */}
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                <div className="text-sm">
                  <p>{formattedDate}</p>
                  <p className="text-muted-foreground">{formattedTime}</p>
                </div>
              </div>

              {/* 장소 */}
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-sm">{event.location}</p>
                </div>
              )}

              {/* 참여자 수 */}
              <div className="flex items-start gap-3">
                <Users className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-sm">
                  {event.participants_count}명 참여
                  {event.max_participants &&
                    ` / 최대 ${event.max_participants}명`}
                </p>
              </div>
            </div>

            {/* 설명 */}
            {event.description && (
              <div className="border-t pt-4">
                <p className="text-muted-foreground text-sm">
                  {event.description}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          {/* 호스트인 경우 */}
          {isHost && (
            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
              <p className="text-center text-sm text-amber-900 dark:text-amber-100">
                이 이벤트의 주최자이므로 참여할 수 없습니다.
              </p>
            </div>
          )}

          {/* 미인증 사용자 */}
          {!authUser && (
            <>
              <p className="text-muted-foreground text-center text-sm">
                이벤트에 참여하려면 로그인이 필요합니다.
              </p>
              <Button className="w-full" asChild>
                <Link href={`/auth/login?redirect=/join/${inviteCode}`}>
                  로그인
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/auth/sign-up?next=/join/${inviteCode}`}>
                  회원가입
                </Link>
              </Button>
            </>
          )}

          {/* 이미 참여 중 */}
          {authUser && isAlreadyParticipating && (
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <p className="text-center text-sm text-green-900 dark:text-green-100">
                ✓ 이미 이 이벤트에 참여 중입니다.
              </p>
            </div>
          )}

          {/* 참여 가능 */}
          {authUser && !isAlreadyParticipating && !isHost && (
            <JoinEventPreviewButton
              eventId={event.id}
              inviteCode={inviteCode}
            />
          )}

          {/* 이벤트로 이동 버튼 (로그인 사용자) */}
          {authUser && (
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/protected/events/${event.id}`}>
                이벤트 자세히 보기
              </Link>
            </Button>
          )}

          {/* 돌아가기 (미인증) */}
          {!authUser && (
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/">돌아가기</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
