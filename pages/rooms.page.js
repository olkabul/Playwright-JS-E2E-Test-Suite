export class RoomsPage {
  constructor(page) {
    this.page = page;

    this.createRoomBtn = page.locator("#createRoom");
    this.alertMsg = page.locator(".alert.alert-danger");
    this.roomListing = page.locator("p[id^='roomName']");
    this.roomName = page.locator("#roomName");
    this.roomPrice = page.locator("#roomPrice");

    this.checkboxes = {
      tv: page.locator("#tvCheckbox"),
      radio: page.locator("#radioCheckbox"),
      views: page.locator("#viewsCheckbox"),
    };

    this.roomDetails = page.locator(".room-details");
  }

  roomByNumber(roomNumber) {
    return this.page.locator(
      `[data-testid="roomlisting"]:has(#roomName${roomNumber})`
    );
  }

  deleteRoomBtn(roomNumber) {
    return this.page.locator(
      `[data-testid="roomlisting"]:has(#roomName${roomNumber}) .roomDelete`
    );
  }

  async createRoom(
    roomNumber,
    price,
    options = { tv: false, radio: false, views: false }
  ) {
    await this.roomName.fill(roomNumber);
    await this.roomPrice.fill(price.toString());

    if (options.tv) await this.checkboxes.tv.click();
    if (options.radio) await this.checkboxes.radio.click();
    if (options.views) await this.checkboxes.views.click();

    await this.createRoomBtn.click();
  }

  async roomExists(roomNumber) {
    return (await this.roomByNumber(roomNumber).count()) > 0;
  }

  async deleteRoom(roomNumber) {
    await this.deleteRoomBtn(roomNumber).click();
  }

  async countRooms() {
    await this.roomListing.first().waitFor({ state: "attached" });
    return await this.roomListing.count();
  }
}
