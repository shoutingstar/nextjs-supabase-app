/**
 * 참여자 관련 타입 정의
 * Phase 3에서 Supabase 스키마 생성 후 database.types.ts 기반으로 교체 예정
 */

import type { UserProfile } from "./user";

/** 참여자 상태 */
export type ParticipantStatus = "pending" | "approved" | "rejected" | "banned";

/** RSVP 응답 상태 */
export type RsvpStatus =
  | "attending"
  | "not_attending"
  | "maybe"
  | "no_response";

/** 참여자 기본 정보 */
export interface Participant {
  id: string;
  event_id: string;
  user_id: string;
  status: ParticipantStatus;
  rsvp: RsvpStatus;
  joined_at: string;
  updated_at: string | null;
}

/** 참여자 상세 (사용자 정보 포함) */
export interface ParticipantDetail extends Participant {
  user: UserProfile;
}

/** 참여 신청 입력 */
export interface JoinEventInput {
  event_id: string;
  rsvp?: RsvpStatus;
}

/** RSVP 업데이트 입력 */
export interface UpdateRsvpInput {
  rsvp: RsvpStatus;
}
