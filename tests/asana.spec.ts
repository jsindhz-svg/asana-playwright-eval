import { test, expect, Page, BrowserContext } from '@playwright/test';

const BASE_URL = 'http://create-asana-like-pr-39y5.bolt.host/';
const CREDENTIALS = { email: 'admin', password: 'password123' };

const testCases = [
  { id: 1, project: 'Web Application', taskName: 'Implement user authentication', column: 'To Do', tags: ['Feature', 'High Priority'] },
  { id: 2, project: 'Web Application', taskName: 'Fix navigation bug', column: 'To Do', tags: ['Bug'] },
  { id: 3, project: 'Web Application', taskName: 'Design system updates', column: 'In Progress', tags: ['Design'] },
  { id: 4, project: 'Mobile Application', taskName: 'Push notification system', column: 'To Do', tags: ['Feature'] },
  { id: 5, project: 'Mobile Application', taskName: 'Offline mode', column: 'In Progress', tags: ['Feature', 'High Priority'] },
  { id: 6, project: 'Mobile Application', taskName: 'App icon design', column: 'Done', tags: ['Design'] },
];

test.describe('Asana Demo App Automated Test Suite', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ ignoreHTTPSErrors: true });
    page = await context.newPage();

    // 1. Login once
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('input').first().fill(CREDENTIALS.email);
    await page.locator('input[type="password"]').first().fill(CREDENTIALS.password);
    await page.locator('button').filter({ hasText: /sign in|log in|login|submit/i }).first().click();
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await context.close();
  });

  for (const tc of testCases) {
    test(`Test Case ${tc.id}: Verify "${tc.taskName}" in "${tc.project}" under "${tc.column}"`, async () => {
      // 1. Switch Project tab
      const projectBtn = page.getByRole('button', { name: tc.project }).or(page.getByText(tc.project)).first();
      await projectBtn.click();

      // 2. Locate Column Header
      const columnHeader = page.getByRole('heading', { name: tc.column }).or(page.getByText(tc.column)).first();
      await expect(columnHeader).toBeVisible();

      // 3. Locate Task Card directly by text across the active view
      const taskCard = page.locator('div, article, section').filter({ hasText: tc.taskName }).last();
      await expect(taskCard).toBeVisible();

      // 4. Verify each Tag individually
      for (const tag of tc.tags) {
        const tagElement = taskCard.locator('span, div, p').filter({ hasText: new RegExp(`^${tag}$`, 'i') }).first();
        await expect(tagElement).toBeVisible();
      }
    });
  }
});