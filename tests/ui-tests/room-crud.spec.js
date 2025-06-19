import { test, expect } from "@playwright/test";
import { functions } from "../helpers/functions.js";
import { RoomsPage } from "../../pages/rooms.page.js";
import { EditRoomPage } from "../../pages/editRoom.page.js";

const baseUrl = "https://automationintesting.online/admin";

test.describe("CRUD - Room lifecycle", () => {
  let myRoomNumber;

  test("Create a new room and verify", async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await page.goto(`${baseUrl}`);

    //Calculate new room's number and price
    myRoomNumber = await functions.generateRoomNumber(page);
    const randomPrice = functions.generateRandomPrice();

    const roomOptions = { tv: true, radio: true };
    await roomsPage.createRoom(myRoomNumber, randomPrice, roomOptions);

    await expect(roomsPage.roomByNumber(myRoomNumber)).toHaveCount(1); //Verify room created
  });

  test("Update the room and verify", async ({ page }) => {
    const editRoomPage = new EditRoomPage(page);
    const roomsPage = new RoomsPage(page);

    await page.goto(`${baseUrl}`);
    await roomsPage.roomByNumber(myRoomNumber).click();
    await expect(editRoomPage.formContainer).toContainText(myRoomNumber);

    // Update the room
    const randomDescription = functions.generateDescription();
    await editRoomPage.updateRoom({ description: randomDescription });

    // Verify the room updated
    await expect(roomsPage.roomDetails).toContainText(randomDescription);
    await expect(roomsPage.roomDetails).toContainText("true");
    await expect(roomsPage.roomDetails).toContainText("Double");
  });

  test("Delete the room and verify", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    await page.goto(`${baseUrl}`);
    await roomsPage.deleteRoom(myRoomNumber); // Delete the new room
    await expect(roomsPage.roomByNumber(myRoomNumber)).toHaveCount(0); // Verify the room deleted
  });

  test("Create room with missing data (negative)", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    await page.goto(`${baseUrl}`);
    const roomsBefore = await roomsPage.countRooms(); // Count the rooms before the test
    await roomsPage.createRoomBtn.click();

    // Verify the room was not created
    await expect(roomsPage.alertMsg).toContainText(
      "This text was added for failing tests demo"
    );
    const roomsAfter = await roomsPage.countRooms();
    expect(roomsAfter).toBe(roomsBefore);
  });
});
