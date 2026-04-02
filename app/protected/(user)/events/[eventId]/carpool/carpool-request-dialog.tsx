"use client";

import { useState } from "react";

import { requestCarpool } from "@/app/protected/events/[eventId]/carpool/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CarpoolRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carpoolSlotId: string;
  eventId: string;
}

export function CarpoolRequestDialog({
  open,
  onOpenChange,
  carpoolSlotId,
  eventId,
}: CarpoolRequestDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await requestCarpool(carpoolSlotId, eventId, message || undefined);
      onOpenChange(false);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "동승 신청에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>동승 신청</DialogTitle>
          <DialogDescription>
            드라이버에게 동승 신청을 보냅니다. 기타 사항이 있으면 메모를
            남겨주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">메모 (선택)</Label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="예: 짐이 많아요, 음악 좋아합니다..."
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "신청 중..." : "신청하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
