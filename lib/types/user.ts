/**
 * 사용자 관련 타입 정의
 * Phase 3에서 Supabase 스키마 생성 후 database.types.ts 기반으로 교체 예정
 */

/** 사용자 역할 */
export type UserRole = "admin" | "moderator" | "user";

/** 사용자 기본 정보 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string | null;
}

/** 사용자 프로필 (공개 정보) */
export interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

/** 사용자 생성 입력 */
export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
}

/** 사용자 업데이트 입력 */
export interface UpdateUserInput {
  name?: string;
  avatar_url?: string;
}
