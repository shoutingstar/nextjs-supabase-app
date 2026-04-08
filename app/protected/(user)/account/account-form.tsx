"use client";

import { Loader2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

import { updateProfile, uploadAvatarImage } from "./actions";

type Claims = { sub: string; email?: string; [key: string]: unknown };

export default function AccountForm({ claims }: { claims: Claims | null }) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getProfile = useCallback(async () => {
    try {
      if (!claims?.sub) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const {
        data,
        error: fetchError,
        status,
      } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", claims.sub)
        .single();

      if (fetchError && status !== 406) {
        console.log(fetchError);
        throw fetchError;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (err) {
      let errorMessage = "프로필 로드 중 오류가 발생했습니다.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        errorMessage = err.message;
      }

      console.error("[GetProfile Error]", { originalError: err, errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [claims, supabase]);

  useEffect(() => {
    getProfile();
  }, [claims, getProfile]);

  async function handleUpdateProfile({
    username: updatedUsername,
    fullname: updatedFullname,
    website: updatedWebsite,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
  }) {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      console.log("[UpdateProfile] 서버 액션 호출:", {
        username: updatedUsername,
        fullname: updatedFullname,
        website: updatedWebsite,
        avatarUrl,
      });

      // 서버 액션 호출 (RLS 정책 적용됨)
      const result = await updateProfile({
        fullName: updatedFullname,
        username: updatedUsername,
        website: updatedWebsite,
        avatarUrl,
      });

      if (!result.success) {
        setError(result.error || "프로필 업데이트 중 오류가 발생했습니다.");
        return;
      }

      console.log("[UpdateProfile] 성공:", result.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      let errorMessage = "프로필 업데이트 중 오류가 발생했습니다.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        errorMessage = err.message;
      }

      console.error("[UpdateProfile Error]", {
        originalError: err,
        errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // 파일 검증 (클라이언트 측)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("파일 크기는 5MB 이하여야 합니다.");
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("JPG, PNG, WebP 형식만 지원합니다.");
      }

      console.log("[UploadAvatar] 업로드 시작:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      const formData = new FormData();
      formData.append("avatar", file);

      const result = await uploadAvatarImage(formData);

      console.log("[UploadAvatar] 서버 응답:", result);

      if (!result.success) {
        setError(result.error || "아바타 업로드 중 오류가 발생했습니다.");
        return;
      }

      setAvatarUrl(result.data?.url ?? null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      let errorMessage = "아바타 업로드 중 오류가 발생했습니다.";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error("[UploadAvatar ClientError]", {
        originalError: err,
        errorMessage,
      });
      setError(errorMessage);
    } finally {
      setUploading(false);
      // 파일 입력 초기화 (같은 파일 다시 선택 가능)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">계정 설정</h1>
        <p className="text-muted-foreground mt-1">
          프로필 정보를 확인하고 수정하세요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>프로필 사진</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {/* 아바타 미리보기 */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl ?? undefined} alt="프로필 사진" />
            <AvatarFallback>
              {fullname
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          {/* 파일 입력 (숨김) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarUpload}
            disabled={uploading || loading}
            className="hidden"
          />

          {/* 업로드 버튼 */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || loading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                사진 변경
              </>
            )}
          </Button>

          <p className="text-muted-foreground text-center text-xs">
            JPG, PNG, WebP 형식 지원 (최대 5MB)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 이메일 (읽기 전용) */}
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={claims?.email ?? ""}
              disabled
              className="bg-muted"
            />
            <p className="text-muted-foreground text-xs">
              이메일은 Supabase 계정 설정에서 변경할 수 있습니다.
            </p>
          </div>

          {/* 사용자명 */}
          <div className="space-y-2">
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="my_username"
              disabled={loading}
            />
            <p className="text-muted-foreground text-xs">
              영문, 숫자, 언더스코어(_)만 사용 가능 (최소 3자)
            </p>
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <Label htmlFor="fullname">이름</Label>
            <Input
              id="fullname"
              type="text"
              value={fullname || ""}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="홍길동"
              disabled={loading}
            />
          </div>

          {/* 웹사이트 */}
          <div className="space-y-2">
            <Label htmlFor="website">웹사이트</Label>
            <Input
              id="website"
              type="url"
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              disabled={loading}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {/* 성공 메시지 */}
          {success && (
            <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
              프로필이 저장되었습니다.
            </div>
          )}

          {/* 저장 버튼 */}
          <Button
            onClick={() =>
              handleUpdateProfile({
                username,
                fullname,
                website,
              })
            }
            disabled={loading || !claims?.sub}
            className="w-full"
          >
            {loading ? "저장 중..." : "저장"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
