import { chromium } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

const baseUrl = "https://automationintesting.online/admin";
const storagePath = "auth.json";

//Gets arguments from the user when running tests from CLI
function getArgValue(prefix) {
  const arg = process.argv.find((arg) => arg.startsWith(prefix + ":"));
  return arg ? arg.split(":")[1] : undefined;
}

//In case of running from CLI - waits for "user/password" input. Otherwayse using creds from the environment
const username = getArgValue("user") || process.env.UI_USER;
const password = getArgValue("password") || process.env.UI_PASSWORD;

if (!username || !password) {
  throw new Error(
    "Username and password must be provided via CLI or environment variables"
  );
}

/**
 * Validates an existing session stored in auth.json
 * Returns true if login-protected element (createRoom button) is visible
 */
async function isSessionValid() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: storagePath });
  const page = await context.newPage();
  await page.goto(baseUrl);
  const isLoggedIn = await page
    .locator(locators.createRoomBtn)
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
  await page.fill(locators.username, username);
  await page.fill(locators.password, password);
  await page.click(locators.loginBtn);
  await page.waitForSelector(locators.createRoomBtn, { timeout: 5000 });
  await context.storageState({ path: storagePath });
  await browser.close();
  console.log("✅ Login successful, session saved.");
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
    console.log("🔁 Session expired or missing. Logging in again...");
    await loginAndSaveSession();
  } else {
    console.log("✅ Reusing existing valid session.");
  }
}

const locators = {
  createRoomBtn: "#createRoom",
  username: "#username",
  password: "#password",
  loginBtn: "#doLogin",
};

export default globalSetup;
