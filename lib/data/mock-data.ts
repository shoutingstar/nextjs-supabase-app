/**
 * 더미 데이터 정의
 * 개발 및 테스트 환경에서 사용할 정적 더미 데이터 모음
 * Phase 3에서 Supabase DB 연동 후 대체 예정
 */

import type { EventDetail } from "@/lib/types/event";
import type { ParticipantDetail } from "@/lib/types/participant";
import type { User } from "@/lib/types/user";
import {
  generateRandomParticipant,
  generateRandomUser,
} from "@/lib/utils/data-generators";

/* ============================================================================
 * 더미 사용자 데이터 (50명)
 * ============================================================================ */

/**
 * 테스트용 고정 사용자 목록
 * @description 컴포넌트 테스트, 스토리북, E2E 테스트에서 사용
 */
export const MOCK_USERS: User[] = Array.from({ length: 50 }, (_, i) =>
  generateRandomUser({
    // 첫 번째 사용자는 관리자로 고정
    ...(i === 0 && { role: "admin", name: "관리자" }),
    // 두 번째 사용자는 모더레이터로 고정
    ...(i === 1 && { role: "moderator", name: "운영진" }),
  }),
);

/** 더미 호스트 사용자 (이벤트 생성에 사용) */
export const MOCK_HOST = MOCK_USERS[0];

/** 더미 현재 로그인 사용자 */
export const MOCK_CURRENT_USER = MOCK_USERS[2];

/* ============================================================================
 * 더미 이벤트 데이터 (30개)
 * ============================================================================ */

/** 호스트로 사용할 사용자 ID 목록 (처음 5명) */
const HOST_IDS = MOCK_USERS.slice(0, 5).map((u) => u.id);

/**
 * 테스트용 고정 이벤트 목록
 * @description start_date는 현재 기준 ±7일 범위로 생성됨
 */
/**
 * 더미 이벤트 데이터
 * 고정된 ID를 사용하여 라우팅 테스트 가능하도록 설정
 */
export const MOCK_EVENTS: EventDetail[] = [
  // Event 1: 이벤트 1 (호스트: 사용자 1)
  {
    id: "event-001",
    title: "Next.js 15 핵심 기능 스터디",
    description: "Next.js 15의 최신 기능을 함께 학습합니다.",
    start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: "서울 강남구 역삼동",
    host_id: HOST_IDS[0],
    status: "published",
    invite_code: "GATHER001",
    max_participants: 20,
    cover_image: "https://picsum.photos/seed/nextjs15study/800/400",
    participant_count: 8,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    host: {
      id: HOST_IDS[0],
      name: MOCK_USERS.find((u) => u.id === HOST_IDS[0])?.name || "주최자 1",
      avatar_url: MOCK_USERS.find((u) => u.id === HOST_IDS[0])?.avatar_url,
    },
  },
  // Event 2: 이벤트 2 (호스트: 사용자 2)
  {
    id: "event-002",
    title: "React 19 실전 워크숍",
    description: "React 19의 새로운 기능을 실습합니다.",
    start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: "서울 서초구 테헤란로",
    host_id: HOST_IDS[1],
    status: "published",
    invite_code: "GATHER002",
    max_participants: 30,
    cover_image: "https://picsum.photos/seed/react19workshop/800/400",
    participant_count: 12,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    host: {
      id: HOST_IDS[1],
      name: MOCK_USERS.find((u) => u.id === HOST_IDS[1])?.name || "주최자 2",
      avatar_url: MOCK_USERS.find((u) => u.id === HOST_IDS[1])?.avatar_url,
    },
  },
  // Event 3: 이벤트 3 (호스트: 사용자 3) - 초안 상태
  {
    id: "event-003",
    title: "[초안] TypeScript 심화 과정",
    description: "TypeScript의 고급 개념을 깊이 있게 학습합니다.",
    start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: "서울 중구",
    host_id: HOST_IDS[2],
    status: "draft",
    invite_code: null,
    max_participants: 25,
    cover_image: null,
    participant_count: 0,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: null,
    host: {
      id: HOST_IDS[2],
      name: MOCK_USERS.find((u) => u.id === HOST_IDS[2])?.name || "주최자 3",
      avatar_url: MOCK_USERS.find((u) => u.id === HOST_IDS[2])?.avatar_url,
    },
  },
  // Event 4-30: 추가 더미 이벤트 (고정된 데이터)
  ...Array.from({ length: 27 }, (_, i) => {
    const idx = i + 3;
    const eventNum = idx + 1;
    const hostId = HOST_IDS[idx % HOST_IDS.length];
    const host = MOCK_USERS.find((u) => u.id === hostId)!;

    return {
      id: `event-${String(eventNum).padStart(3, "0")}`,
      title: `이벤트 ${eventNum}`,
      description: `${eventNum}번째 이벤트입니다. 더미 데이터로 테스트합니다.`,
      start_date: new Date(
        Date.now() + (eventNum % 14) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      location: `서울 ${eventNum % 10 === 0 ? "강남" : eventNum % 10 === 1 ? "서초" : eventNum % 10 === 2 ? "종로" : eventNum % 10 === 3 ? "마포" : "송파"}구`,
      host_id: hostId,
      status:
        eventNum % 5 === 0
          ? "draft"
          : eventNum % 5 === 1
            ? "completed"
            : "published",
      invite_code: `GATHER${String(eventNum).padStart(3, "0")}`,
      max_participants: 20 + eventNum,
      cover_image: `https://picsum.photos/seed/event${eventNum}/800/400`,
      participant_count: 5 + (eventNum % 15),
      created_at: new Date(
        Date.now() - (27 - eventNum) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updated_at: new Date(
        Date.now() - (27 - eventNum) * 12 * 60 * 60 * 1000,
      ).toISOString(),
      host: {
        id: host.id,
        name: host.name,
        avatar_url: host.avatar_url,
      },
    } satisfies EventDetail;
  }),
];

/* ============================================================================
 * 더미 참여자 데이터
 * ============================================================================ */

/**
 * 첫 번째 이벤트의 더미 참여자 목록 (최대 15명)
 * @description ParticipantCard 컴포넌트 테스트에 사용
 */
export const MOCK_PARTICIPANTS: ParticipantDetail[] = MOCK_USERS.slice(
  5,
  20,
).map((user) => {
  const participant = generateRandomParticipant(MOCK_EVENTS[0].id, user.id);

  return {
    ...participant,
    user: {
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
    },
  } satisfies ParticipantDetail;
});

/** 호스트 참여자 (항상 approved + attending 상태) */
export const MOCK_HOST_PARTICIPANT: ParticipantDetail = {
  id: "host-participant-id",
  event_id: MOCK_EVENTS[0].id,
  user_id: MOCK_HOST.id,
  status: "approved",
  rsvp: "attending",
  joined_at: MOCK_EVENTS[0].created_at,
  updated_at: null,
  user: {
    id: MOCK_HOST.id,
    name: MOCK_HOST.name,
    avatar_url: MOCK_HOST.avatar_url,
  },
};

/* ============================================================================
 * 이벤트-참여자 매핑 (Phase 2: 더미 데이터)
 * Phase 3에서 event_participants 테이블 쿼리로 교체 예정
 * ============================================================================ */

/**
 * 각 이벤트의 참여자 목록
 * @description 이벤트 ID를 키로 하고, 참여자 사용자 ID 배열을 값으로 함
 * MOCK_CURRENT_USER(MOCK_USERS[2])는 여러 이벤트에 참여하도록 설정
 */
export const MOCK_EVENT_PARTICIPANTS: Record<string, string[]> = {
  // event-001: 8명 참여 (MOCK_CURRENT_USER 포함)
  "event-001": [
    MOCK_USERS[5].id,
    MOCK_USERS[6].id,
    MOCK_CURRENT_USER.id, // MOCK_USERS[2]
    MOCK_USERS[8].id,
    MOCK_USERS[9].id,
    MOCK_USERS[10].id,
    MOCK_USERS[11].id,
    MOCK_USERS[12].id,
  ],
  // event-002: 12명 참여 (MOCK_CURRENT_USER 포함)
  "event-002": [
    MOCK_USERS[5].id,
    MOCK_USERS[7].id,
    MOCK_USERS[13].id,
    MOCK_CURRENT_USER.id,
    MOCK_USERS[14].id,
    MOCK_USERS[15].id,
    MOCK_USERS[16].id,
    MOCK_USERS[17].id,
    MOCK_USERS[18].id,
    MOCK_USERS[19].id,
    MOCK_USERS[20].id,
    MOCK_USERS[21].id,
  ],
  // event-004: 6명 참여 (MOCK_CURRENT_USER 포함)
  "event-004": [
    MOCK_USERS[6].id,
    MOCK_USERS[8].id,
    MOCK_CURRENT_USER.id,
    MOCK_USERS[10].id,
    MOCK_USERS[22].id,
    MOCK_USERS[23].id,
  ],
  // event-005: 5명 참여 (MOCK_CURRENT_USER 미포함, published 상태)
  "event-005": [
    MOCK_USERS[7].id,
    MOCK_USERS[9].id,
    MOCK_USERS[15].id,
    MOCK_USERS[24].id,
    MOCK_USERS[25].id,
  ],
  // event-006: 7명 참여 (MOCK_CURRENT_USER 포함)
  "event-006": [
    MOCK_USERS[5].id,
    MOCK_CURRENT_USER.id,
    MOCK_USERS[11].id,
    MOCK_USERS[14].id,
    MOCK_USERS[26].id,
    MOCK_USERS[27].id,
    MOCK_USERS[28].id,
  ],
  // event-007: 4명 참여 (MOCK_CURRENT_USER 미포함)
  "event-007": [
    MOCK_USERS[8].id,
    MOCK_USERS[12].id,
    MOCK_USERS[16].id,
    MOCK_USERS[29].id,
  ],
  // event-008: 9명 참여 (MOCK_CURRENT_USER 포함)
  "event-008": [
    MOCK_USERS[6].id,
    MOCK_USERS[9].id,
    MOCK_CURRENT_USER.id,
    MOCK_USERS[13].id,
    MOCK_USERS[17].id,
    MOCK_USERS[19].id,
    MOCK_USERS[30].id,
    MOCK_USERS[31].id,
    MOCK_USERS[32].id,
  ],
  // event-009: 3명 참여 (MOCK_CURRENT_USER 미포함)
  "event-009": [MOCK_USERS[7].id, MOCK_USERS[14].id, MOCK_USERS[20].id],
  // event-010: 6명 참여 (MOCK_CURRENT_USER 포함)
  "event-010": [
    MOCK_USERS[5].id,
    MOCK_CURRENT_USER.id,
    MOCK_USERS[18].id,
    MOCK_USERS[21].id,
    MOCK_USERS[33].id,
    MOCK_USERS[34].id,
  ],
};

/* ============================================================================
 * 관리자 통계 데이터 (Phase 2: 더미 데이터)
 * Phase 3에서 실제 데이터베이스 쿼리로 교체 예정
 * ============================================================================ */

/**
 * 일일 사용자 통계 (최근 30일)
 * 누적 가입자 수를 시뮬레이션
 */
export const MOCK_DAILY_USERS = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    }),
    count: 1500 + Math.floor(Math.random() * 800) + i * 10,
  };
});

/**
 * 일일 이벤트 생성 통계 (최근 30일)
 * 상태별 이벤트 생성 수
 */
export const MOCK_DAILY_EVENTS = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    }),
    draft: Math.floor(Math.random() * 3),
    published: Math.floor(Math.random() * 5) + 1,
    completed: Math.floor(Math.random() * 2),
  };
});

/**
 * 이벤트 상태별 분포
 */
export const MOCK_EVENT_STATUS_DISTRIBUTION = [
  {
    name: "Draft",
    value: MOCK_EVENTS.filter((e) => e.status === "draft").length,
    fill: "#ef4444",
  },
  {
    name: "Published",
    value: MOCK_EVENTS.filter((e) => e.status === "published").length,
    fill: "#3b82f6",
  },
  {
    name: "Completed",
    value: MOCK_EVENTS.filter((e) => e.status === "completed").length,
    fill: "#10b981",
  },
  {
    name: "Cancelled",
    value: MOCK_EVENTS.filter((e) => e.status === "cancelled").length,
    fill: "#6b7280",
  },
];

/**
 * 사용자 역할 분포
 */
export const MOCK_USER_ROLE_DISTRIBUTION = [
  {
    name: "User",
    value: MOCK_USERS.filter((u) => u.role === "user").length,
    fill: "#3b82f6",
  },
  {
    name: "Moderator",
    value: MOCK_USERS.filter((u) => u.role === "moderator").length,
    fill: "#f59e0b",
  },
  {
    name: "Admin",
    value: MOCK_USERS.filter((u) => u.role === "admin").length,
    fill: "#ef4444",
  },
];

/**
 * 상위 10 인기 이벤트 (참여자 수 기준)
 */
export const MOCK_TOP_EVENTS = MOCK_EVENTS.sort(
  (a, b) => (b.participant_count || 0) - (a.participant_count || 0),
)
  .slice(0, 10)
  .map((event) => ({
    name: event.title,
    participants: event.participant_count || 0,
  }));

/* ============================================================================
 * 편의 export
 * ============================================================================ */

/**
 * 단일 이벤트 더미 데이터 (상세 페이지 테스트용)
 */
export const MOCK_EVENT_DETAIL = MOCK_EVENTS[0];

/**
 * published 상태의 이벤트만 필터링
 */
export const MOCK_PUBLISHED_EVENTS = MOCK_EVENTS.filter(
  (e) => e.status === "published",
);

/**
 * 커버 이미지가 있는 이벤트만 필터링
 */
export const MOCK_EVENTS_WITH_COVER = MOCK_EVENTS.filter(
  (e) => e.cover_image !== null,
);
