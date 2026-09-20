# Asana Playwright Test Suite

Automated end-to-end test suite using **[Playwright](https://playwright.dev/)** and **TypeScript** to verify task card details and tag associations on the Asana demo application.

## Architecture

* **Page Object Model (POM):** Test logic is decoupled from page layout and selectors.

  * `pages/LoginPage.ts`: Encapsulates authentication and initial landing navigation.
  * `pages/TaskBoardPage.ts`: Encapsulates project view switching, column-scoped task identification, and tag assertion logic.

* **Data-Driven Execution:** Test cases are driven dynamically via `tests/data/testCases.json`.

## Directory Structure

```text
asana-playwright-eval/
├── pages/
│   ├── LoginPage.ts
│   └── TaskBoardPage.ts
├── tests/
│   ├── data/
│   │   └── testCases.json
│   └── asana.spec.ts
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## Setup & Execution

### Prerequisites

* Node.js 18+ installed
* npm installed

### Installation

Install project dependencies:

```bash
npm install
```

Install Playwright browsers and required dependencies:

```bash
npx playwright install --with-deps
```

### Run Tests

Execute the automated test suite:

```bash
npm test
```

### TypeScript Type Check

Perform a TypeScript type check without generating JavaScript files:

```bash
npx tsc --noEmit
```

## Test Coverage

The suite validates all six required scenarios:

| ID  | Project            | Task                          | Column      | Tags                   |
| --- | ------------------ | ----------------------------- | ----------- | ---------------------- |
| TC1 | Web Application    | Implement user authentication | To Do       | Feature, High Priority |
| TC2 | Web Application    | Fix navigation bug            | To Do       | Bug                    |
| TC3 | Web Application    | Design system updates         | In Progress | Design                 |
| TC4 | Mobile Application | Push notification system      | To Do       | Feature                |
| TC5 | Mobile Application | Offline mode                  | In Progress | Feature, High Priority |
| TC6 | Mobile Application | App icon design               | Done        | Design                 |

Each test verifies:

* Successful authentication
* Navigation to the expected project
* Presence of the expected column
* Presence of the expected task within that column
* Presence of every expected tag associated with the task

## Data-Driven Testing

Test scenarios are maintained separately in:

```text
tests/data/testCases.json
```

The Playwright test dynamically generates a test for each scenario in the JSON data. This keeps the test implementation reusable and minimizes duplication.

Adding another scenario only requires adding a new data object to `testCases.json`; the test implementation does not need to be duplicated.

Example:

```json
{
  "id": 7,
  "project": "Web Application",
  "task": "Example task",
  "column": "To Do",
  "tags": ["Feature"]
}
```

## Authentication

Authentication is handled through the `LoginPage` Page Object.

Each test starts from a clean browser page, performs the login flow, and verifies that the expected application dashboard is loaded before continuing with task validation.

## Validation Strategy

The test suite uses a layered validation approach:

1. Select the required project.
2. Identify the expected board column.
3. Locate the expected task within that column.
4. Scope tag validation specifically to the identified task card.
5. Verify every expected tag from the test data.

This ensures that tags are validated against the correct task rather than simply searching for them elsewhere on the page.

## Playwright Configuration

The test suite is configured with:

* Chromium browser execution
* HTML test reporting
* Failure screenshots
* Failure video recordings
* Failure traces
* Configurable test timeouts
* CI-specific retries
* CI worker configuration

## Test Reporting

After execution, Playwright generates an HTML report.

To open the report:

```bash
npm run test:report
```

For failed tests, Playwright retains screenshots, videos, and execution traces to support debugging and failure investigation.


## Tech Stack

* **Playwright**
* **TypeScript**
* **Node.js**
* **JSON**
* **Page Object Model**
* **Playwright HTML Reporter**
