"use client";

/**
 * 참여자 수 실시간 표시 컴포넌트
 * - 초기 참여자 수로 시작
 * - Realtime으로 실시간 업데이트
 */

import { Users } from "lucide-react";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

interface ParticipantsCountDisplayProps {
  eventId: string;
  initialCount: number;
  maxParticipants: number | null;
}

export function ParticipantsCountDisplay({
  eventId,
  initialCount,
  maxParticipants,
}: ParticipantsCountDisplayProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();

    // Realtime 구독 설정
    const channel = supabase
      .channel(`event:${eventId}:participants`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_participants",
          filter: `event_id=eq.${eventId}`,
        },
        async () => {
          // 참여자 수 최신화
          const { count: newCount } = await supabase
            .from("event_participants")
            .select("id", { count: "exact", head: true })
            .eq("event_id", eventId);

          if (newCount !== null) {
            setCount(newCount);
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [eventId]);

  return (
    <div className="flex items-start gap-3 text-sm">
      <Users className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
      <p>
        {count}명 참여
        {maxParticipants && ` / 최대 ${maxParticipants}명`}
      </p>
    </div>
  );
}
