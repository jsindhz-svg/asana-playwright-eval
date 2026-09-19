import { test, expect } from '@playwright/test';
import testCases from '../test-data.json';

const BASE_URL = 'https://create-asana-like-pr-39y5.bolt.host/';

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
    await page.goto(BASE_URL);

    await expect(page.locator('#username')).toBeVisible();
    await page.locator('#username').fill(CREDENTIALS.username);

    await expect(page.locator('#password')).toBeVisible();
    await page.locator('#password').fill(CREDENTIALS.password);

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(
      page.getByText('Web Application', { exact: true }).first()
    ).toBeVisible();
  });

  for (const scenario of scenarios) {
    test(
      'TC' +
        scenario.id +
        ': "' +
        scenario.taskName +
        '" is in ' +
        scenario.project +
        ' -> ' +
        scenario.column,
      async ({ page }) => {
        const project = page
          .getByRole('button', { name: scenario.project })
          .or(page.getByText(scenario.project, { exact: true }))
          .first();

        await expect(project).toBeVisible();
        await project.click();

        const columnHeader = page
          .getByRole('heading', { name: scenario.column })
          .or(page.getByText(scenario.column, { exact: true }))
          .first();

        await expect(columnHeader).toBeVisible();

        const columnContainer = page
          .locator('div, section, article')
          .filter({ has: columnHeader })
          .last();

        const taskCard = columnContainer
          .locator('div, article')
          .filter({ hasText: scenario.taskName })
          .first();

        await expect(taskCard).toBeVisible();

        for (const tag of scenario.tags) {
          const tagElement = taskCard
            .locator('span, div, p')
            .filter({ hasText: tag })
            .first();

          await expect(tagElement).toBeVisible();
        }
      }
    );
  }
});