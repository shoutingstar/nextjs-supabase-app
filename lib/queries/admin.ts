import { createClient } from "@/lib/supabase/server";

/**
 * 관리자 전용 쿼리 레이어
 * 통계 조회, 검색, 필터, 페이지네이션 포함
 */

// ============================================================================
// 타입 정의
// ============================================================================

export interface AdminDashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalUsers: number;
  totalParticipations: number;
}

export interface AdminEventRow {
  id: string;
  title: string;
  status: "draft" | "active" | "cancelled" | "completed";
  host: { name: string | null };
  created_at: string;
  participant_count: number;
  max_participants: number | null;
}

export interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
}

export interface AdminEventsFilter {
  page: number;
  perPage: number;
  search?: string;
  status?: string;
}

export interface AdminUsersFilter {
  page: number;
  perPage: number;
  search?: string;
  role?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface DailyEventCount {
  date: string;
  draft: number;
  published: number;
  completed: number;
}

export interface DistributionItem {
  name: string;
  value: number;
  fill: string;
}

export interface TopEvent {
  name: string;
  participants: number;
}

export interface AdminStatsData {
  dailyUsers: DailyCount[];
  dailyEvents: DailyEventCount[];
  eventStatusDistribution: DistributionItem[];
  userRoleDistribution: DistributionItem[];
  topEvents: TopEvent[];
}

// ============================================================================
// 대시보드 지표 (F012)
// ============================================================================

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createClient();

  try {
    // 병렬 실행으로 성능 최적화
    const [
      eventsResult,
      activeEventsResult,
      usersResult,
      participationsResult,
    ] = await Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("event_participants")
        .select("id", { count: "exact", head: true }),
    ]);

    return {
      totalEvents: eventsResult.count ?? 0,
      activeEvents: activeEventsResult.count ?? 0,
      totalUsers: usersResult.count ?? 0,
      totalParticipations: participationsResult.count ?? 0,
    };
  } catch (error) {
    console.error("대시보드 통계 조회 오류:", error);
    return {
      totalEvents: 0,
      activeEvents: 0,
      totalUsers: 0,
      totalParticipations: 0,
    };
  }
}

// ============================================================================
// 이벤트 목록 - 검색, 필터, 페이지네이션 (F013)
// ============================================================================

export async function getAdminEvents(
  filter: AdminEventsFilter,
): Promise<PaginatedResult<AdminEventRow>> {
  const supabase = await createClient();

  try {
    const { page, perPage, search, status } = filter;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // 1. 이벤트 + 호스트 정보 조회 (nested select)
    let query = supabase
      .from("events")
      .select(
        "id, title, status, host_id, created_at, max_participants, profiles!host_id(full_name)",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: events, count, error } = await query;

    if (error || !events) {
      console.error("이벤트 조회 오류:", error);
      return { data: [], total: 0, page, perPage, totalPages: 0 };
    }

    const total = count ?? 0;

    // 2. 이벤트가 없으면 빈 결과 반환
    if (events.length === 0) {
      return { data: [], total, page, perPage, totalPages: 0 };
    }

    // 3. 참여자 수 일괄 조회
    const eventIds = events.map((e) => e.id);
    const { data: participants, error: participantsError } = await supabase
      .from("event_participants")
      .select("event_id")
      .in("event_id", eventIds);

    if (participantsError) {
      console.error("참여자 조회 오류:", participantsError);
    }

    // 4. Map으로 참여자 수 집계
    const participantCountMap = new Map<string, number>();
    participants?.forEach((p) => {
      participantCountMap.set(
        p.event_id,
        (participantCountMap.get(p.event_id) ?? 0) + 1,
      );
    });

    // 5. 데이터 변환
    return {
      data: events.map((e) => ({
        id: e.id,
        title: e.title,
        status: e.status as AdminEventRow["status"],
        host: {
          name:
            (e.profiles as { full_name: string | null } | null)?.full_name ??
            null,
        },
        created_at: e.created_at,
        participant_count: participantCountMap.get(e.id) ?? 0,
        max_participants: e.max_participants,
      })),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  } catch (error) {
    console.error("이벤트 목록 조회 오류:", error);
    return { data: [], total: 0, page: 1, perPage: 20, totalPages: 0 };
  }
}

// ============================================================================
// 사용자 목록 - 검색, 필터, 페이지네이션 (F014)
// ============================================================================

export async function getAdminUsers(
  filter: AdminUsersFilter,
): Promise<PaginatedResult<AdminUserRow>> {
  const supabase = await createClient();

  try {
    const { page, perPage, search, role } = filter;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.ilike("full_name", `%${search}%`);
    }

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    const { data, count, error } = await query;

    if (error || !data) {
      console.error("사용자 조회 오류:", error);
      return { data: [], total: 0, page, perPage, totalPages: 0 };
    }

    const total = count ?? 0;

    return {
      data: data.map((p) => ({
        id: p.id,
        name: p.full_name,
        email: p.email ?? "",
        role: p.role as AdminUserRow["role"],
        created_at: p.created_at ?? new Date().toISOString(),
      })),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  } catch (error) {
    console.error("사용자 목록 조회 오류:", error);
    return { data: [], total: 0, page: 1, perPage: 20, totalPages: 0 };
  }
}

// ============================================================================
// 통계 데이터 - 집계 (F015)
// ============================================================================

export async function getAdminStats(): Promise<AdminStatsData> {
  const supabase = await createClient();

  try {
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    // 병렬 쿼리 실행
    const [
      recentProfiles,
      recentEventsResult,
      allEventsResult,
      allProfilesResult,
      allParticipants,
    ] = await Promise.all([
      // 최근 30일 프로필 (created_at 기준)
      supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: true }),

      // 최근 30일 이벤트 생성
      supabase
        .from("events")
        .select("created_at, status")
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: true }),

      // 전체 이벤트 상태 분포
      supabase.from("events").select("status"),

      // 전체 사용자 역할 분포
      supabase.from("profiles").select("role"),

      // 전체 event_participants (Top 10용)
      supabase.from("event_participants").select("event_id"),
    ]);

    // ========================================================================
    // 1. 가입자 추이 (30일)
    // ========================================================================
    const groupByDay = (items: Array<{ date: string }>) => {
      const map = new Map<string, number>();
      items.forEach(({ date }) => {
        const day = date.split("T")[0];
        map.set(day, (map.get(day) ?? 0) + 1);
      });
      return map;
    };

    const dailyProfilesMap = groupByDay(
      recentProfiles.data
        ?.filter((p) => p.created_at)
        .map((p) => ({ date: p.created_at! })) ?? [],
    );

    // 30일 버킷 생성 및 누적값 계산
    const dailyUsers: DailyCount[] = [];
    let cumulativeCount = 0;
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0] ?? "";
      const dayCount = dailyProfilesMap.get(dateStr) ?? 0;
      cumulativeCount += dayCount;
      dailyUsers.push({
        date: new Date(dateStr).toLocaleDateString("ko-KR", {
          month: "numeric",
          day: "numeric",
        }),
        count: cumulativeCount,
      });
    }

    // ========================================================================
    // 2. 이벤트 생성 추이 (30일, 상태별)
    // ========================================================================
    const dailyEventsMap = new Map<
      string,
      { draft: number; published: number; completed: number }
    >();
    recentEventsResult.data?.forEach(({ created_at, status }) => {
      const day = created_at.split("T")[0];
      const current = dailyEventsMap.get(day) ?? {
        draft: 0,
        published: 0,
        completed: 0,
      };
      if (status === "draft") current.draft += 1;
      else if (status === "active") current.published += 1;
      else if (status === "completed") current.completed += 1;
      dailyEventsMap.set(day, current);
    });

    const dailyEvents: DailyEventCount[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const data = dailyEventsMap.get(dateStr) ?? {
        draft: 0,
        published: 0,
        completed: 0,
      };
      dailyEvents.push({
        date: new Date(dateStr).toLocaleDateString("ko-KR", {
          month: "numeric",
          day: "numeric",
        }),
        draft: data.draft,
        published: data.published,
        completed: data.completed,
      });
    }

    // ========================================================================
    // 3. 이벤트 상태 분포
    // ========================================================================
    const statusMap = new Map<string, number>();
    allEventsResult.data?.forEach(({ status }) => {
      statusMap.set(status, (statusMap.get(status) ?? 0) + 1);
    });

    const statusColorMap: Record<string, string> = {
      draft: "#ef4444",
      active: "#3b82f6",
      completed: "#10b981",
      cancelled: "#6b7280",
    };

    const eventStatusDistribution: DistributionItem[] = [
      {
        name: "예정",
        value: statusMap.get("draft") ?? 0,
        fill: statusColorMap["draft"],
      },
      {
        name: "활성",
        value: statusMap.get("active") ?? 0,
        fill: statusColorMap["active"],
      },
      {
        name: "완료",
        value: statusMap.get("completed") ?? 0,
        fill: statusColorMap["completed"],
      },
      {
        name: "취소",
        value: statusMap.get("cancelled") ?? 0,
        fill: statusColorMap["cancelled"],
      },
    ];

    // ========================================================================
    // 4. 사용자 역할 분포
    // ========================================================================
    const roleMap = new Map<string, number>();
    allProfilesResult.data?.forEach(({ role }) => {
      roleMap.set(role, (roleMap.get(role) ?? 0) + 1);
    });

    const roleColorMap: Record<string, string> = {
      admin: "#dc2626",
      moderator: "#f59e0b",
      user: "#8b5cf6",
    };

    const userRoleDistribution: DistributionItem[] = [
      {
        name: "일반",
        value: roleMap.get("user") ?? 0,
        fill: roleColorMap["user"],
      },
      {
        name: "운영진",
        value: roleMap.get("moderator") ?? 0,
        fill: roleColorMap["moderator"],
      },
      {
        name: "관리자",
        value: roleMap.get("admin") ?? 0,
        fill: roleColorMap["admin"],
      },
    ];

    // ========================================================================
    // 5. 인기 이벤트 Top 10 (참여자 수 기준)
    // ========================================================================
    const participantCountMap = new Map<string, number>();
    allParticipants.data?.forEach(({ event_id }) => {
      participantCountMap.set(
        event_id,
        (participantCountMap.get(event_id) ?? 0) + 1,
      );
    });

    const top10EventIds = [...participantCountMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id);

    const { data: topEventsData } = await supabase
      .from("events")
      .select("id, title")
      .in("id", top10EventIds);

    const topEvents: TopEvent[] = (topEventsData ?? []).map((event) => ({
      name: event.title,
      participants: participantCountMap.get(event.id) ?? 0,
    }));

    return {
      dailyUsers,
      dailyEvents,
      eventStatusDistribution,
      userRoleDistribution,
      topEvents,
    };
  } catch (error) {
    console.error("통계 데이터 조회 오류:", error);
    return {
      dailyUsers: [],
      dailyEvents: [],
      eventStatusDistribution: [],
      userRoleDistribution: [],
      topEvents: [],
    };
  }
}
