import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    browserName: "chromium",
    headless: isCI,
    viewport: { width: 1600, height: 1000 },
    storageState: "auth.json",
  },
  globalSetup: "./tests/helpers/ui-login.js",
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],
});
