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
export const MOCK_EVENTS = Array.from({ length: 30 }, (_, i) => {
  const hostId = HOST_IDS[i % HOST_IDS.length];
  const host = MOCK_USERS.find((u) => u.id === hostId)!;

  const event = generateRandomEvent(hostId, {
    // 처음 3개는 상태를 고정
    ...(i === 0 && {
      status: "published",
      title: "Next.js 15 핵심 기능 스터디",
    }),
    ...(i === 1 && { status: "published", title: "React 19 실전 워크숍" }),
    ...(i === 2 && { status: "draft", title: "[초안] TypeScript 심화 과정" }),
  });

  // EventDetail 형태로 확장 (호스트 정보 + 참여자 수 포함)
  const participantCount = Math.floor(Math.random() * 20) + 1;

  return {
    ...event,
    host: {
      id: host.id,
      name: host.name,
      avatar_url: host.avatar_url,
    },
    participant_count: participantCount,
  } satisfies EventDetail;
});

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
