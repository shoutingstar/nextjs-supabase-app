"use server";

/**
 * 관리자 서버 액션 (F013, F014)
 * - 이벤트 삭제
 * - 사용자 역할 변경
 */

import { revalidatePath } from "next/cache";

import { getUserRole } from "@/lib/queries/profiles";
import { createClient } from "@/lib/supabase/server";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * 관리자 권한 검증 헬퍼
 */
async function assertAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const role = await getUserRole(user.id);
  if (role !== "admin") {
    throw new Error("관리자 권한이 필요합니다.");
  }

  return user.id;
}

/**
 * 이벤트 삭제 (관리자)
 * - host_id 체크 없이 삭제 가능 (관리자 권한)
 */
export async function adminDeleteEventAction(
  eventId: string,
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  try {
    await assertAdmin(supabase);

    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      console.error("이벤트 삭제 오류:", error);
      return { success: false, error: "이벤트 삭제에 실패했습니다." };
    }

    revalidatePath("/protected/admin/events");
    return { success: true, data: undefined };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
    console.error("adminDeleteEventAction 오류:", message);
    return { success: false, error: message };
  }
}

/**
 * 사용자 역할 변경 (관리자)
 */
export async function adminChangeRoleAction(
  targetUserId: string,
  newRole: "admin" | "moderator" | "user",
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  try {
    await assertAdmin(supabase);

    // 자기 자신의 역할을 user로 강제 다운그레이드하는 경우 방지
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id === targetUserId && newRole !== "admin") {
      return {
        success: false,
        error: "자신의 관리자 권한을 제거할 수 없습니다.",
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", targetUserId);

    if (error) {
      console.error("역할 변경 오류:", error);
      return { success: false, error: "역할 변경에 실패했습니다." };
    }

    revalidatePath("/protected/admin/users");
    return { success: true, data: undefined };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
    console.error("adminChangeRoleAction 오류:", message);
    return { success: false, error: message };
  }
}
