/**
 * 동적 사이트맵 생성
 * 모든 정적 페이지와 동적 이벤트 페이지를 포함합니다.
 * 빌드 시간에 생성되며, ISR을 통해 주기적으로 재생성할 수 있습니다.
 */

import type { MetadataRoute } from "next";

import { generateSitemapEntry } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

/* ============================================================================
 * 정적 페이지 정의
 * ============================================================================ */

const staticPages = [
  {
    path: "/",
    priority: 1.0,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/auth/login",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/auth/sign-up",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/protected/events",
    priority: 0.9,
    changeFrequency: "daily" as const,
  },
  {
    path: "/protected/participants",
    priority: 0.7,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/protected/account",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
];

/* ============================================================================
 * 사이트맵 생성 함수
 * ============================================================================ */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 정적 페이지 사이트맵 항목
    const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) =>
      generateSitemapEntry(
        page.path,
        new Date(),
        page.changeFrequency,
        page.priority,
      ),
    );

    // 동적 이벤트 페이지 조회
    const supabase = await createClient();

    const { data: events, error } = await supabase
      .from("events")
      .select("id, title, updated_at, status")
      .eq("status", "active") // 활성 이벤트만 포함
      .order("updated_at", { ascending: false })
      .limit(100); // 사이트맵 크기 제한 (최대 50,000개까지 권장, 여기선 100개로 제한)

    if (error) {
      console.error("사이트맵 생성 중 오류:", error);
      return staticEntries; // 오류 시 정적 페이지만 반환
    }

    // 동적 이벤트 페이지 사이트맵 항목
    const eventEntries: MetadataRoute.Sitemap = (events || []).map((event) =>
      generateSitemapEntry(
        `/protected/events/${event.id}`,
        new Date(event.updated_at),
        "weekly",
        0.8,
      ),
    );

    // 정적 페이지 + 동적 이벤트 페이지 병합
    return [...staticEntries, ...eventEntries];
  } catch (error) {
    console.error("사이트맵 생성 실패:", error);
    // 오류 발생 시 정적 페이지만 반환하여 빌드 실패 방지
    return staticPages.map((page) =>
      generateSitemapEntry(
        page.path,
        new Date(),
        page.changeFrequency,
        page.priority,
      ),
    );
  }
}

/* ============================================================================
 * 캐싱 설정
 * ============================================================================ */

// 사이트맵을 24시간 캐시 (Incremental Static Regeneration)
export const revalidate = 86400; // 24시간 (초 단위)
