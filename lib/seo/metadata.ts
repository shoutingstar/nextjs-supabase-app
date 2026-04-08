/**
 * SEO 메타데이터 헬퍼 함수
 * Open Graph, Twitter Card, 기타 메타데이터 생성 유틸리티
 */

import type { Metadata } from "next";

/* ============================================================================
 * 상수 정의
 * ============================================================================ */

export const SITE_CONFIG = {
  name: "Gather",
  description: "함께 모이는 가장 간단한 방법",
  url: process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000",
  ogImage: {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Gather - 이벤트 관리 플랫폼",
  },
  locale: "ko_KR",
  twitter: "@gatherhq", // 선택사항
};

/* ============================================================================
 * 기본 메타데이터 생성
 * ============================================================================ */

/**
 * 페이지의 기본 메타데이터를 생성합니다.
 * @param title - 페이지 제목
 * @param description - 페이지 설명 (160자 이하 권장)
 * @param path - 페이지 경로 (예: /events/123)
 * @param image - Open Graph 이미지 (기본값: og-image.png)
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string = "/",
  image?: { url: string; width?: number; height?: number; alt?: string },
): Metadata {
  const fullUrl = `${SITE_CONFIG.url}${path}`;
  const ogImage = image || SITE_CONFIG.ogImage;

  return {
    title,
    description,
    metadataBase: new URL(SITE_CONFIG.url),
    openGraph: {
      type: "website",
      locale: SITE_CONFIG.locale,
      url: fullUrl,
      title,
      description,
      images: [
        {
          url: ogImage.url,
          width: ogImage.width || SITE_CONFIG.ogImage.width,
          height: ogImage.height || SITE_CONFIG.ogImage.height,
          alt: ogImage.alt || SITE_CONFIG.ogImage.alt,
        },
      ],
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE_CONFIG.twitter,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
  };
}

/* ============================================================================
 * 이벤트 메타데이터 생성
 * ============================================================================ */

interface EventMetadataParams {
  title: string;
  description: string;
  eventId: string;
  coverImage?: string;
  location?: string;
  startDate?: Date;
}

/**
 * 이벤트 페이지의 메타데이터를 생성합니다.
 * @param params - 이벤트 메타데이터 파라미터
 */
export function generateEventMetadata(params: EventMetadataParams): Metadata {
  const { title, description, eventId, coverImage, location } = params;
  const path = `/protected/events/${eventId}`;
  const fullUrl = `${SITE_CONFIG.url}${path}`;

  // 메타 설명에 장소 추가
  const fullDescription = location
    ? `${description} · ${location}`
    : description;

  return {
    title: `${title} | Gather`,
    description: fullDescription.slice(0, 160), // Twitter 메타 설명 크기 제한
    metadataBase: new URL(SITE_CONFIG.url),
    openGraph: {
      type: "website",
      locale: SITE_CONFIG.locale,
      url: fullUrl,
      title,
      description: fullDescription,
      images: coverImage
        ? [
            {
              url: coverImage,
              width: 1200,
              height: 630,
              alt: `${title} 커버 이미지`,
            },
          ]
        : [
            {
              url: SITE_CONFIG.ogImage.url,
              width: SITE_CONFIG.ogImage.width,
              height: SITE_CONFIG.ogImage.height,
              alt: SITE_CONFIG.ogImage.alt,
            },
          ],
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: fullDescription.slice(0, 200),
      creator: SITE_CONFIG.twitter,
      images: coverImage ? [coverImage] : [SITE_CONFIG.ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
  };
}

/* ============================================================================
 * 동적 라우트 SEO 유틸
 * ============================================================================ */

/**
 * URL 캐노니컬 형식으로 변환합니다.
 * 크롤러가 중복 콘텐츠를 제대로 인식하도록 합니다.
 */
export function getCanonicalUrl(path: string): string {
  return `${SITE_CONFIG.url}${path}`;
}

/**
 * SEO 최적화 문구를 생성합니다.
 * 이벤트 사이트맵 업데이트 시 사용
 */
export function generateSitemapEntry(
  path: string,
  lastModified: Date,
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never" = "weekly",
  priority: number = 0.5,
) {
  return {
    url: getCanonicalUrl(path),
    lastModified,
    changeFrequency,
    priority,
  };
}
