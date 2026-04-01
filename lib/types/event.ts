/**
 * 이벤트 관련 타입 정의
 * Phase 3에서 Supabase 스키마 생성 후 database.types.ts 기반으로 교체 예정
 */

import type { UserProfile } from "./user";

/** 이벤트 상태 */
export type EventStatus = "draft" | "published" | "cancelled" | "completed";

/**
 * 이벤트 기본 정보
 * @description DB의 events 테이블에 대응될 예정 (Phase 3)
 */
export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string; // ISO 8601 형식 (YYYY-MM-DDTHH:mm:ss)
  location: string | null;
  host_id: string;
  status: EventStatus;
  invite_code: string | null;
  max_participants: number | null;
  /** 이벤트 커버 이미지 URL (Phase 3에서 DB 컬럼으로 추가 예정) */
  cover_image: string | null;
  created_at: string;
  updated_at: string | null;
}

/**
 * 이벤트 상세 (참여자 + 호스트 정보 포함)
 * @description 클라이언트 UI에서 호스트 정보와 함께 표시할 때 사용
 */
export interface EventDetail extends Event {
  host: UserProfile;
  participant_count: number;
}

/**
 * 이벤트 생성 입력
 * @description CreateEventForm 및 POST /api/events에 대응
 */
export interface CreateEventInput {
  title: string;
  description?: string;
  start_date: string;
  location?: string;
  max_participants?: number;
}

/**
 * 이벤트 업데이트 입력
 * @description PATCH /api/events/:id에 대응
 */
export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
}
