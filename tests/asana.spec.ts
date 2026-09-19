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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test.describe('Asana Demo App - Data-Driven Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    const usernameInput = page.locator('#username');
    const passwordInput = page.locator('#password');

    await expect(usernameInput).toBeVisible();
    await usernameInput.fill(CREDENTIALS.username);

    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(CREDENTIALS.password);

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
          .getByRole('button', {
            name: scenario.project,
            exact: true,
          })
          .or(
            page.getByText(scenario.project, {
              exact: true,
            })
          )
          .first();

        await expect(project).toBeVisible();
        await project.click();

        /*
         * Locate the expected column by its heading.
         * This establishes the column as the starting point
         * for the task-location assertion.
         */
        const columnHeading = page.getByRole('heading', {
          name: new RegExp(
            '^' +
              escapeRegExp(scenario.column) +
              '\\s*\\(\\d+\\)$'
          ),
        });

        await expect(columnHeading).toBeVisible();

        /*
         * Find the nearest ancestor of the column heading
         * that contains the expected task.
         *
         * This verifies the task is actually contained within
         * the expected column rather than simply finding the
         * column name somewhere near the task.
         */
        const columnContainer = columnHeading.locator(
          'xpath=ancestor::*[.//*[normalize-space()="' +
            scenario.taskName +
            '"]][1]'
        );

        await expect(columnContainer).toBeVisible();

        /*
         * Locate the task only within the verified column.
         */
        const taskText = columnContainer.getByText(
          scenario.taskName,
          {
            exact: true,
          }
        );

        await expect(taskText).toBeVisible();

        /*
         * Locate the task card using the task itself and
         * the first expected tag as anchors.
         *
         * This keeps tag verification scoped to the task card
         * instead of the entire column.
         */
        const firstExpectedTag = scenario.tags[0];

        const taskCard = taskText.locator(
          'xpath=ancestor::*[.//*[normalize-space()="' +
            firstExpectedTag +
            '"]][1]'
        );

        await expect(taskCard).toBeVisible();

        /*
         * Verify every expected tag belongs to the same task card.
         */
        for (const tag of scenario.tags) {
          await expect(
            taskCard.getByText(tag, {
              exact: true,
            }).first()
          ).toBeVisible();
        }
      }
    );
  }
});