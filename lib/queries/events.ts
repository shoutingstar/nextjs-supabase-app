import { createClient } from "@/lib/supabase/server";

export interface EventWithHost {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  location: string | null;
  host: {
    id: string;
    full_name: string;
    email: string;
  };
  participants_count: number;
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
      .select("id, title, description, start_date, location, host_id")
      .eq("host_id", userId)
      .order("start_date", { ascending: false });

    if (eventsError) throw eventsError;
    if (!events || events.length === 0) return [];

    // 2. 호스트 정보 조회
    const { data: hosts, error: hostsError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in(
        "id",
        events.map((e) => e.host_id),
      );

    if (hostsError) throw hostsError;

    // 3. 참여자 수 조회
    const { data: participants, error: participantsError } = await supabase
      .from("event_participants")
      .select("event_id");

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
      start_date: event.start_date,
      location: event.location,
      host: hostsMap.get(event.host_id) || {
        id: event.host_id,
        full_name: "Unknown",
        email: "",
      },
      participants_count: participantCountMap.get(event.id) || 0,
    }));
  } catch (error) {
    console.error(
      "Error fetching hosted events:",
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
      .eq("participant_id", userId);

    if (participationsError) throw participationsError;
    if (!participations || participations.length === 0) return [];

    const eventIds = participations.map((p) => p.event_id);

    // 2. 이벤트 정보 조회
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("id, title, description, start_date, location, host_id")
      .in("id", eventIds)
      .order("start_date", { ascending: false });

    if (eventsError) throw eventsError;
    if (!events || events.length === 0) return [];

    // 3. 호스트 정보 조회
    const { data: hosts, error: hostsError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
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
      start_date: event.start_date,
      location: event.location,
      host: hostsMap.get(event.host_id) || {
        id: event.host_id,
        full_name: "Unknown",
        email: "",
      },
      participants_count: participantCountMap.get(event.id) || 0,
    }));
  } catch (error) {
    console.error("Error fetching participating events:", error);
    return [];
  }
}
