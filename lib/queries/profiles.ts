import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database.types";

// profiles 테이블의 Row 타입을 Database 타입에서 추출
export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * 사용자 프로필 전체 조회
 * @param userId - 조회할 사용자 UUID
 * @returns UserProfile 또는 null (프로필 없거나 에러 시)
 */
export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, avatar_url, role, updated_at, username, website, email, created_at",
      )
      .eq("id", userId)
      .single();

    if (error) {
      console.error("프로필 조회 실패:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("프로필 조회 중 예외 발생:", err);
    return null;
  }
}

/**
 * 사용자 역할(role)만 조회 (권한 체크용 경량 쿼리)
 * @param userId - 조회할 사용자 UUID
 * @returns 'admin' | 'user' 또는 null (프로필 없거나 에러 시)
 */
export async function getUserRole(userId: string): Promise<string | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("역할 조회 실패:", error.message);
      return null;
    }

    return data?.role ?? null;
  } catch (err) {
    console.error("역할 조회 중 예외 발생:", err);
    return null;
  }
}

/**
 * 관리자 수 조회 (대시보드 통계용)
 * @returns 관리자 계정 수 (에러 시 0 반환)
 */
export async function getAdminCount(): Promise<number> {
  const supabase = await createClient();

  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (error) {
      console.error("관리자 수 조회 실패:", error.message);
      return 0;
    }

    return count ?? 0;
  } catch (err) {
    console.error("관리자 수 조회 중 예외 발생:", err);
    return 0;
  }
}
