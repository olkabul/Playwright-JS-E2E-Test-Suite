import { test, expect } from "@playwright/test";
import { functions } from "../helpers/functions.js";
import { locators } from "../helpers/locators.js";

const baseUrl = "https://automationintesting.online/admin";

test.describe("CRUD - Room lifecycle", () => {
  let myRoomNumber;

  test("Create a new room and verify", async ({ page }) => {
    await page.goto(`${baseUrl}`);

    //Calculate new room's number
    myRoomNumber = await functions.generateRoomNumber(page);

    await page.fill(locators.roomName, myRoomNumber);
    const randomPrice = functions.generateRandomPrice();
    await page.fill(locators.roomPrice, randomPrice.toString());
    await page.click(locators.checkboxes.tv);
    await page.click(locators.checkboxes.radio);
    await page.click(locators.createRoomBtn);

    //Verify room created
    await expect(page.locator(locators.roomByNumber(myRoomNumber))).toHaveCount(
      1
    );
  });

  test("Update the room and verify", async ({ page }) => {
    // Navigate to admin page
    await page.goto(`${baseUrl}`);
    await page.locator(locators.roomByNumber(myRoomNumber)).click();
    await expect(page.locator(locators.formContainer)).toContainText(
      myRoomNumber
    );

    //Update the room
    await page.click(locators.formEditBtn);
    const randomDescription = functions.generateDescription();
    await page.fill(locators.formDescription, randomDescription);
    await page.selectOption(locators.formRoomType, "Double");
    await page.selectOption(locators.formAccessible, "true");
    await page.click(locators.checkboxes.views);
    await page.click(locators.formUpdateBtn);

    //Verify the room updated
    await expect(page.locator(locators.roomDetails)).toContainText(
      randomDescription
    );
    await expect(page.locator(locators.roomDetails)).toContainText("true");
    await expect(page.locator(locators.roomDetails)).toContainText("Double");
    await expect(page.locator(locators.roomDetails)).toContainText(
      "TV, Radio, Views"
    );
  });

  test("Delete the room and verify", async ({ page }) => {
    // Navigate to admin page
    await page.goto(`${baseUrl}`);

    //Delete the new room
    await page.locator(locators.deleteRoomBtn(myRoomNumber)).click();

    //Verify the room deleted
    await expect(page.locator(locators.roomByNumber(myRoomNumber))).toHaveCount(
      0
    );
  });

  test.only("Create room with missing data (negative)", async ({ page }) => {
    // Navigate to admin page
    await page.goto(`${baseUrl}`);

    //Count the rooms before the test
    await page.waitForSelector("[data-testid='roomlisting']", {
      state: "attached",
    });
    const roomsBefore = await page.locator(locators.roomListing).count();

    await page.click(locators.createRoomBtn);

    //Verify the room not created
    const alert = page.locator(locators.alertMsg);
    await expect(alert).toContainText("This error for demo only");
    const roomsAfter = await page.locator(locators.roomListing).count();
    expect(roomsAfter).toBe(roomsBefore);
  });
});
