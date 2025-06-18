import { faker } from "@faker-js/faker";

export const functions = {
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

  /**
   * Generates a fake booking object with randomized data for testing.
   * This includes name, price, deposit status, and additional needs.
   * Dates are fixed to simplify assertions.
   *
   * @returns {Object} booking - A valid booking object for API creation
   * @property {string} booking.firstname - Random first name
   * @property {string} booking.lastname - Random last name
   * @property {number} booking.totalprice - Random total price between 100–1000
   * @property {boolean} booking.depositpaid - Random boolean
   * @property {Object} booking.bookingdates - Static checkin and checkout dates
   * @property {string} booking.additionalneeds - Random extra request
   */
  generateBookingDataAndSave() {
    const booking = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 100, max: 1000 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: {
        checkin: "2025-07-01",
        checkout: "2025-07-10",
      },
      additionalneeds: faker.helpers.arrayElement([
        "breakfast",
        "crib",
        "late checkout",
      ]),
    };
    return booking;
  },
};
