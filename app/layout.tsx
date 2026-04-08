import "./globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { ErrorBoundary } from "@/components/ui/error-boundary";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Gather",
    template: "%s | Gather",
  },
  description: "함께 모이는 가장 간단한 방법",

  /* ============================================================================
   * Open Graph 메타데이터 (소셜 미디어 공유)
   * ============================================================================ */
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: defaultUrl,
    title: "Gather - 이벤트 관리 플랫폼",
    description: "함께 모이는 가장 간단한 방법",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gather - 이벤트 관리 플랫폼",
      },
    ],
    siteName: "Gather",
  },

  /* ============================================================================
   * Twitter 카드 메타데이터
   * ============================================================================ */
  twitter: {
    card: "summary_large_image",
    title: "Gather - 이벤트 관리 플랫폼",
    description: "함께 모이는 가장 간단한 방법",
    images: ["/og-image.png"],
    creator: "@gatherhq",
  },

  /* ============================================================================
   * 검색 엔진 크롤링 정책
   * ============================================================================ */
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },

  /* ============================================================================
   * Viewport 설정
   * ============================================================================ */
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  /* ============================================================================
   * 다크모드 지원
   * ============================================================================ */
  colorScheme: "light dark",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary showRetry={true}>{children}</ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
