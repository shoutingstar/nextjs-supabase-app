import { createClient } from "@/lib/supabase/server";
import type { EventStatus } from "@/lib/types/event";
import { computeEventStatus } from "@/lib/utils/event-status";

export interface EventWithHost {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  status: EventStatus;
  invite_code: string;
  cover_image_url: string | null;
  max_participants: number | null;
  host: {
    id: string;
    full_name: string | null;
  };
  participants_count: number;
}

export interface EventDetailData {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  status: EventStatus;
  invite_code: string;
  cover_image_url: string | null;
  max_participants: number | null;
  host_id: string;
  host: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  participants_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * 사용자가 만든(호스팅) 이벤트 목록 조회
 */
export async function getUserHostedEvents(
  userId: string,
): Promise<EventWithHost[]> {
  const supabase = await createClient();

  try {
    // 1. 사용자가 호스팅하는 이벤트 조회
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select(
        "id, title, description, event_date, location, host_id, status, invite_code, cover_image_url, max_participants",
      )
      .eq("host_id", userId)
      .order("event_date", { ascending: false });

    if (eventsError) throw eventsError;
    if (!events || events.length === 0) return [];

    // 2. 호스트 정보 조회
    const { data: hosts, error: hostsError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in(
        "id",
        events.map((e) => e.host_id),
      );

    if (hostsError) throw hostsError;

    // 3. 참여자 수 조회
    const { data: participants, error: participantsError } = await supabase
      .from("event_participants")
      .select("event_id")
      .in(
        "event_id",
        events.map((e) => e.id),
      );

    if (participantsError) throw participantsError;

    // 4. 데이터 병합
    const hostsMap = new Map(hosts?.map((h) => [h.id, h]) || []);
    const participantCountMap = new Map<string, number>();

    participants?.forEach((p) => {
      participantCountMap.set(
        p.event_id,
        (participantCountMap.get(p.event_id) || 0) + 1,
      );
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      // 자동 상태 계산 적용
      status: computeEventStatus(event.event_date, event.status as EventStatus),
      invite_code: event.invite_code,
      cover_image_url: event.cover_image_url,
      max_participants: event.max_participants,
      host: hostsMap.get(event.host_id) || {
        id: event.host_id,
        full_name: null,
      },
      participants_count: participantCountMap.get(event.id) || 0,
    }));
  } catch (error) {
    console.error(
      "호스팅 이벤트 조회 오류:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

/**
 * 사용자가 참여 중인 이벤트 목록 조회
 */
export async function getUserParticipatingEvents(
  userId: string,
): Promise<EventWithHost[]> {
  const supabase = await createClient();

  try {
    // 1. 사용자가 참여하는 이벤트 ID 조회
    const { data: participations, error: participationsError } = await supabase
      .from("event_participants")
      .select("event_id")
      .eq("user_id", userId);

    if (participationsError) throw participationsError;
    if (!participations || participations.length === 0) return [];

    const eventIds = participations.map((p) => p.event_id);

    // 2. 이벤트 정보 조회 (호스팅 중인 이벤트 제외)
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select(
        "id, title, description, event_date, location, host_id, status, invite_code, cover_image_url, max_participants",
      )
      .in("id", eventIds)
      .neq("host_id", userId)
      .order("event_date", { ascending: false });

    if (eventsError) throw eventsError;
    if (!events || events.length === 0) return [];

    // 3. 호스트 정보 조회
    const { data: hosts, error: hostsError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in(
        "id",
        events.map((e) => e.host_id),
      );

    if (hostsError) throw hostsError;

    // 4. 참여자 수 조회
    const { data: allParticipants, error: participantsError } = await supabase
      .from("event_participants")
      .select("event_id")
      .in("event_id", eventIds);

    if (participantsError) throw participantsError;

    // 5. 데이터 병합
    const hostsMap = new Map(hosts?.map((h) => [h.id, h]) || []);
    const participantCountMap = new Map<string, number>();

    allParticipants?.forEach((p) => {
      participantCountMap.set(
        p.event_id,
        (participantCountMap.get(p.event_id) || 0) + 1,
      );
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      // 자동 상태 계산 적용
      status: computeEventStatus(event.event_date, event.status as EventStatus),
      invite_code: event.invite_code,
      cover_image_url: event.cover_image_url,
      max_participants: event.max_participants,
      host: hostsMap.get(event.host_id) || {
        id: event.host_id,
        full_name: null,
      },
      participants_count: participantCountMap.get(event.id) || 0,
    }));
  } catch (error) {
    console.error("참여 이벤트 조회 오류:", error);
    return [];
  }
}

/**
 * 이벤트 상세 정보 조회
 * - 호스트 정보, 참여자 수 포함
 * - 상태 자동 계산 적용
 */
export async function getEventDetail(
  eventId: string,
): Promise<EventDetailData | null> {
  const supabase = await createClient();

  try {
    const { data: event, error } = await supabase
      .from("events")
      .select(
        "id, title, description, event_date, location, host_id, status, invite_code, cover_image_url, max_participants, created_at, updated_at",
      )
      .eq("id", eventId)
      .single();

    if (error || !event) return null;

    // 호스트 정보 조회
    const { data: host } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", event.host_id)
      .single();

    // 참여자 수 조회
    const { count: participantsCount } = await supabase
      .from("event_participants")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId);

    // 자동 상태 계산
    const computedStatus = computeEventStatus(
      event.event_date,
      event.status as EventStatus,
    );

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      status: computedStatus,
      invite_code: event.invite_code,
      cover_image_url: event.cover_image_url,
      max_participants: event.max_participants,
      host_id: event.host_id,
      host: host || { id: event.host_id, full_name: null, avatar_url: null },
      participants_count: participantsCount || 0,
      created_at: event.created_at,
      updated_at: event.updated_at,
    };
  } catch (error) {
    console.error("이벤트 상세 조회 오류:", error);
    return null;
  }
}

/**
 * 초대 코드로 이벤트 조회 (미인증 사용자도 접근 가능)
 * - 주의: 이 함수는 현재 /join 페이지에서 직접 조회하므로 거의 사용되지 않음
 * - 필요시 미인증 상태에서 실행하는 Route Handler 사용 권장
 */
export async function getEventByInviteCode(
  inviteCode: string,
): Promise<EventDetailData | null> {
  const supabase = await createClient();

  try {
    console.log(`[초대 코드 조회 시작] inviteCode: "${inviteCode}"`);

    const { data: event, error } = await supabase
      .from("events")
      .select(
        "id, title, description, event_date, location, host_id, status, invite_code, cover_image_url, max_participants, created_at, updated_at",
      )
      .eq("invite_code", inviteCode)
      .single();

    if (error) {
      console.error(
        `[조회 실패] inviteCode: "${inviteCode}"`,
        `에러 코드: ${error.code}`,
        `메시지: ${error.message}`,
      );
      return null;
    }

    if (!event) {
      console.warn(
        `[이벤트 없음] 초대 코드 "${inviteCode}"에 해당하는 이벤트가 없습니다.`,
      );
      return null;
    }

    console.log(`[조회 성공] eventId: "${event.id}", title: "${event.title}"`);

    // 호스트 정보 조회
    const { data: host, error: hostError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", event.host_id)
      .single();

    if (hostError) {
      console.warn(
        `[호스트 정보 조회 실패] host_id: ${event.host_id}`,
        hostError.message,
      );
    }

    // 참여자 수 조회
    const { count: participantsCount, error: countError } = await supabase
      .from("event_participants")
      .select("id", { count: "exact", head: true })
      .eq("event_id", event.id);

    if (countError) {
      console.warn(
        `[참여자 수 조회 실패] eventId: ${event.id}`,
        countError.message,
      );
    }

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      status: computeEventStatus(event.event_date, event.status as EventStatus),
      invite_code: event.invite_code,
      cover_image_url: event.cover_image_url,
      max_participants: event.max_participants,
      host_id: event.host_id,
      host: host || { id: event.host_id, full_name: null, avatar_url: null },
      participants_count: participantsCount || 0,
      created_at: event.created_at,
      updated_at: event.updated_at,
    };
  } catch (error) {
    console.error(
      "[초대 코드 조회 예외]",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * 단일 이벤트 조회 (ID로)
 * - edit 페이지와 detail 페이지 모두 재사용
 * - 기본 이벤트 정보만 반환
 */
export async function getEventById(eventId: string): Promise<{
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  host_id: string;
  status: string;
  invite_code: string;
  cover_image_url: string | null;
  max_participants: number | null;
  created_at: string;
  updated_at: string;
} | null> {
  const supabase = await createClient();

  try {
    const { data: event, error } = await supabase
      .from("events")
      .select(
        "id, title, description, event_date, location, host_id, status, invite_code, cover_image_url, max_participants, created_at, updated_at",
      )
      .eq("id", eventId)
      .single();

    if (error || !event) return null;

    return event;
  } catch (error) {
    console.error("단일 이벤트 조회 오류:", error);
    return null;
  }
}

/**
 * 이벤트 참여자 조회
 * - 프로필 정보 함께 조회
 */
export async function getEventParticipants(eventId: string): Promise<
  Array<{
    id: string;
    user_id: string;
    event_id: string;
    status: string;
    joined_at: string;
    profiles: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    };
  }>
> {
  const supabase = await createClient();

  try {
    const { data: participants, error } = await supabase
      .from("event_participants")
      .select(
        "id, user_id, event_id, status, joined_at, profiles(id, full_name, avatar_url)",
      )
      .eq("event_id", eventId)
      .order("joined_at", { ascending: true });

    if (error) {
      console.error("이벤트 참여자 조회 오류:", error);
      return [];
    }

    return participants || [];
  } catch (error) {
    console.error("이벤트 참여자 조회 오류:", error);
    return [];
  }
}
