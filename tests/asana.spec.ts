import { test, expect } from '@playwright/test';
import testCases from '../test-data.json';

const CREDENTIALS = {
  username: 'admin',
  password: 'password123',
};

type TestCase = {
  id: number;
  project: string;
  taskName: string;
  column: string;
  tags: string[];
};

const scenarios: TestCase[] = testCases;

test.describe('Asana Demo App - Data-Driven Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application using the configured baseURL.
    await page.goto('/');

    // Authenticate with the provided demo credentials.
    await expect(page.locator('#username')).toBeVisible();
    await page.locator('#username').fill(CREDENTIALS.username);

    await expect(page.locator('#password')).toBeVisible();
    await page.locator('#password').fill(CREDENTIALS.password);

    await page.getByRole('button', { name: 'Sign in' }).click();

    // Confirm that authentication completed successfully.
    await expect(
      page.getByText('Web Application', { exact: true }).first()
    ).toBeVisible();
  });

  // Generate one test per scenario from test-data.json.
  for (const scenario of scenarios) {
    test(
      `TC${scenario.id}: "${scenario.taskName}" is in ${scenario.project} -> ${scenario.column}`,
      async ({ page }) => {
        // Navigate to the project specified by the test data.
        const project = page
          .getByRole('button', { name: scenario.project })
          .or(page.getByText(scenario.project, { exact: true }))
          .first();

        await expect(project).toBeVisible();
        await project.click();

        // Locate the expected column.
        const columnHeader = page
          .getByRole('heading', { name: scenario.column })
          .or(page.getByText(scenario.column, { exact: true }))
          .first();

        await expect(columnHeader).toBeVisible();

        // Scope the task search to the expected column.
        const columnContainer = page
          .locator('div, section, article')
          .filter({ has: columnHeader })
          .last();

        // Find the exact task within the expected column.
        const taskCard = columnContainer
          .locator('div, article')
          .filter({
            has: page.getByText(scenario.taskName, { exact: true }),
          })
          .first();

        await expect(taskCard).toBeVisible();

        // Verify every tag expected for this scenario.
        for (const tag of scenario.tags) {
          await expect(
            taskCard.getByText(tag, { exact: true }).first()
          ).toBeVisible();
        }
      }
    );
  }
});