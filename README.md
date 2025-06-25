# Playwright JS UI & API E2E Automation Suite

<p align="center">
  <img src="https://img.shields.io/badge/Playwright-Test%20Automation-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Tech-JavaScript-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Type-UI%20%26%20API%20E2E-orange?style=flat-square" />
</p>

## What this project does

This project shows how to test both API and UI using Playwright and JavaScript. It uses Page Object Model for UI and basic auth for API. I wrote this project as a full end-to-end example that runs from CLI and GitHub Actions.

## How to start

1. Clone the repo:

```bash
git clone https://github.com/YOUR_USERNAME/playwright-js-e2e-suite.git
cd playwright-js-e2e-suite
```

2. Install everything:

```bash
npm install
npx playwright install
```

3. Copy the example env file:

```bash
cp .env.template .env
```

Or just create `.env` yourself and add credentials.

## Run tests

### UI Tests

```env
UI_USER=admin
UI_PASSWORD=password
```

```bash
npm run test:ui
```

### API Tests

```env
BOOKING_USER=admin
BOOKING_PASS=password123
```

```bash
npm run test:api
```

You can also pass credentials from CLI like this:

```bash
BOOKING_USER=admin BOOKING_PASS=password123 npm run test:api
```

## What is tested

- API: create, get, update, delete booking
- UI: add, update, delete room from admin dashboard

## Notes

- The public API can sometimes be slow or unstable.
- GitHub Actions runs the tests automatically when I push code.
- Playwright HTML report is created for each test run.

## How it looks inside

```
.
├── api-tests/             # API test specs
├── ui-tests/              # UI test specs
├── pages/                 # Page Object files
├── utils/                 # Helper functions
├── .env.template          # Example env file
└── playwright.config.js   # Playwright settings
```

---

This project helped me practice automation with real tools and real structure. Hope it helps someone else too.
