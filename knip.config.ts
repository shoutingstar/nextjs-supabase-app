import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "app/**/*.{ts,tsx}",
    "proxy.ts",
    "next.config.ts",
    "tailwind.config.ts",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "knip.config.ts",
  ],
  project: ["**/*.{ts,tsx,mjs}"],
  ignore: ["node_modules/**", ".next/**", "next-env.d.ts"],
  ignoreDependencies: ["autoprefixer", "postcss"],
};

export default config;
