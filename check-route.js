const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/join/r6zvhxck",
  method: "GET",
  redirect: "manual",
};

const req = http.request(options, (res) => {
  console.log("상태 코드:", res.statusCode);
  console.log("모든 헤더:", JSON.stringify(res.headers, null, 2));
  console.log("");
  console.log("Location 헤더 (전체):", res.headers.location);
});

req.on("error", (error) => {
  console.error("에러:", error);
});

req.end();
