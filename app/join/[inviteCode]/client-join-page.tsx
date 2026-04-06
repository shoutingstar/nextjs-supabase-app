"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database.types";

interface ClientJoinPageProps {
  inviteCode: string;
  initialUser: { id: string; email?: string } | null;
}

export function ClientJoinPage({
  inviteCode,
  initialUser,
}: ClientJoinPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<
    Database["public"]["Tables"]["events"]["Row"] | null
  >(null);
  const [host, setHost] = useState<{
    id: string;
    full_name: string | null;
  } | null>(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [isAlreadyParticipating, setIsAlreadyParticipating] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const supabase = createClient();

        // 1. 사용자 인증 상태 확인
        const {
          data: { user },
        } = await supabase.auth.getUser();

        console.log(
          "[CLIENT JOIN] 사용자 인증 상태:",
          user ? `${user.email}` : "미인증",
        );

        // 미인증 사용자인 경우
        if (!user) {
          console.log(
            "[CLIENT JOIN] 미인증 사용자 감지, localStorage에 inviteCode 저장",
          );
          // localStorage에 초대 코드 저장
          try {
            localStorage.setItem("pending_invite_code", inviteCode);
            console.log("[CLIENT JOIN] localStorage 저장 완료");
          } catch (e) {
            console.error("[CLIENT JOIN] localStorage 저장 실패:", e);
          }

          const redirectUrl = `/auth/login`;
          console.log("[CLIENT JOIN] 로그인 페이지로 리다이렉트:", redirectUrl);
          window.location.href = redirectUrl;
          return;
        }

        // 2. 이벤트 조회
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select(
            "id, title, description, event_date, location, host_id, status, invite_code, cover_image_url, max_participants, created_at, updated_at",
          )
          .eq("invite_code", inviteCode)
          .single();

        if (eventError || !eventData) {
          setError("이벤트를 찾을 수 없습니다.");
          setIsLoading(false);
          return;
        }

        setEvent(eventData);

        // 3. 호스트 확인
        const hostId = eventData.host_id;
        setIsHost(user.id === hostId);

        // 4. 호스트 정보 조회
        const { data: hostData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("id", hostId)
          .single();

        setHost(hostData);

        // 5. 참여자 수 조회
        const { count } = await supabase
          .from("event_participants")
          .select("id", { count: "exact", head: true })
          .eq("event_id", eventData.id);

        setParticipantsCount(count || 0);

        // 6. 현재 사용자의 참여 여부 확인
        if (!hostId || user.id !== hostId) {
          const { data: participation } = await supabase
            .from("event_participants")
            .select("id")
            .eq("event_id", eventData.id)
            .eq("user_id", user.id)
            .single();

          setIsAlreadyParticipating(!!participation);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("[CLIENT JOIN] 오류:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    };

    loadEventData();
  }, [inviteCode, router]);

  if (isLoading) {
    return (
      <div className="from-primary/5 min-h-screen bg-gradient-to-b to-transparent">
        <div className="bg-white px-4 py-6 shadow-sm dark:bg-slate-950">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-lg font-bold">이벤트 초대</h1>
          </div>
        </div>
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
          <p className="text-muted-foreground text-center">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="from-primary/5 min-h-screen bg-gradient-to-b to-transparent">
        <div className="bg-white px-4 py-6 shadow-sm dark:bg-slate-950">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-lg font-bold">이벤트 초대</h1>
          </div>
        </div>
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
            <h2 className="mb-2 text-xl font-bold text-red-900 dark:text-red-100">
              {error || "이벤트를 찾을 수 없습니다"}
            </h2>
            <p className="text-sm text-red-700 dark:text-red-300">
              초대 코드:{" "}
              <code className="rounded bg-red-100 px-2 py-1 text-sm dark:bg-red-900">
                {inviteCode}
              </code>
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 이벤트 상태 확인
  const isCancelled = event.status === "cancelled";
  const isCompleted = event.status === "completed";
  const canJoin =
    !isCancelled && !isCompleted && !isAlreadyParticipating && !isHost;

  // 날짜/시간 포맷팅
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
    <div className="from-primary/5 min-h-screen bg-gradient-to-b to-transparent">
      {/* 상단 헤더 */}
      <div className="bg-white px-4 py-6 shadow-sm dark:bg-slate-950">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-lg font-bold">이벤트 초대</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            친구가 초대한 이벤트에 참여하세요
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        {/* 커버 이미지 */}
        {event.cover_image_url && (
          <div className="bg-muted relative aspect-video min-h-48 w-full overflow-hidden rounded-lg shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.cover_image_url}
              alt={`${event.title} 커버 이미지`}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* 이벤트 정보 카드 */}
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          {/* 제목 */}
          <h2 className="text-2xl font-bold leading-tight">{event.title}</h2>

          {/* 주최자 정보 */}
          <p className="text-muted-foreground mt-3 text-sm">
            주최자:{" "}
            <span className="text-foreground font-medium">
              {host?.full_name ?? "알 수 없음"}
            </span>
          </p>

          {/* 설명 */}
          {event.description && (
            <p className="text-muted-foreground mt-4 text-sm">
              {event.description}
            </p>
          )}

          {/* 이벤트 상세 정보 */}
          <div className="mt-6 space-y-3 border-t pt-6">
            {/* 날짜/시간 */}
            <div className="flex items-start gap-3">
              <Calendar className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">{formattedDate}</p>
                <p className="text-muted-foreground text-sm">{formattedTime}</p>
              </div>
            </div>

            {/* 장소 */}
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <p className="font-medium">{event.location}</p>
              </div>
            )}

            {/* 참여자 정보 */}
            <div className="flex items-start gap-3">
              <Users className="text-primary mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">
                  {participantsCount}명 참여 중
                  {event.max_participants &&
                    ` / 최대 ${event.max_participants}명`}
                </p>
                <p className="text-muted-foreground text-sm">현재 참여자 수</p>
              </div>
            </div>
          </div>
        </div>

        {/* 참여 액션 */}
        <div className="space-y-3">
          {/* 취소된 이벤트 */}
          {isCancelled && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-center text-sm font-medium">
              이 이벤트는 취소되었습니다.
            </div>
          )}

          {/* 완료된 이벤트 */}
          {isCompleted && !isCancelled && (
            <div className="bg-muted rounded-lg p-4 text-center text-sm font-medium">
              이 이벤트는 이미 종료되었습니다.
            </div>
          )}

          {/* 호스트인 경우 */}
          {isHost && (
            <Button size="lg" className="w-full" asChild>
              <Link href={`/protected/events/${event.id}`}>내 이벤트 보기</Link>
            </Button>
          )}

          {/* 이미 참여 중 */}
          {isAlreadyParticipating && (
            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href={`/protected/events/${event.id}`}>
                이미 참여 중 - 이벤트 보기
              </Link>
            </Button>
          )}

          {/* 참여 가능한 경우 */}
          {canJoin && (
            <Button size="lg" className="w-full" asChild>
              <Link
                href={`/protected/events/${event.id}?join=true&code=${inviteCode}`}
              >
                이벤트 참여하기
              </Link>
            </Button>
          )}
        </div>

        {/* 하단 여백 (모바일 네비게이션 대응) */}
        <div className="h-8" />
      </div>
    </div>
  );
}
