"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SetupProfileFormProps {
  userId: string;
  initialFullName?: string | null;
}

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export function SetupProfileForm({
  userId,
  initialFullName,
}: SetupProfileFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState(initialFullName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // 사용자명 입력 시 유효성 검사
  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    setUsernameError(null);

    // 형식 검증
    if (value && !USERNAME_REGEX.test(value)) {
      setUsernameError(
        "사용자명은 영문, 숫자, 언더스코어(_)만 사용 가능하며 3-20자여야 합니다",
      );
      return;
    }

    // 형식이 유효한 경우에만 중복 확인
    if (value && USERNAME_REGEX.test(value)) {
      try {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", value.trim())
          .single();

        if (existingUser) {
          setUsernameError("사용자명이 이미 사용 중입니다");
        } else {
          setUsernameError(null);
        }
      } catch (err) {
        // 사용자명이 존재하지 않는 경우 (정상)
        setUsernameError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 기본 검증
    if (!username.trim()) {
      setUsernameError("사용자명을 입력해주세요");
      return;
    }

    if (!USERNAME_REGEX.test(username)) {
      setUsernameError(
        "사용자명은 영문, 숫자, 언더스코어(_)만 사용 가능하며 3-20자여야 합니다",
      );
      return;
    }

    if (usernameError) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase.from("profiles").upsert({
        id: userId,
        username: username.trim(),
        full_name: fullName.trim() || null,
        updated_at: new Date().toISOString(),
      });

      if (updateError) {
        throw updateError;
      }

      // 성공 후 이벤트 페이지로 이동
      router.push("/protected/events");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "오류가 발생했습니다";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">프로필 설정</h1>
        <p className="text-muted-foreground mt-1">
          이제 사용할 사용자명을 설정해주세요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 사용자명 (필수) */}
            <div className="space-y-2">
              <Label htmlFor="username">
                사용자명
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="my_username"
                value={username}
                onChange={(e) => {
                  const value = e.target.value;
                  handleUsernameChange(value);
                }}
                disabled={loading}
                className={cn(
                  usernameError &&
                    "border-destructive focus-visible:ring-destructive",
                )}
                autoFocus
              />
              {usernameError && (
                <p className="text-destructive text-xs">{usernameError}</p>
              )}
              <p className="text-muted-foreground text-xs">
                영문, 숫자, 언더스코어(_)만 사용 가능 (3-20자)
              </p>
            </div>

            {/* 이름 (선택) */}
            <div className="space-y-2">
              <Label htmlFor="full-name">이름</Label>
              <Input
                id="full-name"
                type="text"
                placeholder="홍길동 (선택사항)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            {/* 버튼 그룹 */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading || !username.trim() || !!usernameError}
                className="w-full"
              >
                {loading ? "저장 중..." : "설정 완료"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/protected/events")}
                disabled={loading}
                className="w-full"
              >
                건너뛰기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
