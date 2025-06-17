# QA Automation Task
## RESTFUL items lifecycle

This project includes two sets of tests:

1. API tests: test the backend (create, update, delete bookings)
2. UI tests: test the admin web interface using browser actions

### Prerequisites:

* Node.js must be installed
* npm (comes with Node.js)
* Run `npm install` in the project folder to install required packages

## How to Run API Tests:

You can run API tests in two ways:

#### 1. Using .env file:

In root directory, create a file named .env and add:

    BOOKING_USER=<your_username> 
    BOOKING_PASS=<your_password>

Then run:

```sh
npx playwright test api-tests
```

#### 2. Using credentials directly in CLI:

```sh 
BOOKING_USER=<your_username> BOOKING_PASS=<your_password> npx playwright test api-tests
```

## How to Run UI Tests:

You can also run UI tests in two ways:

#### 1. Using .env file:

Create a file named .env and add:

    UI_USER=<your_username>
    UI_PASSWORD=<your_password>

Then run:
```sh 
npx playwright test ui-tests
```

#### 2. Using credentials directly in CLI:
```sh 
UI_USER=<your_username> UI_PASSWORD=<your_password> npx playwright test ui-tests
```

### Notes

* `auth.json` is automatically created after a successful UI login and is reused for future sessions to avoid repeated logins.
* `.env` and `auth.json` are included in `.gitignore` and will not be pushed to Git.
* The public API (restful-booker.herokuapp.com) may be unstable or slow sometimes.

