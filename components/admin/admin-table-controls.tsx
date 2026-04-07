"use client";

/**
 * 관리자 테이블 검색/필터 컨트롤
 * - 검색 input
 * - 필터 select (상태/역할)
 * - URL 파라미터 기반 제어
 */

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminTableControlsProps {
  section: "events" | "users";
  currentSearch?: string;
  currentFilter?: string;
}

export function AdminTableControls({
  section,
  currentSearch = "",
  currentFilter = "all",
}: AdminTableControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const search = formData.get("q") as string;
    const filter = formData.get("filter") as string;

    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (filter && filter !== "all")
      params.set(section === "events" ? "status" : "role", filter);
    params.set("page", "1"); // 필터 변경 시 첫 페이지로

    router.push(`/protected/admin/${section}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
      {/* 검색 input */}
      <Input
        name="q"
        placeholder={
          section === "events" ? "이벤트 제목 검색..." : "사용자 이름 검색..."
        }
        defaultValue={currentSearch}
        className="w-64"
      />

      {/* 필터 select */}
      {section === "events" ? (
        <Select defaultValue={currentFilter} name="filter">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="draft">예정</SelectItem>
            <SelectItem value="active">활성</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
            <SelectItem value="cancelled">취소</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Select defaultValue={currentFilter} name="filter">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 역할</SelectItem>
            <SelectItem value="user">사용자</SelectItem>
            <SelectItem value="moderator">운영진</SelectItem>
            <SelectItem value="admin">관리자</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* 검색 버튼 */}
      <Button type="submit" variant="outline">
        검색
      </Button>
    </form>
  );
}
