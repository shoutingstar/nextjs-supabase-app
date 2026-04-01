"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

/**
 * 카풀 슬롯 생성 (드라이버 등록)
 */
export async function createCarpoolSlot(eventId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  const departureLocation = formData.get("departure_location") as string;
  const departureTime = formData.get("departure_time") as string;
  const totalSeats = parseInt(formData.get("total_seats") as string);
  const note = (formData.get("note") as string) || null;

  if (!departureLocation || !departureTime || !totalSeats) {
    throw new Error("필수 필드를 입력해주세요");
  }

  if (totalSeats < 1 || totalSeats > 10) {
    throw new Error("총 좌석은 1~10 사이여야 합니다");
  }

  // 이미 등록한 드라이버가 있는지 확인
  const { data: existingSlot } = await supabase
    .from("carpool_slots")
    .select("id")
    .eq("event_id", eventId)
    .eq("driver_id", user.id)
    .single();

  if (existingSlot) {
    throw new Error("이미 카풀을 등록했습니다. 먼저 삭제 후 다시 등록해주세요");
  }

  // 카풀 슬롯 생성
  const { error } = await supabase.from("carpool_slots").insert({
    event_id: eventId,
    driver_id: user.id,
    departure_location: departureLocation,
    departure_time: departureTime,
    total_seats: totalSeats,
    note,
  });

  if (error) throw new Error(`카풀 등록 실패: ${error.message}`);

  revalidatePath(`/protected/events/${eventId}/carpool`);
}

/**
 * 카풀 슬롯 삭제
 */
export async function deleteCarpoolSlot(
  carpoolSlotId: string,
  eventId: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  // 드라이버 확인
  const { data: slot } = await supabase
    .from("carpool_slots")
    .select("driver_id")
    .eq("id", carpoolSlotId)
    .single();

  if (!slot || slot.driver_id !== user.id) {
    throw new Error("카풀을 삭제할 권한이 없습니다");
  }

  // 카풀 슬롯 삭제 (carpool_requests는 CASCADE로 자동 삭제)
  const { error } = await supabase
    .from("carpool_slots")
    .delete()
    .eq("id", carpoolSlotId);

  if (error) throw new Error(`카풀 삭제 실패: ${error.message}`);

  revalidatePath(`/protected/events/${eventId}/carpool`);
}

/**
 * 카풀 동승 신청
 */
export async function requestCarpool(
  carpoolSlotId: string,
  eventId: string,
  message?: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  // 이미 신청했거나 승인된 신청이 있는지 확인
  const { data: existingRequest } = await supabase
    .from("carpool_requests")
    .select("id, status")
    .eq("slot_id", carpoolSlotId)
    .eq("user_id", user.id)
    .single();

  if (existingRequest) {
    if (existingRequest.status === "approved") {
      throw new Error("이미 승인된 신청이 있습니다");
    }
    throw new Error("이미 신청했습니다");
  }

  // 잔여 좌석 확인
  const { data: slot } = await supabase
    .from("carpool_slots")
    .select(
      `
      id,
      total_seats,
      carpool_requests (id, status)
    `,
    )
    .eq("id", carpoolSlotId)
    .single();

  if (!slot) {
    throw new Error("카풀 정보를 찾을 수 없습니다");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const approvedCount = (slot.carpool_requests || []).filter(
    (r: any) => r.status === "approved",
  ).length;

  if (approvedCount >= slot.total_seats) {
    throw new Error("잔여 좌석이 없습니다");
  }

  // 동승 신청 생성
  const { error } = await supabase.from("carpool_requests").insert({
    slot_id: carpoolSlotId,
    user_id: user.id,
    message: message || null,
  });

  if (error) throw new Error(`신청 실패: ${error.message}`);

  revalidatePath(`/protected/events/${eventId}/carpool`);
}

/**
 * 카풀 신청 승인
 */
export async function approveCarpoolRequest(
  requestId: string,
  eventId: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  // 드라이버 확인
  const { data: request } = await supabase
    .from("carpool_requests")
    .select(
      `
      id,
      carpool_slots:slot_id (driver_id)
    `,
    )
    .eq("id", requestId)
    .single();

  if (!request) {
    throw new Error("신청을 찾을 수 없습니다");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slots = request.carpool_slots as any;
  if (slots?.driver_id !== user.id) {
    throw new Error("신청을 승인할 권한이 없습니다");
  }

  // 신청 승인
  const { error } = await supabase
    .from("carpool_requests")
    .update({
      status: "approved",
    })
    .eq("id", requestId);

  if (error) throw new Error(`승인 실패: ${error.message}`);

  revalidatePath(`/protected/events/${eventId}/carpool`);
}

/**
 * 카풀 신청 거절
 */
export async function rejectCarpoolRequest(requestId: string, eventId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다");

  // 드라이버 확인
  const { data: request } = await supabase
    .from("carpool_requests")
    .select(
      `
      id,
      carpool_slots:slot_id (driver_id)
    `,
    )
    .eq("id", requestId)
    .single();

  if (!request) {
    throw new Error("신청을 찾을 수 없습니다");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slots = request.carpool_slots as any;
  if (slots?.driver_id !== user.id) {
    throw new Error("신청을 거절할 권한이 없습니다");
  }

  // 신청 거절
  const { error } = await supabase
    .from("carpool_requests")
    .update({
      status: "rejected",
    })
    .eq("id", requestId);

  if (error) throw new Error(`거절 실패: ${error.message}`);

  revalidatePath(`/protected/events/${eventId}/carpool`);
}

/**
 * 이벤트의 카풀 슬롯 조회
 */
export async function getCarpoolSlot(eventId: string) {
  const supabase = await createClient();

  const { data: slot, error } = await supabase
    .from("carpool_slots")
    .select(
      `
      id,
      driver_id,
      departure_location,
      departure_time,
      total_seats,
      note,
      status,
      created_at,
      profiles:driver_id (full_name),
      carpool_requests (
        id,
        user_id,
        status,
        message,
        created_at,
        profiles:user_id (full_name, avatar_url)
      )
    `,
    )
    .eq("event_id", eventId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116: no rows returned
    throw new Error(`카풀 조회 실패: ${error.message}`);
  }

  return slot || null;
}

/**
 * 카풀 신청 목록 조회 (운전자용)
 */
export async function getCarpoolRequests(carpoolSlotId: string) {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("carpool_requests")
    .select(
      `
      id,
      user_id,
      status,
      message,
      created_at,
      profiles:user_id (full_name, avatar_url)
    `,
    )
    .eq("slot_id", carpoolSlotId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`신청 목록 조회 실패: ${error.message}`);

  return requests || [];
}

/**
 * 현재 사용자의 카풀 신청 상태 조회
 */
export async function getCurrentUserCarpoolStatus(eventId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: request } = await supabase
    .from("carpool_requests")
    .select(
      `
      id,
      status,
      carpool_slots:slot_id (id)
    `,
    )
    .eq("carpool_slots.event_id", eventId)
    .eq("user_id", user.id)
    .single();

  return request || null;
}
