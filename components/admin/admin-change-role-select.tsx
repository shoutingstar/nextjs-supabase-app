"use client";

/**
 * 사용자 역할 변경 select (관리자)
 * - 드롭다운에서 역할 선택
 * - 선택 시 adminChangeRoleAction 호출
 */

import { useTransition } from "react";

import { adminChangeRoleAction } from "@/app/protected/(admin)/admin/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminChangeRoleSelectProps {
  userId: string;
  currentRole: "admin" | "moderator" | "user";
  isCurrentUser: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  user: "사용자",
  moderator: "운영진",
  admin: "관리자",
};

export function AdminChangeRoleSelect({
  userId,
  currentRole,
  isCurrentUser,
}: AdminChangeRoleSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (newRole: string) => {
    if (newRole === currentRole) return;

    // 자신의 관리자 권한을 제거하려는 경우 경고
    if (isCurrentUser && currentRole === "admin" && newRole !== "admin") {
      const confirmed = window.confirm(
        "자신의 관리자 권한을 제거하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      );
      if (!confirmed) return;
    }

    startTransition(async () => {
      const result = await adminChangeRoleAction(
        userId,
        newRole as "admin" | "moderator" | "user",
      );

      if (result.success) {
        alert("역할이 변경되었습니다.");
      } else {
        alert(result.error || "역할 변경에 실패했습니다.");
      }
    });
  };

  return (
    <Select
      value={currentRole}
      onValueChange={handleRoleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">{ROLE_LABELS.user}</SelectItem>
        <SelectItem value="moderator">{ROLE_LABELS.moderator}</SelectItem>
        <SelectItem value="admin">{ROLE_LABELS.admin}</SelectItem>
      </SelectContent>
    </Select>
  );
}
