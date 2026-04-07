"use client";

/**
 * 이벤트 참여자 목록 컴포넌트
 * - 실시간 참여자 업데이트
 * - 참여자 프로필 표시
 */

import { Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface Participant {
  id: string;
  user_id: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
  rsvp: string;
  joined_at: string;
}

interface ParticipantsListProps {
  eventId: string;
}

export function ParticipantsList({ eventId }: ParticipantsListProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 초기 참여자 데이터 로드
    const loadParticipants = async () => {
      const { data, error } = await supabase
        .from("event_participants")
        .select(
          `
          id,
          user_id,
          rsvp,
          joined_at,
          user:profiles(id, full_name, avatar_url)
        `,
        )
        .eq("event_id", eventId)
        .order("joined_at", { ascending: false });

      if (!error && data) {
        setParticipants(data as Participant[]);
      }
      setLoading(false);
    };

    loadParticipants();

    // Realtime 구독
    const channel = supabase
      .channel(`event:${eventId}:participants-list`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_participants",
          filter: `event_id=eq.${eventId}`,
        },
        async () => {
          // 목록 최신화
          await loadParticipants();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [eventId]);

  if (loading) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-sm">로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="mb-4 flex items-center gap-2 font-semibold">
        <Users className="h-4 w-4" />
        참여자 ({participants.length}명)
      </h3>

      {participants.length === 0 ? (
        <p className="text-muted-foreground text-sm">아직 참여자가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center gap-3">
              {/* 프로필 이미지 */}
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-400">
                {participant.user?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={participant.user.avatar_url}
                    alt={participant.user?.full_name || "참여자"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                    {participant.user?.full_name?.charAt(0) || "?"}
                  </div>
                )}
              </div>

              {/* 참여자 정보 */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {participant.user?.full_name || "알 수 없는 사용자"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {participant.rsvp === "attending"
                    ? "✓ 참석"
                    : participant.rsvp === "not_attending"
                      ? "✗ 불참"
                      : "? 미응답"}
                </p>
              </div>

              {/* 참여 날짜 */}
              <div className="text-muted-foreground whitespace-nowrap text-xs">
                {new Date(participant.joined_at).toLocaleDateString("ko-KR")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
