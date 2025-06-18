import { test, expect } from "@playwright/test";
import { getBookingAuthToken } from "../helpers/api-auth.js";
import { functions } from "../helpers/functions.js";

const baseUrl = "https://restful-booker.herokuapp.com";
const bookingEp = "/booking";

test.describe("booking lifecicle", async () => {
  let bookingId;
  let headers;

  test.beforeAll("authorization", async ({ request }) => {
    const auth = await getBookingAuthToken(request);
    headers = auth.headers;
  });

  test("create new booking", async ({ request }) => {
    const bookingData = functions.generateBookingDataAndSave();
    const response = await request.post(`${baseUrl}${bookingEp}`, {
      data: bookingData,
      headers,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    bookingId = body.bookingid;
  });

  test("validate created booking", async ({ request }) => {
    const response = await request.get(`${baseUrl}${bookingEp}/${bookingId}`);
    expect(response.status()).toBe(200);
    const booking = await response.json();
    expect(typeof booking.firstname).toBe("string");
    expect(typeof booking.lastname).toBe("string");
    expect(typeof booking.totalprice).toBe("number");
    expect(typeof booking.depositpaid).toBe("boolean");
    expect(typeof booking.additionalneeds).toBe("string");
  });

  test("update the booking", async ({ request }) => {
    const response = await request.patch(
      `${baseUrl}${bookingEp}/${bookingId}`,
      {
        data: {
          depositpaid: true,
          additionalneeds: "Dinner",
        },
        headers,
      }
    );
    expect(response.status()).toBe(200);
    const updatedBooking = await response.json();
    expect(updatedBooking.depositpaid).toBe(true);
    expect(updatedBooking.additionalneeds).toContain("Dinner");
  });

  test("delete booking", async ({ request }) => {
    const response = await request.delete(
      `${baseUrl}${bookingEp}/${bookingId}`,
      { headers }
    );
    expect(response.status()).toBe(201);
  });

  test("verify the booking deleted", async ({ request }) => {
    const response = await request.get(`${baseUrl}${bookingEp}/${bookingId}`);
    expect(response.status()).toBe(404);
  });
});
