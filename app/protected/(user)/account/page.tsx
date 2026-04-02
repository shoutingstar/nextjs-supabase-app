import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

import AccountForm from "./account-form";

export const metadata: Metadata = {
  title: "계정 설정 | Gather",
  description: "프로필 정보를 확인하고 수정하세요.",
};

export default async function Account() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();

  return <AccountForm claims={claimsData?.claims ?? null} />;
}
