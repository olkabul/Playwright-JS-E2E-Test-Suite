import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const isCI = !!process.env.CI;
const testType = process.env.TEST_TYPE || "ui"; // default to UI if not specified

//Base config
const config = {
  timeout: 30000,
  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    browserName: "chromium",
    headless: isCI,
    viewport: { width: 1600, height: 1000 },
  },
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],
};

// Adjusting to test type
if (testType === "ui") {
  config.testDir = "./tests/ui-tests";
  config.globalSetup = "./tests/helpers/ui-login.js";
  config.use.storageState = "auth.json";
} else if (testType === "api") {
  config.testDir = "./tests/api-tests";
  // No UI login or storageState needed
}

export default defineConfig(config);
