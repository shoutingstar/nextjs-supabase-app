"use client";

/**
 * 이벤트 생성 폼 컴포넌트
 * React Hook Form + Zod 검증 사용
 * Phase 2: 더미 데이터 처리만 수행 (API 미연동)
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
  type CreateEventFormValues,
  createEventSchema,
} from "@/lib/validators/event-schema";

/* ============================================================================
 * CreateEventForm Props
 * ============================================================================ */

interface CreateEventFormProps {
  /**
   * 폼 제출 성공 후 리다이렉트 경로
   * @default "/protected/events"
   */
  redirectTo?: string;
}

/* ============================================================================
 * CreateEventForm 컴포넌트
 * ============================================================================ */

/**
 * 이벤트 생성 폼 컴포넌트
 *
 * 필드:
 * - title: 이벤트 제목 (필수)
 * - start_date: 시작 날짜/시간 (필수)
 * - location: 장소 (선택)
 * - max_participants: 최대 참여 인원 (선택)
 * - description: 설명 (선택)
 * - cover_image: 커버 이미지 (선택)
 */
export function CreateEventForm({
  redirectTo = "/protected/events",
}: CreateEventFormProps) {
  const router = useRouter();
  // 라우터 전환 중 로딩 상태 관리
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      start_date: "",
      location: "",
      max_participants: undefined,
      description: "",
      cover_image: undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting || isPending;

  /* ------------------------------------------------------------------
   * 폼 제출 핸들러
   * Phase 2: 콘솔 로그 + toast 메시지만 처리
   * Phase 3: Supabase INSERT 연동 예정
   * ------------------------------------------------------------------ */
  async function onSubmit(values: CreateEventFormValues) {
    // Phase 2: 더미 처리 (API 호출 없음)
    console.log("이벤트 생성 데이터:", values);

    // 실제 제출 시뮬레이션 (300ms 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 300));

    toast.success("이벤트가 생성되었습니다!", {
      description: `"${values.title}" 이벤트가 만들어졌습니다.`,
    });

    startTransition(() => {
      router.push(redirectTo);
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
                  // number input은 빈 값을 빈 문자열로 반환하므로 undefined 변환
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
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    // FileList에서 첫 번째 파일만 사용
                    const file = e.target.files?.[0];
                    onChange(file ?? undefined);
                  }}
                  {...fieldProps}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>JPG, PNG, WebP 등 이미지 파일</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 폼 액션 버튼 */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "생성 중..." : "이벤트 만들기"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
