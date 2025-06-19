import { chromium } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { LoginPage } from "../../pages/login.page";
import { RoomsPage } from "../../pages/rooms.page";

const baseUrl = "https://automationintesting.online/admin";
const storagePath = "auth.json";

// Gets arguments from the user when running tests from CLI
function getArgValue(prefix) {
  const arg = process.argv.find((arg) => arg.startsWith(prefix + ":"));
  return arg ? arg.split(":")[1] : undefined;
}

// Gets credentials from CLI or env
const username = getArgValue("user") || process.env.UI_USER;
const password = getArgValue("password") || process.env.UI_PASSWORD;

if (!username || !password) {
  console.error(
    "Username and password must be provided via CLI or environment variables."
  );
  process.exit(1);
}

/**
 * Validates an existing session stored in auth.json
 * Returns true if login-protected element (createRoom button) is visible
 */
async function isSessionValid() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: storagePath });
  const page = await context.newPage();
  const roomsPage = new RoomsPage(page);

  await page.goto(baseUrl);
  const isLoggedIn = await roomsPage.createRoomBtn
    .isVisible()
    .catch(() => false);

  await browser.close();
  return isLoggedIn;
}

/**
 * Performs UI login using credentials, then saves the session to auth.json
 */
async function loginAndSaveSession() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(baseUrl);

  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);

  await page.waitForLoadState("networkidle");

  const roomsPage = new RoomsPage(page);
  const result = await Promise.race([
    roomsPage.createRoomBtn.waitFor({ timeout: 5000 }).then(() => "success"),
    loginPage.alertMsg.waitFor({ timeout: 5000 }).then(() => "error"),
  ]).catch(() => "unknown");

  if (result === "error") {
    console.error("Login failed: Invalid credentials.");
    await browser.close();
    process.exit(1);
  }

  if (result !== "success") {
    console.error("Login failed: Unknown reason.");
    await browser.close();
    process.exit(1);
  }

  await context.storageState({ path: storagePath });
  await browser.close();
}

/**
 * Entry point for Playwright globalSetup
 * - Reuses valid session from auth.json
 * - Logs in again if session is missing or invalid
 */
async function globalSetup() {
  const hasAuth = fs.existsSync(storagePath);
  const sessionValid = hasAuth ? await isSessionValid() : false;

  if (!sessionValid) {
    console.log("Session expired or missing. Logging in again...");
    await loginAndSaveSession();
  } else {
    console.log("Reusing existing valid session.");
  }
}

export default globalSetup;
