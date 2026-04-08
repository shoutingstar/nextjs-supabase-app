#!/usr/bin/env node

/**
 * 파일 크기 제한 테스트 스크립트
 *
 * 사용법:
 * node scripts/test-file-upload.js
 */

const fs = require("fs");
const path = require("path");

// 테스트 설정
const TEST_CONFIG = {
  email: "dhljjknd@gmail.com",
  password: "123456",
  testCases: [
    { size: 2 * 1024 * 1024, name: "2MB", shouldPass: true },
    { size: 4 * 1024 * 1024, name: "4MB", shouldPass: true },
    { size: 5 * 1024 * 1024, name: "5MB (경계값)", shouldPass: true },
    { size: 6 * 1024 * 1024, name: "6MB", shouldPass: false },
  ],
};

// 파일 크기 제한 설정 검증
const FILE_SIZE_LIMITS = {
  "account-form.tsx": {
    path: "app/protected/(user)/account/account-form.tsx",
    limit: 5 * 1024 * 1024,
    description: "프로필 사진 (클라이언트)",
  },
  "account/actions.ts": {
    path: "app/protected/(user)/account/actions.ts",
    limit: 5 * 1024 * 1024,
    description: "프로필 사진 (서버)",
  },
  "events/actions.ts": {
    path: "app/protected/(user)/events/actions.ts",
    limit: 5 * 1024 * 1024,
    description: "이벤트 이미지 (서버)",
  },
};

/**
 * 코드에서 파일 크기 제한 검증
 */
function verifyFileSizeLimits() {
  console.log("\n📋 파일 크기 제한 코드 검증\n");
  console.log("=".repeat(70));

  let allPassed = true;

  Object.entries(FILE_SIZE_LIMITS).forEach(([key, config]) => {
    const filePath = path.join(process.cwd(), config.path);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ 파일 없음: ${config.path}`);
      allPassed = false;
      return;
    }

    const content = fs.readFileSync(filePath, "utf-8");

    // 5MB 제한이 있는지 확인
    const has5MBLimit =
      content.includes("5 * 1024 * 1024") ||
      content.includes("5242880") ||
      content.includes("5MB");

    if (has5MBLimit) {
      console.log(`✅ ${config.description}`);
      console.log(`   📄 파일: ${config.path}`);
      console.log(`   📏 제한: 5MB (5,242,880 bytes)`);
      console.log("");
    } else {
      console.log(`⚠️  ${config.description}`);
      console.log(`   📄 파일: ${config.path}`);
      console.log(`   ❌ 5MB 제한을 찾을 수 없습니다`);
      console.log("");
      allPassed = false;
    }
  });

  console.log("=".repeat(70));

  return allPassed;
}

/**
 * 테스트 파일 생성
 */
function generateTestFiles() {
  console.log("\n🎬 테스트 파일 생성\n");
  console.log("=".repeat(70));

  const testDir = path.join(process.cwd(), ".test-files");

  // 테스트 디렉토리 생성
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  TEST_CONFIG.testCases.forEach(({ size, name, shouldPass }) => {
    const fileName = `test-${name.replace(/\s+/g, "-")}.jpg`;
    const filePath = path.join(testDir, fileName);

    // 파일이 이미 있으면 스킵
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(
        `✅ ${name} 파일 이미 존재 (${(stats.size / 1024 / 1024).toFixed(2)}MB)`,
      );
      return;
    }

    // 테스트 파일 생성
    const buffer = Buffer.alloc(size);
    fs.writeFileSync(filePath, buffer);

    const stats = fs.statSync(filePath);
    const shouldPassStr = shouldPass ? "✅ 성공" : "❌ 실패";
    console.log(
      `📦 생성: ${fileName} (${(stats.size / 1024 / 1024).toFixed(2)}MB) - 예상: ${shouldPassStr}`,
    );
  });

  console.log("");
  console.log("💾 테스트 파일 위치:", testDir);
  console.log("=".repeat(70));
}

/**
 * 테스트 계획 출력
 */
function printTestPlan() {
  console.log("\n🧪 테스트 계획\n");
  console.log("=".repeat(70));

  console.log("계정: dhljjknd@gmail.com / 123456\n");

  console.log("프로필 사진 업로드 (/protected/account):");
  console.log("━".repeat(70));
  TEST_CONFIG.testCases.forEach(({ name, shouldPass }) => {
    const result = shouldPass ? "✅ 성공" : "❌ 실패";
    console.log(`  ${name.padEnd(15)} → ${result}`);
  });

  console.log("\n이벤트 이미지 업로드 (/protected/events/new):");
  console.log("━".repeat(70));
  TEST_CONFIG.testCases.forEach(({ name, shouldPass }) => {
    const result = shouldPass ? "✅ 성공" : "❌ 실패";
    console.log(`  ${name.padEnd(15)} → ${result}`);
  });

  console.log("\n" + "=".repeat(70));
}

/**
 * 메인 실행
 */
function main() {
  console.log("\n\n🚀 파일 크기 제한 테스트 스크립트\n".padStart(50));

  // 1. 파일 크기 제한 검증
  const limitsValid = verifyFileSizeLimits();

  // 2. 테스트 파일 생성
  generateTestFiles();

  // 3. 테스트 계획 출력
  printTestPlan();

  // 4. 최종 결론
  console.log("\n📊 최종 결론\n");
  if (limitsValid) {
    console.log("✅ 모든 파일 크기 제한이 5MB로 설정되어 있습니다.");
    console.log("");
    console.log("다음 단계:");
    console.log("1. 테스트 파일이 .test-files 디렉토리에 생성되었습니다.");
    console.log("2. 웹 브라우저에서 앱에 접속하세요.");
    console.log("3. 위의 테스트 계획을 따라 파일 업로드를 테스트하세요.");
    console.log("4. 모든 예상 결과와 일치하는지 확인하세요.");
  } else {
    console.log(
      "⚠️  파일 크기 제한 설정에 문제가 있습니다. 위의 결과를 확인하세요.",
    );
  }

  console.log("\n" + "=".repeat(70) + "\n");
}

// 실행
main();
