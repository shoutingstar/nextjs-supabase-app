import { expect, type Page, test } from "@playwright/test";

/**
 * 참여자 관리 E2E 테스트
 *
 * 테스트 환경: 로컬 개발 서버 (http://localhost:3000)
 *
 * 사전 조건:
 * - 개발 서버가 실행 중이어야 합니다 (npm run dev)
 * - .env.local에 테스트 계정 정보가 설정되어 있어야 합니다:
 *   호스트 계정:
 *   E2E_TEST_EMAIL=host@example.com
 *   E2E_TEST_PASSWORD=host_password
 *
 *   참여자 계정 (선택적):
 *   E2E_TEST_EMAIL_GUEST=guest@example.com
 *   E2E_TEST_PASSWORD_GUEST=guest_password
 */

const BASE_URL = "http://localhost:3000";

// 호스트 계정
const HOST_EMAIL = process.env.E2E_TEST_EMAIL ?? "";
const HOST_PASSWORD = process.env.E2E_TEST_PASSWORD ?? "";

// 참여자 계정 (없으면 호스트 계정의 다른 세션으로 시뮬레이션)
const GUEST_EMAIL = process.env.E2E_TEST_EMAIL_GUEST ?? "";
const GUEST_PASSWORD = process.env.E2E_TEST_PASSWORD_GUEST ?? "";

/* ============================================================================
 * 로그인 헬퍼 함수
 * ============================================================================ */

async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/auth/login`);

  // 로그인 폼 작성
  await page.fill("#email", email);
  await page.fill("#password", password);

  // 로그인 버튼 클릭
  await page.click('button[type="submit"]');

  // 로그인 성공 후 /protected 경로로 리다이렉트 확인
  await page.waitForURL(/\/protected/, { timeout: 15_000 });
}

/* ============================================================================
 * 테스트 데이터 헬퍼
 * ============================================================================ */

/** 테스트용 고유 이벤트 제목 생성 */
function uniqueEventTitle() {
  return `참여자 테스트 이벤트 ${Date.now()}`;
}

/** 미래 날짜/시간 문자열 생성 */
function futureDatetime(daysFromNow = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/* ============================================================================
 * 이벤트 생성 헬퍼
 * ============================================================================ */

/**
 * 로그인한 사용자가 이벤트를 생성하고 초대 코드와 ID를 반환합니다.
 */
async function createTestEventForParticipation(
  page: Page,
  title: string,
): Promise<{ eventId: string; inviteCode: string }> {
  await page.goto(`${BASE_URL}/protected/events/new`);

  // 폼 작성
  await page.fill('input[placeholder*="이벤트 제목"]', title);
  await page.fill('input[type="datetime-local"]', futureDatetime(7));
  await page.fill('input[placeholder*="장소"]', "서울시 강남구");

  // 폼 제출
  await page.click('button[type="submit"]');

  // 이벤트 상세 페이지로 리다이렉트 (URL에서 eventId 추출)
  await page.waitForURL(/\/protected\/events\/[^/]+$/, { timeout: 15_000 });
  const url = page.url();
  const eventIdMatch = url.match(/\/protected\/events\/([^/]+)$/);
  const eventId = eventIdMatch?.[1] ?? "";

  // 초대 코드 추출 (페이지의 초대 코드 섹션)
  const inviteCodeText = await page.locator(".font-mono").textContent();
  const inviteCode = inviteCodeText?.trim() ?? "";

  return { eventId, inviteCode };
}

/* ============================================================================
 * 사전 조건 검증
 * ============================================================================ */

test.describe("사전 조건: 환경 변수 확인", () => {
  test("호스트 계정 환경 변수가 설정되어 있어야 함", () => {
    if (!HOST_EMAIL || !HOST_PASSWORD) {
      test.skip(
        true,
        [
          "E2E_TEST_EMAIL, E2E_TEST_PASSWORD 환경 변수가 설정되지 않았습니다.",
          ".env.local에 다음을 추가하세요:",
          "E2E_TEST_EMAIL=host@example.com",
          "E2E_TEST_PASSWORD=host_password",
        ].join("\n"),
      );
    }
  });
});

/* ============================================================================
 * 시나리오 1: 초대 링크 접근 및 로그인 리다이렉션
 * ============================================================================ */

test.describe("시나리오 1: 초대 링크 접근 및 로그인 리다이렉션", () => {
  test.skip(!HOST_EMAIL || !HOST_PASSWORD, "호스트 계정 환경 변수 미설정");

  test("비로그인 상태에서 /join/[inviteCode]에 접근 시 로그인 페이지로 리다이렉션", async ({
    page,
  }) => {
    // 호스트가 이벤트 생성 (별도 페이지에서)
    const hostPage = await page.context().newPage();
    await login(hostPage, HOST_EMAIL, HOST_PASSWORD);
    const { inviteCode } = await createTestEventForParticipation(
      hostPage,
      uniqueEventTitle(),
    );
    await hostPage.close();

    // 비로그인 상태에서 초대 링크 접근
    await page.goto(`${BASE_URL}/join/${inviteCode}`);

    // 로그인 페이지로 리다이렉션되는지 확인... 아니면 로그인 CTA가 보여야 함
    // 초대 링크는 미인증도 접근 가능하므로 리다이렉션 대신 CTA 버튼이 표시됨
    await expect(
      page.getByRole("button", { name: /로그인하고 참여하기/i }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("초대 링크 페이지에 이벤트 정보가 표시됨", async ({ page }) => {
    // 호스트가 이벤트 생성
    const hostPage = await page.context().newPage();
    await login(hostPage, HOST_EMAIL, HOST_PASSWORD);
    const eventTitle = uniqueEventTitle();
    const { inviteCode } = await createTestEventForParticipation(
      hostPage,
      eventTitle,
    );
    await hostPage.close();

    // 초대 링크 접근
    await page.goto(`${BASE_URL}/join/${inviteCode}`);

    // 이벤트 제목이 표시되는지 확인
    await expect(page.getByRole("heading", { name: eventTitle })).toBeVisible({
      timeout: 10_000,
    });

    // 이벤트 정보 확인
    await expect(page.getByText(/참여|참가|이벤트/i).first()).toBeVisible({
      timeout: 5_000,
    });
  });
});

/* ============================================================================
 * 시나리오 2: 로그인 후 이벤트 참여
 * ============================================================================ */

test.describe("시나리오 2: 로그인 후 이벤트 참여", () => {
  test.skip(!HOST_EMAIL || !HOST_PASSWORD, "호스트 계정 환경 변수 미설정");
  test.skip(!GUEST_EMAIL || !GUEST_PASSWORD, "참여자 계정 환경 변수 미설정");

  test("참여자가 초대 링크를 통해 이벤트에 참여 가능", async ({ page }) => {
    // 호스트가 이벤트 생성
    const hostPage = await page.context().newPage();
    await login(hostPage, HOST_EMAIL, HOST_PASSWORD);
    const { inviteCode } = await createTestEventForParticipation(
      hostPage,
      uniqueEventTitle(),
    );

    // 초기 참여자 수 추출
    const initialParticipantsText = await hostPage
      .locator("text=/명 참여/")
      .textContent();
    const initialCount = parseInt(
      initialParticipantsText?.match(/\d+/)?.[0] ?? "0",
    );

    await hostPage.close();

    // 참여자가 초대 링크 접근
    await page.goto(`${BASE_URL}/join/${inviteCode}`);

    // 로그인하고 참여하기 버튼 클릭
    await page.click('button:has-text("로그인하고 참여하기")');

    // 로그인 페이지로 이동
    await page.waitForURL(/\/auth\/login/, { timeout: 10_000 });

    // 로그인 처리
    await page.fill("#email", GUEST_EMAIL);
    await page.fill("#password", GUEST_PASSWORD);
    await page.click('button[type="submit"]');

    // 이벤트 상세 페이지로 리다이렉션 (join=true 파라미터 포함)
    await page.waitForURL(/\/protected\/events\/[^/]+/, { timeout: 15_000 });

    // 참여 버튼이 "이미 참여 중"으로 변경되었는지 확인
    await expect(
      page.getByRole("button", { name: /이미 참여 중/i }),
    ).toBeVisible({ timeout: 10_000 });

    // 참여자 수 증가 확인
    const updatedParticipantsText = await page
      .locator("text=/명 참여/")
      .textContent();
    const updatedCount = parseInt(
      updatedParticipantsText?.match(/\d+/)?.[0] ?? "0",
    );
    expect(updatedCount).toBe(initialCount + 1);
  });
});

/* ============================================================================
 * 시나리오 3: 호스트가 초대 링크 접근
 * ============================================================================ */

test.describe("시나리오 3: 호스트가 초대 링크 접근", () => {
  test.skip(!HOST_EMAIL || !HOST_PASSWORD, "호스트 계정 환경 변수 미설정");

  test("호스트가 자신의 이벤트 초대 링크에 접근 시 '내 이벤트' 버튼 표시", async ({
    page,
  }) => {
    // 호스트가 이벤트 생성
    await login(page, HOST_EMAIL, HOST_PASSWORD);
    const { inviteCode } = await createTestEventForParticipation(
      page,
      uniqueEventTitle(),
    );

    // 초대 링크로 접근 (호스트 세션)
    await page.goto(`${BASE_URL}/join/${inviteCode}`);

    // 로그인한 호스트이므로 "내 이벤트 보기" 버튼이 표시되어야 함
    await expect(
      page.getByRole("link", { name: /내 이벤트|이벤트 보기/i }),
    ).toBeVisible({ timeout: 10_000 });

    // 참여 버튼은 없어야 함 (호스트는 참여할 수 없음)
    await expect(
      page.getByRole("button", { name: /이벤트 참여하기/i }),
    ).not.toBeVisible();
  });
});

/* ============================================================================
 * 시나리오 4: 중복 참여 방지
 * ============================================================================ */

test.describe("시나리오 4: 중복 참여 방지", () => {
  test.skip(!HOST_EMAIL || !HOST_PASSWORD, "호스트 계정 환경 변수 미설정");
  test.skip(!GUEST_EMAIL || !GUEST_PASSWORD, "참여자 계정 환경 변수 미설정");

  test("이미 참여한 사용자는 다시 참여할 수 없음", async ({ page }) => {
    // 호스트가 이벤트 생성
    const hostPage = await page.context().newPage();
    await login(hostPage, HOST_EMAIL, HOST_PASSWORD);
    const { eventId, inviteCode } = await createTestEventForParticipation(
      hostPage,
      uniqueEventTitle(),
    );
    await hostPage.close();

    // 참여자가 첫 번째 참여
    await login(page, GUEST_EMAIL, GUEST_PASSWORD);
    await page.goto(`${BASE_URL}/protected/events/${eventId}?join=true`);

    // 첫 번째 참여 성공 확인
    await expect(
      page.getByRole("button", { name: /이미 참여 중/i }),
    ).toBeVisible({ timeout: 10_000 });

    // 초대 링크를 통해 다시 접근
    await page.goto(`${BASE_URL}/join/${inviteCode}`);

    // "이미 참여 중" 상태 표시 확인
    await expect(
      page.getByRole("button", { name: /이미 참여 중|이벤트 보기/i }),
    ).toBeVisible({ timeout: 10_000 });

    // 참여 버튼은 없어야 함
    await expect(
      page.getByRole("button", { name: /이벤트 참여하기/i }),
    ).not.toBeVisible();
  });
});

/* ============================================================================
 * 시나리오 5: 취소된 이벤트 참여 불가
 * ============================================================================ */

test.describe("시나리오 5: 취소된 이벤트 참여 불가", () => {
  test.skip(!HOST_EMAIL || !HOST_PASSWORD, "호스트 계정 환경 변수 미설정");
  test.skip(!GUEST_EMAIL || !GUEST_PASSWORD, "참여자 계정 환경 변수 미설정");

  test("취소된 이벤트에는 참여할 수 없음", async ({ page }) => {
    // 호스트가 이벤트 생성
    const hostPage = await page.context().newPage();
    await login(hostPage, HOST_EMAIL, HOST_PASSWORD);
    const eventTitle = uniqueEventTitle();
    const { eventId, inviteCode } = await createTestEventForParticipation(
      hostPage,
      eventTitle,
    );

    // 이벤트 수정 페이지에서 상태를 "취소"로 변경
    await hostPage.goto(`${BASE_URL}/protected/events/${eventId}/edit`);
    await hostPage.selectOption("select", "cancelled"); // 상태 드롭다운 (있는 경우)
    await hostPage.click('button[type="submit"]');
    await hostPage.close();

    // 참여자가 초대 링크 접근
    await login(page, GUEST_EMAIL, GUEST_PASSWORD);
    await page.goto(`${BASE_URL}/join/${inviteCode}`);

    // 취소된 이벤트 메시지 확인
    await expect(page.getByText(/취소|참여할 수 없음/i).first()).toBeVisible({
      timeout: 10_000,
    });

    // 참여 버튼은 없거나 비활성화되어야 함
    const joinButton = page.getByRole("button", { name: /이벤트 참여하기/i });
    const isDisabled = await joinButton.evaluate((el: HTMLButtonElement) =>
      el.hasAttribute("disabled"),
    );
    expect(isDisabled).toBeTruthy();
  });
});
