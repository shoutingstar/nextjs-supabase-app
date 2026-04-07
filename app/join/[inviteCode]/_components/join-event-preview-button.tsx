"use client";

/**
 * 초대 링크 페이지의 참여 버튼 컴포넌트
 * - 사용자가 명시적으로 버튼을 클릭하여 참여
 * - 성공 후 이벤트 상세 페이지로 리다이렉트
 */

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { joinEventAction } from "@/app/protected/(user)/events/actions";
import { Button } from "@/components/ui/button";

interface JoinEventPreviewButtonProps {
  eventId: string;
  inviteCode: string;
}

export function JoinEventPreviewButton({
  eventId,
  inviteCode,
}: JoinEventPreviewButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleJoin = () => {
    startTransition(async () => {
      console.log(
        "[JOIN PREVIEW] 참여 버튼 클릭, eventId:",
        eventId,
        "inviteCode:",
        inviteCode,
      );

      const result = await joinEventAction(eventId);

      if (!result.success) {
        console.error("[JOIN PREVIEW] 참여 실패:", result.error);
        alert(result.error || "이벤트 참여에 실패했습니다.");
        return;
      }

      console.log("[JOIN PREVIEW] 참여 성공, 이벤트 페이지로 리다이렉트");

      // 이벤트 상세 페이지로 리다이렉트
      router.push(`/protected/events/${eventId}`);
      router.refresh();
    });
  };

  return (
    <Button onClick={handleJoin} disabled={isPending} className="w-full">
      {isPending ? "참여 중..." : "이벤트에 참여하기"}
    </Button>
  );
}
