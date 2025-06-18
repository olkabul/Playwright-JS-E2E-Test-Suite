import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const baseUrl = "https://restful-booker.herokuapp.com";
const authEp = "/auth";

/**
 * Utility function to get CLI arguments in format --user:admin
 * If not provided - takes the environment variables
 */
function getArgValue(prefix) {
  const arg = process.argv.find((arg) => arg.startsWith(prefix + ":"));
  return arg ? arg.split(":")[1] : undefined;
}

/**
 * Authenticates against the Booking API and returns token and headers
 * - Accepts CLI credentials via --user: --password:
 * - Falls back to .env variables if not provided
 * @param {APIRequestContext} request - Provided by Playwright test runner
 * @returns {Object} { token, headers } for authenticated requests
 */
export async function getBookingAuthToken(request) {
  const username = getArgValue("user") || process.env.BOOKING_USER;
  const password = getArgValue("password") || process.env.BOOKING_PASS;

  console.log("BOOKING_USER:", process.env.BOOKING_USER);
  console.log("BOOKING_PASS:", process.env.BOOKING_PASS);

  if (!username || !password) {
    throw new Error("Booking username and password must be provided");
  }

  //Sends POST request to get auth token
  const response = await request.post(`${baseUrl}${authEp}`, {
    data: { username, password },
  });
  const body = await response.json();
  const token = body.token;

  //Creates headers for API calls
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Cookie: `token=${token}`,
  };

  return {
    token,
    headers,
  };
}
