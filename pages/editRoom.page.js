export class EditRoomPage {
  constructor(page) {
    this.page = page;

    this.formContainer = page.locator("#root-container");
    this.formEditBtn = page.locator('button:has-text("Edit")');
    this.formDescription = page.locator("#description");
    this.formAccessible = page.locator("#accessible");
    this.formTrueAccess = page.locator("#accessible > option:nth-child(2)");
    this.formRoomType = page.locator("#type");
    this.formUpdateBtn = page.locator("#update");
  }

  async updateRoom({ description, type = "Double", accessible = true }) {
    await this.formEditBtn.click();
    await this.formDescription.fill(description);
    await this.formRoomType.selectOption(type);
    await this.formAccessible.selectOption(accessible.toString());
    await this.formUpdateBtn.click();
  }
}
