import { test, expect } from '@playwright/test';
import testCases from './data/testCases.json';

test.describe('Asana Task Verification - Data Driven Suite', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the web app
    await page.goto('https://create-asana-like-pr-39y5.bolt.host/');

    // 2. Perform login
    await page.locator('input[type="text"], #username').first().fill('admin');
    await page.locator('input[type="password"], #password').first().fill('password123');
    await page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")').first().click();

    // 3. Confirm dashboard loaded
    await expect(page.getByRole('banner').getByRole('heading', { name: 'Web Application' })).toBeVisible({ timeout: 10000 });
  });

  for (const scenario of testCases) {
    test(`Test Case ${scenario.id}: Verify "${scenario.task}" under ${scenario.project}`, async ({ page }) => {
      
      // 1. Navigate to requested project tab in sidebar
      const projectButton = page.getByRole('button', { name: new RegExp(scenario.project, 'i') }).first();
      await projectButton.click();

      // 2. Locate the column container matching column name (handles dynamic counts like "To Do (3)")
      const columnHeader = page.locator('h2, h3, header, div')
        .filter({ hasText: new RegExp(`^${scenario.column}`, 'i') })
        .first();

      const columnContainer = page.locator('div')
        .filter({ has: columnHeader })
        .filter({ hasText: scenario.task })
        .first();

      // 3. Locate the isolated task card (targets the inner card container specifically)
      const taskCard = columnContainer.locator('div.bg-white, div.rounded-lg, article, div.p-4')
        .filter({ has: page.getByRole('heading', { name: scenario.task }) })
        .or(columnContainer.locator('div.bg-white, div.rounded-lg, article, div.p-4').filter({ hasText: scenario.task }))
        .first();

      // Assertion 1: Verify task card is visible
      await expect(taskCard).toBeVisible({ timeout: 10000 });

      // Assertion 2: Verify tags belong specifically to this task card
      for (const tag of scenario.tags) {
        const tagElement = taskCard.locator('span, div').filter({ hasText: new RegExp(`^${tag}$`, 'i') }).first();
        await expect(tagElement).toBeVisible();
      }
    });
  }
});