"use server";

/**
 * 이벤트 CRUD Server Actions
 * 인증된 사용자만 이벤트를 생성/수정/삭제할 수 있습니다.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { EventStatus } from "@/lib/types/event";
import { computeEventStatus } from "@/lib/utils/event-status";
import {
  createEventSchema,
  updateEventSchema,
} from "@/lib/validators/event-schema";

/* ============================================================================
 * 타입 정의
 * ============================================================================ */

/** 이벤트 생성 액션 입력 */
interface CreateEventInput {
  title: string;
  start_date: string; // datetime-local 형식 (YYYY-MM-DDTHH:mm)
  location?: string;
  max_participants?: number;
  description?: string;
  cover_image_url?: string | null;
}

/** 이벤트 수정 액션 입력 */
interface UpdateEventInput {
  title?: string;
  start_date?: string;
  location?: string;
  max_participants?: number | null;
  description?: string;
  status?: EventStatus;
  cover_image_url?: string | null;
}

/** Server Action 응답 타입 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/* ============================================================================
 * 이벤트 생성 (F001, F002)
 * ============================================================================ */

/**
 * 새 이벤트를 생성합니다.
 * - 초대 코드는 DB에서 자동 생성 (substr(md5(random()::text), 1, 8))
 * - 인증된 사용자만 생성 가능
 */
export async function createEvent(
  input: CreateEventInput,
): Promise<ActionResult<{ id: string; invite_code: string }>> {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 이벤트 날짜 유효성 검사
  const eventDate = new Date(input.start_date);
  if (isNaN(eventDate.getTime())) {
    return { success: false, error: "올바른 날짜/시간 형식이 아닙니다." };
  }

  // 이벤트 상태 결정: 미래 날짜면 draft, 현재면 active
  const initialStatus: EventStatus = "draft";

  const { data, error } = await supabase
    .from("events")
    .insert({
      host_id: user.id,
      title: input.title,
      description: input.description || null,
      event_date: eventDate.toISOString(),
      location: input.location || null,
      max_participants: input.max_participants || null,
      status: initialStatus,
      cover_image_url: input.cover_image_url || null,
      // invite_code는 DB 기본값으로 자동 생성
    })
    .select("id, invite_code")
    .single();

  if (error) {
    console.error("이벤트 생성 오류:", error);
    return { success: false, error: "이벤트 생성에 실패했습니다." };
  }

  // 캐시 무효화
  revalidatePath("/protected/events");

  return {
    success: true,
    data: { id: data.id, invite_code: data.invite_code },
  };
}

/* ============================================================================
 * 이벤트 수정 (F006)
 * ============================================================================ */

/**
 * 기존 이벤트를 수정합니다.
 * 주최자(host_id)만 수정 가능합니다.
 */
export async function updateEvent(
  eventId: string,
  input: UpdateEventInput,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 이벤트 소유권 확인
  const { data: existing, error: fetchError } = await supabase
    .from("events")
    .select("id, host_id, status, event_date")
    .eq("id", eventId)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "이벤트를 찾을 수 없습니다." };
  }

  if (existing.host_id !== user.id) {
    return { success: false, error: "이벤트를 수정할 권한이 없습니다." };
  }

  // 업데이트할 필드 구성
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined)
    updateData.description = input.description || null;
  if (input.location !== undefined)
    updateData.location = input.location || null;
  if (input.max_participants !== undefined)
    updateData.max_participants = input.max_participants;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.cover_image_url !== undefined)
    updateData.cover_image_url = input.cover_image_url;

  if (input.start_date !== undefined) {
    const eventDate = new Date(input.start_date);
    if (isNaN(eventDate.getTime())) {
      return { success: false, error: "올바른 날짜/시간 형식이 아닙니다." };
    }
    updateData.event_date = eventDate.toISOString();
  }

  const { data, error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", eventId)
    .select("id")
    .single();

  if (error) {
    console.error("이벤트 수정 오류:", error);
    return { success: false, error: "이벤트 수정에 실패했습니다." };
  }

  // 캐시 무효화
  revalidatePath("/protected/events");
  revalidatePath(`/protected/events/${eventId}`);

  return { success: true, data: { id: data.id } };
}

/* ============================================================================
 * 이벤트 삭제 (F006)
 * ============================================================================ */

/**
 * 이벤트를 삭제합니다.
 * - 주최자(host_id)만 삭제 가능
 * - 관련 데이터(참여자, 카풀, 비용)는 DB CASCADE로 함께 삭제
 * - 삭제 후 /protected/events로 리다이렉트
 */
export async function deleteEvent(eventId: string): Promise<ActionResult> {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 이벤트 소유권 확인
  const { data: existing, error: fetchError } = await supabase
    .from("events")
    .select("id, host_id, cover_image_url")
    .eq("id", eventId)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "이벤트를 찾을 수 없습니다." };
  }

  if (existing.host_id !== user.id) {
    return { success: false, error: "이벤트를 삭제할 권한이 없습니다." };
  }

  // 커버 이미지가 있으면 Storage에서도 삭제
  if (existing.cover_image_url) {
    try {
      // URL에서 파일 경로 추출 (supabase storage URL 형식)
      const url = new URL(existing.cover_image_url);
      const pathParts = url.pathname.split("/event-covers/");
      if (pathParts.length > 1) {
        await supabase.storage.from("event-covers").remove([pathParts[1]]);
      }
    } catch (err) {
      // 이미지 삭제 실패는 무시 (이벤트 삭제는 계속 진행)
      console.warn("커버 이미지 삭제 실패:", err);
    }
  }

  // 이벤트 삭제 (RLS에 의해 host_id 검증)
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    console.error("이벤트 삭제 오류:", error);
    return { success: false, error: "이벤트 삭제에 실패했습니다." };
  }

  // 캐시 무효화 후 리다이렉트
  revalidatePath("/protected/events");

  redirect("/protected/events");
}

/* ============================================================================
 * 커버 이미지 업로드 (F009)
 * ============================================================================ */

/**
 * 이벤트 커버 이미지를 Supabase Storage에 업로드합니다.
 * - 버킷: event-covers
 * - 파일 경로: {userId}/{eventId}-{timestamp}.{ext}
 * - 지원 형식: jpg, png, webp (max 5MB)
 */
export async function uploadEventCoverImage(
  formData: FormData,
  eventId: string,
): Promise<ActionResult<{ url: string }>> {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const file = formData.get("cover_image") as File | null;

  if (!file || file.size === 0) {
    return { success: false, error: "파일을 선택해 주세요." };
  }

  // 파일 크기 검사 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "파일 크기는 5MB 이하여야 합니다." };
  }

  // 지원 형식 검사
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: "JPG, PNG, WebP 형식만 지원합니다.",
    };
  }

  // 파일 확장자 추출
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const timestamp = Date.now();
  // 파일 경로: {userId}/{eventId}-{timestamp}.{ext}
  const filePath = `${user.id}/${eventId}-${timestamp}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("event-covers")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("이미지 업로드 오류:", uploadError);
    return { success: false, error: "이미지 업로드에 실패했습니다." };
  }

  // 공개 URL 생성
  const {
    data: { publicUrl },
  } = supabase.storage.from("event-covers").getPublicUrl(filePath);

  return { success: true, data: { url: publicUrl } };
}

/* ============================================================================
 * Zod 스키마 검증 포함 Server Actions (createEventAction / updateEventAction / deleteEventAction)
 * 클라이언트 폼에서 전달된 데이터를 서버 측에서 재검증합니다.
 * ============================================================================ */

/**
 * 초대 코드 생성 유틸리티 함수
 * 8자리 영숫자 코드 생성 (예: 6ada88d8)
 */
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * 이벤트 생성 액션 (Zod 검증 포함)
 *
 * 처리 순서:
 * 1. 인증 체크 (로그인 사용자 확인)
 * 2. Zod 스키마 검증 (createEventSchema)
 * 3. 초대 코드 명시적 생성
 * 4. DB 컬럼명 매핑: start_date → event_date, cover_image → cover_image_url
 * 5. Supabase INSERT
 */
export async function createEventAction(
  input: unknown,
): Promise<ActionResult<{ id: string; invite_code: string }>> {
  const supabase = await createClient();

  // 1. 인증 체크
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 2. Zod 스키마 검증 (서버 측 재검증)
  const parsed = createEventSchema.safeParse(input);
  if (!parsed.success) {
    // Zod v4: .issues 사용 (v3의 .errors와 동일)
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? "입력값이 올바르지 않습니다.",
    };
  }

  const values = parsed.data;

  // 3. 초대 코드 명시적 생성
  const inviteCode = generateInviteCode();

  // 4. DB 컬럼명 매핑
  //    폼: start_date (datetime-local 문자열) → DB: event_date (ISO 8601)
  //    폼: cover_image (File | undefined) → DB: cover_image_url (별도 업로드 후 URL)
  const eventDate = new Date(values.start_date);
  if (isNaN(eventDate.getTime())) {
    return { success: false, error: "올바른 날짜/시간 형식이 아닙니다." };
  }

  // 5. Supabase INSERT (초대 코드 명시적 전달)
  const { data, error } = await supabase
    .from("events")
    .insert({
      host_id: user.id,
      title: values.title,
      description: values.description || null,
      event_date: eventDate.toISOString(),
      location: values.location || null,
      max_participants: values.max_participants ?? null,
      status: "draft" as EventStatus,
      invite_code: inviteCode,
      // cover_image_url은 파일 업로드 후 별도 updateEvent로 처리
    })
    .select("id, invite_code")
    .single();

  if (error) {
    console.error("이벤트 생성 오류 (createEventAction):", error);
    return { success: false, error: "이벤트 생성에 실패했습니다." };
  }

  // 캐시 무효화
  revalidatePath("/protected/events");

  return {
    success: true,
    data: { id: data.id, invite_code: data.invite_code },
  };
}

/**
 * 이벤트 수정 액션 (Zod 검증 포함)
 *
 * 처리 순서:
 * 1. 인증 체크 (로그인 사용자 확인)
 * 2. 이벤트 존재 및 host_id 권한 검증
 * 3. Zod 스키마 검증 (updateEventSchema)
 * 4. DB 컬럼명 매핑: start_date → event_date
 * 5. Supabase UPDATE
 */
export async function updateEventAction(
  eventId: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  // 1. 인증 체크
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 2. 이벤트 존재 및 권한 검증
  const { data: existing, error: fetchError } = await supabase
    .from("events")
    .select("id, host_id")
    .eq("id", eventId)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "이벤트를 찾을 수 없습니다." };
  }

  if (existing.host_id !== user.id) {
    return { success: false, error: "이벤트를 수정할 권한이 없습니다." };
  }

  // 3. Zod 스키마 검증 (서버 측 재검증)
  const parsed = updateEventSchema.safeParse(input);
  if (!parsed.success) {
    // Zod v4: .issues 사용 (v3의 .errors와 동일)
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? "입력값이 올바르지 않습니다.",
    };
  }

  const values = parsed.data;

  // 4. 업데이트할 필드 구성 (DB 컬럼명 매핑 포함)
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (values.title !== undefined) updateData.title = values.title;
  if (values.description !== undefined)
    updateData.description = values.description || null;
  if (values.location !== undefined)
    updateData.location = values.location || null;
  if (values.max_participants !== undefined)
    updateData.max_participants = values.max_participants ?? null;
  if (values.status !== undefined) updateData.status = values.status;

  // 폼: start_date → DB: event_date (컬럼명 매핑)
  if (values.start_date !== undefined) {
    const eventDate = new Date(values.start_date);
    if (isNaN(eventDate.getTime())) {
      return { success: false, error: "올바른 날짜/시간 형식이 아닙니다." };
    }
    updateData.event_date = eventDate.toISOString();
  }

  // 5. Supabase UPDATE
  const { data, error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", eventId)
    .select("id")
    .single();

  if (error) {
    console.error("이벤트 수정 오류 (updateEventAction):", error);
    return { success: false, error: "이벤트 수정에 실패했습니다." };
  }

  // 캐시 무효화
  revalidatePath("/protected/events");
  revalidatePath(`/protected/events/${eventId}`);

  return { success: true, data: { id: data.id } };
}

/**
 * 이벤트 삭제 액션 (권한 검증 포함)
 *
 * 처리 순서:
 * 1. 인증 체크 (로그인 사용자 확인)
 * 2. 이벤트 존재 및 host_id 권한 검증
 * 3. 커버 이미지 Storage 삭제 (있는 경우)
 * 4. Supabase DELETE (관련 데이터는 DB CASCADE로 삭제)
 * 5. /protected/events로 리다이렉트
 */
export async function deleteEventAction(
  eventId: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  // 1. 인증 체크
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 2. 이벤트 존재 및 권한 검증
  const { data: existing, error: fetchError } = await supabase
    .from("events")
    .select("id, host_id, cover_image_url")
    .eq("id", eventId)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "이벤트를 찾을 수 없습니다." };
  }

  if (existing.host_id !== user.id) {
    return { success: false, error: "이벤트를 삭제할 권한이 없습니다." };
  }

  // 3. 커버 이미지가 있으면 Storage에서도 삭제
  if (existing.cover_image_url) {
    try {
      const url = new URL(existing.cover_image_url);
      const pathParts = url.pathname.split("/event-covers/");
      if (pathParts.length > 1) {
        await supabase.storage.from("event-covers").remove([pathParts[1]]);
      }
    } catch (err) {
      // 이미지 삭제 실패는 무시하고 이벤트 삭제 계속 진행
      console.warn("커버 이미지 삭제 실패 (deleteEventAction):", err);
    }
  }

  // 4. 이벤트 삭제 (RLS에 의해 host_id 검증, 관련 데이터는 CASCADE 삭제)
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    console.error("이벤트 삭제 오류 (deleteEventAction):", error);
    return { success: false, error: "이벤트 삭제에 실패했습니다." };
  }

  // 캐시 무효화 후 목록 페이지로 리다이렉트
  revalidatePath("/protected/events");

  redirect("/protected/events");
}

/* ============================================================================
 * 이벤트 상태 자동 업데이트 (F008)
 * ============================================================================ */

/**
 * 특정 이벤트의 상태를 현재 시간 기준으로 자동 업데이트합니다.
 * 이벤트 조회 시 호출하여 상태를 최신화합니다.
 */
export async function syncEventStatus(eventId: string): Promise<void> {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, status, event_date")
    .eq("id", eventId)
    .single();

  if (!event) return;

  const newStatus = computeEventStatus(
    event.event_date,
    event.status as EventStatus,
  );

  // 상태가 변경된 경우에만 업데이트
  if (newStatus !== event.status) {
    await supabase
      .from("events")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", eventId);

    revalidatePath(`/protected/events/${eventId}`);
  }
}

/* ============================================================================
 * 참여자 관리 (F004, F007)
 * ============================================================================ */

/**
 * 사용자가 이벤트에 참여합니다.
 * - 초대 링크를 통해 미인증 사용자도 로그인 후 참여 가능
 * - 중복 참여 방지 (DB UNIQUE 제약: event_id, user_id)
 * - 취소/완료된 이벤트는 참여 불가
 */
export async function joinEventAction(
  eventId: string,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  // 1. 인증 체크
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 2. 이벤트 존재 확인
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, status, host_id")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return { success: false, error: "이벤트를 찾을 수 없습니다." };
  }

  // 3. 호스트는 참여 불가 (이미 호스팅하는 이벤트)
  if (event.host_id === user.id) {
    return {
      success: false,
      error: "이벤트의 주최자는 참여할 수 없습니다.",
    };
  }

  // 4. 이벤트 상태 확인 (활성화/예정 이벤트만 참여 가능)
  if (event.status === "cancelled") {
    return { success: false, error: "취소된 이벤트에는 참여할 수 없습니다." };
  }

  if (event.status === "completed") {
    return {
      success: false,
      error: "완료된 이벤트에는 참여할 수 없습니다.",
    };
  }

  // 5. 중복 참여 확인
  const { data: existingParticipation, error: checkError } = await supabase
    .from("event_participants")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single();

  // 🔍 주의: .single()은 레코드가 없으면 PGRST116 에러 반환
  // 에러가 없고 데이터가 있다 = 이미 참여 중
  if (!checkError && existingParticipation) {
    return { success: false, error: "이미 참여 중인 이벤트입니다." };
  }

  // 6. 참여자 추가
  const { data: participant, error: insertError } = await supabase
    .from("event_participants")
    .insert({
      event_id: eventId,
      user_id: user.id,
      status: "approved",
      rsvp: "attending",
    })
    .select("id")
    .single();

  if (insertError) {
    // DB UNIQUE 제약 위반 (중복 참여 시도) → 친화적 에러 메시지
    if (insertError.code === "23505") {
      return { success: false, error: "이미 참여 중인 이벤트입니다." };
    }

    console.error("이벤트 참여 추가 오류:", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
    });
    return {
      success: false,
      error: `이벤트 참여에 실패했습니다. (${insertError.code})`,
    };
  }

  // 7. 캐시 무효화
  revalidatePath(`/protected/events/${eventId}`);
  revalidatePath("/protected/events");

  return { success: true, data: { id: participant.id } };
}

/**
 * 사용자가 이벤트에서 나갑니다 (참여 취소).
 * - 호스트는 나갈 수 없음 (이벤트를 삭제해야 함)
 * - event_participants 레코드 삭제
 */
export async function leaveEventAction(eventId: string): Promise<ActionResult> {
  const supabase = await createClient();

  // 1. 인증 체크
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  // 2. 이벤트 존재 및 호스트 확인
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, host_id")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return { success: false, error: "이벤트를 찾을 수 없습니다." };
  }

  // 3. 호스트는 나갈 수 없음 (이벤트 삭제는 deleteEventAction으로 처리)
  if (event.host_id === user.id) {
    return {
      success: false,
      error:
        "주최자는 이벤트에서 나갈 수 없습니다. 이벤트를 삭제하거나 상태를 변경하세요.",
    };
  }

  // 4. 참여 기록 삭제
  const { error: deleteError } = await supabase
    .from("event_participants")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("이벤트 참여 취소 오류:", deleteError);
    return { success: false, error: "이벤트 참여 취소에 실패했습니다." };
  }

  // 5. 캐시 무효화
  revalidatePath(`/protected/events/${eventId}`);
  revalidatePath("/protected/events");

  return { success: true };
}
