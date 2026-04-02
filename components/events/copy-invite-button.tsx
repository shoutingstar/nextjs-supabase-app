"use client";

/**
 * 초대 링크 복사 버튼 (클라이언트 컴포넌트)
 * 초대 코드를 클립보드에 복사하고 토스트 메시지 표시
 */

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CopyInviteButtonProps {
  /** 이벤트 ID (초대 링크 생성용) */
  eventId: string;
  /** 초대 코드 (표시용) */
  inviteCode: string;
  /** 초대 링크 전체 URL (선택사항) */
  fullUrl?: string;
}

export function CopyInviteButton({
  eventId: _eventId,
  inviteCode,
  fullUrl,
}: CopyInviteButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // 복사할 텍스트: fullUrl이 있으면 전체 URL, 없으면 초대 코드만
      const textToCopy = fullUrl || inviteCode;

      // 클립보드에 복사
      await navigator.clipboard.writeText(textToCopy);

      // 성공 피드백
      setIsCopied(true);
      toast.success("초대 링크가 복사되었습니다! 👋", {
        description: `친구들에게 공유하세요!`,
      });

      // 2초 후 아이콘 복원
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
      toast.error("복사에 실패했습니다.", {
        description: "다시 시도해주세요.",
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-center gap-2"
      onClick={handleCopy}
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4" />
          복사됨
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          초대 링크 복사
        </>
      )}
    </Button>
  );
}
