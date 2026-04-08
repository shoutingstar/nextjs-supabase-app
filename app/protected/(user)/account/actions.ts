"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateProfile({
  fullName,
  username,
  website,
}: {
  fullName: string | null;
  username: string | null;
  website: string | null;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다.", success: false };
  }

  try {
    // username 검증
    if (username && username.trim()) {
      const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
      if (!USERNAME_REGEX.test(username.trim())) {
        return {
          error:
            "사용자명은 영문, 숫자, 언더스코어(_)만 사용 가능하며 3-20자여야 합니다",
          success: false,
        };
      }
    }

    console.log("[UpdateProfile Server Action]", {
      userId: user.id,
      username,
      fullName,
      website,
    });

    const { error, data } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName || null,
      username: username || null,
      website: website || null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[UpdateProfile Error]", error);
      return { error: error.message, success: false };
    }

    console.log("[UpdateProfile Success]", data);
    return { success: true, data };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "프로필 업데이트 중 오류가 발생했습니다";
    console.error("[UpdateProfile Exception]", errorMessage);
    return { error: errorMessage, success: false };
  }
}
