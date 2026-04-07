"use client";

/**
 * 이벤트 관리 테이블 (F013)
 * 실제 데이터베이스 연동 - props로 데이터 수신
 */

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminEventRow } from "@/lib/queries/admin";

import { AdminDeleteEventButton } from "./admin-delete-event-button";

const STATUS_VARIANTS: Record<
  AdminEventRow["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  draft: "secondary",
  completed: "outline",
  cancelled: "destructive",
};

const STATUS_LABELS: Record<AdminEventRow["status"], string> = {
  active: "활성",
  draft: "예정",
  completed: "완료",
  cancelled: "취소",
};

interface EventsTableProps {
  events: AdminEventRow[];
}

export function EventsTable({ events }: EventsTableProps) {
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
          {events.map((event) => (
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
                <AdminDeleteEventButton eventId={event.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
