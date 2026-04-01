/**
 * 더미 데이터 생성 유틸리티
 * 테스트 및 개발 환경에서 사용할 랜덤 데이터를 생성합니다.
 */

import type { Event, EventStatus } from "@/lib/types/event";
import type { ParticipantStatus, RsvpStatus } from "@/lib/types/participant";
import type { User, UserRole } from "@/lib/types/user";

/* ============================================================================
 * 랜덤 값 생성 헬퍼 함수
 * ============================================================================ */

/**
 * 배열에서 랜덤 요소를 반환합니다.
 */
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * min ~ max 범위의 랜덤 정수를 반환합니다.
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 현재 시각 기준 ±daysOffset 범위의 랜덤 날짜 ISO 문자열을 반환합니다.
 */
function randomDateNear(daysOffset: number = 7): string {
  const now = new Date();
  const offsetMs = daysOffset * 24 * 60 * 60 * 1000;
  const randomOffset = Math.floor(Math.random() * 2 * offsetMs) - offsetMs;
  return new Date(now.getTime() + randomOffset).toISOString();
}

/**
 * 고유 ID를 생성합니다. (UUID v4 형식)
 */
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ============================================================================
 * 더미 데이터 원본 목록
 * ============================================================================ */

/** 이벤트 제목 샘플 목록 */
const EVENT_TITLES = [
  "개발자 네트워킹 밋업",
  "Next.js 15 스터디 그룹",
  "React 심화 워크숍",
  "프론트엔드 코드 리뷰 세션",
  "TypeScript 실전 입문",
  "Supabase 백엔드 구축 실습",
  "UI/UX 디자인 토론 모임",
  "사이드 프로젝트 발표회",
  "알고리즘 스터디",
  "오픈소스 기여 입문",
  "클라우드 아키텍처 세미나",
  "AI/ML 트렌드 공유",
  "스타트업 피칭 연습",
  "포트폴리오 피드백 세션",
  "웹 성능 최적화 워크숍",
  "모바일 앱 개발 입문",
  "Docker & Kubernetes 실습",
  "데이터베이스 설계 패턴",
  "보안 취약점 분석 실습",
  "애자일 방법론 도입 토론",
];

/** 이벤트 설명 샘플 목록 */
const EVENT_DESCRIPTIONS = [
  "함께 성장하는 개발자 커뮤니티 모임입니다. 최신 기술 트렌드를 공유하고 서로의 경험을 나눕니다.",
  "실습 중심의 워크숍으로, 이론보다 직접 코드를 작성하며 배웁니다. 노트북 지참 필수입니다.",
  "초보자도 환영합니다! 기초부터 차근차근 함께 배워가는 스터디 그룹입니다.",
  "현업 개발자들의 실제 경험담을 듣고 질문할 수 있는 소중한 기회입니다.",
  "네트워킹과 지식 공유를 동시에! 다양한 배경의 개발자들이 모입니다.",
  "2시간 집중 세션으로 핵심 개념을 빠르게 익힐 수 있습니다.",
  "코드 리뷰 문화를 함께 만들어가는 세션입니다. 서로 배우고 성장합니다.",
  "사이드 프로젝트 경험을 공유하고 피드백을 받을 수 있는 자리입니다.",
];

/** 장소 샘플 목록 */
const LOCATIONS = [
  "강남구 선릉역 2번 출구 인근 카페",
  "종로구 광화문 스터디 카페",
  "마포구 합정역 공유 오피스",
  "서초구 교대역 회의실",
  "성동구 성수동 코워킹 스페이스",
  "온라인 (Zoom)",
  "온라인 (Google Meet)",
  "송파구 잠실 스터디룸",
  "영등포구 여의도 세미나실",
  "용산구 이태원 카페",
];

/** 사용자 이름 샘플 목록 */
const USER_NAMES = [
  "김민준",
  "이서연",
  "박도현",
  "최지우",
  "정하늘",
  "강민서",
  "윤지호",
  "임수빈",
  "한준혁",
  "오채원",
  "신동현",
  "류지민",
  "배성훈",
  "조예린",
  "문태양",
  "권나연",
  "노재원",
  "하은진",
  "방성민",
  "송아현",
  "전우진",
  "백서연",
  "엄재혁",
  "구민아",
  "남정우",
  "탁지영",
  "계수현",
  "소병철",
  "어진영",
  "석민호",
];

/** 이벤트 상태 목록 */
const EVENT_STATUSES: EventStatus[] = [
  "published",
  "published",
  "published",
  "draft",
  "completed",
  "cancelled",
];

/** 참여자 상태 목록 */
const PARTICIPANT_STATUSES: ParticipantStatus[] = [
  "approved",
  "approved",
  "approved",
  "pending",
  "rejected",
];

/** RSVP 응답 상태 목록 */
const RSVP_STATUSES: RsvpStatus[] = [
  "attending",
  "attending",
  "attending",
  "not_attending",
  "maybe",
  "no_response",
];

/** 사용자 역할 목록 */
const USER_ROLES: UserRole[] = ["user", "user", "user", "moderator", "admin"];

/* ============================================================================
 * 더미 데이터 생성 함수
 * ============================================================================ */

/**
 * 랜덤 사용자 데이터를 생성합니다.
 * @param overrides - 특정 필드를 덮어쓸 값
 * @returns User 객체
 */
export function generateRandomUser(overrides?: Partial<User>): User {
  const name = randomFrom(USER_NAMES);
  const id = generateId();
  // 아바타 이미지: DiceBear API로 이니셜 기반 아바타 생성
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return {
    id,
    email: `${name.replace(/\s/g, "").toLowerCase()}${randomInt(1, 99)}@example.com`,
    name,
    role: randomFrom(USER_ROLES),
    avatar_url: Math.random() > 0.2 ? avatarUrl : null, // 80% 확률로 아바타 존재
    created_at: randomDateNear(30),
    updated_at: Math.random() > 0.5 ? randomDateNear(7) : null,
    ...overrides,
  };
}

/**
 * 랜덤 이벤트 데이터를 생성합니다.
 * @param hostId - 호스트 사용자 ID
 * @param overrides - 특정 필드를 덮어쓸 값
 * @returns Event 객체
 */
export function generateRandomEvent(
  hostId: string,
  overrides?: Partial<Event>,
): Event {
  const hasMaxParticipants = Math.random() > 0.4;
  const hasCoverImage = Math.random() > 0.3; // 70% 확률로 커버 이미지 존재

  return {
    id: generateId(),
    title: randomFrom(EVENT_TITLES),
    description: randomFrom(EVENT_DESCRIPTIONS),
    start_date: randomDateNear(7), // 현재 기준 ±7일
    location: Math.random() > 0.2 ? randomFrom(LOCATIONS) : null, // 80% 확률로 장소 존재
    host_id: hostId,
    status: randomFrom(EVENT_STATUSES),
    invite_code:
      Math.random() > 0.5 ? generateId().slice(0, 8).toUpperCase() : null,
    max_participants: hasMaxParticipants ? randomInt(5, 50) : null,
    cover_image: hasCoverImage
      ? `https://picsum.photos/seed/${generateId().slice(0, 8)}/800/400`
      : null,
    created_at: randomDateNear(30),
    updated_at: Math.random() > 0.5 ? randomDateNear(7) : null,
    ...overrides,
  };
}

/**
 * 이벤트 목록을 생성합니다.
 * @param count - 생성할 이벤트 수
 * @param hostIds - 호스트로 사용할 사용자 ID 배열
 * @returns Event 배열
 */
export function generateRandomEventList(
  count: number,
  hostIds: string[],
): Event[] {
  return Array.from({ length: count }, () =>
    generateRandomEvent(randomFrom(hostIds)),
  );
}

/**
 * 랜덤 참여자 데이터를 생성합니다.
 * @param eventId - 이벤트 ID
 * @param userId - 사용자 ID
 * @param overrides - 특정 필드를 덮어쓸 값
 * @returns Participant 객체 (user 정보 포함)
 */
export function generateRandomParticipant(
  eventId: string,
  userId: string,
  overrides?: {
    status?: ParticipantStatus;
    rsvp?: RsvpStatus;
  },
) {
  return {
    id: generateId(),
    event_id: eventId,
    user_id: userId,
    status: overrides?.status ?? randomFrom(PARTICIPANT_STATUSES),
    rsvp: overrides?.rsvp ?? randomFrom(RSVP_STATUSES),
    joined_at: randomDateNear(14),
    updated_at: Math.random() > 0.5 ? randomDateNear(3) : null,
  };
}
