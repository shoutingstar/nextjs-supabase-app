"use client";

/**
 * 이벤트 관리 테이블 (F013)
 * 더미 데이터 기반 테이블 표시
 * Phase 3에서 API 연동 예정
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_EVENTS } from "@/lib/data/mock-data";
import type { EventStatus } from "@/lib/types/event";

const STATUS_VARIANTS: Record<
  EventStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  published: "default",
  draft: "secondary",
  completed: "outline",
  cancelled: "destructive",
};

const STATUS_LABELS: Record<EventStatus, string> = {
  published: "공개",
  draft: "초안",
  completed: "완료",
  cancelled: "취소",
};

export function EventsTable() {
  // 정렬: 최근 생성일 순
  const sortedEvents = [...MOCK_EVENTS].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>주최자</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead className="text-right">참여자</TableHead>
            <TableHead className="text-right">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">
                <a
                  href={`/protected/events/${event.id}`}
                  className="text-primary hover:underline"
                >
                  {event.title}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANTS[event.status]}>
                  {STATUS_LABELS[event.status]}
                </Badge>
              </TableCell>
              <TableCell>{event.host.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(event.created_at)}
              </TableCell>
              <TableCell className="text-right text-sm">
                {event.participant_count}명
                {event.max_participants && `/${event.max_participants}명`}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
