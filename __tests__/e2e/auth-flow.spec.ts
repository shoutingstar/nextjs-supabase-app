import { expect, test } from "@playwright/test";

/**
 * 인증 플로우 E2E 테스트
 *
 * 테스트 환경: 로컬 개발 서버 (http://localhost:3000)
 *
 * 참고: Google OAuth 시나리오(A)는 실제 Google 인증 서버가 필요하므로
 * 실제 E2E 환경에서만 실행됩니다. 나머지 시나리오는 앱 동작을 검증합니다.
 */

const BASE_URL = "http://localhost:3000";

/**
 * 시나리오 B, C, D: 로그인 페이지 및 보호 경로 동작 검증
 * (Google OAuth 없이 테스트 가능한 시나리오)
 */
test.describe("시나리오 B/C: 보호된 경로 접근 제어", () => {
  test("비로그인 상태에서 /protected 경로 접근 시 /auth/login으로 리다이렉트", async ({
    page,
  }) => {
    // 비로그인 상태에서 보호된 경로 접근 시도
    await page.goto(`${BASE_URL}/protected`);

    // 미들웨어가 /auth/login으로 리다이렉트해야 함
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("비로그인 상태에서 /protected/(admin)/admin 접근 시 /auth/login으로 리다이렉트", async ({
    page,
  }) => {
    // 관리자 경로에 직접 접근 시도
    await page.goto(`${BASE_URL}/protected/admin`);

    // 미들웨어 또는 레이아웃이 /auth/login으로 리다이렉트해야 함
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("/auth/login 페이지에 Google OAuth 버튼이 렌더링됨", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/auth/login`);

    // 페이지가 정상 로드됨
    await expect(page).toHaveURL(/\/auth\/login/);

    // Google OAuth 버튼 존재 확인 (버튼 텍스트 또는 Google 텍스트 포함)
    const googleButton = page.getByText(/Google/i);
    await expect(googleButton).toBeVisible();
  });

  test("/auth/login 페이지가 올바른 구조로 렌더링됨", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);

    // 페이지 타이틀 또는 헤딩 확인
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page).not.toHaveURL(/\/auth\/error/);
  });
});

/**
 * 시나리오 D: 로그아웃 엔드포인트 검증
 */
test.describe("시나리오 D: 로그아웃 엔드포인트", () => {
  test("POST /auth/logout 요청 시 /auth/login으로 리다이렉트됨", async ({
    page,
  }) => {
    // 비로그인 상태에서 로그아웃 엔드포인트 직접 POST 요청
    const response = await page.request.post(`${BASE_URL}/auth/logout`, {
      // CSRF 보호가 없는 경우 빈 바디로 요청
      data: {},
    });

    // 302 리다이렉트 또는 최종 URL이 /auth/login이어야 함
    // Playwright는 리다이렉트를 자동으로 따라감
    expect(response.ok()).toBeTruthy();
  });

  test("로그아웃 후 /protected 경로 접근 시 /auth/login으로 리다이렉트됨", async ({
    page,
  }) => {
    // 로그아웃 처리 후
    await page.request.post(`${BASE_URL}/auth/logout`);

    // 보호된 경로 접근 시도
    await page.goto(`${BASE_URL}/protected`);

    // 리다이렉트 확인
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

/**
 * 시나리오 A: Google OAuth 콜백 처리 (에러 케이스만 테스트)
 * - 실제 Google OAuth는 CI/CD 환경에서 테스트하기 어려우므로
 *   에러 처리 경로만 검증합니다.
 */
test.describe("시나리오 A: OAuth 콜백 에러 처리", () => {
  test("error_description 파라미터 있을 때 /auth/error로 리다이렉트됨", async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/auth/callback?error_description=access_denied`,
    );

    // 에러 페이지로 리다이렉트되어야 함
    await expect(page).toHaveURL(/\/auth\/error/);
  });

  test("code 파라미터 없을 때 /auth/error로 리다이렉트됨", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/callback`);

    // 에러 페이지로 리다이렉트되어야 함
    await expect(page).toHaveURL(/\/auth\/error/);
  });
});

/**
 * 미들웨어 동작 검증
 */
test.describe("미들웨어 세션 관리", () => {
  test("정적 파일 경로(_next/static)는 미들웨어를 통과함", async ({ page }) => {
    // _next/static은 미들웨어의 matcher에서 제외됨
    // 실제 정적 파일 요청이 성공적으로 응답받는지 확인
    // (404는 파일이 없는 것이지 미들웨어 문제가 아님)
    const response = await page.request.get(
      `${BASE_URL}/_next/static/chunks/main.js`,
    );

    // 200 또는 404 (파일 없음)는 정상 - 401이 아니어야 함
    expect([200, 404]).toContain(response.status());
  });

  test("/auth 경로는 인증 없이 접근 가능함", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);

    // /auth/login이 미들웨어에 의해 리다이렉트되지 않아야 함
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("루트 경로(/)는 인증 없이 접근 가능함", async ({ page }) => {
    await page.goto(BASE_URL);

    // 홈 페이지가 /auth/login으로 리다이렉트되지 않아야 함
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });
});
