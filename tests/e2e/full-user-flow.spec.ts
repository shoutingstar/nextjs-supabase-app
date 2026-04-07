import { expect, Page, test } from "@playwright/test";

/**
 * Task 012: 핵심 기능 통합 테스트
 *
 * 전체 사용자 플로우 테스트 (주최자, 참여자, 관리자)
 * - 주최자: 이벤트 생성 → 초대 링크 공유 → 참여자 확인
 * - 참여자: 초대 링크 클릭 → 로그인 → 자동 참여
 * - 관리자: 로그인 → 지표 확인 → 데이터 관리
 */

// 테스트 환경 설정
const BASE_URL = "http://localhost:3000";
const TEST_ADMIN_EMAIL = "admin@test.com";
const TEST_ADMIN_PASSWORD = "test@1234";
const TEST_HOST_EMAIL = "host@test.com";
const TEST_HOST_PASSWORD = "test@1234";
const TEST_PARTICIPANT_EMAIL = "participant@test.com";
const TEST_PARTICIPANT_PASSWORD = "test@1234";

// 헬퍼 함수: 로그인
async function loginAsEmail(
  page: Page,
  email: string,
  password: string,
  isAdmin: boolean = false,
) {
  const loginUrl = isAdmin ? "/auth/admin-login" : "/auth/login";
  await page.goto(`${BASE_URL}${loginUrl}`);

  // 이메일 입력
  await page.fill('input[type="email"]', email);
  // 비밀번호 입력
  await page.fill('input[type="password"]', password);
  // 로그인 버튼 클릭
  await page.click('button:has-text("로그인")');

  // 리다이렉트 대기
  await page.waitForURL("**/protected/**", { timeout: 5000 });
}

// 헬퍼 함수: 로그아웃
async function logout(page: Page) {
  // 프로필 메뉴 열기 (상단 우측)
  await page.click("button:has-text('Settings')");
  // 로그아웃 버튼 클릭
  await page.click("button:has-text('로그아웃')");
  // 로그인 페이지로 리다이렉트 대기
  await page.waitForURL("**/auth/login", { timeout: 5000 });
}

test.describe("Task 012: 핵심 기능 통합 테스트", () => {
  test.describe("주최자 플로우 (F001-F009)", () => {
    test("이벤트 생성 → 초대 링크 공유 → 참여자 확인", async ({ page }) => {
      // Step 1: 주최자 로그인
      await loginAsEmail(page, TEST_HOST_EMAIL, TEST_HOST_PASSWORD);
      await page.waitForURL("**/protected/**");

      // Step 2: 홈 페이지에서 "이벤트 만들기" 버튼 클릭
      await page.click("button:has-text('이벤트 만들기')");
      await page.waitForURL("**/protected/events/new");

      // Step 3: 이벤트 정보 입력 및 생성
      const eventTitle = `테스트 이벤트 ${Date.now()}`;
      await page.fill('input[placeholder="이벤트 제목"]', eventTitle);
      await page.fill('input[type="date"]', "2026-04-20");
      await page.fill('input[placeholder="장소"]', "테스트 장소");
      await page.fill('textarea[placeholder*="설명"]', "테스트 이벤트 설명");
      await page.click('button:has-text("생성")');

      // Step 4: 이벤트 상세 페이지 확인
      await page.waitForURL("**/protected/events/[eventId]");
      const isEventTitleVisible = await page
        .locator("text=" + eventTitle)
        .isVisible();
      expect(isEventTitleVisible).toBe(true);

      // Step 5: 초대 링크 복사
      const copyButton = page.locator('button:has-text("초대 링크 복사")');
      await copyButton.click();
      const inviteLinkText = await page.locator("text=복사됨").isVisible();
      expect(inviteLinkText).toBe(true);

      // Step 6: 초대 링크 추출 (URL에서)
      const currentUrl = page.url();
      const eventId = currentUrl.split("/").pop();
      const inviteLink = `${BASE_URL}/join/${eventId}`;

      // Step 7: 로그아웃
      await logout(page);

      // ======== 참여자 플로우로 전환 ========
      // Step 8: 참여자가 초대 링크 접근
      await page.goto(inviteLink);
      await page.waitForURL("**/join/**");

      // Step 9: 로그인/회원가입 버튼 클릭
      const loginBtn = page.locator('button:has-text("로그인하기")');
      const signUpBtn = page.locator('button:has-text("회원가입")');
      if (await loginBtn.isVisible()) {
        await loginBtn.click();
      } else {
        await signUpBtn.click();
      }

      // Step 10: 참여자 로그인
      await loginAsEmail(
        page,
        TEST_PARTICIPANT_EMAIL,
        TEST_PARTICIPANT_PASSWORD,
      );

      // Step 11: 자동 참여 확인
      await page.waitForURL("**/protected/**");
      const participantsList = await page.locator("text=참여자").isVisible();
      expect(participantsList).toBe(true);

      // ======== 주최자 플로우 복귀 ========
      // Step 12: 주최자 로그인
      await logout(page);
      await loginAsEmail(page, TEST_HOST_EMAIL, TEST_HOST_PASSWORD);

      // Step 13: 이벤트 상세 페이지에서 참여자 수 확인
      await page.goto(`${BASE_URL}/protected/events/${eventId}`);
      await page.waitForURL("**/protected/events/**");

      // 참여자가 2명 이상 표시되는지 확인 (주최자 1명 + 참여자 1명)
      const participantCountText = await page
        .locator("text=/참여자.*명/")
        .first()
        .textContent();
      expect(participantCountText).toContain("참여자");
      expect(participantCountText).toContain("2"); // 주최자 + 참여자
    });
  });

  test.describe("참여자 플로우 (F004-F007)", () => {
    test("초대 링크 클릭 → 자동 참여 → 내가 참여한 이벤트 확인", async ({
      page,
    }) => {
      // Step 1: 새로운 이벤트 생성 (주최자로)
      await loginAsEmail(page, TEST_HOST_EMAIL, TEST_HOST_PASSWORD);
      await page.goto(`${BASE_URL}/protected/events/new`);

      const eventTitle = `참여 테스트 ${Date.now()}`;
      await page.fill('input[placeholder="이벤트 제목"]', eventTitle);
      await page.fill('input[type="date"]', "2026-04-21");
      await page.fill('input[placeholder="장소"]', "테스트 장소 2");
      await page.click('button:has-text("생성")');

      // Step 2: 초대 링크 획득
      const currentUrl = page.url();
      const eventId = currentUrl.split("/").pop();
      const inviteLink = `${BASE_URL}/join/${eventId}`;

      await logout(page);

      // Step 3: 참여자가 초대 링크 접근
      await page.goto(inviteLink);

      // Step 4: 이벤트 정보 미리보기 확인
      const eventTitleVisible = await page
        .locator("text=" + eventTitle)
        .isVisible();
      expect(eventTitleVisible).toBe(true);

      // Step 5: 로그인
      await loginAsEmail(
        page,
        TEST_PARTICIPANT_EMAIL,
        TEST_PARTICIPANT_PASSWORD,
      );

      // Step 6: 자동 참여 확인
      await page.waitForURL("**/protected/**");

      // Step 7: "내가 참여한 이벤트" 페이지로 이동
      await page.click("a:has-text('Calendar')"); // 모바일 네비 또는 메뉴
      await page.waitForURL("**/protected/participants**");

      // Step 8: 참여한 이벤트 목록에서 확인
      const participationEventVisible = await page
        .locator("text=" + eventTitle)
        .isVisible();
      expect(participationEventVisible).toBe(true);
    });
  });

  test.describe("관리자 플로우 (F012-F015)", () => {
    test("관리자 로그인 → 대시보드 → 이벤트 관리 → 사용자 관리", async ({
      page,
    }) => {
      // Step 1: 관리자 로그인
      await loginAsEmail(page, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, true);

      // Step 2: 관리자 대시보드 확인
      await page.waitForURL("**/protected/admin**");

      // Step 3: 통계 카드 확인 (F012)
      const totalEventsCard = await page
        .locator("text=/전체 이벤트|Total Events/")
        .isVisible();
      const totalUsersCard = await page
        .locator("text=/전체 사용자|Total Users/")
        .isVisible();
      expect(totalEventsCard || totalUsersCard).toBe(true);

      // Step 4: 이벤트 관리 테이블로 이동 (F013)
      await page.click("a:has-text('이벤트 관리')");
      await page.waitForURL("**/protected/admin/events");

      // Step 5: 검색 기능 테스트
      await page.fill('input[placeholder="이벤트 제목 검색"]', "테스트");
      await page.click('button:has-text("검색")');
      await page.waitForLoadState("networkidle");

      // Step 6: 필터 기능 테스트
      const filterSelect = page.locator("select").first();
      await filterSelect.selectOption("active");
      await page.click('button:has-text("검색")');
      await page.waitForLoadState("networkidle");

      // Step 7: 사용자 관리 테이블로 이동 (F014)
      await page.click("a:has-text('사용자 관리')");
      await page.waitForURL("**/protected/admin/users");

      // Step 8: 사용자 목록 확인
      const usersTableVisible = await page
        .locator("text=/사용자|이메일/")
        .isVisible();
      expect(usersTableVisible).toBe(true);

      // Step 9: 사용자 검색
      await page.fill('input[placeholder="사용자 이름 검색"]', "test");
      await page.click('button:has-text("검색")');
      await page.waitForLoadState("networkidle");

      // Step 10: 통계 분석 페이지로 이동 (F015)
      await page.click("a:has-text('통계')");
      await page.waitForURL("**/protected/admin/stats");

      // Step 11: 차트 렌더링 확인
      const chartsVisible = await page
        .locator("svg") // Recharts는 SVG로 렌더링
        .first()
        .isVisible();
      expect(chartsVisible).toBe(true);

      // Step 12: 페이지네이션 테스트
      const nextButton = page.locator('button:has-text("다음")');
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForLoadState("networkidle");
      }
    });

    test("관리자 권한 없이 접근 불가", async ({ page }) => {
      // Step 1: 일반 사용자로 로그인
      await loginAsEmail(
        page,
        TEST_PARTICIPANT_EMAIL,
        TEST_PARTICIPANT_PASSWORD,
      );

      // Step 2: 관리자 대시보드 직접 접근 시도
      await page.goto(`${BASE_URL}/protected/admin`);

      // Step 3: 접근 거부 또는 리다이렉트 확인
      const isRedirected =
        page.url() !== `${BASE_URL}/protected/admin` ||
        (await page.locator("text=접근 권한이 없습니다").isVisible());
      expect(isRedirected).toBe(true);
    });
  });

  test.describe("에러 핸들링 및 엣지 케이스", () => {
    test("존재하지 않는 초대 코드 접근", async ({ page }) => {
      const invalidInviteLink = `${BASE_URL}/join/invalid-code-12345`;
      await page.goto(invalidInviteLink);

      // 에러 메시지 또는 리다이렉트 확인
      const errorVisible = await page
        .locator("text=/이벤트를 찾을 수 없습니다|Event not found/")
        .isVisible();
      const isRedirected = !page.url().includes("/join/");

      expect(errorVisible || isRedirected).toBe(true);
    });

    test("중복 참여 방지", async ({ page }) => {
      // Step 1: 이벤트 생성 및 초대 링크 획득
      await loginAsEmail(page, TEST_HOST_EMAIL, TEST_HOST_PASSWORD);
      await page.goto(`${BASE_URL}/protected/events/new`);

      const eventTitle = `중복 참여 테스트 ${Date.now()}`;
      await page.fill('input[placeholder="이벤트 제목"]', eventTitle);
      await page.fill('input[type="date"]', "2026-04-22");
      await page.click('button:has-text("생성")');

      const currentUrl = page.url();
      const eventId = currentUrl.split("/").pop();
      const inviteLink = `${BASE_URL}/join/${eventId}`;

      await logout(page);

      // Step 2: 첫 번째 참여
      await page.goto(inviteLink);
      await loginAsEmail(
        page,
        TEST_PARTICIPANT_EMAIL,
        TEST_PARTICIPANT_PASSWORD,
      );
      await page.waitForURL("**/protected/**");

      // Step 3: 로그아웃 후 같은 초대 링크로 다시 접근
      await logout(page);
      await page.goto(inviteLink);

      // Step 4: 이미 참여한 이벤트 메시지 또는 자동 참여 방지 확인
      const alreadyParticipating = await page
        .locator("text=/이미 참여|Already joined/")
        .isVisible();
      expect(alreadyParticipating).toBe(true);
    });

    test("로그인 없이 보호된 라우트 접근 불가", async ({ page }) => {
      await page.goto(`${BASE_URL}/protected/events`);
      // 로그인 페이지로 리다이렉트되는지 확인
      await page.waitForURL("**/auth/login", { timeout: 5000 });
      expect(page.url()).toContain("/auth/login");
    });

    test("권한 없는 이벤트 수정 시도", async ({ page }) => {
      // Step 1: 호스트로 이벤트 생성
      await loginAsEmail(page, TEST_HOST_EMAIL, TEST_HOST_PASSWORD);
      await page.goto(`${BASE_URL}/protected/events/new`);

      const eventTitle = `권한 테스트 ${Date.now()}`;
      await page.fill('input[placeholder="이벤트 제목"]', eventTitle);
      await page.fill('input[type="date"]', "2026-04-23");
      await page.click('button:has-text("생성")');

      const currentUrl = page.url();
      const eventId = currentUrl.split("/").pop();

      await logout(page);

      // Step 2: 다른 사용자로 수정 페이지 접근 시도
      await loginAsEmail(
        page,
        TEST_PARTICIPANT_EMAIL,
        TEST_PARTICIPANT_PASSWORD,
      );
      await page.goto(`${BASE_URL}/protected/events/${eventId}/edit`);

      // Step 3: 접근 거부 또는 리다이렉트 확인
      const isRedirected =
        !page.url().includes("/edit") ||
        (await page.locator("text=권한이 없습니다").isVisible());
      expect(isRedirected).toBe(true);
    });
  });
});
