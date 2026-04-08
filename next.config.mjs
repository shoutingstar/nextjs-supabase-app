/** @type {import('next').NextConfig} */

/* ============================================================================
 * Next.js 설정
 * ============================================================================ */

const nextConfig = {
  /* ============================================================================
   * 이미지 최적화 설정
   * ============================================================================ */
  images: {
    // 최적화된 이미지 형식 (최신 브라우저부터 순서대로)
    formats: ["image/avif", "image/webp"],
    // 이미지 캐싱 정책 (초 단위)
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1년
    remotePatterns: [
      {
        // Lorem Picsum - 더미 커버 이미지 서비스
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        // DiceBear - 아바타 이미지 서비스
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        // Supabase Storage - 이벤트 커버 이미지
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      {
        // Supabase 저장소 (usercontent)
        protocol: "https",
        hostname: "**.supabaseusercontent.com",
      },
      {
        // Unsplash - 배경 이미지
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  /* ============================================================================
   * 성능 최적화
   * ============================================================================ */
  // 정적 자산 압축 활성화 (기본값: true)
  compress: true,
  // 프로덕션 소스 맵 비활성화 (번들 크기 감소)
  productionBrowserSourceMaps: false,

  /* ============================================================================
   * 재검증 설정
   * ============================================================================ */
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1시간
    pagesBufferLength: 5,
  },

  /* ============================================================================
   * React 엄격 모드
   * ============================================================================ */
  reactStrictMode: true,

  /* ============================================================================
   * Experimental 기능
   * ============================================================================ */
  experimental: {
    // 최적화된 패키지 임포트 (느린 패키지 로드 개선)
    optimizePackageImports: ["@supabase/supabase-js", "lucide-react"],
  },
};

/* ============================================================================
 * 번들 분석기 설정
 * ============================================================================ */
// @next/bundle-analyzer는 고차 함수로 ANALYZE 환경변수를 자동 인식
const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
