import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

const baseUrl = "https://automationintesting.online/admin";

test.describe("CRUD - Room lifecycle", () => {
  let myRoomNumber;

  test("Create new room", async ({ page }) => {
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

  test("Update the new room", async ({ page }) => {
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

  test("Delete the new room", async ({ page }) => {
    // Navigate to admin page
    await page.goto(`${baseUrl}`);

    //Delete the new room
    await page.locator(locators.deleteRoomBtn(myRoomNumber)).click();

    //Verify the room deleted
    await expect(page.locator(locators.roomByNumber(myRoomNumber))).toHaveCount(
      0
    );
  });

  test("Negative: create a room with missing data", async ({ page }) => {
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
    await expect(alert).toContainText("Room name must be set");
    const roomsAfter = await page.locator(locators.roomListing).count();
    expect(roomsAfter).toBe(roomsBefore);
  });
});

const locators = {
  createRoomBtn: "#createRoom",
  alertMsg: ".alert.alert-danger",
  roomListing: "p[id^='roomName']",
  roomName: "#roomName",
  roomPrice: "#roomPrice",
  checkboxes: {
    tv: "#tvCheckbox",
    radio: "#radioCheckbox",
    views: "#viewsCheckbox",
  },
  formContainer: "#root-container",
  roomByNumber: (roomNumber) =>
    `[data-testid="roomlisting"]:has(#roomName${roomNumber})`,
  deleteRoomBtn: (roomNumber) =>
    `[data-testid="roomlisting"]:has(#roomName${roomNumber}) .roomDelete`,
  formEditBtn: 'button:has-text("Edit")',
  formDescription: "#description",
  formAccessible: "#accessible",
  formTrueAccess: "#accessible > option:nth-child(2)",
  formRoomType: "#type",
  formUpdateBtn: "#update",
  roomDetails: ".room-details",
};

const functions = {
  /**
   * Retrieves the list of rooms from the /api/room endpoint,
   * finds the highest existing room number, and returns the next available number as a string.
   * @param {Page} page - Playwright Page instance
   * @returns {Promise<string>} - Next available room number (e.g., "104")
   */
  async generateRoomNumber(page) {
    const response = await page.waitForResponse(
      (res) => res.url().includes("/api/room") && res.status() === 200
    );
    const body = await response.json();
    const roomNumbers = body.rooms.map((room) => Number(room.roomName));
    return (Math.max(...roomNumbers) + 1).toString();
  },

  /**
   * Generates a random room price between 200 and 300 (inclusive).
   * @returns {number} - Random price (e.g., 287)
   */
  generateRandomPrice() {
    return Math.floor(Math.random() * 101) + 200;
  },

  /**
   * Generates a fake sentence to be used as a room description. Uses the Faker library.
   * @returns {string} - A one-sentence room description
   */
  generateDescription() {
    return faker.lorem.sentences(1);
  },
};
