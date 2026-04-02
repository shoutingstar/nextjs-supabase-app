"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createCarpoolSlot } from "@/app/protected/events/[eventId]/carpool/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewCarpoolPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setEventId(p.eventId));
  }, [params]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      await createCarpoolSlot(eventId, formData);
      router.push(`/protected/events/${eventId}/carpool`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "카풀 등록에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">드라이버 등록</h2>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="departure_location">출발 장소 *</Label>
            <Input
              id="departure_location"
              name="departure_location"
              placeholder="예: 서울역"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departure_time">출발 시간 *</Label>
            <Input
              id="departure_time"
              name="departure_time"
              type="datetime-local"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_seats">총 좌석 수 (1~10) *</Label>
            <Input
              id="total_seats"
              name="total_seats"
              type="number"
              min="1"
              max="10"
              placeholder="예: 4"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">특이사항 (선택)</Label>
            <textarea
              id="note"
              name="note"
              placeholder="음식물 반입 금지, 조용한 차량 등..."
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "등록 중..." : "드라이버 등록"}
            </Button>
            <Link href={`/protected/events/${eventId}/carpool`}>
              <Button type="button" variant="outline">
                취소
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
