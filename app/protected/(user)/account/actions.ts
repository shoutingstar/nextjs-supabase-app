"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 프로필 정보를 업데이트합니다.
 * - 이름, 사용자명, 웹사이트, 아바타 URL 업데이트
 * - username은 3-20자, 영문/숫자/언더스코어만 가능
 */
export async function updateProfile({
  fullName,
  username,
  website,
  avatarUrl,
}: {
  fullName: string | null;
  username: string | null;
  website: string | null;
  avatarUrl?: string | null;
}): Promise<ActionResult> {
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
      avatarUrl,
    });

    const updateData: Record<string, unknown> = {
      id: user.id,
      full_name: fullName || null,
      username: username || null,
      website: website || null,
      updated_at: new Date().toISOString(),
    };

    // avatarUrl이 제공되면 포함
    if (avatarUrl !== undefined) {
      updateData.avatar_url = avatarUrl;
    }

    const { error, data } = await supabase.from("profiles").upsert(updateData);

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

/**
 * 프로필 아바타 이미지를 Supabase Storage에 업로드합니다.
 * - 버킷: event-covers (이벤트 커버와 동일 버킷 공유)
 * - 파일 경로: {userId}/profiles/avatar-{timestamp}.{ext}
 * - 지원 형식: jpg, png, webp (max 5MB)
 * - 기존 아바타는 자동으로 삭제됨
 */
export async function uploadAvatarImage(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const file = formData.get("avatar") as File | null;

  if (!file || file.size === 0) {
    return { success: false, error: "파일을 선택해 주세요." };
  }

  // 파일 크기 검사 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "파일 크기는 5MB 이하여야 합니다." };
  }

  // 지원 형식 검사
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: "JPG, PNG, WebP 형식만 지원합니다.",
    };
  }

  // 기존 아바타 삭제
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile?.avatar_url) {
      const url = new URL(profile.avatar_url);
      const pathParts = url.pathname.split("/event-covers/");
      if (pathParts.length > 1) {
        await supabase.storage.from("event-covers").remove([pathParts[1]]);
      }
    }
  } catch (err) {
    // 기존 아바타 삭제 실패는 무시
    console.warn("[DeleteOldAvatar] 기존 아바타 삭제 실패:", err);
  }

  // 파일 확장자 추출
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const timestamp = Date.now();
  // 파일 경로: {userId}/profiles/avatar-{timestamp}.{ext}
  const filePath = `${user.id}/profiles/avatar-${timestamp}.${ext}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("event-covers")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[UploadAvatar Error]", {
        error: uploadError,
        message: uploadError.message,
        statusCode: uploadError.statusCode,
      });

      if (uploadError.statusCode === 403) {
        return {
          success: false,
          error:
            "아바타 업로드 권한이 없습니다. Supabase RLS 정책을 확인하세요.",
        };
      }

      return { success: false, error: `업로드 실패: ${uploadError.message}` };
    }

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from("event-covers").getPublicUrl(filePath);

    console.log("[UploadAvatar Success]", { filePath, publicUrl });
    return { success: true, data: { url: publicUrl } };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[UploadAvatar Exception]", errorMsg);
    return { success: false, error: `업로드 중 오류 발생: ${errorMsg}` };
  }
}
