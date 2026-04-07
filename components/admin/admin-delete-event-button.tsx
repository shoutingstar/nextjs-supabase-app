"use client";

/**
 * 이벤트 삭제 버튼 (관리자)
 * - 선택 시 confirm 다이얼로그 표시
 * - 승인 시 adminDeleteEventAction 호출
 */

import { useTransition } from "react";

import { adminDeleteEventAction } from "@/app/protected/(admin)/admin/actions";
import { Button } from "@/components/ui/button";

interface AdminDeleteEventButtonProps {
  eventId: string;
}

export function AdminDeleteEventButton({
  eventId,
}: AdminDeleteEventButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    // 확인 다이얼로그 (window.confirm 사용)
    const confirmed = window.confirm("정말 이 이벤트를 삭제하시겠습니까?");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await adminDeleteEventAction(eventId);

      if (result.success) {
        alert("이벤트가 삭제되었습니다.");
      } else {
        alert(result.error || "삭제에 실패했습니다.");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "삭제 중..." : "삭제"}
    </Button>
  );
}
