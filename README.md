# Asana Playwright Data-Driven Automated Test Suite

An enterprise-grade, data-driven automated test suite verifying project task boards, column scopes, and metadata tags for the Asana demo web application using **Playwright** and **TypeScript**.

## Architecture & Features

- **Data-Driven Design:** Test cases are fully decoupled from test execution logic using `test-data.json`. Adding new scenarios requires zero code changes.
- **Strict Scope Isolation:** Task cards are asserted strictly inside their parent column container element to prevent false-positive passes.
- **Test Isolation:** Each scenario executes with a clean page context and explicit authentication verification.
- **TypeScript Type Safety:** Strictly typed test schema (`TestCase` interface) ensures compile-time data integrity.

## Directory Structure

```text
.
├── tests/
│   └── asana.spec.ts      # Core Playwright test suite
├── test-data.json         # Data-driven scenario definitions
├── playwright.config.ts   # Playwright execution configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Scripts and dependencies
└── README.md              # Project documentation

Setup & Execution
Prerequisites
Node.js v18+

Installation
Bash
# Install dependencies
npm install

# Install Playwright browser binaries
npx playwright install
Running Tests
Bash
# Run headless test suite
npm test

# Run tests with visible browser window
npm run test:headed

# Open HTML test execution report
npm run report

---

### Step 5: Validate, Commit & Push

1. Run the test suite locally to verify all 6 tests pass:
   ```powershell
   npm test