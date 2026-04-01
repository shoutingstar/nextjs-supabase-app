import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
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
    ],
  },
};

export default nextConfig;
