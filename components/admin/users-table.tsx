"use client";

/**
 * 사용자 관리 테이블 (F014)
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
import type { AdminUserRow } from "@/lib/queries/admin";

import { AdminChangeRoleSelect } from "./admin-change-role-select";

const ROLE_VARIANTS: Record<
  AdminUserRow["role"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  user: "secondary",
  moderator: "outline",
  admin: "destructive",
};

const ROLE_LABELS: Record<AdminUserRow["role"], string> = {
  user: "사용자",
  moderator: "운영진",
  admin: "관리자",
};

interface UsersTableProps {
  users: AdminUserRow[];
  currentUserId?: string;
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
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
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>역할</TableHead>
            <TableHead>가입일</TableHead>
            <TableHead className="text-right">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {user.email}
              </TableCell>
              <TableCell>
                <Badge variant={ROLE_VARIANTS[user.role]}>
                  {ROLE_LABELS[user.role]}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(user.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <AdminChangeRoleSelect
                  userId={user.id}
                  currentRole={user.role}
                  isCurrentUser={user.id === currentUserId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
