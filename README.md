# Asana Playwright Test Evaluation

A data-driven end-to-end test suite built with **Playwright and TypeScript** to validate task management workflows in the Asana-like demo application.

The suite covers all six required scenarios across the **Web Application** and **Mobile Application** projects, validating project, task, column, and tag information.

## Tech Stack

* Playwright
* TypeScript
* Node.js
* JSON-based test data
* Playwright HTML Reporter

## Project Structure

```text
.
├── tests/
│   └── asana.spec.ts
├── test-data.json
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Test Coverage

The test suite validates the following scenarios:

| ID  | Project            | Task                          | Column      | Tags                   |
| --- | ------------------ | ----------------------------- | ----------- | ---------------------- |
| TC1 | Web Application    | Implement user authentication | To Do       | Feature, High Priority |
| TC2 | Web Application    | Fix navigation bug            | To Do       | Bug                    |
| TC3 | Web Application    | Design system updates         | In Progress | Design                 |
| TC4 | Mobile Application | Push notification system      | To Do       | Feature                |
| TC5 | Mobile Application | Offline mode                  | In Progress | Feature, High Priority |
| TC6 | Mobile Application | App icon design               | Done        | Design                 |

Each scenario verifies:

1. Successful authentication
2. Navigation to the expected project
3. Presence of the expected column
4. Presence of the expected task within that column
5. Presence of every expected tag associated with the task

## Data-Driven Design

Test scenarios are maintained separately in `test-data.json`.

The Playwright test implementation dynamically generates a test for each scenario in the JSON data. This keeps the test logic reusable and minimizes duplication.

To add another scenario, a new test-data object can be added to `test-data.json` without duplicating the test implementation.

Example:

```json
{
  "id": 7,
  "project": "Web Application",
  "taskName": "Example task",
  "column": "To Do",
  "tags": ["Feature"]
}
```

## Prerequisites

* Node.js installed
* npm installed

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Install the Playwright browser:

```bash
npx playwright install
```

## Running the Tests

Run the complete test suite:

```bash
npm test
```

Run tests with the browser visible:

```bash
npm run test:headed
```

## Test Reporting

An HTML report is generated after the test run.

To open the report:

```bash
npm run test:report
```

For failed tests, Playwright is configured to retain:

* Screenshots
* Video recordings
* Execution traces

These artifacts can be used to investigate failures and reproduce issues efficiently.

## Playwright Configuration

The Playwright configuration includes:

* Configured application `baseURL`
* HTML reporting
* Failure screenshots
* Failure video
* Failure traces
* Test timeout configuration
* CI-specific retries
* Chromium test project

## Authentication

The test suite automates login using the credentials provided for the demo application.

Authentication is handled in a shared `beforeEach` hook so that each scenario starts from an authenticated application state while keeping the individual tests focused on their specific validation.

## Maintainability

The test suite is designed to keep test data and test logic separate:

* `test-data.json` contains scenario-specific data.
* `tests/asana.spec.ts` contains reusable automation logic.
* `playwright.config.ts` contains test execution and reporting configuration.

This structure makes the suite easier to extend and maintain as additional scenarios are introduced.
