"use client";

import { useState } from "react";

import {
  approveCarpoolRequest,
  rejectCarpoolRequest,
} from "@/app/protected/events/[eventId]/carpool/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CarpoolActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "approve" | "reject" | null;
  requestId: string;
  eventId: string;
  userName: string;
}

export function CarpoolActionsDialog({
  open,
  onOpenChange,
  action,
  requestId,
  eventId,
  userName,
}: CarpoolActionsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);

    try {
      if (action === "approve") {
        await approveCarpoolRequest(requestId, eventId);
      } else if (action === "reject") {
        await rejectCarpoolRequest(requestId, eventId);
      }
      onOpenChange(false);
    } catch (err) {
      console.error("동승 처리 실패:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const isApprove = action === "approve";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isApprove ? "동승 신청 승인" : "동승 신청 거절"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isApprove
              ? `${userName}의 동승 신청을 승인하시겠습니까?`
              : `${userName}의 동승 신청을 거절하시겠습니까?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              isApprove ? "" : "bg-destructive hover:bg-destructive/90"
            }
          >
            {isLoading ? "처리 중..." : isApprove ? "승인" : "거절"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
