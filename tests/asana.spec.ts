import { test, expect } from '@playwright/test';

const BASE_URL = 'http://create-asana-like-pr-39y5.bolt.host/';
const CREDENTIALS = {
  email: 'admin',
  password: 'password123',
};

const testCases = [
  {
    id: 1,
    project: 'Web Application',
    taskName: 'Implement user authentication',
    column: 'To Do',
    tags: ['Feature', 'High Priority'],
  },
  {
    id: 2,
    project: 'Web Application',
    taskName: 'Fix navigation bug',
    column: 'To Do',
    tags: ['Bug'],
  },
  {
    id: 3,
    project: 'Web Application',
    taskName: 'Design system updates',
    column: 'In Progress',
    tags: ['Design'],
  },
  {
    id: 4,
    project: 'Mobile Application',
    taskName: 'Push notification system',
    column: 'To Do',
    tags: ['Feature'],
  },
  {
    id: 5,
    project: 'Mobile Application',
    taskName: 'Offline mode',
    column: 'In Progress',
    tags: ['Feature', 'High Priority'],
  },
  {
    id: 6,
    project: 'Mobile Application',
    taskName: 'App icon design',
    column: 'Done',
    tags: ['Design'],
  },
];

test.describe('Asana Demo App Automated Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    // 2. Perform Login Automation using multi-strategy locators
    const usernameInput = page.locator('input').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button').filter({ hasText: /sign in|log in|login|submit/i }).first();

    await usernameInput.fill(CREDENTIALS.email);
    await passwordInput.fill(CREDENTIALS.password);
    await submitButton.click();

    // 3. Wait for the project navigation board to load
    await page.waitForLoadState('networkidle');
  });

  for (const tc of testCases) {
    test(`Test Case ${tc.id}: Verify "${tc.taskName}" in "${tc.project}" under "${tc.column}"`, async ({ page }) => {
      // Navigate to Project
      const projectButton = page.getByRole('button', { name: tc.project }).or(page.getByText(tc.project)).first();
      await projectButton.click();

      // Find Column Header
      const columnHeader = page.getByRole('heading', { name: tc.column }).or(page.getByText(tc.column)).first();
      await expect(columnHeader).toBeVisible();

      // Find Task Card within Column
      const columnContainer = page.locator('div, section').filter({ has: columnHeader }).last();
      const taskCard = columnContainer.locator('div, article').filter({ hasText: tc.taskName }).first();
      await expect(taskCard).toBeVisible();

      // Verify Tags
      for (const tag of tc.tags) {
        const tagElement = taskCard.getByText(tag, { exact: true }).first();
        await expect(tagElement).toBeVisible();
      }
    });
  }

});