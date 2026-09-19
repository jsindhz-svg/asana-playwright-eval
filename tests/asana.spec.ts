import { test, expect, Page, BrowserContext } from '@playwright/test';
import testCases from '../test-data.json';

const BASE_URL = 'http://create-asana-like-pr-39y5.bolt.host/';
const CREDENTIALS = { email: 'admin', password: 'password123' };

test.describe('Asana Demo App Automated Test Suite', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ ignoreHTTPSErrors: true });
    page = await context.newPage();

    // Navigate immediately without waiting for full DOM parsing overhead
    await page.goto(BASE_URL, { waitUntil: 'commit', timeout: 0 });
    
    // Wait explicitly for the login form to be visible on screen
    const emailInput = page.locator('input[type="email"], input[name="username"], input[name="email"], input').first();
    await emailInput.waitFor({ state: 'visible', timeout: 60000 });

    // Perform Login
    await emailInput.fill(CREDENTIALS.email);
    await page.locator('input[type="password"]').first().fill(CREDENTIALS.password);
    await page.locator('button').filter({ hasText: /sign in|log in|login|submit/i }).first().click();
    
    // Wait for main dashboard view
    await page.waitForLoadState('domcontentloaded');
  }, 90000);

  test.afterAll(async () => {
    await context.close();
  });

  for (const tc of testCases) {
    test(`Test Case ${tc.id}: Verify "${tc.taskName}" in "${tc.project}" under "${tc.column}"`, async () => {
      // 1. Switch Project Tab
      const projectBtn = page.getByRole('button', { name: tc.project }).or(page.getByText(tc.project)).first();
      await projectBtn.click();

      // 2. Locate Column Header
      const columnHeader = page.getByRole('heading', { name: tc.column }).or(page.getByText(tc.column)).first();
      await expect(columnHeader).toBeVisible();

      // 3. Scope Task Card strictly inside the Column Container
      const columnContainer = page.locator('div, section, article').filter({ has: columnHeader }).last();
      const taskCard = columnContainer.locator('div, article').filter({ hasText: tc.taskName }).first();
      await expect(taskCard).toBeVisible();

      // 4. Verify Tags inside the Task Card
      for (const tag of tc.tags) {
        const tagElement = taskCard.locator('span, div, p').filter({ hasText: new RegExp(`^${tag}$`, 'i') }).first();
        await expect(tagElement).toBeVisible();
      }
    });
  }
});