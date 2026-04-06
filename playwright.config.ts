import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E 테스트 설정
 *
 * 실행 방법:
 * - 전체 테스트: npx playwright test
 * - UI 모드: npx playwright test --ui
 * - 특정 파일: npx playwright test __tests__/e2e/auth-flow.spec.ts
 * - 이벤트 테스트: npx playwright test __tests__/e2e/events.spec.ts
 *
 * 이벤트 테스트 사전 조건:
 * - .env.local에 테스트 계정 설정 필요:
 *   E2E_TEST_EMAIL=your_email@example.com
 *   E2E_TEST_PASSWORD=your_password
 */
export default defineConfig({
  // 테스트 파일 위치
  testDir: "./__tests__/e2e",

  // 테스트 타임아웃 (60초 - 이벤트 생성/수정/삭제 플로우 고려)
  timeout: 60_000,

  // expect 타임아웃 (10초 - 서버 렌더링 대기 시간 고려)
  expect: {
    timeout: 10_000,
  },

  // 테스트 실패 시 재시도 횟수 (CI에서는 2회, 로컬에서는 0회)
  retries: process.env.CI ? 2 : 0,

  // 병렬 실행 (로컬에서는 단일 워커)
  workers: process.env.CI ? 2 : 1,

  // 테스트 리포터
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],

  use: {
    // 기본 URL
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    // 실패 시 스크린샷 캡처
    screenshot: "only-on-failure",

    // 실패 시 트레이스 수집
    trace: "on-first-retry",

    // 헤드리스 모드 (CI에서는 항상 headless)
    headless: true,
  },

  // 테스트 프로젝트 설정
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  // 개발 서버 자동 시작 (선택사항 - 수동으로 실행할 수도 있음)
  // webServer: {
  //   command: "npm run dev",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120_000,
  // },
});
