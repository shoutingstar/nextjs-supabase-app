"use client";

/**
 * 이벤트 생성 폼 컴포넌트
 * React Hook Form + Zod 검증 사용
 * Supabase Storage 이미지 업로드 + 이벤트 생성 Server Action 연동
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  createEventAction,
  updateEvent,
} from "@/app/protected/(user)/events/actions";
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
import { createClient } from "@/lib/supabase/client";
import { Toast } from "@/lib/utils/toast-utils";
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
 * 제출 순서:
 * 1. 이벤트 DB 레코드 생성 (invite_code 포함)
 * 2. 커버 이미지가 있으면 Storage 업로드 후 URL 업데이트
 * 3. 성공 시 이벤트 상세 페이지로 리다이렉트
 */
export function CreateEventForm({
  redirectTo: _redirectTo = "/protected/events",
}: CreateEventFormProps) {
  const router = useRouter();
  const supabase = createClient();
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
   * 1. 이벤트 생성 (createEventAction: Zod 서버 측 재검증 포함)
   * 2. 커버 이미지 업로드 (uploadEventCoverImage Server Action)
   * 3. 이미지 URL을 이벤트에 반영 (updateEvent)
   * ------------------------------------------------------------------ */
  async function onSubmit(values: CreateEventFormValues) {
    // 1단계: Zod 검증 포함 이벤트 생성 Action 호출
    // cover_image(File)는 Server Action으로 직렬화 불가 → 별도 업로드 단계로 처리
    const result = await createEventAction({
      title: values.title,
      start_date: values.start_date,
      location: values.location || undefined,
      max_participants: values.max_participants,
      description: values.description || undefined,
    });

    if (!result.success || !result.data) {
      // Zod 에러 포함 서버 에러 메시지 표시
      Toast.event.createError(result.error);
      return;
    }

    const { id: eventId, invite_code } = result.data;

    // 2단계: 커버 이미지 업로드 (파일이 있는 경우 - 클라이언트에서 직접 업로드)
    if (values.cover_image instanceof File && values.cover_image.size > 0) {
      try {
        // 파일 크기 재검증
        if (values.cover_image.size > 5 * 1024 * 1024) {
          throw new Error("파일 크기는 5MB 이하여야 합니다.");
        }

        // 클라이언트에서 Supabase Storage에 직접 업로드
        const ext = values.cover_image.type
          .split("/")[1]
          .replace("jpeg", "jpg");
        const timestamp = Date.now();
        const filePath = `events/${eventId}/cover-${timestamp}.${ext}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("event-covers")
          .upload(filePath, values.cover_image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
        }

        if (uploadData) {
          // 공개 URL 획득
          const {
            data: { publicUrl },
          } = supabase.storage.from("event-covers").getPublicUrl(filePath);

          // 3단계: 이미지 URL을 이벤트에 업데이트 (URL 문자열만 전송 - Server Actions 크기 제한 회피)
          await updateEvent(eventId, { cover_image_url: publicUrl });
        }
      } catch (err) {
        // 이미지 업로드 실패는 경고만 (이벤트는 이미 생성됨)
        const errorMsg =
          err instanceof Error ? err.message : "이미지 업로드 중 오류 발생";
        Toast.event.warningUploadFailed(
          `${errorMsg}. 나중에 이미지를 추가할 수 있습니다.`,
        );
      }
    }

    Toast.event.created(values.title, invite_code);

    // 성공 시 새 이벤트 상세 페이지로 이동
    startTransition(() => {
      router.push(`/protected/events/${eventId}`);
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
                    field.onChange(val === "" ? undefined : Number(val));
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
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    // FileList에서 첫 번째 파일만 사용
                    const file = e.target.files?.[0];
                    onChange(file ?? undefined);
                  }}
                  {...fieldProps}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>JPG, PNG, WebP 형식 / 최대 5MB</FormDescription>
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
