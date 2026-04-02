/**
 * 더미 데이터 정의
 * 개발 및 테스트 환경에서 사용할 정적 더미 데이터 모음
 * Phase 3에서 Supabase DB 연동 후 대체 예정
 */

import type { EventDetail } from "@/lib/types/event";
import type { ParticipantDetail } from "@/lib/types/participant";
import type { User } from "@/lib/types/user";
import {
  generateRandomEvent,
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
  // Event 4-30: 추가 더미 이벤트 (생성 함수 사용)
  ...Array.from({ length: 27 }, (_, i) => {
    const idx = i + 3;
    const hostId = HOST_IDS[idx % HOST_IDS.length];
    const host = MOCK_USERS.find((u) => u.id === hostId)!;
    const event = generateRandomEvent(hostId);
    // ID를 고정된 형식으로 변경
    const fixedEvent = {
      ...event,
      id: `event-${String(idx + 1).padStart(3, "0")}`,
    };
    return {
      ...fixedEvent,
      host: {
        id: host.id,
        name: host.name,
        avatar_url: host.avatar_url,
      },
      participant_count: Math.floor(Math.random() * 20) + 1,
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
