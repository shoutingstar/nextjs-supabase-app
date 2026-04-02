"use client";

/**
 * 이벤트 수정 폼 컴포넌트
 * CreateEventForm 기반으로 확장 (기존 데이터 미리 채우기 + status 필드)
 * Phase 2: 더미 데이터 처리만 수행 (API 미연동)
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventDetail } from "@/lib/types/event";
import {
  type UpdateEventFormValues,
  updateEventSchema,
} from "@/lib/validators/event-schema";

/* ============================================================================
 * 상태 레이블 매핑
 * ============================================================================ */

const STATUS_OPTIONS = [
  { value: "draft", label: "초안" },
  { value: "published", label: "공개" },
  { value: "cancelled", label: "취소됨" },
  { value: "completed", label: "완료됨" },
] as const;

/* ============================================================================
 * datetime-local 형식 변환 헬퍼
 * ============================================================================ */

/**
 * ISO 8601 날짜 문자열을 datetime-local input 형식으로 변환합니다.
 * @example "2024-03-15T14:30:00" → "2024-03-15T14:30"
 */
function toDatetimeLocalValue(isoString: string): string {
  if (!isoString) return "";
  // 초 이하 제거: "YYYY-MM-DDTHH:mm" 형식으로 변환
  return isoString.slice(0, 16);
}

/* ============================================================================
 * UpdateEventForm Props
 * ============================================================================ */

interface UpdateEventFormProps {
  /** 수정할 이벤트 데이터 */
  event: EventDetail;
  /**
   * 폼 제출 성공 후 리다이렉트 경로
   * @default `/protected/events/${event.id}`
   */
  redirectTo?: string;
}

/* ============================================================================
 * UpdateEventForm 컴포넌트
 * ============================================================================ */

/**
 * 이벤트 수정 폼 컴포넌트
 *
 * CreateEventForm에서 다음 기능이 추가됩니다:
 * - event prop으로 기존 데이터 미리 채우기 (defaultValues)
 * - status 필드 (draft/published/cancelled/completed)
 * - 삭제 버튼 + 확인 모달
 */
export function UpdateEventForm({ event, redirectTo }: UpdateEventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // 삭제 확인 다이얼로그 open 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // 삭제 처리 중 상태
  const [isDeleting, setIsDeleting] = useState(false);

  // 리다이렉트 경로: 미지정 시 상세 페이지로
  const successRedirect = redirectTo ?? `/protected/events/${event.id}`;

  const form = useForm<UpdateEventFormValues>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: event.title,
      start_date: toDatetimeLocalValue(event.start_date),
      location: event.location ?? "",
      max_participants: event.max_participants ?? undefined,
      description: event.description ?? "",
      cover_image: undefined,
      status: event.status,
    },
  });

  const isSubmitting = form.formState.isSubmitting || isPending;

  /* ------------------------------------------------------------------
   * 폼 제출 핸들러
   * Phase 2: 콘솔 로그 + toast 메시지만 처리
   * Phase 3: Supabase PATCH 연동 예정
   * ------------------------------------------------------------------ */
  async function onSubmit(values: UpdateEventFormValues) {
    console.log("이벤트 수정 데이터:", { id: event.id, ...values });

    // 실제 제출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));

    toast.success("이벤트가 수정되었습니다!", {
      description: `"${values.title ?? event.title}" 이벤트가 업데이트되었습니다.`,
    });

    startTransition(() => {
      router.push(successRedirect);
      router.refresh();
    });
  }

  /* ------------------------------------------------------------------
   * 삭제 핸들러
   * Phase 2: 콘솔 로그 + toast 메시지만 처리
   * Phase 3: Supabase DELETE 연동 예정
   * ------------------------------------------------------------------ */
  async function handleDelete() {
    setIsDeleting(true);
    console.log("이벤트 삭제:", event.id);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setIsDeleting(false);
    setDeleteDialogOpen(false);

    toast.success("이벤트가 삭제되었습니다", {
      description: `"${event.title}" 이벤트가 삭제되었습니다.`,
    });

    startTransition(() => {
      router.push("/protected/events");
      router.refresh();
    });
  }

  /* ------------------------------------------------------------------
   * 취소 핸들러
   * ------------------------------------------------------------------ */
  function handleCancel() {
    router.back();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 이벤트 제목 (필수) */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                이벤트 제목 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 팀 회식, 스터디 모임, 생일 파티..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 이벤트 상태 */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이벤트 상태</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="상태를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 날짜 및 시간 (필수) */}
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                날짜 및 시간 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 장소 (선택) */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>장소</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 서울 강남구 테헤란로 123..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 최대 참여 인원 (선택) */}
        <FormField
          control={form.control}
          name="max_participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>최대 참여 인원</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="제한 없음"
                  min={1}
                  max={10000}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? undefined : val);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>비워두면 인원 제한이 없습니다</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 이벤트 설명 (선택) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="이벤트에 대한 설명을 입력하세요..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 커버 이미지 (선택) */}
        <FormField
          control={form.control}
          name="cover_image"
          render={({ field: { onChange, value: _value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>커버 이미지</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file ?? undefined);
                  }}
                  {...fieldProps}
                  disabled={isSubmitting}
                />
              </FormControl>
              {event.cover_image && (
                <FormDescription>
                  현재 이미지가 있습니다. 새 파일을 선택하면 교체됩니다.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 폼 액션 버튼 */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {/* 삭제 버튼 + 확인 다이얼로그 */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                disabled={isSubmitting || isDeleting}
              >
                이벤트 삭제
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>이벤트를 삭제하시겠습니까?</DialogTitle>
                <DialogDescription>
                  &quot;{event.title}&quot; 이벤트가 영구적으로 삭제됩니다.
                  참여자 정보도 함께 삭제되며 이 작업은 되돌릴 수 없습니다.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  취소
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "삭제 중..." : "삭제 확인"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 우측: 취소 + 저장 버튼 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
