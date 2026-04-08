import { redirect } from "next/navigation";

import { SetupProfileForm } from "@/components/forms/setup-profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function SetupProfilePage() {
  const supabase = await createClient();

  // 현재 사용자 정보 조회
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 사용자 프로필 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", user.id)
    .single();

  // 이미 username이 설정된 경우 이벤트 페이지로 리다이렉트
  if (profile?.username) {
    redirect("/protected/events");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <SetupProfileForm userId={user.id} initialFullName={profile?.full_name} />
    </div>
  );
}
