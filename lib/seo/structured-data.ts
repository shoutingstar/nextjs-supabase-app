/**
 * JSON-LD 구조화된 데이터 생성 유틸
 * 검색 엔진이 이벤트 정보를 더 잘 이해하도록 합니다.
 */

/* ============================================================================
 * 이벤트 구조화된 데이터 생성
 * ============================================================================ */

interface CreateEventStructuredDataParams {
  name: string;
  description: string;
  image?: string;
  startDate: Date;
  endDate?: Date;
  location?: {
    name: string;
    address?: string;
  };
  organizer?: {
    name: string;
    url?: string;
  };
  url: string;
}

/**
 * Schema.org Event 타입의 JSON-LD 구조화된 데이터를 생성합니다.
 * 검색 엔진이 이벤트의 날짜, 장소, 개최자 정보를 파싱하도록 합니다.
 *
 * @see https://schema.org/Event
 */
export function createEventStructuredData(
  params: CreateEventStructuredDataParams,
) {
  const {
    name,
    description,
    image,
    startDate,
    endDate,
    location,
    organizer,
    url,
  } = params;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    image: image
      ? [image]
      : [
          // 기본 이미지 (있을 경우)
        ],
    startDate: startDate.toISOString(),
    endDate: endDate ? endDate.toISOString() : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(location && {
      location: {
        "@type": "Place",
        name: location.name,
        address: location.address
          ? {
              "@type": "PostalAddress",
              addressRegion: "KR", // 대한민국
              ...(location.address && { streetAddress: location.address }),
            }
          : undefined,
      },
    }),
    ...(organizer && {
      organizer: {
        "@type": "Organization",
        name: organizer.name,
        ...(organizer.url && { url: organizer.url }),
      },
    }),
    url,
    // 예약 옵션 (선택적)
    offers: {
      "@type": "Offer",
      url,
      price: "0",
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
    },
  };
}

/* ============================================================================
 * Organization 구조화된 데이터 생성
 * ============================================================================ */

interface CreateOrganizationStructuredDataParams {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[]; // 소셜 미디어 링크 배열
}

/**
 * Schema.org Organization 타입의 JSON-LD 구조화된 데이터를 생성합니다.
 * 사이트의 대표 조직 정보를 제공합니다.
 *
 * @see https://schema.org/Organization
 */
export function createOrganizationStructuredData(
  params: CreateOrganizationStructuredDataParams,
) {
  const { name, url, logo, description, sameAs } = params;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
  };
}

/* ============================================================================
 * BreadcrumbList 구조화된 데이터 생성
 * ============================================================================ */

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Schema.org BreadcrumbList 타입의 JSON-LD 구조화된 데이터를 생성합니다.
 * 검색 엔진이 사이트 계층 구조를 이해하도록 합니다.
 *
 * @see https://schema.org/BreadcrumbList
 */
export function createBreadcrumbListStructuredData(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/* ============================================================================
 * JSON-LD을 HTML 스크립트 태그로 변환
 * ============================================================================ */

/**
 * 구조화된 데이터를 JSON-LD 스크립트 태그 HTML로 변환합니다.
 * React 컴포넌트에서 사용할 수 있습니다.
 *
 * @example
 * ```tsx
 * import { structuredDataToScript } from "@/lib/seo/structured-data";
 * import { createEventStructuredData } from "@/lib/seo/structured-data";
 *
 * const data = createEventStructuredData({...});
 * const script = structuredDataToScript(data);
 *
 * return (
 *   <>
 *     <h1>Event Title</h1>
 *     <script
 *       type="application/ld+json"
 *       dangerouslySetInnerHTML={{ __html: script }}
 *     />
 *   </>
 * );
 * ```
 */
export function structuredDataToScript(data: unknown): string {
  return JSON.stringify(data);
}
