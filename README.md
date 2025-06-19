# QA Automation Task

## RESTFUL items lifecycle

### Project Setup

This project was created using **Playwright** and **JavaScript**. All tests are written in JS using Playwright's built-in test runner (`@playwright/test`).

This project includes two sets of tests:

1. API tests: test the backend (create, update, delete bookings)
2. UI tests: test the admin web interface using browser actions

The structure follows **Page Object Model (POM)** for UI automation, separating test logic from page interactions for better readability and maintainability.

### Prerequisites:

- Node.js must be installed
- npm (comes with Node.js)
- Run `npm install` in the project folder to install required packages

### Authentication Flows

- **UI Tests**: Authentication is handled by logging into the admin dashboard using provided credentials. A file named `auth.json` is automatically generated upon successful login and is reused in subsequent test runs. This prevents repeated logins and speeds up execution.

- **API Tests**: Authentication uses basic auth. Provide credentials either via `.env` or directly in CLI as environment variables:
  - `BOOKING_USER`
  - `BOOKING_PASS`

> Note: The project follows best practices and does not store any sensitive data. Authentication details must be passed via environment variables or `.env`.

---

### How Environment Selection Works

This project supports two types of tests: UI and API. To control which type to run, we use an environment variable `TEST_TYPE`:

- `TEST_TYPE=ui` → runs browser-based tests
- `TEST_TYPE=api` → runs API-only tests

These are already wired into `package.json` scripts using `cross-env`, so you don’t need to set it manually.

---

## How to Run API Tests:

You can run API tests in two ways:

#### 1. Using `.env` file:

In root directory, create a file named `.env` and add:

```env
BOOKING_USER=<your_username>
BOOKING_PASS=<your_password>
```

Then run:

```sh
npm run test:api
```

#### 2. Using credentials directly in CLI:

```sh
BOOKING_USER=<your_username> BOOKING_PASS=<your_password> npm run test:api
```

---

## How to Run UI Tests:

You can also run UI tests in two ways:

#### 1. Using `.env` file:

```env
UI_USER=<your_username>
UI_PASSWORD=<your_password>
```

Then run:

```sh
npm run test:ui
```

#### 2. Using credentials directly in CLI:

```sh
UI_USER=<your_username> UI_PASSWORD=<your_password> npm run test:ui
```

---

### Notes

- `.env` and `auth.json` are included in `.gitignore` and will not be pushed to Git.
- The public API (restful-booker.herokuapp.com) may be unstable or slow sometimes. If a test fails, it may be due to rate limits or service availability.

---

### GitHub Actions

This project includes GitHub Actions workflow that automatically runs both UI and API tests on each `push` (or manually in Actions tab). The HTML report is generated and attached as an artifact. Failed test reports are saved and zipped separately for analysis.
