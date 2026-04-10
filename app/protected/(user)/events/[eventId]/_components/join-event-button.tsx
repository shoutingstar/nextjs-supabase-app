"use client";

/**
 * 이벤트 참여 버튼 컴포넌트
 * - 사용자가 명시적으로 버튼을 클릭하여 참여
 * - useTransition으로 로딩 상태 관리
 * - 참여 성공 후 페이지 새로고침으로 즉시 UI 업데이트
 */

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { joinEventAction } from "@/app/protected/(user)/events/actions";
import { Button } from "@/components/ui/button";

interface JoinEventButtonProps {
  eventId: string;
  isHost: boolean;
  isParticipating: boolean;
  eventStatus: string;
}

export function JoinEventButton({
  eventId,
  isHost,
  isParticipating,
  eventStatus,
}: JoinEventButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // 참여 가능 여부
  const canJoin =
    !isHost &&
    !isParticipating &&
    eventStatus !== "cancelled" &&
    eventStatus !== "completed";

  const handleJoin = () => {
    startTransition(async () => {
      const result = await joinEventAction(eventId);
      if (!result.success) {
        alert(result.error || "이벤트 참여에 실패했습니다.");
      } else {
        // 성공 시 페이지 새로고침 (참여자 수 등 UI 즉시 업데이트)
        router.refresh();
      }
    });
  };

  // 호스트는 버튼 표시 안 함 (edit 버튼이 있음)
  if (isHost) {
    return null;
  }

  // 이미 참여 중: 버튼 표시 안 함
  if (isParticipating) {
    return null;
  }

  // 취소/완료된 이벤트
  if (!canJoin) {
    return (
      <Button variant="outline" className="w-full" disabled>
        {eventStatus === "cancelled" ? "취소된 이벤트" : "완료된 이벤트"}
      </Button>
    );
  }

  // 참여 가능: 버튼 표시
  return (
    <Button onClick={handleJoin} disabled={isPending} className="w-full">
      {isPending ? "참여 중..." : "이벤트 참여하기"}
    </Button>
  );
}
