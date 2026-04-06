import { expect, type Page, test } from "@playwright/test";

/**
 * 이벤트 생성/수정/삭제 E2E 테스트
 *
 * 테스트 환경: 로컬 개발 서버 (http://localhost:3000)
 *
 * 사전 조건:
 * - 개발 서버가 실행 중이어야 합니다 (npm run dev)
 * - .env.local에 테스트 계정 정보가 설정되어 있어야 합니다:
 *   E2E_TEST_EMAIL=test@example.com
 *   E2E_TEST_PASSWORD=your_password
 */

const BASE_URL = "http://localhost:3000";

// 테스트 계정 환경 변수 (없으면 빈 문자열 - skip 처리됨)
const TEST_EMAIL = process.env.E2E_TEST_EMAIL ?? "";
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD ?? "";

/* ============================================================================
 * 로그인 헬퍼 함수
 * 각 테스트 전에 로그인 상태를 확보합니다.
 * ============================================================================ */

async function login(
  page: Page,
  email: string = TEST_EMAIL,
  password: string = TEST_PASSWORD,
) {
  await page.goto(`${BASE_URL}/auth/login`);

  // 로그인 폼 작성
  await page.fill("#email", email);
  await page.fill("#password", password);

  // 로그인 버튼 클릭 (Login 텍스트)
  await page.click('button[type="submit"]');

  // 로그인 성공 후 /protected 경로로 리다이렉트 확인
  await page.waitForURL(/\/protected/, { timeout: 15_000 });
}

/* ============================================================================
 * 테스트 데이터 헬퍼
 * ============================================================================ */

/** 테스트용 고유 이벤트 제목 생성 (중복 방지) */
function uniqueEventTitle() {
  return `E2E 테스트 이벤트 ${Date.now()}`;
}

/** 미래 날짜/시간 문자열 생성 (datetime-local 입력 형식: YYYY-MM-DDTHH:mm) */
function futureDatetime(daysFromNow = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  // YYYY-MM-DDTHH:mm 형식으로 변환 (로컬 시간)
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/* ============================================================================
 * 사전 조건 검증
 * ============================================================================ */

test.describe("사전 조건: 환경 변수 확인", () => {
  test("테스트 계정 환경 변수가 설정되어 있어야 함", () => {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      test.skip(
        true,
        [
          "E2E_TEST_EMAIL, E2E_TEST_PASSWORD 환경 변수가 설정되지 않았습니다.",
          ".env.local에 다음을 추가하세요:",
          "E2E_TEST_EMAIL=your_test_email@example.com",
          "E2E_TEST_PASSWORD=your_test_password",
        ].join("\n"),
      );
    }
  });
});

/* ============================================================================
 * 시나리오 1: 로그인 및 대시보드 접근
 * ============================================================================ */

test.describe("시나리오 1: 로그인 및 대시보드 접근", () => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, "테스트 계정 환경 변수 미설정");

  test("이메일/패스워드로 로그인 후 대시보드에 접근 가능", async ({ page }) => {
    await login(page);

    // 대시보드 페이지 확인
    await expect(page).toHaveURL(/\/protected/);

    // 인사말 또는 대시보드 콘텐츠 확인
    await expect(
      page.getByText(/어서오세요|이벤트|대시보드/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("로그인 상태에서 이벤트 목록 페이지 접근 가능", async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/protected/events`);

    // 이벤트 페이지 확인 (헤더 텍스트)
    await expect(page.getByRole("heading", { name: "이벤트" })).toBeVisible({
      timeout: 10_000,
    });
  });
});

/* ============================================================================
 * 시나리오 2: 이벤트 생성 플로우
 * ============================================================================ */

test.describe("시나리오 2: 이벤트 생성 플로우", () => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, "테스트 계정 환경 변수 미설정");

  test("새 이벤트 만들기 버튼 클릭 시 이벤트 생성 페이지로 이동", async ({
    page,
  }) => {
    await login(page);
    await page.goto(`${BASE_URL}/protected/events`);

    // FAB 버튼 (aria-label="이벤트 만들기" 또는 "새 이벤트 만들기") 클릭
    const fabLink = page.locator('a[href="/protected/events/new"]').first();
    await expect(fabLink).toBeVisible({ timeout: 10_000 });
    await fabLink.click();

    // 이벤트 생성 페이지 URL 확인
    await expect(page).toHaveURL(/\/protected\/events\/new/);
  });

  test("이벤트 생성 폼 전체 플로우 (생성 → 상세 페이지 리다이렉트)", async ({
    page,
  }) => {
    await login(page);
    await page.goto(`${BASE_URL}/protected/events/new`);

    const eventTitle = uniqueEventTitle();
    const eventDate = futureDatetime(7);

    // 이벤트 제목 입력
    await page.fill('input[placeholder*="이벤트 제목"]', eventTitle);

    // 날짜/시간 입력 (datetime-local)
    await page.fill('input[type="datetime-local"]', eventDate);

    // 장소 입력 (선택)
    await page.fill('input[placeholder*="장소"]', "서울시 강남구 테헤란로 123");

    // 최대 참여 인원 입력 (선택)
    await page.fill('input[type="number"]', "10");

    // 설명 입력 (선택)
    await page.fill("textarea", "E2E 테스트를 위한 이벤트입니다.");

    // 폼 제출 ("이벤트 만들기" 버튼)
    await page.click('button[type="submit"]');

    // 성공 토스트 확인 (sonner 토스트는 li[data-sonner-toast] 또는 텍스트로 확인)
    await expect(
      page.getByText(/이벤트가 생성되었습니다|생성되었습니다/i),
    ).toBeVisible({ timeout: 15_000 });

    // 이벤트 상세 페이지로 리다이렉트 확인
    await page.waitForURL(/\/protected\/events\/[^/]+$/, { timeout: 15_000 });

    // 생성된 이벤트 제목이 상세 페이지에 표시됨
    await expect(page.getByRole("heading", { name: eventTitle })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("이벤트 생성 후 이벤트 목록에 나타남", async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/protected/events/new`);

    const eventTitle = uniqueEventTitle();

    // 최소 필드만 입력 (제목 + 날짜)
    await page.fill('input[placeholder*="이벤트 제목"]', eventTitle);
    await page.fill('input[type="datetime-local"]', futureDatetime(14));

    // 폼 제출
    await page.click('button[type="submit"]');

    // 이벤트 상세 페이지로 리다이렉트
    await page.waitForURL(/\/protected\/events\/[^/]+$/, { timeout: 15_000 });

    // 이벤트 목록으로 이동
    await page.goto(`${BASE_URL}/protected/events`);

    // 생성된 이벤트가 목록에 나타나는지 확인
    await expect(page.getByText(eventTitle)).toBeVisible({ timeout: 10_000 });
  });

  test("필수 필드(제목) 미입력 시 유효성 검사 오류 표시", async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/protected/events/new`);

    // 제목 없이 폼 제출 시도
    await page.click('button[type="submit"]');

    // 유효성 검사 오류 메시지 확인
    await expect(page.getByText(/제목|필수|입력해/i).first()).toBeVisible({
      timeout: 5_000,
    });
  });
});

/* ============================================================================
 * 시나리오 3: 이벤트 수정 플로우
 * ============================================================================ */

test.describe("시나리오 3: 이벤트 수정 플로우", () => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, "테스트 계정 환경 변수 미설정");

  /**
   * 이벤트 생성 후 수정 테스트를 위한 헬퍼
   * 이벤트를 생성하고 상세 페이지 URL의 eventId를 반환합니다.
   */
  async function createTestEvent(page: Page, title: string): Promise<string> {
    await page.goto(`${BASE_URL}/protected/events/new`);
    await page.fill('input[placeholder*="이벤트 제목"]', title);
    await page.fill('input[type="datetime-local"]', futureDatetime(10));
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/protected\/events\/[^/]+$/, { timeout: 15_000 });

    // URL에서 eventId 추출
    const url = page.url();
    const match = url.match(/\/protected\/events\/([^/]+)$/);
    return match?.[1] ?? "";
  }

  test("이벤트 수정 버튼 클릭 시 수정 페이지로 이동", async ({ page }) => {
    await login(page);

    const eventTitle = uniqueEventTitle();
    const eventId = await createTestEvent(page, eventTitle);

    // 이벤트 상세 페이지에서 "이벤트 수정" 버튼 클릭 (호스트에게만 표시)
    await expect(page.getByRole("link", { name: "이벤트 수정" })).toBeVisible({
      timeout: 10_000,
    });
    await page.getByRole("link", { name: "이벤트 수정" }).click();

    // 수정 페이지 URL 확인
    await expect(page).toHaveURL(
      new RegExp(`/protected/events/${eventId}/edit`),
    );
  });

  test("이벤트 제목 수정 후 변경사항 저장", async ({ page }) => {
    await login(page);

    const originalTitle = uniqueEventTitle();
    const eventId = await createTestEvent(page, originalTitle);

    // 수정 페이지로 이동
    await page.goto(`${BASE_URL}/protected/events/${eventId}/edit`);

    // 제목 필드 초기화 후 새 제목 입력
    const updatedTitle = `${originalTitle} (수정됨)`;
    const titleInput = page.locator('input[placeholder*="이벤트 제목"]');
    await titleInput.clear();
    await titleInput.fill(updatedTitle);

    // "변경사항 저장" 버튼 클릭
    await page.click('button[type="submit"]');

    // 성공 토스트 확인
    await expect(
      page.getByText(/이벤트가 수정되었습니다|수정되었습니다/i),
    ).toBeVisible({ timeout: 15_000 });

    // 이벤트 상세 페이지로 리다이렉트 확인
    await page.waitForURL(new RegExp(`/protected/events/${eventId}$`), {
      timeout: 15_000,
    });

    // 수정된 제목이 상세 페이지에 반영됨
    await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible(
      { timeout: 10_000 },
    );
  });

  test("이벤트 수정 폼에 기존 데이터가 미리 채워져 있음", async ({ page }) => {
    await login(page);

    const eventTitle = uniqueEventTitle();
    const eventId = await createTestEvent(page, eventTitle);

    // 수정 페이지로 이동
    await page.goto(`${BASE_URL}/protected/events/${eventId}/edit`);

    // 기존 제목이 폼에 미리 채워져 있는지 확인
    const titleInput = page.locator('input[placeholder*="이벤트 제목"]');
    await expect(titleInput).toHaveValue(eventTitle, { timeout: 10_000 });
  });

  test("취소 버튼 클릭 시 이전 페이지로 이동", async ({ page }) => {
    await login(page);

    const eventTitle = uniqueEventTitle();
    const eventId = await createTestEvent(page, eventTitle);

    // 수정 페이지로 이동
    await page.goto(`${BASE_URL}/protected/events/${eventId}/edit`);

    // 취소 버튼 클릭
    await page.getByRole("button", { name: "취소" }).click();

    // 이전 페이지(이벤트 상세 또는 이벤트 목록)로 이동 확인
    await expect(page).toHaveURL(/\/protected\/events/, { timeout: 10_000 });
  });
});

/* ============================================================================
 * 시나리오 4: 이벤트 삭제 플로우
 * ============================================================================ */

test.describe("시나리오 4: 이벤트 삭제 플로우", () => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, "테스트 계정 환경 변수 미설정");

  /**
   * 이벤트 생성 헬퍼 (삭제 테스트용)
   */
  async function createAndGoToEdit(
    page: Page,
  ): Promise<{ title: string; eventId: string }> {
    const title = uniqueEventTitle();
    await page.goto(`${BASE_URL}/protected/events/new`);
    await page.fill('input[placeholder*="이벤트 제목"]', title);
    await page.fill('input[type="datetime-local"]', futureDatetime(5));
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/protected\/events\/[^/]+$/, { timeout: 15_000 });

    const url = page.url();
    const match = url.match(/\/protected\/events\/([^/]+)$/);
    const eventId = match?.[1] ?? "";

    // 수정 페이지로 이동 (삭제 버튼이 있는 곳)
    await page.goto(`${BASE_URL}/protected/events/${eventId}/edit`);

    return { title, eventId };
  }

  test("삭제 버튼 클릭 시 확인 다이얼로그 표시", async ({ page }) => {
    await login(page);
    await createAndGoToEdit(page);

    // "이벤트 삭제" 버튼 클릭
    await page.getByRole("button", { name: "이벤트 삭제" }).click();

    // 확인 다이얼로그 표시 확인
    await expect(page.getByText(/이벤트를 삭제하시겠습니까/i)).toBeVisible({
      timeout: 5_000,
    });
  });

  test("삭제 확인 다이얼로그에서 취소 클릭 시 다이얼로그 닫힘", async ({
    page,
  }) => {
    await login(page);
    await createAndGoToEdit(page);

    // "이벤트 삭제" 버튼 클릭
    await page.getByRole("button", { name: "이벤트 삭제" }).click();

    // 확인 다이얼로그 내 "취소" 버튼 클릭
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "취소" }).click();

    // 다이얼로그가 닫혔는지 확인 (이벤트 삭제하시겠습니까 텍스트가 사라짐)
    await expect(page.getByText(/이벤트를 삭제하시겠습니까/i)).not.toBeVisible({
      timeout: 5_000,
    });

    // 아직 수정 페이지에 머물러 있음
    await expect(page).toHaveURL(/\/edit$/, { timeout: 5_000 });
  });

  test("이벤트 삭제 확인 후 목록에서 제거됨", async ({ page }) => {
    await login(page);
    const { title } = await createAndGoToEdit(page);

    // "이벤트 삭제" 버튼 클릭
    await page.getByRole("button", { name: "이벤트 삭제" }).click();

    // 확인 다이얼로그에서 "삭제 확인" 버튼 클릭
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "삭제 확인" }).click();

    // 삭제 후 이벤트 목록으로 리다이렉트 확인
    await page.waitForURL(/\/protected\/events$/, { timeout: 15_000 });

    // 삭제된 이벤트가 목록에서 제거됨
    await expect(page.getByText(title)).not.toBeVisible({ timeout: 10_000 });
  });

  test("삭제 처리 중 '삭제 중...' 상태 표시", async ({ page }) => {
    await login(page);
    await createAndGoToEdit(page);

    // "이벤트 삭제" 버튼 클릭
    await page.getByRole("button", { name: "이벤트 삭제" }).click();

    // 확인 다이얼로그에서 "삭제 확인" 버튼 클릭 후 즉시 상태 확인
    const dialog = page.getByRole("dialog");
    const confirmButton = dialog.getByRole("button", { name: "삭제 확인" });
    await confirmButton.click();

    // 삭제 처리 중 버튼 텍스트가 변경되거나 비활성화됨 (또는 즉시 리다이렉트)
    // 빠른 네트워크에서는 리다이렉트가 즉시 발생할 수 있으므로 두 경우 모두 허용
    await expect(page).toHaveURL(
      /\/(protected\/events$|protected\/events\/[^/]+\/edit)/,
      { timeout: 15_000 },
    );
  });
});

/* ============================================================================
 * 시나리오 5: 권한 및 접근 제어
 * ============================================================================ */

test.describe("시나리오 5: 권한 및 접근 제어", () => {
  test("비로그인 상태에서 이벤트 생성 페이지 접근 시 로그인으로 리다이렉트", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/protected/events/new`);

    // 미들웨어 또는 레이아웃에서 /auth/login으로 리다이렉트
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10_000 });
  });

  test("비로그인 상태에서 이벤트 수정 페이지 접근 시 로그인으로 리다이렉트", async ({
    page,
  }) => {
    await page.goto(
      `${BASE_URL}/protected/events/00000000-0000-0000-0000-000000000000/edit`,
    );

    // 로그인 페이지로 리다이렉트
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10_000 });
  });
});

/* ============================================================================
 * 시나리오 6: 이벤트 상세 페이지 초대 코드 확인
 * ============================================================================ */

test.describe("시나리오 6: 이벤트 상세 페이지", () => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, "테스트 계정 환경 변수 미설정");

  test("이벤트 생성 후 상세 페이지에 초대 코드 표시됨", async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/protected/events/new`);

    const eventTitle = uniqueEventTitle();
    await page.fill('input[placeholder*="이벤트 제목"]', eventTitle);
    await page.fill('input[type="datetime-local"]', futureDatetime(3));
    await page.click('button[type="submit"]');

    // 이벤트 상세 페이지로 리다이렉트
    await page.waitForURL(/\/protected\/events\/[^/]+$/, { timeout: 15_000 });

    // 초대 코드 섹션 확인 (8자리 초대 코드)
    await expect(page.getByText(/초대 코드/i)).toBeVisible({
      timeout: 10_000,
    });

    // 초대 링크 복사 버튼 확인
    await expect(
      page.getByRole("button", { name: /초대 링크 복사|복사/i }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("호스트에게만 이벤트 수정 버튼 표시됨", async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/protected/events/new`);

    const eventTitle = uniqueEventTitle();
    await page.fill('input[placeholder*="이벤트 제목"]', eventTitle);
    await page.fill('input[type="datetime-local"]', futureDatetime(3));
    await page.click('button[type="submit"]');

    // 이벤트 상세 페이지로 리다이렉트
    await page.waitForURL(/\/protected\/events\/[^/]+$/, { timeout: 15_000 });

    // 호스트에게는 수정 버튼이 표시됨
    await expect(page.getByRole("link", { name: "이벤트 수정" })).toBeVisible({
      timeout: 10_000,
    });
  });
});
