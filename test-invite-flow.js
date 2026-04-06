const http = require("http");

const inviteCode = "r6zvhxck";
const eventId = "a58213e1-3e1b-465d-9756-43cc9349efa2";

console.log("🧪 초대 링크 테스트 시작");
console.log(`📝 inviteCode: ${inviteCode}`);
console.log(`📝 eventId: ${eventId}`);
console.log("");

// 시크릿 모드처럼 쿠키 없이 요청 (미인증)
function makeRequest(path, expectedRedirect = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: "GET",
      headers: {
        "User-Agent": "Test Script",
        // 쿠키 없음 = 미인증 사용자
      },
      redirect: "manual", // 리다이렉트 추적
    };

    console.log(`\n📌 요청: GET ${path}`);

    const req = http.request(options, (res) => {
      const location = res.headers.location;
      const statusCode = res.statusCode;

      console.log(`   상태 코드: ${statusCode}`);
      if (location) {
        console.log(`   Location 헤더: ${location}`);
      }

      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve({ statusCode, location, data });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

async function runTest() {
  try {
    // Step 1: 초대 링크 접속 (미인증)
    console.log("\n✅ Step 1: 초대 링크 접속 (미인증 사용자)");
    console.log("━".repeat(60));
    const step1 = await makeRequest(`/join/${inviteCode}`);

    if (!step1.location) {
      console.log("❌ 리다이렉트가 없습니다!");
      console.log("   응답 본문 (처음 500자):", step1.data.substring(0, 500));
      process.exit(1);
    }

    // Step 2: 리다이렉트 확인
    console.log("\n✅ Step 2: 리다이렉트 URL 분석");
    console.log("━".repeat(60));

    const redirectUrl = step1.location;
    console.log(`📍 리다이렉트 URL: ${redirectUrl}`);

    // URL 파싱
    const url = new URL(redirectUrl, "http://localhost:3000");
    const redirectTo = url.searchParams.get("redirect_to");

    console.log(`\n📦 쿼리 파라미터 분석:`);
    console.log(`   - redirect_to: ${redirectTo || "❌ 없음"}`);

    if (!redirectTo) {
      console.log("\n❌ redirect_to 파라미터가 없습니다!");
      console.log(
        "   예상: /auth/login?redirect_to=/protected/events/[eventId]?join=true&code=[code]",
      );
      console.log("   실제:", redirectUrl);
      process.exit(1);
    }

    // Step 3: redirect_to 값 검증
    console.log("\n✅ Step 3: redirect_to 값 검증");
    console.log("━".repeat(60));

    const expectedEventPath = `/protected/events/${eventId}`;
    const expectedCode = inviteCode;

    console.log(`   예상되는 값:
   - eventId 포함: ${expectedEventPath}
   - 쿼리 파라미터: join=true&code=${expectedCode}`);

    console.log(`\n   실제 redirect_to 값:
   ${redirectTo}`);

    if (
      redirectTo.includes(expectedEventPath) &&
      redirectTo.includes(`code=${expectedCode}`)
    ) {
      console.log("\n✅ redirect_to 파라미터 검증 성공!");
    } else {
      console.log("\n⚠️ redirect_to 파라미터 형식이 예상과 다릅니다");
      console.log(`   eventId 포함: ${redirectTo.includes(expectedEventPath)}`);
      console.log(
        `   code 포함: ${redirectTo.includes(`code=${expectedCode}`)}`,
      );
    }

    // Step 4: 최종 검증
    console.log("\n✅ Step 4: 최종 검증 결과");
    console.log("━".repeat(60));

    if (step1.statusCode === 307 || step1.statusCode === 302) {
      console.log(`✅ 리다이렉트 상태 코드 (${step1.statusCode}): 정상`);
    } else {
      console.log(`❌ 리다이렉트 상태 코드 (${step1.statusCode}): 비정상`);
    }

    if (redirectUrl.includes("/auth/login")) {
      console.log("✅ 로그인 페이지로 리다이렉트: 정상");
    } else {
      console.log("❌ 로그인 페이지로 리다이렉트: 비정상");
    }

    if (redirectUrl.includes("redirect_to=")) {
      console.log("✅ redirect_to 파라미터 포함: 정상");
    } else {
      console.log("❌ redirect_to 파라미터 미포함: 비정상");
    }

    // 최종 결과
    console.log("\n" + "=".repeat(60));
    console.log("🎯 최종 결과");
    console.log("=".repeat(60));

    if (
      step1.statusCode === 307 &&
      redirectUrl.includes("/auth/login") &&
      redirectUrl.includes("redirect_to=") &&
      redirectUrl.includes(expectedEventPath) &&
      redirectUrl.includes(`code=${expectedCode}`)
    ) {
      console.log("✅ 모든 테스트 통과! 초대 링크 흐름이 정상 작동합니다.");
      console.log("\n📍 예상되는 사용자 경로:");
      console.log(`1. 시크릿 모드에서 /join/${inviteCode} 접속`);
      console.log(`2. 자동으로 ${redirectUrl}로 리다이렉트`);
      console.log(`3. 사용자가 로그인`);
      console.log(`4. 로그인 후 ${redirectTo}로 이동`);
      console.log(`5. 자동으로 이벤트에 참여`);
    } else {
      console.log("❌ 일부 테스트 실패. 위의 결과를 확인하세요.");
    }

    console.log("\n" + "=".repeat(60));
    process.exit(0);
  } catch (error) {
    console.error("❌ 테스트 중 오류 발생:", error);
    process.exit(1);
  }
}

runTest();
