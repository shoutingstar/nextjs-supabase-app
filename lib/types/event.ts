/**
 * 이벤트 관련 타입 정의
 * Phase 3에서 Supabase 스키마 생성 후 database.types.ts 기반으로 교체 예정
 */

import type { UserProfile } from "./user";

/** 이벤트 상태 */
export type EventStatus = "draft" | "published" | "cancelled" | "completed";

/** 이벤트 기본 정보 */
export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  host_id: string;
  status: EventStatus;
  invite_code: string | null;
  max_participants: number | null;
  created_at: string;
  updated_at: string | null;
}

/** 이벤트 상세 (참여자 + 호스트 정보 포함) */
export interface EventDetail extends Event {
  host: UserProfile;
  participant_count: number;
}

/** 이벤트 생성 입력 */
export interface CreateEventInput {
  title: string;
  description?: string;
  date: string;
  location?: string;
  max_participants?: number;
}

/** 이벤트 업데이트 입력 */
export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
}
