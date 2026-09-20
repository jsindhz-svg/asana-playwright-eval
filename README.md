# Asana Playwright Test Suite

Automated end-to-end test suite using Playwright and TypeScript to validate task board behavior for the Asana-like demo application.

## Production-ready improvements

This release branch introduces:

- environment-based credentials via `.env.example`
- stricter page object waits and selectors
- separate smoke and regression suites
- CI pipelines for release validation
- lint and typecheck quality gates
- schema validation for the JSON test data
- multi-browser coverage for Chromium, Firefox, and WebKit

## Architecture

- `pages/LoginPage.ts`: handles authentication and app entry
- `pages/TaskBoardPage.ts`: handles project selection, column lookup, and task/tag assertions
- `tests/asana.spec.ts`: regression suite driven by `tests/data/testCases.json`
- `tests/smoke.spec.ts`: fast feasibility checks for happy-path validation
- `tests/data-validation.spec.ts`: checks the dataset structure before running regression tests

## Setup

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
npx playwright install --with-deps
```

### Environment configuration

Copy `.env.example` and set real values:

```bash
cp .env.example .env
```

Then export or set:

```bash
ASANA_USERNAME=your-user
ASANA_PASSWORD=your-password
BASE_URL=https://create-asana-like-pr-39y5.bolt.host
```

## Running tests

```bash
npm test
npm run test:smoke
npm run test:regression
npm run test:report
npm run typecheck
npm run lint
```

## CI and reporting

The repo includes GitHub Actions workflows for release checks and artifact upload. Failed runs retain Playwright HTML reports, traces, screenshots, and videos for debugging.

## Test coverage

The regression suite validates the six core scenarios for both Web Application and Mobile Application boards, including task presence and required tag checks in the correct column.

## Tech stack

- Playwright
- TypeScript
- Node.js
- GitHub Actions
- ESLint
- JSON schema validation
